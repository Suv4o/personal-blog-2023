# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "open_clip_torch",
#     "torch",
#     "pillow",
# ]
# ///
"""
Generate OpenCLIP image embeddings for the Through The Lens gallery.

Model: ViT-H-14 / dfn5b (1024-dim).

Run with uv (no virtualenv setup required):

    uv run scripts/generate_photo_image_embeddings.py

Reads the photo list (photoPath + imagePath) from
server/utils/photo-text-embeddings.json (produced by the Node text-embedding
script), encodes each image, and writes
server/utils/photo-image-embeddings.json with [{ photoPath, imageEmbedding }].
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import open_clip
import torch
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
INPUT_JSON = ROOT / "server" / "utils" / "photo-text-embeddings.json"
OUTPUT_JSON = ROOT / "server" / "utils" / "photo-image-embeddings.json"
PUBLIC_DIR = ROOT / "public"

MODEL_NAME = "ViT-H-14"
PRETRAINED = "dfn5b"


def pick_device() -> torch.device:
    if torch.backends.mps.is_available():
        return torch.device("mps")
    if torch.cuda.is_available():
        return torch.device("cuda")
    return torch.device("cpu")


def main() -> int:
    if not INPUT_JSON.exists():
        print(f"Missing input: {INPUT_JSON}", file=sys.stderr)
        print("Run `yarn gen:photo-text` first.", file=sys.stderr)
        return 1

    entries = json.loads(INPUT_JSON.read_text(encoding="utf-8"))
    print(f"Loaded {len(entries)} photo entries from text-embeddings JSON")

    device = pick_device()
    print(f"Using device: {device}")

    print(f"Loading OpenCLIP {MODEL_NAME} / {PRETRAINED}…")
    model, _, preprocess = open_clip.create_model_and_transforms(
        MODEL_NAME, pretrained=PRETRAINED
    )
    model = model.to(device).eval()

    results: list[dict] = []
    missing: list[str] = []

    for i, entry in enumerate(entries, start=1):
        photo_path = entry["photoPath"]
        image_rel = entry["imagePath"].lstrip("/")
        image_abs = PUBLIC_DIR / image_rel

        if not image_abs.exists():
            print(f"  [{i}/{len(entries)}] missing image, skipping: {image_abs}")
            missing.append(photo_path)
            continue

        try:
            image = Image.open(image_abs).convert("RGB")
        except Exception as exc:
            print(f"  [{i}/{len(entries)}] failed to load {image_abs}: {exc}")
            missing.append(photo_path)
            continue

        tensor = preprocess(image).unsqueeze(0).to(device)
        with torch.no_grad():
            vec = model.encode_image(tensor)
            vec = vec / vec.norm(dim=-1, keepdim=True)
        embedding = vec.squeeze(0).cpu().tolist()

        results.append({"photoPath": photo_path, "imageEmbedding": embedding})
        print(f"  [{i}/{len(entries)}] {photo_path}")

    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_JSON.write_text(json.dumps(results, indent=2), encoding="utf-8")
    print(f"\nWrote {len(results)} image embeddings → {OUTPUT_JSON}")
    if missing:
        print(f"Skipped {len(missing)} entries with missing/broken images:")
        for m in missing:
            print(f"  - {m}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
