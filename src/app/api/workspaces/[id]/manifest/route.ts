import { NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params;
    const { addInputs = [], addOutputs = [], sku, variant } = await request.json();

    if (!id) {
       return NextResponse.json({ error: "Missing workspace ID" }, { status: 400 });
    }
    
    // 1. Find the manifest
    const { blobs } = await list({ prefix: `workspaces/${id}/manifest.json`, limit: 1 });
    
    if (blobs.length === 0) {
        return NextResponse.json({ error: "Manifest not found" }, { status: 404 });
    }
    
    const manifestUrl = blobs[0].url;
    
    // 2. Fetch current content
    const currentManifest = await fetch(manifestUrl).then(res => res.json());
    
    // 3. Merge
    const updatedManifest = {
        ...currentManifest,
        updatedAt: Date.now(),
        ...(sku !== undefined && { sku }),
        ...(variant !== undefined && { variant }),
        inputs: [...(currentManifest.inputs || []), ...addInputs],
        outputs: [...(currentManifest.outputs || []), ...addOutputs]
    };
    
    // 4. Save back
    const { url } = await put(`workspaces/${id}/manifest.json`, JSON.stringify(updatedManifest), {
      access: 'public',
      addRandomSuffix: false
    });

    return NextResponse.json({ 
        success: true,
        manifest: updatedManifest,
        url
    });

  } catch (error) {
     console.error("Manifest update error:", error);
     return NextResponse.json({ error: "Failed to update manifest" }, { status: 500 });
  }
}
