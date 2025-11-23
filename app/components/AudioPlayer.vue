<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

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
const isPlaying = ref(false);
const currentTime = ref(0);
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

const togglePlay = () => {
    if (!audioRef.value) return;
    if (isPlaying.value) {
        audioRef.value.pause();
    } else {
        audioRef.value.play();
    }
    isPlaying.value = !isPlaying.value;
};

const onTimeUpdate = () => {
    if (!audioRef.value) return;
    currentTime.value = audioRef.value.currentTime;

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
};

const seek = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const time = parseFloat(input.value);
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
watch(showTranscript, (newVal) => {
    if (newVal && activeSegmentIndex.value !== -1) {
        scrollToActiveSegment();
    }
});
</script>

<template>
    <div
        class="my-6 rounded-xl bg-secondary text-white shadow-lg transition-all duration-300 overflow-hidden"
        :class="isExpanded ? 'p-5' : 'p-3 px-4'"
    >
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <!-- Play Icon (Triangle) -->
                <button
                    @click="togglePlay"
                    class="focus:outline-none hover:opacity-80 transition-opacity p-1 cursor-pointer"
                    aria-label="Play/Pause"
                >
                    <IconPlay v-if="!isPlaying" class="w-6 h-6 text-white" />
                    <IconPause v-else class="w-6 h-6 text-white" />
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
                    type="range"
                    min="0"
                    :max="duration"
                    :value="currentTime"
                    @input="seek"
                    class="w-full h-1 bg-gray-secondary/50 rounded-lg appearance-none cursor-pointer accent-primary hover:h-1.5 transition-all"
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
                    class="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                    :class="showTranscript ? 'text-primary' : 'text-gray-300'"
                    title="Toggle Transcript"
                >
                    <IconTranscript class="w-5 h-5" />
                    <span class="text-base font-medium">Transcript</span>
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
</style>
