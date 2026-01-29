"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Sun, Lamp, Sunset, Snowflake, Zap } from "lucide-react"
import { useWorkspace } from "./workspace-context"
import { cn } from "@/lib/utils"

const LIGHT_MODES = [
    { id: 'natural', label: 'Natural', icon: Sun, color: 'text-amber-500' },
    { id: 'studio', label: 'Studio', icon: Lamp, color: 'text-indigo-500' },
    { id: 'warm', label: 'Warm', icon: Sunset, color: 'text-orange-500' },
    { id: 'cool', label: 'Cool', icon: Snowflake, color: 'text-cyan-500' },
    { id: 'neon', label: 'Neon', icon: Zap, color: 'text-purple-500' },
]

export function WidgetSmartLights() {
    const { state, dispatch } = useWorkspace()

    return (
        <motion.div 
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.02 }}
            className="absolute top-1/2 -translate-y-1/2 right-8 w-[72px] bg-white/30 backdrop-blur-xl border border-white/20 rounded-[36px] shadow-lg flex flex-col items-center py-4 gap-2"
        >
            <div className="w-8 h-1 rounded-full bg-black/10 mb-2" /> {/* Handle */}
            
            {LIGHT_MODES.map((mode) => {
                const isActive = state.lighting === mode.id
                const Icon = mode.icon
                
                return (
                    <div key={mode.id} className="relative group">
                         <button
                            onClick={() => dispatch({ type: 'SET_LIGHTING', payload: mode.id })}
                            className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                                isActive 
                                    ? "bg-white shadow-md scale-110" 
                                    : "bg-transparent hover:bg-white/20"
                            )}
                        >
                            <Icon className={cn("w-5 h-5 transition-colors", isActive ? mode.color : "text-gray-500")} />
                        </button>
                        
                        {/* Tooltip on left */}
                        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none backdrop-blur-sm">
                            {mode.label}
                        </div>
                    </div>
                )
            })}
        </motion.div>
    )
}
