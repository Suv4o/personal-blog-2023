<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";

// Available parameter values based on the images
const pitchValues = [-20, -15, -10, -5, 0, 5, 10, 15, 20];
const pupilXValues = [-15, -10, -5, 0, 5, 10, 15];
const pupilYValues = [-15, -7, 0, 7, 15];

// Generate all image filenames from available files
const imageFiles = [
    // pitch -20
    "image_pitch-20_px-15_py-15.webp",
    "image_pitch-20_px-15_py-7.webp",
    "image_pitch-20_px-15_py0.webp",
    "image_pitch-20_px-15_py7.webp",
    "image_pitch-20_px-15_py15.webp",
    "image_pitch-20_px-10_py-15.webp",
    "image_pitch-20_px-10_py-7.webp",
    "image_pitch-20_px-10_py0.webp",
    "image_pitch-20_px-10_py7.webp",
    "image_pitch-20_px-10_py15.webp",
    "image_pitch-20_px-5_py-15.webp",
    "image_pitch-20_px-5_py-7.webp",
    "image_pitch-20_px-5_py0.webp",
    "image_pitch-20_px-5_py7.webp",
    "image_pitch-20_px-5_py15.webp",
    "image_pitch-20_px0_py-15.webp",
    "image_pitch-20_px0_py-7.webp",
    "image_pitch-20_px0_py0.webp",
    "image_pitch-20_px0_py7.webp",
    "image_pitch-20_px0_py15.webp",
    "image_pitch-20_px5_py-15.webp",
    "image_pitch-20_px5_py-7.webp",
    "image_pitch-20_px5_py0.webp",
    "image_pitch-20_px5_py7.webp",
    "image_pitch-20_px5_py15.webp",
    "image_pitch-20_px10_py-15.webp",
    "image_pitch-20_px10_py-7.webp",
    "image_pitch-20_px10_py0.webp",
    "image_pitch-20_px10_py7.webp",
    "image_pitch-20_px10_py15.webp",
    "image_pitch-20_px15_py-15.webp",
    "image_pitch-20_px15_py-7.webp",
    "image_pitch-20_px15_py0.webp",
    "image_pitch-20_px15_py7.webp",
    "image_pitch-20_px15_py15.webp",
    // pitch -15
    "image_pitch-15_px-15_py-15.webp",
    "image_pitch-15_px-15_py-7.webp",
    "image_pitch-15_px-15_py0.webp",
    "image_pitch-15_px-15_py7.webp",
    "image_pitch-15_px-15_py15.webp",
    "image_pitch-15_px-10_py-15.webp",
    "image_pitch-15_px-10_py-7.webp",
    "image_pitch-15_px-10_py0.webp",
    "image_pitch-15_px-10_py7.webp",
    "image_pitch-15_px-10_py15.webp",
    "image_pitch-15_px-5_py-15.webp",
    "image_pitch-15_px-5_py-7.webp",
    "image_pitch-15_px-5_py0.webp",
    "image_pitch-15_px-5_py7.webp",
    "image_pitch-15_px-5_py15.webp",
    "image_pitch-15_px0_py-15.webp",
    "image_pitch-15_px0_py-7.webp",
    "image_pitch-15_px0_py0.webp",
    "image_pitch-15_px0_py7.webp",
    "image_pitch-15_px0_py15.webp",
    "image_pitch-15_px5_py-15.webp",
    "image_pitch-15_px5_py-7.webp",
    "image_pitch-15_px5_py0.webp",
    "image_pitch-15_px5_py7.webp",
    "image_pitch-15_px5_py15.webp",
    "image_pitch-15_px10_py-15.webp",
    "image_pitch-15_px10_py-7.webp",
    "image_pitch-15_px10_py0.webp",
    "image_pitch-15_px10_py7.webp",
    "image_pitch-15_px10_py15.webp",
    "image_pitch-15_px15_py-15.webp",
    "image_pitch-15_px15_py-7.webp",
    "image_pitch-15_px15_py0.webp",
    "image_pitch-15_px15_py7.webp",
    "image_pitch-15_px15_py15.webp",
    // pitch -10
    "image_pitch-10_px-15_py-15.webp",
    "image_pitch-10_px-15_py-7.webp",
    "image_pitch-10_px-15_py0.webp",
    "image_pitch-10_px-15_py7.webp",
    "image_pitch-10_px-15_py15.webp",
    "image_pitch-10_px-10_py-15.webp",
    "image_pitch-10_px-10_py-7.webp",
    "image_pitch-10_px-10_py0.webp",
    "image_pitch-10_px-10_py7.webp",
    "image_pitch-10_px-10_py15.webp",
    "image_pitch-10_px-5_py-15.webp",
    "image_pitch-10_px-5_py-7.webp",
    "image_pitch-10_px-5_py0.webp",
    "image_pitch-10_px-5_py7.webp",
    "image_pitch-10_px-5_py15.webp",
    "image_pitch-10_px0_py-15.webp",
    "image_pitch-10_px0_py-7.webp",
    "image_pitch-10_px0_py0.webp",
    "image_pitch-10_px0_py7.webp",
    "image_pitch-10_px0_py15.webp",
    "image_pitch-10_px5_py-15.webp",
    "image_pitch-10_px5_py-7.webp",
    "image_pitch-10_px5_py0.webp",
    "image_pitch-10_px5_py7.webp",
    "image_pitch-10_px5_py15.webp",
    "image_pitch-10_px10_py-15.webp",
    "image_pitch-10_px10_py-7.webp",
    "image_pitch-10_px10_py0.webp",
    "image_pitch-10_px10_py7.webp",
    "image_pitch-10_px10_py15.webp",
    "image_pitch-10_px15_py-15.webp",
    "image_pitch-10_px15_py-7.webp",
    "image_pitch-10_px15_py0.webp",
    "image_pitch-10_px15_py7.webp",
    "image_pitch-10_px15_py15.webp",
    // pitch -5
    "image_pitch-5_px-15_py-15.webp",
    "image_pitch-5_px-15_py-7.webp",
    "image_pitch-5_px-15_py0.webp",
    "image_pitch-5_px-15_py7.webp",
    "image_pitch-5_px-15_py15.webp",
    "image_pitch-5_px-10_py-15.webp",
    "image_pitch-5_px-10_py-7.webp",
    "image_pitch-5_px-10_py0.webp",
    "image_pitch-5_px-10_py7.webp",
    "image_pitch-5_px-10_py15.webp",
    "image_pitch-5_px-5_py-15.webp",
    "image_pitch-5_px-5_py-7.webp",
    "image_pitch-5_px-5_py0.webp",
    "image_pitch-5_px-5_py7.webp",
    "image_pitch-5_px-5_py15.webp",
    "image_pitch-5_px0_py-15.webp",
    "image_pitch-5_px0_py-7.webp",
    "image_pitch-5_px0_py0.webp",
    "image_pitch-5_px0_py7.webp",
    "image_pitch-5_px0_py15.webp",
    "image_pitch-5_px5_py-15.webp",
    "image_pitch-5_px5_py-7.webp",
    "image_pitch-5_px5_py0.webp",
    "image_pitch-5_px5_py7.webp",
    "image_pitch-5_px5_py15.webp",
    "image_pitch-5_px10_py-15.webp",
    "image_pitch-5_px10_py-7.webp",
    "image_pitch-5_px10_py0.webp",
    "image_pitch-5_px10_py7.webp",
    "image_pitch-5_px10_py15.webp",
    "image_pitch-5_px15_py-15.webp",
    "image_pitch-5_px15_py-7.webp",
    "image_pitch-5_px15_py0.webp",
    "image_pitch-5_px15_py7.webp",
    "image_pitch-5_px15_py15.webp",
    // pitch 0
    "image_pitch0_px-15_py-15.webp",
    "image_pitch0_px-15_py-7.webp",
    "image_pitch0_px-15_py0.webp",
    "image_pitch0_px-15_py7.webp",
    "image_pitch0_px-15_py15.webp",
    "image_pitch0_px-10_py-15.webp",
    "image_pitch0_px-10_py-7.webp",
    "image_pitch0_px-10_py0.webp",
    "image_pitch0_px-10_py7.webp",
    "image_pitch0_px-10_py15.webp",
    "image_pitch0_px-5_py-15.webp",
    "image_pitch0_px-5_py-7.webp",
    "image_pitch0_px-5_py0.webp",
    "image_pitch0_px-5_py7.webp",
    "image_pitch0_px-5_py15.webp",
    "image_pitch0_px0_py-15.webp",
    "image_pitch0_px0_py-7.webp",
    "image_pitch0_px0_py0.webp",
    "image_pitch0_px0_py7.webp",
    "image_pitch0_px0_py15.webp",
    "image_pitch0_px5_py-15.webp",
    "image_pitch0_px5_py-7.webp",
    "image_pitch0_px5_py0.webp",
    "image_pitch0_px5_py7.webp",
    "image_pitch0_px5_py15.webp",
    "image_pitch0_px10_py-15.webp",
    "image_pitch0_px10_py-7.webp",
    "image_pitch0_px10_py0.webp",
    "image_pitch0_px10_py7.webp",
    "image_pitch0_px10_py15.webp",
    "image_pitch0_px15_py-15.webp",
    "image_pitch0_px15_py-7.webp",
    "image_pitch0_px15_py0.webp",
    "image_pitch0_px15_py7.webp",
    "image_pitch0_px15_py15.webp",
    // pitch 5
    "image_pitch5_px-15_py-15.webp",
    "image_pitch5_px-15_py-7.webp",
    "image_pitch5_px-15_py0.webp",
    "image_pitch5_px-15_py7.webp",
    "image_pitch5_px-15_py15.webp",
    "image_pitch5_px-10_py-15.webp",
    "image_pitch5_px-10_py-7.webp",
    "image_pitch5_px-10_py0.webp",
    "image_pitch5_px-10_py7.webp",
    "image_pitch5_px-10_py15.webp",
    "image_pitch5_px-5_py-15.webp",
    "image_pitch5_px-5_py-7.webp",
    "image_pitch5_px-5_py0.webp",
    "image_pitch5_px-5_py7.webp",
    "image_pitch5_px-5_py15.webp",
    "image_pitch5_px0_py-15.webp",
    "image_pitch5_px0_py-7.webp",
    "image_pitch5_px0_py0.webp",
    "image_pitch5_px0_py7.webp",
    "image_pitch5_px0_py15.webp",
    "image_pitch5_px5_py-15.webp",
    "image_pitch5_px5_py-7.webp",
    "image_pitch5_px5_py0.webp",
    "image_pitch5_px5_py7.webp",
    "image_pitch5_px5_py15.webp",
    "image_pitch5_px10_py-15.webp",
    "image_pitch5_px10_py-7.webp",
    "image_pitch5_px10_py0.webp",
    "image_pitch5_px10_py7.webp",
    "image_pitch5_px10_py15.webp",
    "image_pitch5_px15_py-15.webp",
    "image_pitch5_px15_py-7.webp",
    "image_pitch5_px15_py0.webp",
    "image_pitch5_px15_py7.webp",
    "image_pitch5_px15_py15.webp",
    // pitch 10
    "image_pitch10_px-15_py-15.webp",
    "image_pitch10_px-15_py-7.webp",
    "image_pitch10_px-15_py0.webp",
    "image_pitch10_px-15_py7.webp",
    "image_pitch10_px-15_py15.webp",
    "image_pitch10_px-10_py-15.webp",
    "image_pitch10_px-10_py-7.webp",
    "image_pitch10_px-10_py0.webp",
    "image_pitch10_px-10_py7.webp",
    "image_pitch10_px-10_py15.webp",
    "image_pitch10_px-5_py-15.webp",
    "image_pitch10_px-5_py-7.webp",
    "image_pitch10_px-5_py0.webp",
    "image_pitch10_px-5_py7.webp",
    "image_pitch10_px-5_py15.webp",
    "image_pitch10_px0_py-15.webp",
    "image_pitch10_px0_py-7.webp",
    "image_pitch10_px0_py0.webp",
    "image_pitch10_px0_py7.webp",
    "image_pitch10_px0_py15.webp",
    "image_pitch10_px5_py-15.webp",
    "image_pitch10_px5_py-7.webp",
    "image_pitch10_px5_py0.webp",
    "image_pitch10_px5_py7.webp",
    "image_pitch10_px5_py15.webp",
    "image_pitch10_px10_py-15.webp",
    "image_pitch10_px10_py-7.webp",
    "image_pitch10_px10_py0.webp",
    "image_pitch10_px10_py7.webp",
    "image_pitch10_px10_py15.webp",
    "image_pitch10_px15_py-15.webp",
    "image_pitch10_px15_py-7.webp",
    "image_pitch10_px15_py0.webp",
    "image_pitch10_px15_py7.webp",
    "image_pitch10_px15_py15.webp",
    // pitch 15
    "image_pitch15_px-15_py-15.webp",
    "image_pitch15_px-15_py-7.webp",
    "image_pitch15_px-15_py0.webp",
    "image_pitch15_px-15_py7.webp",
    "image_pitch15_px-15_py15.webp",
    "image_pitch15_px-10_py-15.webp",
    "image_pitch15_px-10_py-7.webp",
    "image_pitch15_px-10_py0.webp",
    "image_pitch15_px-10_py7.webp",
    "image_pitch15_px-10_py15.webp",
    "image_pitch15_px-5_py-15.webp",
    "image_pitch15_px-5_py-7.webp",
    "image_pitch15_px-5_py0.webp",
    "image_pitch15_px-5_py7.webp",
    "image_pitch15_px-5_py15.webp",
    "image_pitch15_px0_py-15.webp",
    "image_pitch15_px0_py-7.webp",
    "image_pitch15_px0_py0.webp",
    "image_pitch15_px0_py7.webp",
    "image_pitch15_px0_py15.webp",
    "image_pitch15_px5_py-15.webp",
    "image_pitch15_px5_py-7.webp",
    "image_pitch15_px5_py0.webp",
    "image_pitch15_px5_py7.webp",
    "image_pitch15_px5_py15.webp",
    "image_pitch15_px10_py-15.webp",
    "image_pitch15_px10_py-7.webp",
    "image_pitch15_px10_py0.webp",
    "image_pitch15_px10_py7.webp",
    "image_pitch15_px10_py15.webp",
    "image_pitch15_px15_py-15.webp",
    "image_pitch15_px15_py-7.webp",
    "image_pitch15_px15_py0.webp",
    "image_pitch15_px15_py7.webp",
    "image_pitch15_px15_py15.webp",
    // pitch 20
    "image_pitch20_px-15_py-15.webp",
    "image_pitch20_px-15_py-7.webp",
    "image_pitch20_px-15_py0.webp",
    "image_pitch20_px-15_py7.webp",
    "image_pitch20_px-15_py15.webp",
    "image_pitch20_px-10_py-15.webp",
    "image_pitch20_px-10_py-7.webp",
    "image_pitch20_px-10_py0.webp",
    "image_pitch20_px-10_py7.webp",
    "image_pitch20_px-10_py15.webp",
    "image_pitch20_px-5_py-15.webp",
    "image_pitch20_px-5_py-7.webp",
    "image_pitch20_px-5_py0.webp",
    "image_pitch20_px-5_py7.webp",
    "image_pitch20_px-5_py15.webp",
    "image_pitch20_px0_py-15.webp",
    "image_pitch20_px0_py-7.webp",
    "image_pitch20_px0_py0.webp",
    "image_pitch20_px0_py7.webp",
    "image_pitch20_px0_py15.webp",
    "image_pitch20_px5_py-15.webp",
    "image_pitch20_px5_py-7.webp",
    "image_pitch20_px5_py0.webp",
    "image_pitch20_px5_py7.webp",
    "image_pitch20_px5_py15.webp",
    "image_pitch20_px10_py-15.webp",
    "image_pitch20_px10_py-7.webp",
    "image_pitch20_px10_py0.webp",
    "image_pitch20_px10_py7.webp",
    "image_pitch20_px10_py15.webp",
    "image_pitch20_px15_py-15.webp",
    "image_pitch20_px15_py-7.webp",
    "image_pitch20_px15_py0.webp",
    "image_pitch20_px15_py7.webp",
    "image_pitch20_px15_py15.webp",
];

