"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
    Download,
    ExternalLink,
    Clock,
    X,
    Trash2,
    Image as ImageIcon,
    Package
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface CloudImage {
    id: string; // Unique composition
    url: string;
    name: string;
    workspaceId: string;
    timestamp: number;
}

export default function GalleryPage() {
    const [images, setImages] = React.useState<CloudImage[]>([])
    const [loading, setLoading] = React.useState(true);
    const [lightboxUrl, setLightboxUrl] = React.useState<string | null>(null)

    React.useEffect(() => {
        const loadGallery = async () => {
            setLoading(true);
            const savedWorkspaces = JSON.parse(localStorage.getItem("vue_workspaces") || "[]");
            
            const allImages: CloudImage[] = [];

            // Fetch all workspaces in parallel
            await Promise.all(savedWorkspaces.map(async (id: string) => {
                try {
                    const res = await fetch(`/api/share/${id}`);
                    if (!res.ok) return;
                    const manifest = await res.json();
                    
                    if (manifest.outputs) {
                        manifest.outputs.forEach((out: any) => {
                            allImages.push({
                                id: out.url, // URL as unique ID
                                url: out.url,
                                name: out.name,
                                workspaceId: id,
                                timestamp: manifest.createdAt
                            });
                        });
                    }
                } catch (e) {
                    console.error("Failed to load workspace", id);
                }
            }));

            // Sort by new
            allImages.sort((a, b) => b.timestamp - a.timestamp);
            setImages(allImages);
            setLoading(false);
        };

        loadGallery();
    }, []);

    const clearHistory = () => {
        if(confirm("Clear gallery history? This only removes references from this browser, files remain in the cloud.")) {
            localStorage.removeItem("vue_workspaces");
            setImages([]);
        }
    }

    return (
        <main className="app-canvas p-8 lg:p-12 min-h-full pb-24">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--text-strong)] tracking-tight">Cloud Gallery</h1>
                        <p className="text-[var(--text-muted)] mt-1">Your generated assets from Vercel Blob.</p>
                    </div>
                    
                    {images.length > 0 && (
                        <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={clearHistory}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Clear History
                        </Button>
                    )}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
                        {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-gray-200 rounded-xl" />)}
                    </div>
                ) : images.length === 0 ? (
                     <div className="text-center py-24 border-2 border-dashed border-[var(--border)] rounded-[var(--radius-card)] bg-[var(--surface-1)]">
                         <ImageIcon className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4 opacity-50" />
                         <h3 className="text-lg font-medium text-[var(--text-strong)]">No Images Found</h3>
                         <p className="text-[var(--text-muted)]">Generate images in the Studio to see them here.</p>
                         <Button className="mt-4" variant="outline" onClick={() => window.location.href = '/studio'}>
                             Go to Studio
                         </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {images.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="group relative aspect-square rounded-[var(--radius-card)] overflow-hidden cursor-zoom-in border border-[var(--border)] hover:shadow-lg transition-all"
                                onClick={() => setLightboxUrl(item.url)}
                            >
                                <img 
                                    src={item.url} 
                                    className="w-full h-full object-cover bg-gray-50" 
                                    alt={item.name}
                                    loading="lazy"
                                />
                                
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                     {/* Download Button */}
                                     <a 
                                        href={item.url} 
                                        download={item.name}
                                        className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white"
                                        onClick={(e) => e.stopPropagation()}
                                        title="Download"
                                    >
                                        <Download className="w-4 h-4" />
                                    </a>
                                    {/* Workspace Link */}
                                    <Link 
                                        href={`/share/${item.workspaceId}`}
                                        target="_blank"
                                        className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white"
                                        onClick={(e) => e.stopPropagation()}
                                        title="View Workspace"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </Link>
                                    {/* Export ZIP */}
                                    <button 
                                        className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(`/api/workspaces/${item.workspaceId}/export`, '_blank');
                                        }}
                                        title="Export Workspace ZIP"
                                    >
                                        <Package className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {lightboxUrl && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-300"
                    onClick={() => setLightboxUrl(null)}
                >
                    <button 
                        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all hover:scale-105 z-[110]"
                        onClick={() => setLightboxUrl(null)}
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <img 
                        src={lightboxUrl} 
                        className="max-w-[90vw] max-h-[90vh] object-contain rounded-md shadow-2xl" 
                        onClick={(e) => e.stopPropagation()} 
                    />
                </div>
            )}
        </main>
    )
}
