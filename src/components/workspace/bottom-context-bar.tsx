"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useWorkspace } from "./workspace-context"
import { cn } from "@/lib/utils"
// Icons
import { LayoutDashboard, Sparkles, Image as ImageIcon, Loader2 } from "lucide-react"

export function BottomContextBar() {
    const { state } = useWorkspace()

    // Determine Status Text
    const getStatusText = () => {
        switch (state.status) {
            case 'idle': return "Workspace Ready";
            case 'images_ready': return `Ready: ${state.files.length} images`;
            case 'generating': return "Generating Assets...";
            case 'done': return "Run Completed";
            default: return "System Online";
        }
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 h-[76px] z-50 flex items-center justify-between px-8 text-sm font-medium text-gray-500 pointer-events-none">
            {/* Glass Background Panel (Separate from text so text isn't blurred if we want crispness, but here we blur everything behind) */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-xl border-t border-white/40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]" />

            {/* Left: Context */}
            <div className="relative z-10 flex items-center gap-4">
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 border border-white/20 shadow-sm">
                     <div className={cn("w-2 h-2 rounded-full", 
                        state.status === 'generating' ? "bg-amber-400 animate-pulse" : 
                        state.status === 'done' ? "bg-emerald-400" : "bg-emerald-400/50"
                     )} />
                     <span>{getStatusText()}</span>
                 </div>
            </div>

            {/* Center: Dynamic Actions (Pointer events re-enabled) */}
            <div className="relative z-10 pointer-events-auto">
                 <AnimatePresence mode="wait">
                     {state.status === 'done' && (
                         <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className="h-10 px-6 rounded-full bg-black text-white shadow-lg shadow-black/20 hover:scale-105 transition-transform flex items-center gap-2"
                            onClick={() => window.location.href = "/gallery"}
                         >
                             <ImageIcon className="w-4 h-4" />
                             Open Gallery
                         </motion.button>
                     )}
                     {state.status === 'images_ready' && (
                         <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className="text-indigo-600 bg-indigo-50/50 px-4 py-2 rounded-full border border-indigo-100"
                         >
                             Press 'Generate' in Quick Shot
                         </motion.div>
                     )}
                 </AnimatePresence>
            </div>

            {/* Right: System Status */}
            <div className="relative z-10 flex items-center gap-4">
                 <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-60">
                     <span className="w-1.5 h-1.5 rounded-full bg-black/20" />
                     Queue: {state.status === 'generating' ? 'Running' : 'Idle'}
                 </div>
                 <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-60">
                     <span className="w-1.5 h-1.5 rounded-full bg-black/20" />
                     Model: Pro 1.5
                 </div>
                 <div className="w-px h-4 bg-black/10" />
                 <div className="flex items-center gap-1.5 opacity-40">
                     Brillen Studio v2.0
                 </div>
            </div>
        </div>
    )
}
