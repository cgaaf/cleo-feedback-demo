<script lang="ts">
  import { recordingStore } from '$lib/stores';
  import { formatDuration } from '$lib/utils/voice-recorder';
  
  let { onRecordingComplete }: { onRecordingComplete?: (blob: Blob) => void } = $props();
  
  const state = $derived(recordingStore.recordingState);
  const recording = $derived(recordingStore.recording);
  
  async function toggleRecording() {
    try {
      if (state.isRecording) {
        const completedRecording = await recordingStore.stopRecording();
        if (completedRecording && onRecordingComplete) {
          onRecordingComplete(completedRecording.blob);
        }
      } else {
        await recordingStore.startRecording();
      }
    } catch (error) {
      console.error('Error toggling recording:', error);
      // Error will be displayed through the state.error reactive binding
    }
  }
  
  function togglePause() {
    if (state.isPaused) {
      recordingStore.resumeRecording();
    } else {
      recordingStore.pauseRecording();
    }
  }
  
  function clearRecording() {
    recordingStore.clearRecording();
  }
</script>

<div class="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-md">
  <h3 class="text-lg font-semibold text-gray-800">Voice Feedback</h3>
  
  {#if state.error}
    <div class="text-red-600 text-sm bg-red-50 px-4 py-2 rounded">
      {state.error}
    </div>
  {/if}
  
  <div class="flex items-center space-x-4">
    <button
      onclick={toggleRecording}
      class="relative p-4 rounded-full transition-all duration-200 {state.isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}"
      aria-label={state.isRecording ? 'Stop recording' : 'Start recording'}
    >
      {#if state.isRecording}
        <!-- Stop icon -->
        <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" />
        </svg>
        
        <!-- Recording indicator -->
        <span class="absolute -top-1 -right-1 flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      {:else}
        <!-- Microphone icon -->
        <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
        </svg>
      {/if}
    </button>
    
    {#if state.isRecording}
      <button
        onclick={togglePause}
        class="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
        aria-label={state.isPaused ? 'Resume recording' : 'Pause recording'}
      >
        {#if state.isPaused}
          <!-- Play icon -->
          <svg class="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        {:else}
          <!-- Pause icon -->
          <svg class="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
          </svg>
        {/if}
      </button>
    {/if}
  </div>
  
  {#if state.isRecording || recording}
    <div class="text-center">
      <p class="text-2xl font-mono text-gray-700">
        {formatDuration(state.duration)}
      </p>
      {#if state.isPaused}
        <p class="text-sm text-orange-600 mt-1">Paused</p>
      {:else if state.isRecording}
        <p class="text-sm text-red-600 mt-1">Recording...</p>
      {/if}
    </div>
  {/if}
  
  {#if recording && !state.isRecording}
    <div class="flex items-center space-x-3">
      <p class="text-sm text-green-600">Recording complete</p>
      <button
        onclick={clearRecording}
        class="text-sm text-gray-500 hover:text-gray-700 underline"
      >
        Clear
      </button>
    </div>
  {/if}
  
  <p class="text-xs text-gray-500 text-center max-w-xs">
    Click the microphone to record your feedback. For example: "Avoid using medical jargon" or "Include medication allergies"
  </p>
</div>