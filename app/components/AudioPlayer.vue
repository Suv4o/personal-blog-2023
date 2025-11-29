<script setup lang="ts">
const props = defineProps<{
    audioSrc: string;
    transcriptSrc: string;
}>();

interface TranscriptSegment {
    start: number;
    end: number;
    text: string;
}

const audioRef = ref<HTMLAudioElement | null>(null);
const transcriptContainerRef = ref<HTMLElement | null>(null);
const rangeInputRef = ref<HTMLInputElement | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
let rafId: number | null = null;
const duration = ref(0);
const transcript = ref<TranscriptSegment[]>([]);
const showTranscript = ref(false);
const activeSegmentIndex = ref<number>(-1);
const isExpanded = ref(false);

// Format time as MM:SS
const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// Load transcript
onMounted(async () => {
    if (audioRef.value) {
        if (audioRef.value.readyState >= 1) {
            duration.value = audioRef.value.duration;
        }
    }

    try {
        const response = await fetch(props.transcriptSrc);
        if (response.ok) {
            transcript.value = await response.json();
        } else {
            console.error("Failed to load transcript:", response.statusText);
        }
    } catch (error) {
        console.error("Error loading transcript:", error);
    }
});

onUnmounted(() => {
    if (rafId) {
        cancelAnimationFrame(rafId);
    }
});

const updateProgressVariable = (percent: number) => {
    if (rangeInputRef.value) {
        rangeInputRef.value.style.setProperty("--progress", `${percent}%`);
    }
};

const updateLoop = () => {
    if (!audioRef.value) return;
    currentTime.value = audioRef.value.currentTime;

    if (duration.value > 0) {
        const percent = (currentTime.value / duration.value) * 100;
        updateProgressVariable(percent);
    }

    rafId = requestAnimationFrame(updateLoop);
};

const togglePlay = () => {
    if (!audioRef.value) return;
    if (isPlaying.value) {
        audioRef.value.pause();
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    } else {
        audioRef.value.play();
        updateLoop();
    }
    isPlaying.value = !isPlaying.value;
};

const onTimeUpdate = () => {
    if (!audioRef.value) return;
    // When playing, RAF handles currentTime updates for smoothness.
    // We only sync here if not playing (e.g. external seek) or as a fallback.
    if (!isPlaying.value) {
        currentTime.value = audioRef.value.currentTime;
    }

    // Find active segment
    const index = transcript.value.findIndex((seg) => currentTime.value >= seg.start && currentTime.value <= seg.end);

    if (index !== -1 && index !== activeSegmentIndex.value) {
        activeSegmentIndex.value = index;
        scrollToActiveSegment();
    }
};

const onLoadedMetadata = () => {
    if (audioRef.value) {
        duration.value = audioRef.value.duration;
    }
};

const onEnded = () => {
    isPlaying.value = false;
    currentTime.value = 0;
    activeSegmentIndex.value = -1;
    if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
};

const seek = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const time = parseFloat(input.value);

    // Immediate visual update
    if (duration.value > 0) {
        const percent = (time / duration.value) * 100;
        updateProgressVariable(percent);
    }

    if (audioRef.value) {
        audioRef.value.currentTime = time;
        currentTime.value = time;
    }
};

const jumpToSegment = (segment: TranscriptSegment) => {
    if (audioRef.value) {
        audioRef.value.currentTime = segment.start;
        if (!isPlaying.value) {
            togglePlay();
        }
    }
};

const scrollToActiveSegment = () => {
    if (!showTranscript.value || !transcriptContainerRef.value) return;

    // We need to wait for the DOM to update with the new active class
    setTimeout(() => {
        const activeEl = transcriptContainerRef.value?.querySelector(".active-segment");
        if (activeEl) {
            activeEl.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center",
            });
        }
    }, 50);
};

// Watch for showTranscript to scroll to active segment when opened
watch(showTranscript, async (newVal) => {
    if (newVal && activeSegmentIndex.value !== -1) {
        await nextTick();
        scrollToActiveSegment();
    }
});

// Update progress variable when not playing (e.g. initial load or external seek)
watch(currentTime, () => {
    if (!isPlaying.value && duration.value > 0) {
        const percent = (currentTime.value / duration.value) * 100;
        updateProgressVariable(percent);
    }
});
</script>

