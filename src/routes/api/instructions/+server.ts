import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { InstructionUpdate } from '$lib/types';
import { validateInstructions } from '$lib/utils/instruction-processor';

// In-memory storage for demo (would use a database in production)
let currentInstructions = {
  id: 'default',
  content: `Generate a concise HPI for emergency medicine documentation that:
- Captures chief complaint and relevant history
- Uses clear, professional medical terminology
- Includes pertinent positives and negatives
- Follows chronological order when possible
- Avoids redundancy and maintains brevity`,
  version: 1,
  updatedAt: new Date()
};

export const GET: RequestHandler = async () => {
  return json(currentInstructions);
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const update: InstructionUpdate = await request.json();

    if (!update.newContent || !update.feedback) {
      return json({
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // Validate the new instructions
    const validation = validateInstructions(update.newContent);
    if (!validation.isValid) {
      return json({
        error: 'Invalid instructions',
        errors: validation.errors
      }, { status: 400 });
    }

    // Update instructions
    currentInstructions = {
      ...currentInstructions,
      content: update.newContent,
      version: currentInstructions.version + 1,
      updatedAt: new Date()
    };

    return json({
      instructions: currentInstructions,
      changes: update.changes
    });

  } catch (error) {
    console.error('Instruction update error:', error);
    return json({
      error: 'Failed to update instructions'
    }, { status: 500 });
  }
};
