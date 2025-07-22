import type { InstructionVersion } from '$lib/types';

export interface VersionDiff {
  additions: string[];
  deletions: string[];
  modifications: string[];
}

export function compareVersions(
  oldVersion: InstructionVersion,
  newVersion: InstructionVersion
): VersionDiff {
  const oldLines = oldVersion.content.split('\n').map(l => l.trim()).filter(Boolean);
  const newLines = newVersion.content.split('\n').map(l => l.trim()).filter(Boolean);
  
  const diff: VersionDiff = {
    additions: [],
    deletions: [],
    modifications: []
  };
  
  // Find additions and modifications
  newLines.forEach((line, index) => {
    if (!oldLines.includes(line)) {
      // Check if it's a modification of an existing line
      const similarLine = findSimilarLine(line, oldLines);
      if (similarLine) {
        diff.modifications.push(`"${similarLine}" → "${line}"`);
      } else {
        diff.additions.push(line);
      }
    }
  });
  
  // Find deletions
  oldLines.forEach(line => {
    if (!newLines.includes(line) && !diff.modifications.some(m => m.includes(line))) {
      diff.deletions.push(line);
    }
  });
  
  return diff;
}

function findSimilarLine(line: string, lines: string[]): string | null {
  // Simple similarity check - in production, use a proper string similarity algorithm
  const lineWords = line.toLowerCase().split(' ');
  
  for (const candidate of lines) {
    const candidateWords = candidate.toLowerCase().split(' ');
    const commonWords = lineWords.filter(word => candidateWords.includes(word));
    
    // If more than 50% of words match, consider it a modification
    if (commonWords.length > Math.min(lineWords.length, candidateWords.length) * 0.5) {
      return candidate;
    }
  }
  
  return null;
}

export function formatVersionDiff(diff: VersionDiff): string {
  const parts: string[] = [];
  
  if (diff.additions.length > 0) {
    parts.push(`Added:\n${diff.additions.map(a => `  + ${a}`).join('\n')}`);
  }
  
  if (diff.deletions.length > 0) {
    parts.push(`Removed:\n${diff.deletions.map(d => `  - ${d}`).join('\n')}`);
  }
  
  if (diff.modifications.length > 0) {
    parts.push(`Modified:\n${diff.modifications.map(m => `  ~ ${m}`).join('\n')}`);
  }
  
  return parts.join('\n\n');
}

export function getVersionSummary(version: InstructionVersion): string {
  const date = new Date(version.createdAt);
  const timeStr = date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit' 
  });
  
  let summary = `v${version.version} - ${timeStr}`;
  
  if (version.changeDescription) {
    summary += ` - ${version.changeDescription}`;
  } else if (version.feedback) {
    summary += ` - ${version.feedback.substring(0, 50)}...`;
  }
  
  return summary;
}

export function exportVersionHistory(versions: InstructionVersion[]): string {
  const header = '# Instruction Version History\n\n';
  
  const content = versions.map(version => {
    const date = new Date(version.createdAt);
    return `## Version ${version.version} - ${date.toLocaleString()}

${version.changeDescription || version.feedback || 'No description'}

\`\`\`
${version.content}
\`\`\`
`;
  }).join('\n---\n\n');
  
  return header + content;
}

export function canRevertToVersion(
  currentVersion: number,
  targetVersion: number,
  totalVersions: number
): boolean {
  return targetVersion > 0 && 
         targetVersion < currentVersion && 
         targetVersion <= totalVersions;
}