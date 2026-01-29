"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { History, Download, ExternalLink } from "lucide-react"
import { getHistory, GeneratedImage } from "@/lib/storage"
import { useWorkspace } from "./workspace-context"
// Using Next.js Link for navigation
import Link from "next/link"

export function WidgetRecentAssets() {
    const { state } = useWorkspace() // We listen to state to trigger re-fetches
    const [recent, setRecent] = React.useState<GeneratedImage[]>([])

    // Poll history whenever generation finishes (state.status goes to 'done')
    // OR just poll every 3s for simpler "live" feel in MVP
    React.useEffect(() => {
        const fetchRecent = async () => {
            const history = await getHistory()
            setRecent(history.slice(0, 4)) // Last 4
        }
        
        fetchRecent()
        
        // Refresh when generation finishes
        if (state.status === 'done') {
            fetchRecent()
        }
        
        // Also poll just in case
        const interval = setInterval(fetchRecent, 5000)
        return () => clearInterval(interval)
    }, [state.status])

    if (recent.length === 0) return null

    return (
        <motion.div 
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.02 }}
            className="absolute bottom-24 right-8 w-[340px] bg-white/40 backdrop-blur-xl border border-white/30 rounded-[28px] shadow-lg p-5 flex flex-col gap-4"
        >
            <div className="flex items-center justify-between px-1">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Recent Live
                </span>
                <Link href="/gallery" className="p-1.5 hover:bg-black/5 rounded-full" title="Open Gallery">
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {recent.map((item) => (
                    <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden group shadow-sm">
                        <img src={item.imageUrl} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <a 
                                href={item.imageUrl} 
                                download={`asset-${item.timestamp}.webp`}
                                className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Download className="w-4 h-4" />
                            </a>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent text-[10px] text-white truncate px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           {item.templateName}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}
