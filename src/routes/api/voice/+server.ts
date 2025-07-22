import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createInstructionUpdate } from '$lib/utils/instruction-processor';
import { transcribeAudio, processVoiceFeedback } from '$lib/server/ai';

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

    // Transcribe the audio using Whisper API
    const transcription = await transcribeAudio(audioFile);
    
    // Process the feedback using GPT-4
    const { processedFeedback, instructionUpdate } = await processVoiceFeedback(
      transcription,
      currentInstructions
    );
    
    // Create instruction update with AI-enhanced processing
    const update = await createInstructionUpdate(
      currentInstructions,
      transcription,
      processedFeedback,
      instructionUpdate
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