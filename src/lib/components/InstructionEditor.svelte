<script lang="ts">
  import { instructionsStore, processingStore } from '$lib/stores';
  
  let { 
    editable = false,
    onOptimize
  }: { 
    editable?: boolean;
    onOptimize?: () => void;
  } = $props();
  
  const current = $derived(instructionsStore.current);
  const processing = $derived(processingStore.processingState);
  
  let editedContent = $state('');
  let isEditing = $state(false);
  
  $effect(() => {
    editedContent = current.content;
  });
  
  function startEditing() {
    isEditing = true;
    editedContent = current.content;
  }
  
  function cancelEditing() {
    isEditing = false;
    editedContent = current.content;
  }
  
  function saveEdits() {
    if (editedContent !== current.content) {
      instructionsStore.updateInstructions(
        editedContent,
        'Manual edit',
        ['Manually edited instructions']
      );
    }
    isEditing = false;
  }
  
  function handleOptimize() {
    if (onOptimize) {
      onOptimize();
    }
  }
</script>

<div class="bg-white rounded-lg shadow-md p-6">
  <div class="flex justify-between items-center mb-4">
    <h3 class="text-lg font-semibold text-gray-800">HPI Instructions</h3>
    <div class="flex items-center space-x-2">
      <span class="text-sm text-gray-500">Version {current.version}</span>
      {#if editable && !isEditing && !processing.isProcessing}
        <button
          onclick={startEditing}
          class="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
        >
          Edit
        </button>
      {/if}
    </div>
  </div>
  
  {#if isEditing}
    <div class="space-y-3">
      <textarea
        bind:value={editedContent}
        class="w-full h-64 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
        placeholder="Enter your instructions..."
      ></textarea>
      <div class="flex justify-end space-x-2">
        <button
          onclick={cancelEditing}
          class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onclick={saveEdits}
          class="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  {:else}
    <div class="prose prose-sm max-w-none">
      <pre class="whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-sm text-gray-700 font-mono">{current.content}</pre>
    </div>
  {/if}
  
  {#if processing.isProcessing}
    <div class="mt-4 p-4 bg-blue-50 rounded-md">
      <div class="flex items-center space-x-3">
        <div class="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
        <div>
          <p class="text-sm font-medium text-blue-700">{processing.message}</p>
          {#if processing.progress > 0}
            <div class="mt-2 w-full bg-blue-200 rounded-full h-2">
              <div 
                class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style="width: {processing.progress}%"
              ></div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
  
  {#if processing.error}
    <div class="mt-4 p-4 bg-red-50 rounded-md">
      <p class="text-sm text-red-700">{processing.error}</p>
    </div>
  {/if}
  
  {#if !isEditing && !processing.isProcessing}
    <div class="mt-4 flex justify-between items-center">
      <p class="text-xs text-gray-500">
        Last updated: {new Date(current.updatedAt).toLocaleString()}
      </p>
      {#if onOptimize}
        <button
          onclick={handleOptimize}
          class="px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Improve Instructions</span>
        </button>
      {/if}
    </div>
  {/if}
</div>