interface ProcessingState {
  isProcessing: boolean;
  currentStep: 'idle' | 'transcribing' | 'analyzing' | 'updating' | 'optimizing';
  progress: number;
  message: string;
  error?: string;
}

class ProcessingStore {
  private state = $state<ProcessingState>({
    isProcessing: false,
    currentStep: 'idle',
    progress: 0,
    message: ''
  });

  get processingState() {
    return this.state;
  }

  startProcessing(step: ProcessingState['currentStep'], message: string) {
    this.state.isProcessing = true;
    this.state.currentStep = step;
    this.state.message = message;
    this.state.error = undefined;
    this.state.progress = 0;
  }

  updateProgress(progress: number, message?: string) {
    this.state.progress = Math.min(100, Math.max(0, progress));
    if (message) {
      this.state.message = message;
    }
  }

  setStep(step: ProcessingState['currentStep'], message: string) {
    this.state.currentStep = step;
    this.state.message = message;
  }

  completeProcessing() {
    this.state.isProcessing = false;
    this.state.currentStep = 'idle';
    this.state.progress = 100;
    this.state.message = 'Processing complete';
  }

  setError(error: string) {
    this.state.error = error;
    this.state.isProcessing = false;
    this.state.currentStep = 'idle';
    this.state.progress = 0;
  }

  reset() {
    this.state = {
      isProcessing: false,
      currentStep: 'idle',
      progress: 0,
      message: '',
      error: undefined
    };
  }
}

export const processingStore = new ProcessingStore();