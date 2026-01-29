"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Sparkles, UploadCloud, X, Image as ImageIcon, ArrowRight } from "lucide-react"
import { useWorkspace } from "./workspace-context"
import { cn } from "@/lib/utils"
// Re-use our FileUpload UI but simplified
import { Button } from "@/components/ui/button"

export function WidgetQuickShot() {
    const { state, dispatch, generatePack } = useWorkspace()
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            dispatch({ type: 'UPLOAD_FILES', payload: Array.from(e.target.files) })
        }
    }

    const handleGenerate = () => {
        generatePack();
    }

    return (
        <motion.div 
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
            className="absolute top-24 left-24 w-[400px] bg-white/70 backdrop-blur-xl border border-white/50 rounded-[32px] shadow-xl p-6 flex flex-col gap-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center shadow-inner">
                        <UploadCloud className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">Quick Shot</h3>
                        <p className="text-xs text-gray-500">Upload product</p>
                    </div>
                </div>
                {state.files.length > 0 && (
                    <button onClick={() => dispatch({ type: 'RESET' })} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        <X className="w-4 h-4 text-gray-400" />
                    </button>
                )}
            </div>

            {/* Content State */}
            {state.files.length === 0 ? (
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                    onDrop={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            dispatch({ type: 'UPLOAD_FILES', payload: Array.from(e.dataTransfer.files) })
                        }
                    }}
                    className="h-48 border-2 border-dashed border-indigo-200 rounded-2xl bg-indigo-50/30 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-indigo-50/60 transition-colors group"
                >
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        <PlusIcon className="w-6 h-6 text-indigo-400" />
                    </div>
                    <p className="text-sm font-medium text-indigo-400">Drop images here or click</p>
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileChange}
                    />
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Thumbnails */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {state.files.map((file, i) => (
                            <div key={i} className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border border-white/50 shadow-sm group">
                                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                                <button 
                                    onClick={() => dispatch({ type: 'REMOVE_FILE', payload: file.name })}
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-6 h-6 text-white" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Action */}
                    <Button 
                        onClick={handleGenerate}
                        className="w-full h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-indigo-200 font-semibold text-base transition-all active:scale-95"
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Shots
                    </Button>
                </div>
            )}
        </motion.div>
    )
}

function PlusIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
    )
}
