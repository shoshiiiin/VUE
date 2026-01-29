"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Layers, Lock } from "lucide-react"
import { useWorkspace } from "./workspace-context"
import { cn } from "@/lib/utils"

const PACKS = [
    { id: 'pack_studio', label: 'Studio Minimal', icon: 'M' },
    { id: 'pack_lifestyle', label: 'Urban Lifestyle', icon: 'U' },
    { id: 'pack_creative', label: 'Creative Pop', icon: 'C' },
    { id: 'pack_social', label: 'Social Feed', icon: 'S' },
]

export function WidgetShotPack() {
    const { state, dispatch } = useWorkspace()

    return (
        <motion.div 
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.02 }}
            className="absolute top-24 left-[500px] w-[360px] bg-white/60 backdrop-blur-md border border-white/40 rounded-[28px] shadow-lg p-5 flex flex-col gap-4"
        >
            <div className="flex items-center justify-between px-1">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Shot Pack
                </span>
                <button className="p-1.5 hover:bg-black/5 rounded-full">
                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                {PACKS.map(pack => {
                    const isActive = state.activePackId === pack.id
                    return (
                        <button
                            key={pack.id}
                            onClick={() => dispatch({ type: 'SET_PACK', payload: pack.id })}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border",
                                isActive 
                                    ? "bg-white border-indigo-200 text-indigo-600 shadow-md shadow-indigo-100 scale-105" 
                                    : "bg-white/40 border-transparent text-gray-600 hover:bg-white/70 hover:scale-105"
                            )}
                        >
                            <span className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                                isActive ? "bg-indigo-100 text-indigo-600" : "bg-black/5 text-gray-500"
                            )}>
                                {pack.icon}
                            </span>
                            {pack.label}
                        </button>
                    )
                })}
            </div>
        </motion.div>
    )
}
