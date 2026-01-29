"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Clock } from "lucide-react"
import { getHistory, GeneratedImage } from "@/lib/storage"

import { useWorkspace } from "./workspace-context"

export function WidgetTimelineScrubber() {
    const { state } = useWorkspace()
    const [history, setHistory] = React.useState<GeneratedImage[]>([])

    React.useEffect(() => {
        const fetchHistory = async () => {
             const items = await getHistory();
             setHistory(items.slice(0, 20)) // Last 20 for timeline
        }
        fetchHistory()
        
        if (state.status === 'done') {
            fetchHistory()
        }
    }, [state.status])

    if (history.length === 0) return null;

    return (
        <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[600px] h-12 bg-white/20 backdrop-blur-md border-t border-white/20 rounded-t-2xl flex items-center px-4 gap-2 z-40 overflow-hidden"
        >
            <Clock className="w-4 h-4 text-white/50 flex-shrink-0" />
            <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide mask-gradient">
                {history.map((item, i) => (
                    <div key={item.id} className="w-8 h-8 rounded-md overflow-hidden opacity-60 hover:opacity-100 transition-opacity cursor-pointer border border-white/20">
                        <img src={item.imageUrl} className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>
        </motion.div>
    )
}
