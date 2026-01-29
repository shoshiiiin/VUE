import { NextResponse } from 'next/server';
import { list, del } from '@vercel/blob';

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params;

    // 1. List all files in the workspace folder
    let hasMore = true;
    let cursor;
    
    while (hasMore) {
        const { blobs, hasMore: more, cursor: nextCursor } = await list({ 
            prefix: `workspaces/${id}/`,
            cursor 
        });
        
        // 2. Delete them
        if (blobs.length > 0) {
            await del(blobs.map(b => b.url));
        }
        
        hasMore = more;
        cursor = nextCursor as string | undefined;
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Delete workspace error:", error);
    return NextResponse.json(
      { error: "Failed to delete workspace" },
      { status: 500 }
    );
  }
}
