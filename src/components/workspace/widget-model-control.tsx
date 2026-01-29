"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Zap, Star } from "lucide-react"
import { useWorkspace } from "./workspace-context"
import { cn } from "@/lib/utils"

export function WidgetModelControl() {
    const { state, dispatch } = useWorkspace()

    return (
        <motion.div 
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.02 }}
            className="absolute top-24 right-20 w-[240px] h-[64px] bg-white/40 backdrop-blur-xl border border-white/30 rounded-full shadow-lg p-1.5 flex gap-1"
        >
            <button
                onClick={() => dispatch({ type: 'SET_MODEL', payload: 'gemini-2.5-flash-image' })}
                className={cn(
                    "flex-1 rounded-full flex items-center justify-center gap-2 text-sm font-medium transition-all relative z-10",
                    state.modelId.includes('flash') 
                        ? "text-amber-600 shadow-sm" 
                        : "text-gray-500 hover:text-gray-700 hover:bg-white/20"
                )}
            >
                 <Zap className={cn("w-4 h-4", state.modelId.includes('flash') && "fill-amber-400 text-amber-500")} />
                 Fast
            </button>
            <button
                onClick={() => dispatch({ type: 'SET_MODEL', payload: 'gemini-3-pro-image-preview' })}
                className={cn(
                    "flex-1 rounded-full flex items-center justify-center gap-2 text-sm font-medium transition-all relative z-10",
                    state.modelId.includes('pro') 
                        ? "text-indigo-600 shadow-sm" 
                        : "text-gray-500 hover:text-gray-700 hover:bg-white/20"
                )}
            >
                 <Star className={cn("w-4 h-4", state.modelId.includes('pro') && "fill-indigo-400 text-indigo-500")} />
                 Pro
            </button>
            
            {/* Sliding Background */}
            <div className={cn(
                "absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-full shadow-md transition-all duration-300 left-1.5",
                state.modelId.includes('pro') && "translate-x-[114px]" // manually tuned for width
            )} />
        </motion.div>
    )
}