// State
const currentImage = ref("image_pitch0_px0_py0.webp");
const isMobile = ref(false);
const motionEnabled = ref(false);
const motionSupported = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const imagesLoaded = ref(false);

// Find closest value in array
function findClosest(target: number, values: number[]): number {
    return values.reduce((prev, curr) => (Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev));
}

// Build image filename from parameters
function buildImageFilename(pitch: number, pupilX: number, pupilY: number): string {
    return `image_pitch${pitch}_px${pupilX}_py${pupilY}.webp`;
}

// Find the closest available image
function findClosestImage(targetPitch: number, targetPupilX: number, targetPupilY: number): string {
    const closestPitch = findClosest(targetPitch, pitchValues);
    const closestPupilX = findClosest(targetPupilX, pupilXValues);
    const closestPupilY = findClosest(targetPupilY, pupilYValues);

    const filename = buildImageFilename(closestPitch, closestPupilX, closestPupilY);

    // Check if the file exists in our list, otherwise find closest available
    if (imageFiles.includes(filename)) {
        return filename;
    }

    // Fallback: find the closest available image by distance
    let minDistance = Infinity;
    let closestFile = "image_pitch0_px0_py0.webp";

    for (const file of imageFiles) {
        const match = file.match(/image_pitch(-?\d+)_px(-?\d+)_py(-?\d+)\.webp/);
        if (match && match[1] && match[2] && match[3]) {
            const p = parseInt(match[1], 10);
            const x = parseInt(match[2], 10);
            const y = parseInt(match[3], 10);
            const distance = Math.abs(p - targetPitch) + Math.abs(x - targetPupilX) + Math.abs(y - targetPupilY);
            if (distance < minDistance) {
                minDistance = distance;
                closestFile = file;
            }
        }
    }

    return closestFile;
}

