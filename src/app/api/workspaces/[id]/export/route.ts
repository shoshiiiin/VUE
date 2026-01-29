
import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';
import archiver from 'archiver';
import { stringify } from 'csv-stringify/sync';
import { PassThrough } from 'stream';

// Helper to sanitize filenames
function sanitize(str: string) {
    return str.replace(/[^a-zA-Z0-9-_]/g, '-');
}

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params;
    
    // 1. Fetch Manifest
    const { blobs } = await list({ prefix: `workspaces/${id}/manifest.json`, limit: 1 });
    if (blobs.length === 0) {
        return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }
    
    const manifestDto = await fetch(blobs[0].url).then(res => res.json());
    
    // 2. Prepare Metadata
    const sku = manifestDto.sku || "UNKNOWN-SKU";
    const variant = manifestDto.variant || "DEFAULT-VARIANT";
    
// 3. Setup Archiver & Stream
    const pass = new PassThrough();
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });

    archive.pipe(pass);

    // 4. Generate CSV
    const csvData = [
        ['sku', 'variant', 'shot_type', 'angle', 'file_name', 'url'],
        ...manifestDto.outputs.map((out: { type?: string; name: string; url: string }) => {
            const shotType = out.type || 'render';
            const angle = out.name.includes('_') ? out.name.split('_').pop()?.replace('.png', '') || 'front' : 'front';
            const fileName = `${sanitize(sku)}_${sanitize(variant)}_${sanitize(shotType)}_${sanitize(angle)}_v01.png`;
            return [sku, variant, shotType, angle, fileName, out.url];
        })
    ];
    const csvString = stringify(csvData);
    archive.append(csvString, { name: 'manifest.csv' });

    // 5. Add Images
    for (const out of manifestDto.outputs) {
        try {
            const shotType = out.type || 'render';
            // Simple heuristic to guess angle/type if not explicitly stored separately
            // Assuming name format was somewhat descriptive or using fallback
            const angle = out.name.includes('_') ? out.name.split('_').pop()?.replace('.png', '') || 'view' : 'view';
            
            const fileName = `${sanitize(sku)}_${sanitize(variant)}_${sanitize(shotType)}_${sanitize(angle)}_v01.png`;
            const folderPath = `${sanitize(sku)}/${sanitize(variant)}/${sanitize(shotType)}/${fileName}`;

            // Fetch image stream
            const res = await fetch(out.url);
            if (!res.ok) continue;
            
            // Archiver supports streams
            // We need to convert web stream to node stream if necessary, but node-fetch (if polyfilled) or built-in fetch returns standard Request/Response. 
            // In Node 18+ (Next.js Edge/Node runtime), fetch response.body is a ReadableStream (Web).
            // Archiver expects Node Streams. We can use Buffer for simplicity or convert.
            // For simplicity and reliability in this context: ArrayBuffer -> Buffer
            const arrayBuffer = await res.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            archive.append(buffer, { name: folderPath });
        } catch (e) {
            console.error("Failed to add file to zip", out.name, e);
        }
    }

    // 6. Finalize (don't await this blocking the return, but we need to ensure it starts)
    archive.finalize();

    // 7. Return Response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new NextResponse(pass as any, {
        headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="${sanitize(sku)}_${sanitize(variant)}_export.zip"`,
        },
    });

  } catch (error) {
     console.error("Export error:", error);
     return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
