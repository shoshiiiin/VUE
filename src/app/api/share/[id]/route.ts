import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params;
    
    // 1. Find the manifest
    const { blobs } = await list({ prefix: `workspaces/${id}/manifest.json`, limit: 1 });
    
    if (blobs.length === 0) {
        return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }
    
    const manifestUrl = blobs[0].url;
    
    // 2. Fetch content
    const manifest = await fetch(manifestUrl).then(res => res.json());

    return NextResponse.json(manifest); // Returns { id, inputs, outputs, ... }

  } catch (error) {
    console.error("Share error:", error);
    return NextResponse.json(
      { error: "Failed to load workspace" },
      { status: 500 }
    );
  }
}
