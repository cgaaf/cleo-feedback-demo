<script lang="ts">
  import VoiceRecorder from '$lib/components/VoiceRecorder.svelte';
  import InstructionEditor from '$lib/components/InstructionEditor.svelte';
  import VersionHistory from '$lib/components/VersionHistory.svelte';
  import { instructionsStore, processingStore } from '$lib/stores';
  import type { InstructionVersion } from '$lib/types';
  
  let showVersionModal = $state(false);
  let selectedVersion = $state<InstructionVersion | null>(null);
  
  async function handleRecordingComplete(blob: Blob) {
    processingStore.startProcessing('transcribing', 'Transcribing your feedback...');
    
    try {
      const formData = new FormData();
      formData.append('audio', blob);
      formData.append('instructions', instructionsStore.current.content);
      
      const response = await fetch('/api/voice', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to process voice feedback');
      }
      
      const result = await response.json();
      
      processingStore.setStep('analyzing', 'Analyzing feedback and updating instructions...');
      processingStore.updateProgress(50);
      
      // Update instructions with the processed feedback
      instructionsStore.updateInstructions(
        result.update.newContent,
        result.transcription,
        result.update.changes
      );
      
      processingStore.completeProcessing();
      
    } catch (error) {
      processingStore.setError(error instanceof Error ? error.message : 'Processing failed');
    }
  }
  
  async function handleOptimize() {
    processingStore.startProcessing('optimizing', 'Optimizing your instructions...');
    
    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          instructions: instructionsStore.current.content
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to optimize instructions');
      }
      
      const result = await response.json();
      
      processingStore.updateProgress(80, 'Applying optimizations...');
      
      // Update instructions with optimized version
      instructionsStore.updateInstructions(
        result.optimized,
        'AI optimization',
        result.improvements
      );
      
      processingStore.completeProcessing();
      
    } catch (error) {
      processingStore.setError(error instanceof Error ? error.message : 'Optimization failed');
    }
  }
  
  function handleVersionSelect(version: InstructionVersion) {
    selectedVersion = version;
    showVersionModal = true;
  }
  
  function closeVersionModal() {
    showVersionModal = false;
    selectedVersion = null;
  }
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Voice Feedback Demo</h1>
          <p class="text-sm text-gray-600 mt-1">AI Medical Scribe Instructions</p>
        </div>
        <div class="text-sm text-gray-500">
          Demo Mode
        </div>
      </div>
    </div>
  </header>
  
  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Instructions Editor -->
        <InstructionEditor 
          editable={true} 
          onOptimize={handleOptimize}
        />
        
        <!-- Voice Recorder -->
        <VoiceRecorder 
          onRecordingComplete={handleRecordingComplete}
        />
      </div>
      
      <!-- Right Column -->
      <div class="space-y-8">
        <!-- Version History -->
        <VersionHistory 
          onVersionSelect={handleVersionSelect}
        />
        
        <!-- Info Card -->
        <div class="bg-blue-50 rounded-lg p-6">
          <h3 class="text-sm font-semibold text-blue-900 mb-2">How it works</h3>
          <ol class="text-sm text-blue-800 space-y-2">
            <li>1. Click the microphone to record feedback</li>
            <li>2. Speak naturally about what to change</li>
            <li>3. Watch as instructions update automatically</li>
            <li>4. Use "Improve Instructions" for AI optimization</li>
          </ol>
        </div>
      </div>
    </div>
  </main>
  
  <!-- Version Modal -->
  {#if showVersionModal && selectedVersion}
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">
            Version {selectedVersion.version} Instructions
          </h3>
        </div>
        <div class="px-6 py-4 overflow-y-auto max-h-[60vh]">
          <pre class="whitespace-pre-wrap text-sm font-mono bg-gray-50 p-4 rounded">{selectedVersion.content}</pre>
          {#if selectedVersion.feedback}
            <div class="mt-4 p-3 bg-blue-50 rounded">
              <p class="text-sm text-blue-800">
                <span class="font-medium">Feedback:</span> {selectedVersion.feedback}
              </p>
            </div>
          {/if}
        </div>
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onclick={closeVersionModal}
            class="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
