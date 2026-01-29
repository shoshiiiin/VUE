"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Shield, ShieldCheck, Lock, Unlock } from "lucide-react"
import { useWorkspace } from "./workspace-context"
import { useBrand } from "@/lib/brand-context"
import { cn } from "@/lib/utils"

export function WidgetBrandLock() {
    const { state, dispatch } = useWorkspace()
    const { companyName } = useBrand()
    const isLocked = state.brandGuard

    return (
        <motion.div 
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.02 }}
            className={cn(
                "absolute bottom-24 left-24 w-[280px] h-[72px] rounded-[24px] flex items-center p-2 pr-4 gap-3 transition-all duration-300 border",
                isLocked 
                    ? "bg-white/90 backdrop-blur-xl border-emerald-100 shadow-[0_8px_30px_rgba(16,185,129,0.15)]" 
                    : "bg-white/40 backdrop-blur-md border-white/30 shadow-lg"
            )}
        >
            <button
                onClick={() => dispatch({ type: 'TOGGLE_BRAND_GUARD' })}
                className={cn(
                    "w-14 h-14 rounded-[20px] flex items-center justify-center transition-all bg-white shadow-sm",
                    isLocked ? "text-emerald-500" : "text-gray-400"
                )}
            >
                {isLocked ? <ShieldCheck className="w-7 h-7" /> : <Shield className="w-7 h-7" />}
            </button>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-1">
                    Brand Identity
                    {isLocked ? <Lock className="w-3 h-3 text-emerald-500" /> : <Unlock className="w-3 h-3 text-gray-400" />}
                </span>
                <span className={cn(
                    "font-semibold text-lg truncate leading-tight transition-colors",
                    isLocked ? "text-gray-800" : "text-gray-500"
                )}>
                    {companyName || "No Brand"}
                </span>
            </div>
        </motion.div>
    )
}
