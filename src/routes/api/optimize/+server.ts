import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { instructions } = await request.json();
    
    if (!instructions) {
      return json({ 
        error: 'Missing instructions to optimize' 
      }, { status: 400 });
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate LLM optimization
    const optimizedInstructions = simulateOptimization(instructions);
    const improvements = generateImprovementSummary(instructions, optimizedInstructions);

    return json({
      original: instructions,
      optimized: optimizedInstructions,
      improvements,
      confidence: 0.92
    });

  } catch (error) {
    console.error('Optimization error:', error);
    return json({ 
      error: 'Failed to optimize instructions' 
    }, { status: 500 });
  }
};

function simulateOptimization(instructions: string): string {
  // Simulate intelligent optimization
  const lines = instructions.split('\n');
  const optimized: string[] = [];
  
  // Add a clear header if missing
  if (!instructions.toLowerCase().includes('hpi')) {
    optimized.push('Generate a comprehensive yet concise History of Present Illness (HPI) that:');
  }
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;
    
    // Improve clarity and specificity
    let improved = trimmed;
    
    // Add bullet points if missing
    if (trimmed.length > 0 && !trimmed.startsWith('-') && !trimmed.endsWith(':')) {
      improved = `- ${trimmed}`;
    }
    
    // Enhance vague terms
    improved = improved
      .replace(/clear/gi, 'clear and unambiguous')
      .replace(/relevant/gi, 'clinically relevant')
      .replace(/concise/gi, 'concise (2-3 paragraphs)')
      .replace(/pertinent/gi, 'pertinent to the chief complaint');
    
    optimized.push(improved);
  });
  
  // Add missing best practices
  const hasChronology = instructions.toLowerCase().includes('chronolog');
  const hasObjective = instructions.toLowerCase().includes('objective');
  
  if (!hasChronology) {
    optimized.push('- Present information in chronological order (onset, progression, current state)');
  }
  
  if (!hasObjective) {
    optimized.push('- Maintain objective tone without subjective interpretations');
  }
  
  return optimized.join('\n');
}

function generateImprovementSummary(original: string, optimized: string): string[] {
  const improvements: string[] = [];
  
  if (optimized.length > original.length) {
    improvements.push('Added more specific guidance for clarity');
  }
  
  if (!original.includes('HPI') && optimized.includes('HPI')) {
    improvements.push('Clarified the purpose (HPI generation)');
  }
  
  if (optimized.includes('2-3 paragraphs')) {
    improvements.push('Added specific length guidance');
  }
  
  if (optimized.split('\n').length > original.split('\n').length) {
    improvements.push('Expanded instructions with best practices');
  }
  
  if (optimized.includes('chronological') && !original.includes('chronological')) {
    improvements.push('Emphasized chronological organization');
  }
  
  return improvements.length > 0 ? improvements : ['Refined language for better clarity'];
}