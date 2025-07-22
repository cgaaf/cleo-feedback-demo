import type { RecordingState, VoiceRecording } from '$lib/types';

class RecordingStore {
  private state = $state<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    error: undefined
  });

  private currentRecording = $state<VoiceRecording | null>(null);
  private mediaRecorder = $state<MediaRecorder | null>(null);
  private stream = $state<MediaStream | null>(null);
  private startTime = $state<number>(0);
  private chunks = $state<Blob[]>([]);
  private durationInterval = $state<number | null>(null);

  get recordingState() {
    return this.state;
  }

  get recording() {
    return this.currentRecording;
  }

  async startRecording() {
    try {
      this.state.error = undefined;
      
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });

      // Create MediaRecorder
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.chunks = [];
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.chunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: 'audio/webm' });
        this.currentRecording = {
          blob,
          duration: this.state.duration,
          timestamp: new Date()
        };
        this.cleanup();
      };

      // Start recording
      this.mediaRecorder.start();
      this.startTime = Date.now();
      this.state.isRecording = true;
      this.state.isPaused = false;

      // Update duration every 100ms
      this.durationInterval = setInterval(() => {
        if (!this.state.isPaused) {
          this.state.duration = Math.floor((Date.now() - this.startTime) / 1000);
        }
      }, 100);

    } catch (error) {
      this.state.error = error instanceof Error ? error.message : 'Failed to access microphone';
      this.cleanup();
    }
  }

  pauseRecording() {
    if (this.mediaRecorder && this.state.isRecording && !this.state.isPaused) {
      this.mediaRecorder.pause();
      this.state.isPaused = true;
    }
  }

  resumeRecording() {
    if (this.mediaRecorder && this.state.isRecording && this.state.isPaused) {
      this.mediaRecorder.resume();
      this.state.isPaused = false;
    }
  }

  async stopRecording(): Promise<VoiceRecording | null> {
    return new Promise((resolve, reject) => {
      try {
        if (!this.mediaRecorder || !this.state.isRecording) {
          resolve(null);
          return;
        }

        // Store reference to ensure it's not null
        const recorder = this.mediaRecorder;
        
        // Set up the handler to resolve when recording is ready
        const originalOnStop = recorder.onstop;
        recorder.onstop = (event) => {
          try {
            // Call the original handler to create the recording
            originalOnStop?.call(recorder, event);
            // Resolve with the recording
            resolve(this.currentRecording);
          } catch (error) {
            this.state.error = 'Failed to process recording';
            reject(error);
          }
        };

        recorder.stop();
        this.state.isRecording = false;
        this.state.isPaused = false;
      } catch (error) {
        this.state.error = 'Failed to stop recording';
        reject(error);
      }
    });
  }

  private cleanup() {
    if (this.durationInterval) {
      clearInterval(this.durationInterval);
      this.durationInterval = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    this.mediaRecorder = null;
    this.state.duration = 0;
    this.startTime = 0;
  }

  clearRecording() {
    this.currentRecording = null;
  }

  reset() {
    this.stopRecording();
    this.clearRecording();
    this.state.error = undefined;
  }
}

export const recordingStore = new RecordingStore();