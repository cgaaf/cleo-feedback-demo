import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createInstructionUpdate } from '$lib/utils/instruction-processor';

// Demo transcriptions for simulation
const DEMO_TRANSCRIPTIONS = [
  "Avoid using the word severe when describing symptoms",
  "Include medication allergies in the HPI",
  "Don't use medical jargon, keep it simple",
  "Add social history when relevant to the chief complaint",
  "Remove redundant information about vital signs"
];

export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const currentInstructions = formData.get('instructions') as string;
    
    if (!audioFile || !currentInstructions) {
      return json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demo: use a random transcription
    const transcription = DEMO_TRANSCRIPTIONS[Math.floor(Math.random() * DEMO_TRANSCRIPTIONS.length)];
    
    // Simulate LLM processing the feedback
    const processedFeedback = simulateProcessFeedback(transcription);
    
    // Create instruction update
    const update = createInstructionUpdate(
      currentInstructions,
      transcription,
      processedFeedback
    );

    return json({
      transcription,
      processedFeedback,
      update,
      confidence: 0.95
    });

  } catch (error) {
    console.error('Voice processing error:', error);
    return json({ 
      error: 'Failed to process voice feedback' 
    }, { status: 500 });
  }
};

function simulateProcessFeedback(transcription: string): string {
  // Simulate intelligent processing of feedback
  const lower = transcription.toLowerCase();
  
  if (lower.includes('avoid') || lower.includes('don\'t')) {
    const keyword = extractMainKeyword(transcription);
    return `Exclude ${keyword} from documentation`;
  }
  
  if (lower.includes('include') || lower.includes('add')) {
    const keyword = extractMainKeyword(transcription);
    return `Include ${keyword} in the documentation`;
  }
  
  if (lower.includes('remove') || lower.includes('delete')) {
    const keyword = extractMainKeyword(transcription);
    return `Remove references to ${keyword}`;
  }
  
  return transcription;
}

function extractMainKeyword(text: string): string {
  const words = text.split(' ');
  const skipWords = ['avoid', 'don\'t', 'include', 'add', 'remove', 'delete', 'the', 'a', 'an', 'using', 'word'];
  
  for (const word of words) {
    if (!skipWords.includes(word.toLowerCase()) && word.length > 3) {
      return word;
    }
  }
  
  return 'this item';
}