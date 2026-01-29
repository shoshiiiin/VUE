import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, UploadCloud, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export interface GridTemplate {
    id: string;
    name: string;
    suffix: string;
    path: string;
    isCustom: boolean;
}

interface ResultsGridProps {
    templates: GridTemplate[];
    results: Record<string, string>;
    loadingState: Record<string, boolean>;
    errorState?: Record<string, string | null>;
    productBaseName: string;
}

export function ResultsGrid({ templates, results, loadingState, errorState, productBaseName }: ResultsGridProps) {
    const hasResults = Object.keys(results).length > 0;

    const downloadAll = () => {
        templates.forEach(template => {
            if (results[template.id]) {
                const link = document.createElement('a');
                link.href = results[template.id];
                link.download = `${productBaseName}${template.suffix}.png`;
                link.click();
            }
        })
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                {templates.map(template => (
                    <Card key={template.id} className="glass-card flex flex-col h-[400px] overflow-hidden group">
                        <CardHeader className="py-4 border-b border-[var(--border)] bg-[var(--surface-0)] backdrop-blur-md z-10">
                            <CardTitle className="text-sm font-medium text-[var(--text-muted)] flex justify-between items-center">
                                <span className="truncate max-w-[120px]" title={template.name}>{template.name}</span>
                                {results[template.id] ? (
                                    <span className="badge badge--success text-[10px] h-5 px-2">Ready</span>
                                ) : errorState?.[template.id] ? (
                                    <span className="badge text-[10px] h-5 px-2 bg-red-100 text-red-600 border-red-200">Failed</span>
                                ) : (
                                    <span className="badge text-[10px] h-5 px-2">Pending</span>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 relative bg-[var(--surface-2)]/30 group-hover:bg-[var(--surface-1)]/50 transition-colors">
                            {results[template.id] ? (
                                <motion.img 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    src={results[template.id]}
                                    alt={`Generated ${template.name}`}
                                    className="w-full h-full object-contain p-4"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-[var(--text-muted)]/50">
                                    {loadingState[template.id] ? (
                                        <div className="w-full h-full p-4 flex flex-col items-center justify-center gap-4">
                                            <Skeleton className="w-full h-full flex-1 rounded-lg bg-accent-100/50" />
                                            <div className="flex items-center gap-2 w-full px-2">
                                                <Skeleton className="h-2 w-2/3 bg-accent-200/50" />
                                                <Skeleton className="h-2 w-1/3 bg-accent-200/30" />
                                            </div>
                                        </div>
                                    ) : errorState?.[template.id] ? (
                                        <div className="flex flex-col items-center gap-3 text-center p-4">
                                            <div className="p-3 rounded-full bg-red-50 text-red-500 mb-1">
                                                <AlertCircle className="w-6 h-6" />
                                            </div>
                                            <span className="text-sm font-medium text-red-600">Generation Failed</span>
                                            <p className="text-[10px] text-[var(--text-muted)] max-w-[150px] leading-tight">
                                                {errorState[template.id]}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-16 h-16 rounded-[var(--radius-chip)] border border-dashed border-[var(--border)] flex items-center justify-center bg-white/40 overflow-hidden">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img 
                                                    src={template.path} 
                                                    alt="Template Preview"
                                                    className="w-full h-full object-cover opacity-30 grayscale" 
                                                />
                                            </div>
                                            <span className="text-xs font-medium text-[var(--text-muted)]">
                                                {template.isCustom ? "Custom Reference" : "Waiting for input"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {results[template.id] && (
                                <div className="absolute bottom-4 right-4">
                                     <Button variant="ghost" size="icon" className="rounded-full shadow-lg bg-white/80 hover:bg-white" onClick={() => {
                                         const link = document.createElement('a');
                                         link.href = results[template.id];
                                         link.download = `${productBaseName}${template.suffix}.png`;
                                         link.click();
                                     }}>
                                         <Download className="w-4 h-4 text-[var(--text-strong)]" />
                                     </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
                </AnimatePresence>
            </div>
            
            {/* Bulk Actions */}
             {hasResults && (
                <div className="flex justify-end">
                     <Button variant="outline" onClick={downloadAll}>
                         <UploadCloud className="w-4 h-4 mr-2" />
                         Download All Assets
                     </Button>
                </div>
            )}
        </div>
    )
}
