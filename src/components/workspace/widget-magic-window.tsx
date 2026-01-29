"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Square, RectangleVertical, RectangleHorizontal } from "lucide-react"
import { useWorkspace } from "./workspace-context"
import { cn } from "@/lib/utils"

const RATIOS = [
    { id: '1:1', label: 'Square', icon: Square },
    { id: '4:5', label: 'Portrait', icon: RectangleVertical },
    { id: '16:9', label: 'Wide', icon: RectangleHorizontal },
]

export function WidgetMagicWindow() {
    const { state, dispatch } = useWorkspace()

    return (
        <motion.div 
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.02 }}
            className="absolute top-24 left-[900px] bg-white/40 backdrop-blur-xl border border-white/30 rounded-full shadow-lg p-1.5 flex gap-1"
        >
             {RATIOS.map((r) => {
                 const isActive = state.aspectRatio === r.id
                 const Icon = r.icon
                 return (
                     <button
                        key={r.id}
                        onClick={() => dispatch({ type: 'SET_ASPECT_RATIO', payload: r.id })}
                        className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-all relative group",
                            isActive ? "bg-white shadow-sm text-indigo-600" : "text-gray-500 hover:bg-white/20"
                        )}
                        title={r.label}
                     >
                         <Icon className="w-5 h-5" />
                         {/* Tooltip */}
                         <span className="absolute -bottom-8 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                             {r.label}
                         </span>
                     </button>
                 )
             })}
        </motion.div>
    )
}
