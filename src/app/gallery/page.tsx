"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
    Download,
    Check,
    Clock,
    Filter,
    X,
    Sparkles,
    Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { getHistory } from "@/lib/storage"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function GalleryPage() {
    const [history, setHistory] = React.useState<any[]>([])
    const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set())
    
    // Derived state
    const isSelectionMode = selectedItems.size > 0

    React.useEffect(() => {
        const load = async () => {
            setHistory(await getHistory())
        }
        load()
    }, [])

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedItems)
        if (newSet.has(id)) {
            newSet.delete(id)
        } else {
            newSet.add(id)
        }
        setSelectedItems(newSet)
    }
    
    const selectAll = () => {
        if (selectedItems.size === history.length) {
            setSelectedItems(new Set())
        } else {
            setSelectedItems(new Set(history.map(h => h.id)))
        }
    }

    const handleDelete = async () => {
        if (!confirm(`Delete ${selectedItems.size} items?`)) return;
        
        const { deleteItems } = await import("@/lib/storage")
        const updated = await deleteItems(Array.from(selectedItems))
        setHistory(updated)
        setSelectedItems(new Set())
        toast.success("Items deleted")
    }

    const [downloadFormat, setDownloadFormat] = React.useState<"png" | "webp">("png")

    const handleDownload = async () => {
        const selected = history.filter(h => selectedItems.has(h.id))
        const { convertImageFormat } = await import("@/lib/utils")

        toast.promise(
            Promise.all(selected.map(async (item, index) => {
                // Determine target extension
                const ext = downloadFormat;
                let finalUrl = item.imageUrl;

                // Check if conversion needed
                // If asking for PNG but have WebP (stored), convert.
                // If asking for WebP but have PNG (old stored), convert.
                // Or just always run convertImageFormat to ensure correct output mime type.
                try {
                    finalUrl = await convertImageFormat(item.imageUrl, ext);
                } catch (e) {
                    console.warn("Conversion failed, falling back to original", e);
                }

                // Stagger downloads
                await new Promise(r => setTimeout(r, index * 300));
                
                const link = document.createElement('a')
                link.href = finalUrl
                link.download = `${item.templateName}-${item.timestamp}.${ext}`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            })),
            {
                loading: `Preparing ${selected.length} images as ${downloadFormat.toUpperCase()}...`,
                success: "Downloads started!",
                error: "Failed to download some items"
            }
        )
    }

    // Lightbox State
    const [lightboxId, setLightboxId] = React.useState<string | null>(null)
    const activeImage = history.find(h => h.id === lightboxId)

    return (
        <main className="app-canvas p-8 lg:p-12 min-h-full pb-24">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--text-strong)] tracking-tight">Gallery</h1>
                        <p className="text-[var(--text-muted)] mt-1">Manage, download, and organize your generated assets.</p>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="glass-panel p-2 flex items-center justify-between sticky top-4 z-20 backdrop-blur-xl bg-white/50 border-[var(--border)] shadow-sm">
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={selectAll}
                            className="text-xs text-[var(--text-muted)]"
                        >
                            {selectedItems.size === history.length && history.length > 0 ? "Deselect All" : "Select All"}
                        </Button>
                        <span className="text-xs text-[var(--text-muted)] border-l pl-2 border-[var(--border)]">
                            {selectedItems.size} selected
                        </span>
                    </div>
                    
                    {isSelectionMode && (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                             {/* Format Selector */}
                             <div className="flex items-center border rounded-md bg-white border-gray-200 h-8 px-1 mr-2">
                                <button 
                                    onClick={() => setDownloadFormat("png")}
                                    className={cn(
                                        "text-[10px] font-medium px-2 py-1 rounded transition-colors",
                                        downloadFormat === "png" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-900"
                                    )}
                                >
                                    PNG
                                </button>
                                <div className="w-px h-3 bg-gray-200 mx-0.5"></div>
                                <button 
                                    onClick={() => setDownloadFormat("webp")}
                                    className={cn(
                                        "text-[10px] font-medium px-2 py-1 rounded transition-colors",
                                        downloadFormat === "webp" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-900"
                                    )}
                                >
                                    WEBP
                                </button>
                             </div>

                            <Button size="sm" variant="outline" onClick={handleDownload} className="h-8 gap-2">
                                <Download className="w-3.5 h-3.5" />
                                Download ({selectedItems.size})
                            </Button>
                            <Button size="sm" variant="destructive" onClick={handleDelete} className="h-8 gap-2">
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                            </Button>
                        </div>
                    )}
                </div>

                {/* Gallery Grid */}
                {history.length === 0 ? (
                     <div className="text-center py-24 border-2 border-dashed border-[var(--border)] rounded-[var(--radius-card)] bg-[var(--surface-1)]">
                         <Clock className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4 opacity-50" />
                         <h3 className="text-lg font-medium text-[var(--text-strong)]">Gallery Empty</h3>
                         <p className="text-[var(--text-muted)]">Generated images will appear here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {history.map((item, idx) => {
                            const isSelected = selectedItems.has(item.id)
                            return (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={cn(
                                        "group relative aspect-square rounded-[var(--radius-card)] overflow-hidden cursor-zoom-in border-2 transition-all duration-200",
                                        isSelected 
                                            ? "border-accent-500 shadow-md ring-2 ring-accent-500/20" 
                                            : "border-transparent hover:border-[var(--border)] hover:shadow-sm"
                                    )}
                                    // Click main card -> Zoom
                                    onClick={() => setLightboxId(item.id)}
                                >
                                    <img 
                                        src={item.imageUrl} 
                                        className="w-full h-full object-cover bg-gray-50" 
                                        alt={item.templateName}
                                        loading="lazy"
                                    />
                                    
                                    {/* Overlay Gradient (Hover) */}
                                    <div className={cn(
                                        "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-200 pointer-events-none",
                                        isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                    )} />

                                    {/* Selection Checkbox - Specific Click Handler */}
                                    <div className="absolute top-2 left-2 z-10" onClick={(e) => {
                                        e.stopPropagation(); // Don't trigger zoom
                                        toggleSelection(item.id);
                                    }}>
                                        <div className={cn(
                                            "w-6 h-6 rounded-full border shadow-sm flex items-center justify-center transition-all cursor-pointer hover:scale-110",
                                            isSelected 
                                                ? "bg-accent-500 border-accent-500 text-white" 
                                                : "bg-white/90 border-gray-300 hover:bg-white text-transparent"
                                        )}>
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                    </div>

                                    {/* Info Badge */}
                                    <div className={cn(
                                        "absolute bottom-2 left-2 right-2 text-white text-xs font-medium truncate transition-all pointer-events-none",
                                        isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                    )}>
                                        {item.templateName}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Lightbox Overlay */}
            {activeImage && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-300"
                    onClick={() => setLightboxId(null)}
                >
                    {/* Close Button - Fixed to Top Right of Screen */}
                    <button 
                        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white/90 hover:text-white transition-all hover:scale-105 z-[110]"
                        onClick={() => setLightboxId(null)}
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="relative w-full h-full max-w-7xl max-h-screen p-8 flex items-center justify-center flex-col gap-4">
                        
                        <div className="relative group">
                            <motion.img 
                                layoutId={`img-${activeImage.id}`} 
                                src={activeImage.imageUrl} 
                                alt={activeImage.templateName}
                                className="max-w-full max-h-[75vh] object-contain rounded-md shadow-2xl bg-white" 
                                onClick={(e) => e.stopPropagation()} 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            />
                        </div>
                        
                        {/* Edit Interface - Lavender Gray Glassmorph */}
                        <div 
                            className="w-full max-w-lg bg-[#D2C5D8]/20 backdrop-blur-xl border border-[#D2C5D8]/30 p-2 rounded-2xl flex items-center gap-2 animate-in slide-in-from-bottom-4 fade-in duration-300 shadow-[0_8px_32px_rgba(146,134,160,0.2)] ring-1 ring-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-2 rounded-xl bg-[#9286A0]/30 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-[#E6E6FA]" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Edit with AI (e.g., 'Make background blue')..."
                                className="flex-1 bg-transparent border-none text-white placeholder-white/50 focus:ring-0 text-sm h-9"
                                onKeyDown={async (e) => {
                                    if (e.key === 'Enter') {
                                        const input = e.currentTarget;
                                        const prompt = input.value;
                                        if (!prompt.trim()) return;
                                        
                                        toast.loading("Editing image...");
                                        input.disabled = true;

                                        try {
                                            const res = await fetch("/api/generate", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({
                                                    apiKey: localStorage.getItem("google_api_key") || "",
                                                    modelId: "gemini-1.5-pro", 
                                                    editImage: activeImage.imageUrl,
                                                    textPrompt: prompt
                                                })
                                            });
                                            
                                            const data = await res.json();
                                            if (!res.ok) throw new Error(data.error);

                                            if (data.image) {
                                                const newUrl = `data:${data.mimeType};base64,${data.image}`;
                                                
                                                // Save new version
                                                const { saveGeneration } = await import("@/lib/storage");
                                                const newEvent = {
                                                    id: crypto.randomUUID(),
                                                    templateName: `Edited: ${activeImage.templateName}`,
                                                    templateId: "edit-mode",
                                                    timestamp: Date.now(),
                                                    imageUrl: newUrl
                                                };
                                                await saveGeneration(newEvent);
                                                
                                                // Update UI
                                                setHistory(prev => [newEvent, ...prev]);
                                                setLightboxId(newEvent.id); 
                                                toast.dismiss();
                                                toast.success("Image updated!");
                                                input.value = "";
                                            }
                                        } catch (err: any) {
                                            toast.error("Process failed", { description: err.message });
                                        } finally {
                                            input.disabled = false;
                                            toast.dismiss();
                                        }
                                    }
                                }}
                            />
                        </div>

                        <div className="text-center space-y-1 pointer-events-none fade-in duration-500 delay-100">
                            <h3 className="text-xl font-medium text-white tracking-tight">{activeImage.templateName}</h3>
                            <p className="text-sm text-white/50">{new Date(activeImage.timestamp).toLocaleDateString()} • {activeImage.templateId}</p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
