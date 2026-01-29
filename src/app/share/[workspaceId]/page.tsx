"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface Manifest {
  id: string;
  createdAt: number;
  outputs: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

export default function SharePage() {
    const params = useParams();
    const id = params?.workspaceId as string;
    const [manifest, setManifest] = useState<Manifest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;
        
        const load = async () => {
             try {
                 const res = await fetch(`/api/share/${id}`);
                 if (!res.ok) throw new Error("Workspace not found");
                 const data = await res.json();
                 setManifest(data);
             } catch (err) {
                 setError("Could not load workspace.");
             } finally {
                 setLoading(false);
             }
        };
        load();
    }, [id]);

    return (
        <div className="min-h-screen bg-[var(--bg-app)]">
             <header className="h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-panel)]/80 backdrop-blur-md sticky top-0 z-50 flex items-center px-4 justify-between">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--text-strong)]">VUE</span>
                    <span className="text-[var(--text-muted)]">/</span>
                    <span className="text-[var(--text-main)]">Shared Workspace</span>
                </div>
             </header>
             
             <main className="container mx-auto p-4 md:p-8">
                {loading && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[1,2,3].map(i => <Skeleton key={i} className="aspect-[3/4] rounded-xl" />)}
                    </div>
                )}
                
                {error && <div className="text-red-500">{error}</div>}
                
                {manifest && (
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-2xl font-bold text-[var(--text-strong)] mb-2">Workspace Results</h1>
                            <p className="text-[var(--text-muted)] text-sm">{new Date(manifest.createdAt).toLocaleDateString()}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {manifest.outputs.map((file, idx) => (
                                <Card key={idx} className="overflow-hidden border-0 bg-[var(--bg-panel)] shadow-sm hover:shadow-md transition-all">
                                    <div className="relative aspect-[3/4]">
                                        <Image 
                                            src={file.url} 
                                            alt={file.name} 
                                            fill 
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                                        <a 
                                            href={file.url} 
                                            download={file.name} 
                                            className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-md opacity-0 hover:opacity-100 transition-opacity"
                                        >
                                            Download
                                        </a>
                                    </div>
                                </Card>
                            ))}
                        </div>
                        
                        {manifest.outputs.length === 0 && (
                            <div className="text-center py-20 text-[var(--text-muted)] border border-dashed border-[var(--border-subtle)] rounded-xl">
                                No results in this workspace yet.
                            </div>
                        )}
                    </div>
                )}
             </main>
        </div>
    );
}
