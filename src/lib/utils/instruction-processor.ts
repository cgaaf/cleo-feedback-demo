import type { InstructionUpdate } from '$lib/types';

export interface ProcessingOptions {
  preserveStructure?: boolean;
  additive?: boolean;
}

export function parseInstructionChanges(
  oldContent: string,
  newContent: string,
  feedback: string
): string[] {
  const changes: string[] = [];
  
  // Split instructions into lines for comparison
  const oldLines = oldContent.split('\n').map(l => l.trim()).filter(Boolean);
  const newLines = newContent.split('\n').map(l => l.trim()).filter(Boolean);
  
  // Find additions
  const additions = newLines.filter(line => !oldLines.some(old => old.includes(line)));
  if (additions.length > 0) {
    changes.push(`Added: ${additions.join(', ')}`);
  }
  
  // Find removals
  const removals = oldLines.filter(line => !newLines.some(newL => newL.includes(line)));
  if (removals.length > 0) {
    changes.push(`Removed: ${removals.join(', ')}`);
  }
  
  // If the overall structure changed significantly
  if (Math.abs(oldLines.length - newLines.length) > 3) {
    changes.push('Restructured instructions');
  }
  
  // Add the feedback as context
  if (feedback) {
    changes.push(`Based on feedback: "${feedback}"`);
  }
  
  return changes;
}

export function createInstructionUpdate(
  currentContent: string,
  feedback: string,
  processedChanges: string
): InstructionUpdate {
  // In a real implementation, this would use an LLM to intelligently merge feedback
  // For demo purposes, we'll simulate intelligent placement
  
  const lines = currentContent.split('\n');
  const newContent = applyFeedbackToInstructions(lines, feedback, processedChanges);
  const changes = parseInstructionChanges(currentContent, newContent, feedback);
  
  return {
    oldContent: currentContent,
    newContent,
    feedback,
    changes
  };
}

function applyFeedbackToInstructions(
  lines: string[],
  feedback: string,
  processedChanges: string
): string {
  // Simulate intelligent placement based on feedback keywords
  const feedbackLower = feedback.toLowerCase();
  
  // Handle specific feedback patterns
  if (feedbackLower.includes('avoid') || feedbackLower.includes('don\'t')) {
    // Add as a constraint
    lines.push(`- ${processedChanges || feedback}`);
  } else if (feedbackLower.includes('add') || feedbackLower.includes('include')) {
    // Insert in relevant section
    const insertIndex = findRelevantSection(lines, feedback);
    lines.splice(insertIndex, 0, `- ${processedChanges || feedback}`);
  } else if (feedbackLower.includes('remove') || feedbackLower.includes('delete')) {
    // Find and remove matching lines
    const filteredLines = lines.filter(line => 
      !line.toLowerCase().includes(extractKeyword(feedback))
    );
    return filteredLines.join('\n');
  } else {
    // Default: append as new instruction
    lines.push(`- ${processedChanges || feedback}`);
  }
  
  return lines.join('\n');
}

function findRelevantSection(lines: string[], feedback: string): number {
  // Simple heuristic to find where to insert new instructions
  const keywords = extractKeywords(feedback);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (keywords.some(keyword => line.includes(keyword))) {
      return i + 1; // Insert after the matching line
    }
  }
  
  return lines.length; // Default to end
}

function extractKeyword(text: string): string {
  // Extract the main subject from feedback
  const words = text.toLowerCase().split(' ');
  const skipWords = ['avoid', 'don\'t', 'remove', 'delete', 'add', 'include', 'the', 'a', 'an'];
  
  for (const word of words) {
    if (!skipWords.includes(word) && word.length > 3) {
      return word;
    }
  }
  
  return '';
}

function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().split(' ');
  const skipWords = ['avoid', 'don\'t', 'remove', 'delete', 'add', 'include', 'the', 'a', 'an', 'to', 'from', 'with'];
  
  return words.filter(word => !skipWords.includes(word) && word.length > 3);
}

export function validateInstructions(content: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!content || content.trim().length === 0) {
    errors.push('Instructions cannot be empty');
  }
  
  if (content.length < 50) {
    errors.push('Instructions should be more detailed (minimum 50 characters)');
  }
  
  if (content.length > 5000) {
    errors.push('Instructions are too long (maximum 5000 characters)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}