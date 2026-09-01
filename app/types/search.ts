export type SearchKind = "article" | "photo" | "keyboard" | "page";

export interface ContentEntry {
    id: string;
    kind: SearchKind;
    title: string;
    description: string;
    path: string;
    image?: string;
    keywordHaystack: string;
    textEmbedding: number[];
}

export interface VisualEntry {
    id: string;
    kind: "photo" | "keyboard";
    path: string;
    imagePath: string;
    imageEmbedding: number[];
}

export interface SearchIndexResponse {
    contentEmbeddings: ContentEntry[];
    visualEmbeddings: VisualEntry[];
    _meta: {
        text: { model: string; dim: number; count: number };
        visual: { model: string; dim: number; count: number };
    };
}

export interface SearchResult {
    id: string;
    kind: SearchKind;
    title: string;
    description: string;
    path: string;
    image?: string;
    score: number;
}

export type SearchConsent = "accepted" | "declined" | "unknown";
