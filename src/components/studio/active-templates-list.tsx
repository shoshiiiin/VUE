import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, UploadCloud, Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ExtendedTemplate } from "@/components/studio/shot-library"

interface ActiveTemplatesListProps {
    templates: ExtendedTemplate[];
    onUpdateImage: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
    onDelete: (id: string, e: React.MouseEvent) => void;
    onAddCustom: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ActiveTemplatesList({ templates, onUpdateImage, onDelete, onAddCustom }: ActiveTemplatesListProps) {
    return (
        <div className="space-y-4">
            <AnimatePresence mode="popLayout">
                {templates.length === 0 && (
                    <motion.div 
                        key="empty-state"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-8 border border-dashed border-accent-200 rounded-2xl bg-white/30 text-center space-y-2"
                    >
                        <p className="text-sm font-medium text-[var(--text-strong)]">No templates active</p>
                        <p className="text-xs text-[var(--text-muted)]">Browse the library to add shots.</p>
                    </motion.div>
                )}
                {templates.map((template, index) => (
                    <motion.div
                        key={template.id}
                        layout
                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                        <Card className={cn(
                            "glass-card hover:bg-white/60 transition-colors group relative overflow-hidden border-l-4",
                            template.isCustom ? "border-l-indigo-400" : "border-l-accent-400"
                        )}>
                            <div className="flex items-start gap-4 p-3 relative z-10">
                                {/* Thumbnail */}
                                <div className="w-20 h-20 rounded-lg overflow-hidden border border-[var(--border)] bg-gray-100 flex-shrink-0 relative">
                                    <img src={template.path} className="w-full h-full object-cover" alt={template.name} />
                                </div>
                                
                                {/* Content */}
                                <div className="flex-1 min-w-0 pt-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className="font-semibold text-sm text-[var(--text-strong)] truncate pr-2">{template.name}</h3>
                                            <p className="text-[10px] text-[var(--text-muted)] line-clamp-2 mt-0.5 leading-tight">
                                                {template.description}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Footer Actions */}
                                    <div className="mt-3 flex items-center justify-between">
                                         <div className="flex items-center gap-2">
                                             <div className="relative group/btn">
                                                 <div className="w-7 h-7 rounded-sm bg-[var(--surface-2)] hover:bg-[var(--surface-3)] flex items-center justify-center cursor-pointer transition-colors border border-[var(--border)]">
                                                     <UploadCloud size={14} className="text-[var(--text-muted)]" />
                                                 </div>
                                                 <input 
                                                     type="file" 
                                                     accept="image/*"
                                                     className="absolute inset-0 opacity-0 cursor-pointer"
                                                     onChange={(e) => onUpdateImage(template.id, e)}
                                                     title="Upload Reference Image"
                                                 />
                                             </div>
                                         </div>
                                         
                                         <button 
                                             onClick={(e) => onDelete(template.id, e)}
                                             className="w-7 h-7 rounded-sm hover:bg-red-100 text-[var(--text-muted)] hover:text-red-500 flex items-center justify-center transition-colors"
                                             title="Remove"
                                         >
                                             <Trash2 size={14} />
                                         </button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
                
                {/* Add Template Button (Upload Custom) */}
                <motion.div
                    key="add-custom-btn"
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <Card className="relative h-12 rounded-[var(--radius-chip)] border border-dashed border-[var(--border)] flex items-center justify-center gap-2 hover:bg-accent-300/10 cursor-pointer transition-colors group">
                        <Plus className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-strong)]" />
                        <span className="text-xs font-medium text-[var(--text-muted)] group-hover:text-[var(--text-strong)]">Upload Custom Reference</span>
                        <input 
                            type="file" 
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={onAddCustom}
                        />
                    </Card>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
