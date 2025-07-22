import type { Instruction, InstructionVersion, Feedback } from '$lib/types';

// const startingInstruction = `Generate a concise HPI for emergency medicine documentation that:
// - Captures chief complaint and relevant history
// - Uses clear, professional medical terminology
// - Includes pertinent positives and negatives
// - Follows chronological order when possible
// - Avoids redundancy and maintains brevity`;

const startingInstruction = `The patient or I may speak in laymans terms but please always convert to medical terminology like "tummy troubles"->"gastrointestinal symptoms".
some terms to avoid converting from layman to medical: ["headache", "lack of appetite"]
if, during an update, the patient gives more historical information, add that here, not in the reeval section. evaluation items should still go in eval section, but the historical components go here. do not include plan items in history
Do not create dedicated subsections for medications, surgeries, allergies etc.
PAY CLOSE ATTENTION do not include assessments/plan/treatments i make in the room in this section. If i am explaining treatments to the patient, those go in evaluation and plan. Do not mention clinician's concerns in this section.`;

class InstructionsStore {
  private currentInstruction = $state<Instruction>({
    id: 'default',
    content: startingInstruction,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1
  });

  private versions = $state<InstructionVersion[]>([{
    id: 'v1',
    instructionId: 'default',
    content: this.currentInstruction.content,
    version: 1,
    createdAt: new Date(),
    changeDescription: 'Initial instructions'
  }]);

  private feedbackHistory = $state<Feedback[]>([]);

  get current() {
    return this.currentInstruction;
  }

  get history() {
    return this.versions;
  }

  get feedback() {
    return this.feedbackHistory;
  }

  updateInstructions(newContent: string, feedback: string, changes: string[]) {
    const newVersion = this.currentInstruction.version + 1;

    const versionEntry: InstructionVersion = {
      id: `v${newVersion}`,
      instructionId: this.currentInstruction.id,
      content: newContent,
      version: newVersion,
      feedback,
      createdAt: new Date(),
      changeDescription: changes.join('; ')
    };

    this.versions.push(versionEntry);

    this.currentInstruction = {
      ...this.currentInstruction,
      content: newContent,
      version: newVersion,
      updatedAt: new Date()
    };

    const feedbackEntry: Feedback = {
      id: `fb${Date.now()}`,
      transcription: feedback,
      processedAt: new Date(),
      appliedChanges: changes.join('; '),
      status: 'applied'
    };

    this.feedbackHistory.push(feedbackEntry);
  }

  addFeedback(feedback: Feedback) {
    this.feedbackHistory.push(feedback);
  }

  getVersion(version: number): InstructionVersion | undefined {
    return this.versions.find(v => v.version === version);
  }

  reset() {
    const initialContent = this.versions[0].content;
    this.currentInstruction = {
      id: 'default',
      content: initialContent,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1
    };
    this.versions = [this.versions[0]];
    this.feedbackHistory = [];
  }
}

export const instructionsStore = new InstructionsStore();
