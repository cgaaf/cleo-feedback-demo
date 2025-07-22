import { openai } from '@ai-sdk/openai';
import { generateObject, generateText, jsonSchema, experimental_transcribe as transcribe } from 'ai';
import type { InstructionUpdate } from '$lib/types';
import { OPENAI_API_KEY } from '$env/static/private';
import { AI_MODELS } from '$lib/config/ai';

// Schema for voice feedback processing
const voiceFeedbackSchema = jsonSchema<{
  processedFeedback: string;
  instructionUpdate: {
    action: 'add' | 'remove' | 'modify' | 'clarify';
    target: string;
    details: string;
  };
}>({
  type: 'object',
  properties: {
    processedFeedback: {
      type: 'string',
      description: 'Refined and actionable version of the voice feedback'
    },
    instructionUpdate: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['add', 'remove', 'modify', 'clarify'],
          description: 'Type of change to make to instructions'
        },
        target: {
          type: 'string',
          description: 'What part of the instructions to change'
        },
        details: {
          type: 'string',
          description: 'Specific details about the change'
        }
      },
      required: ['action', 'target', 'details']
    }
  },
  required: ['processedFeedback', 'instructionUpdate']
});

// Schema for instruction optimization
const optimizationSchema = jsonSchema<{
  optimizedInstructions: string;
  improvements: string[];
  reasoning: string;
}>({
  type: 'object',
  properties: {
    optimizedInstructions: {
      type: 'string',
      description: 'The improved version of the instructions'
    },
    improvements: {
      type: 'array',
      items: { type: 'string' },
      description: 'List of specific improvements made'
    },
    reasoning: {
      type: 'string',
      description: 'Brief explanation of the optimization approach'
    }
  },
  required: ['optimizedInstructions', 'improvements', 'reasoning']
});

// Schema for instruction merging
const instructionMergeSchema = jsonSchema<{
  mergedContent: string;
  appliedChanges: string[];
}>({
  type: 'object',
  properties: {
    mergedContent: {
      type: 'string',
      description: 'The updated instructions with feedback incorporated'
    },
    appliedChanges: {
      type: 'array',
      items: { type: 'string' },
      description: 'List of changes that were applied'
    }
  },
  required: ['mergedContent', 'appliedChanges']
});

export async function transcribeAudio(audioFile: File): Promise<string> {
  try {
    // Convert File to ArrayBuffer for AI SDK compatibility
    const audioBuffer = await audioFile.arrayBuffer();

    const result = await transcribe({
      model: openai.transcription(AI_MODELS.TRANSCRIPTION),
      audio: audioBuffer
    });

    return result.text;
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error(`Failed to transcribe audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function processVoiceFeedback(
  transcription: string,
  currentInstructions: string
) {
  const { object } = await generateObject({
    model: openai(AI_MODELS.PROCESSING),
    schema: voiceFeedbackSchema,
    prompt: `You are an AI medical scribe instruction optimizer.

Current instructions:
${currentInstructions}

Voice feedback from doctor:
"${transcription}"

Analyze this feedback and determine:
1. A clear, actionable version of the feedback
2. The specific type of change needed (add, remove, modify, or clarify)
3. What part of the instructions to target
4. Detailed information about the change

Focus on making the instructions clearer and more effective for generating medical documentation.`
  });

  return object;
}

export async function optimizeInstructions(instructions: string) {
  const { object } = await generateObject({
    model: openai(AI_MODELS.OPTIMIZATION),
    schema: optimizationSchema,
    prompt: `You are an expert in medical documentation and AI instruction optimization.

Current instructions:
${instructions}

Analyze these instructions and optimize them to be:
1. Clear and unambiguous
2. Comprehensive yet concise
3. Well-structured with proper formatting
4. Specific about medical documentation requirements
5. Free of redundancy or vague language

Provide:
1. An optimized version of the instructions
2. A list of specific improvements made
3. Brief reasoning for your optimization approach`
  });

  return object;
}

export async function mergeInstructionUpdate(
  currentInstructions: string,
  feedback: string,
  processedFeedback: {
    action: 'add' | 'remove' | 'modify' | 'clarify';
    target: string;
    details: string;
  }
) {
  const { object } = await generateObject({
    model: openai(AI_MODELS.PROCESSING),
    schema: instructionMergeSchema,
    prompt: `You are an AI medical scribe instruction optimizer.

Current instructions:
${currentInstructions}

Original feedback: "${feedback}"

Processed feedback:
- Action: ${processedFeedback.action}
- Target: ${processedFeedback.target}
- Details: ${processedFeedback.details}

Apply this feedback to the current instructions intelligently:
1. If adding, place new content in the most logical location
2. If removing, ensure no critical information is lost
3. If modifying, preserve the intent while improving clarity
4. If clarifying, add specificity without redundancy

Return the merged instructions and a list of changes applied.`
  });

  return object;
}
