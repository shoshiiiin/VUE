import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  try {
    const { initialData } = await request.json().catch(() => ({ initialData: null }));
    
    // Generate a new Workspace ID
    const workspaceId = uuidv4();
    const timestamp = Date.now();

    // Create initial manifest
    const manifest = {
      id: workspaceId,
      createdAt: timestamp,
      updatedAt: timestamp,
      inputs: [],
      outputs: [],
      ...initialData
    };

    // Upload manifest.json to Blob Storage
    // Path: workspaces/{workspaceId}/manifest.json
    const { url } = await put(`workspaces/${workspaceId}/manifest.json`, JSON.stringify(manifest), {
      access: 'public',
      addRandomSuffix: false // We want a predictable path for the manifest
    });

    return NextResponse.json({ 
      workspaceId,
      manifestUrl: url,
      manifest
    });

  } catch (error) {
    console.error("Error creating workspace:", error);
    return NextResponse.json(
      { error: "Failed to create workspace" },
      { status: 500 }
    );
  }
}
