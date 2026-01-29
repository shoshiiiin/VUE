"use client"

import * as React from "react"
import { Upload, X, Files } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  label: string
  onChange: (files: File[]) => void
  value: File[]
  className?: string
  acceptMultiple?: boolean
}

export function FileUpload({ label, onChange, value, className, acceptMultiple = false }: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  
  // Create preview URLs
  const [previews, setPreviews] = React.useState<string[]>([])

  React.useEffect(() => {
    const urls = value.map(f => URL.createObjectURL(f))
    setPreviews(urls)
    
    return () => {
        urls.forEach(u => URL.revokeObjectURL(u))
    }
  }, [value])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        if (acceptMultiple) {
            const newFiles = Array.from(e.dataTransfer.files)
            onChange([...value, ...newFiles])
        } else {
            onChange([e.dataTransfer.files[0]])
        }
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const removeFile = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    const newValue = [...value]
    newValue.splice(index, 1)
    onChange(newValue)
    if (value.length === 1 && fileInputRef.current) {
        fileInputRef.current.value = ""
    }
  }

  return (
    <div className={cn("w-full group cursor-pointer", className)} onClick={handleClick}>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple={acceptMultiple}
        onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
                if (acceptMultiple) {
                    onChange([...value, ...Array.from(e.target.files)])
                } else {
                    onChange([e.target.files[0]])
                }
            }
        }}
      />
      <motion.div
        animate={{
          borderColor: isDragging ? "var(--accent-400)" : "var(--border)",
          backgroundColor: isDragging ? "rgba(210, 197, 216, 0.15)" : "transparent",
        }}
        className={cn(
          "relative border-2 border-dashed rounded-[var(--r-card)] p-6 transition-colors flex flex-col items-center justify-center text-center overflow-hidden",
          "bg-[var(--surface-2)] backdrop-blur-sm",
          value.length > 0 ? "h-auto min-h-[16rem]" : "h-64",
          {
            "border-accent-400 bg-accent-300/10": isDragging,
            "border-[var(--border)]": !isDragging && value.length === 0,
            "border-solid border-[var(--border)] bg-transparent": value.length > 0 && !isDragging
          }
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <AnimatePresence>
          {value.length > 0 ? (
            <div className={cn(
                "grid w-full gap-4 transition-all duration-300", 
                // Dynamic columns based on count to keep images large and "clean"
                value.length + (acceptMultiple ? 1 : 0) <= 2 ? "grid-cols-2" : 
                value.length + (acceptMultiple ? 1 : 0) <= 4 ? "grid-cols-2 sm:grid-cols-3" : 
                "grid-cols-3 sm:grid-cols-4 md:grid-cols-5"
            )}>
             {previews.map((url, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={cn(
                    "relative overflow-hidden rounded-[var(--radius-chip)] border border-[var(--border)] group/item shadow-sm aspect-square"
                  )}
                  onClick={(e) => e.stopPropagation()} 
                >
                  <img
                    src={url}
                    alt={`Preview ${idx}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                     {value.length === 1 && <p className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">Click to change</p>}
                  </div>

                  <button
                    onClick={(e) => removeFile(e, idx)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white hover:bg-red-500 flex items-center justify-center transition-colors z-10"
                  >
                    <X size={12} />
                  </button>
                </motion.div>
             ))}
                 {acceptMultiple && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className={cn(
                          "flex flex-col items-center justify-center rounded-[var(--radius-chip)] border-2 border-dashed border-[var(--border)] hover:border-accent-400 hover:bg-accent-400/5 transition-all cursor-pointer group/add aspect-square",
                        )}
                        onClick={handleClick}
                    >
                         <div className="w-10 h-10 rounded-full bg-[var(--surface-3)] group-hover/add:bg-accent-400 group-hover/add:text-white flex items-center justify-center transition-colors mb-2 shadow-sm">
                            <Files className="w-5 h-5 text-[var(--text-muted)] group-hover/add:text-white transition-colors" />
                         </div>
                         <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] group-hover/add:text-accent-500">Add More</span>
                    </motion.div>
                 )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="p-4 rounded-full bg-[var(--surface-0)] border border-[var(--border)] mb-2 group-hover:scale-110 transition-transform duration-300 shadow-[var(--shadow-elev-1)]">
                <Upload className="w-8 h-8 text-[var(--text-muted)] group-hover:text-accent-500 transition-colors" />
              </div>
              <p className="font-medium text-[var(--text-strong)]">{label}</p>
              <p className="text-sm text-[var(--text-muted)]">
                Drag & drop or click to upload {acceptMultiple && "(Multiple)"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
