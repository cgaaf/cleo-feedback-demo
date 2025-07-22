<script lang="ts">
  import { instructionsStore } from '$lib/stores';
  import { compareVersions, formatVersionDiff, getVersionSummary } from '$lib/utils/version-manager';
  import type { InstructionVersion } from '$lib/types';
  
  let { 
    onVersionSelect 
  }: { 
    onVersionSelect?: (version: InstructionVersion) => void 
  } = $props();
  
  const versions = $derived(instructionsStore.history);
  const currentVersion = $derived(instructionsStore.current.version);
  
  let selectedVersion = $state<number | null>(null);
  let showDiff = $state(false);
  
  function selectVersion(version: InstructionVersion) {
    selectedVersion = version.version;
    if (onVersionSelect) {
      onVersionSelect(version);
    }
  }
  
  function toggleDiff(versionNum: number) {
    if (selectedVersion === versionNum && showDiff) {
      showDiff = false;
      selectedVersion = null;
    } else {
      selectedVersion = versionNum;
      showDiff = true;
    }
  }
  
  function getDiff(version: InstructionVersion) {
    if (version.version === 1) return null;
    
    const previousVersion = versions.find(v => v.version === version.version - 1);
    if (!previousVersion) return null;
    
    return compareVersions(previousVersion, version);
  }
</script>

<div class="bg-white rounded-lg shadow-md p-6">
  <h3 class="text-lg font-semibold text-gray-800 mb-4">Version History</h3>
  
  {#if versions.length === 0}
    <p class="text-gray-500 text-sm">No version history available</p>
  {:else}
    <div class="space-y-3 max-h-96 overflow-y-auto">
      {#each versions.slice().reverse() as version}
        {@const diff = getDiff(version)}
        <div 
          class="border rounded-md p-3 transition-all {
            version.version === currentVersion 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-gray-300'
          }"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center space-x-2">
                <span class="font-medium text-sm">
                  {getVersionSummary(version)}
                </span>
                {#if version.version === currentVersion}
                  <span class="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">Current</span>
                {/if}
              </div>
              
              {#if version.feedback}
                <p class="text-xs text-gray-600 mt-1">
                  Feedback: "{version.feedback}"
                </p>
              {/if}
              
              {#if version.changeDescription}
                <p class="text-xs text-gray-500 mt-1">
                  {version.changeDescription}
                </p>
              {/if}
            </div>
            
            <div class="flex items-center space-x-2 ml-3">
              {#if diff && (diff.additions.length > 0 || diff.deletions.length > 0 || diff.modifications.length > 0)}
                <button
                  onclick={() => toggleDiff(version.version)}
                  class="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  {selectedVersion === version.version && showDiff ? 'Hide' : 'Show'} changes
                </button>
              {/if}
              
              {#if version.version !== currentVersion}
                <button
                  onclick={() => selectVersion(version)}
                  class="text-xs text-gray-600 hover:text-gray-800 underline"
                >
                  View
                </button>
              {/if}
            </div>
          </div>
          
          {#if selectedVersion === version.version && showDiff && diff}
            <div class="mt-3 pt-3 border-t border-gray-200">
              <pre class="text-xs text-gray-700 whitespace-pre-wrap font-mono bg-gray-50 p-2 rounded">{formatVersionDiff(diff)}</pre>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
  
  {#if versions.length > 1}
    <div class="mt-4 pt-4 border-t border-gray-200">
      <button
        onclick={() => instructionsStore.reset()}
        class="text-sm text-red-600 hover:text-red-800 underline"
      >
        Reset to initial instructions
      </button>
    </div>
  {/if}
</div>