// Update image based on calculated parameters
function updateImageByParams(targetPitch: number, targetPupilX: number, targetPupilY: number): void {
    currentImage.value = findClosestImage(targetPitch, targetPupilX, targetPupilY);
}

// Mouse tracking handler
function handleMouseMove(event: MouseEvent): void {
    if (motionEnabled.value) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Calculate offset from center (-1 to 1)
    const offsetX = (event.clientX - centerX) / centerX;
    const offsetY = (event.clientY - centerY) / centerY;

    // Map to parameter ranges
    const targetPupilX = offsetX * 15;
    const targetPupilY = -offsetY * 15;
    const targetPitch = offsetY * 20;

    updateImageByParams(targetPitch, targetPupilX, targetPupilY);
}

// Device orientation handler
function handleDeviceOrientation(event: DeviceOrientationEvent): void {
    if (!motionEnabled.value) return;

    const beta = event.beta ?? 0; // front/back tilt (-180 to 180)
    const gamma = event.gamma ?? 0; // left/right tilt (-90 to 90)

    // Normalize beta (phone usually held at ~45-90 degrees)
    const normalizedBeta = Math.max(-45, Math.min(45, beta - 45));
    const normalizedGamma = Math.max(-45, Math.min(45, gamma));

    // Map to parameter ranges
    const targetPupilX = (normalizedGamma / 45) * 15;
    const targetPupilY = -(normalizedBeta / 45) * 15;
    const targetPitch = (normalizedBeta / 45) * 20;

    updateImageByParams(targetPitch, targetPupilX, targetPupilY);
}

