import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { InstructionVersion } from '$lib/types';

// In-memory version history for demo
const versionHistory: InstructionVersion[] = [
  {
    id: 'v1',
    instructionId: 'default',
    content: `Generate a concise HPI for emergency medicine documentation that:
- Captures chief complaint and relevant history
- Uses clear, professional medical terminology
- Includes pertinent positives and negatives
- Follows chronological order when possible
- Avoids redundancy and maintains brevity`,
    version: 1,
    createdAt: new Date(),
    changeDescription: 'Initial instructions'
  }
];

export const GET: RequestHandler = async ({ url }) => {
  const version = url.searchParams.get('version');
  
  if (version) {
    const versionNum = parseInt(version);
    const specificVersion = versionHistory.find(v => v.version === versionNum);
    
    if (!specificVersion) {
      return json({ 
        error: 'Version not found' 
      }, { status: 404 });
    }
    
    return json(specificVersion);
  }
  
  return json(versionHistory);
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const newVersion: InstructionVersion = await request.json();
    
    if (!newVersion.content || !newVersion.version) {
      return json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Add to history
    versionHistory.push({
      ...newVersion,
      id: `v${newVersion.version}`,
      createdAt: new Date()
    });

    return json({ 
      success: true,
      version: newVersion 
    });

  } catch (error) {
    console.error('Version history error:', error);
    return json({ 
      error: 'Failed to save version' 
    }, { status: 500 });
  }
};