<template>
    <div class="my-6 rounded-lg bg-secondary text-white shadow-lg transition-all duration-300 overflow-hidden p-3 px-4">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <!-- Play Icon (Triangle) -->
                <button
                    @click="togglePlay"
                    class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-secondary/50 hover:bg-gray-secondary transition-all duration-200 focus:outline-none cursor-pointer group"
                    aria-label="Play/Pause"
                >
                    <IconPlay
                        v-if="!isPlaying"
                        class="w-5 h-5 text-white group-hover:scale-110 transition-transform ml-1"
                    />
                    <IconPause v-else class="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                </button>
                <span class="text-lg font-medium">Play audio summary</span>
            </div>

            <div class="flex items-center gap-2">
                <!-- Expand/Collapse Button -->
                <button
                    @click="isExpanded = !isExpanded"
                    class="p-1 hover:bg-secondary-light rounded-full transition-colors text-gray-300 hover:text-white cursor-pointer"
                    aria-label="Expand/Collapse"
                >
                    <IconChevronDown v-if="!isExpanded" class="w-6 h-6" />
                    <IconChevronUp v-else class="w-6 h-6" />
                </button>
            </div>
        </div>

        <!-- Expanded Controls -->
        <div v-show="isExpanded" class="mt-4 border-t border-gray-secondary/30 pt-4 transition-all duration-300">
            <!-- Progress Bar -->
            <div class="relative mb-2 group">
                <input
                    ref="rangeInputRef"
                    type="range"
                    min="0"
                    :max="duration"
                    step="any"
                    :value="currentTime"
                    @input="seek"
                    class="w-full cursor-pointer"
                    style="--progress: 0%"
                />
            </div>

            <div class="flex justify-between items-center text-base text-gray-300 mb-4">
                <div class="flex gap-2">
                    <span>{{ formatTime(currentTime) }}</span>
                    <span>/</span>
                    <span>{{ formatTime(duration) }}</span>
                </div>

                <!-- Transcript Toggle Icon -->
                <button
                    @click="showTranscript = !showTranscript"
                    class="p-2 rounded-full transition-colors cursor-pointer hover:bg-secondary-light"
                    :class="showTranscript ? 'text-primary' : 'text-gray-300 hover:text-white'"
                    title="Toggle Transcript"
                >
                    <IconTranscript class="w-6 h-6" />
                </button>
            </div>

            <!-- Audio Element (Hidden) -->
            <audio
                ref="audioRef"
                :src="audioSrc"
                @timeupdate="onTimeUpdate"
                @loadedmetadata="onLoadedMetadata"
                @ended="onEnded"
                class="hidden"
            ></audio>

            <!-- Transcript -->
            <div
                v-if="showTranscript"
                class="mt-4 bg-secondary-light/30 rounded-lg p-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-secondary scrollbar-track-transparent"
                ref="transcriptContainerRef"
            >
                <div v-if="transcript.length > 0" class="space-y-3">
                    <p
                        v-for="(segment, index) in transcript"
                        :key="index"
                        @click="jumpToSegment(segment)"
                        :class="[
                            'cursor-pointer transition-all duration-200 p-2 rounded border-l-4 text-lg',
                            activeSegmentIndex === index
                                ? 'active-segment bg-primary/10 border-primary text-white font-medium translate-x-1'
                                : 'border-transparent text-gray-300 hover:bg-secondary-light hover:border-green',
                        ]"
                    >
                        {{ segment.text }}
                    </p>
                </div>
                <div v-else class="text-center text-gray-secondary py-4 text-lg">Loading transcript...</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@reference "../assets/css/main.css";

/* Custom scrollbar for the transcript */
.scrollbar-thin::-webkit-scrollbar {
    @apply w-[6px];
}
.scrollbar-thin::-webkit-scrollbar-track {
    @apply bg-transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
    @apply bg-gray-secondary/50 rounded-[20px];
}

/* Cross-browser range input styling */
input[type="range"] {
    @apply appearance-none w-full h-[6px] rounded-[3px] outline-none bg-transparent transition-none;
    -webkit-appearance: none;
    background: linear-gradient(
        to right,
        rgb(var(--color-primary)) var(--progress),
        rgb(var(--color-gray-secondary) / 0.5) var(--progress)
    );
}

/* Chrome / Safari / Edge - TRACK */
input[type="range"]::-webkit-slider-runnable-track {
    @apply h-[6px] bg-gray-secondary/50 rounded-[3px];
}

/* Chrome / Safari / Edge - THUMB */
input[type="range"]::-webkit-slider-thumb {
    @apply appearance-none w-5 h-5 bg-primary rounded-full cursor-pointer -mt-[7px] transition-colors duration-200;
    -webkit-appearance: none;
}

/* Firefox - TRACK */
input[type="range"]::-moz-range-track {
    @apply h-[6px] bg-gray-secondary/50 rounded-[3px];
}

/* Firefox - THUMB */
input[type="range"]::-moz-range-thumb {
    @apply w-5 h-5 bg-primary border-none rounded-full cursor-pointer transition-colors duration-200;
}

/* Firefox - REMOVE focus border */
input[type="range"]::-moz-focus-outer {
    @apply border-0;
}

/* Hover states */
input[type="range"]::-webkit-slider-thumb:hover,
input[type="range"]::-moz-range-thumb:hover {
    @apply bg-primary-light;
}
</style>