// Detect mobile device
function detectMobileDevice(): boolean {
    return (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (typeof window !== "undefined" && window.DeviceOrientationEvent !== undefined && "ontouchstart" in window)
    );
}

// Request motion permission (iOS 13+)
async function requestMotionPermission(): Promise<boolean> {
    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
        try {
            const permission = await (DeviceOrientationEvent as any).requestPermission();
            return permission === "granted";
        } catch (error) {
            console.error("Error requesting motion permission:", error);
            return false;
        }
    }
    return true;
}

// Toggle motion tracking
async function toggleMotion(): Promise<void> {
    if (!motionEnabled.value) {
        const hasPermission = await requestMotionPermission();
        if (hasPermission) {
            motionEnabled.value = true;
            window.addEventListener("deviceorientation", handleDeviceOrientation);
        }
    } else {
        motionEnabled.value = false;
        window.removeEventListener("deviceorientation", handleDeviceOrientation);
        // Reset to center
        currentImage.value = "image_pitch0_px0_py0.webp";
    }
}

// Computed for button text
const buttonText = computed(() => (motionEnabled.value ? "Disable Motion" : "Enable Motion"));

// Preload all images
function preloadImages(): Promise<void> {
    return new Promise((resolve) => {
        let loadedCount = 0;
        const totalImages = imageFiles.length;

        imageFiles.forEach((file) => {
            const img = new Image();
            img.onload = img.onerror = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    imagesLoaded.value = true;
                    resolve();
                }
            };
            img.src = `/images/portrait-eye-tracking/${file}`;
        });
    });
}

