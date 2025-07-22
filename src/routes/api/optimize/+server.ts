import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { optimizeInstructions } from '$lib/server/ai';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { instructions } = await request.json();
    
    if (!instructions) {
      return json({ 
        error: 'Missing instructions to optimize' 
      }, { status: 400 });
    }

    // Use AI to optimize the instructions
    const result = await optimizeInstructions(instructions);

    return json({
      original: instructions,
      optimized: result.optimizedInstructions,
      improvements: result.improvements,
      confidence: 0.92
    });

  } catch (error) {
    console.error('Optimization error:', error);
    return json({ 
      error: 'Failed to optimize instructions' 
    }, { status: 500 });
  }
};