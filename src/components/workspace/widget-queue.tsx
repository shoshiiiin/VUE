"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Activity, Loader2, CheckCircle2 } from "lucide-react"
import { useWorkspace } from "./workspace-context"

export function WidgetQueue() {
    const { state } = useWorkspace()

    if (state.status === 'idle' && state.queue.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[400px] h-16 bg-black/80 backdrop-blur-xl text-white rounded-full flex items-center px-2 shadow-2xl z-20"
            >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4">
                    {state.status === 'generating' ? (
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                    ) : (
                        <Activity className="w-6 h-6 text-emerald-400" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-white/60">
                            {state.status === 'generating' ? 'Processing...' : 'Queue Done'}
                        </span>
                        <span className="text-xs font-mono text-white/40">
                            {state.generatedCount} / {state.queue.length || 3}
                        </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                            initial={{ width: "0%" }}
                            animate={{ 
                                width: state.status === 'generating' ? '60%' : '100%' 
                            }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                {state.status === 'done' && (
                     <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }}
                        className="ml-4 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black"
                    >
                         <CheckCircle2 className="w-5 h-5" />
                     </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    )
}