onMounted(() => {
    isMobile.value = detectMobileDevice();
    motionSupported.value = typeof window !== "undefined" && "DeviceOrientationEvent" in window;

    // Preload all images before enabling interaction
    preloadImages();

    // Add mouse move listener for desktop
    window.addEventListener("mousemove", handleMouseMove);
});

onUnmounted(() => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("deviceorientation", handleDeviceOrientation);
});
</script>

<template>
    <div class="py-6">
        <div ref="containerRef" class="relative w-full max-w-sm mx-auto aspect-square overflow-hidden rounded-md">
            <!-- Image container with all images stacked -->
            <div class="relative w-full h-full">
                <NuxtImg
                    v-for="file in imageFiles"
                    :key="file"
                    :src="`/images/portrait-eye-tracking/${file}`"
                    alt="Interactive portrait"
                    format="webp"
                    :widths="[320, 480, 640]"
                    fetchpriority="high"
                    class="absolute inset-0 w-full h-full object-contain"
                    :class="{ 'opacity-100 z-10': currentImage === file, 'opacity-0 z-0': currentImage !== file }"
                />
            </div>
        </div>

        <!-- Motion toggle button for mobile devices -->
        <div v-if="isMobile && motionSupported" class="flex justify-center mt-4">
            <Button
                :classes="motionEnabled ? 'blue' : ''"
                subscribe
                :subscribeBtnName="buttonText"
                @click="toggleMotion"
            />
        </div>

        <!-- Instruction text -->
        <p class="text-center text-gray text-sm mt-3">
            <span v-if="!isMobile">Move your mouse around to see me follow!</span>
            <span v-else-if="motionEnabled">Tilt your device to see me follow!</span>
            <span v-else>Tap the button above to enable motion tracking.</span>
        </p>
    </div>
</template>
