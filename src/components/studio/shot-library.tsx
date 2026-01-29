import * as React from "react"
import { SHOT_TEMPLATES, processTemplatePrompt } from "@/lib/shot-templates"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"

// Define the shape of a template expected by the parent
export interface ExtendedTemplate {
    id: string; // can be number-based or string-based
    name: string;
    path: string;
    suffix: string;
    description: string;
    isCustom: boolean;
    isText?: boolean;
    ratio_options?: string[];
}

interface ShotLibraryProps {
    onSelectTemplate: (template: ExtendedTemplate) => void;
    selectedCount: number;
}

const CATEGORIES = ["All", "Studio", "Lifestyle", "Macro", "On-Face", "Creative"];

export function ShotLibrary({ onSelectTemplate, selectedCount }: ShotLibraryProps) {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [selectedCategory, setSelectedCategory] = React.useState("All")

    const filteredTemplates = SHOT_TEMPLATES.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.prompt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--text-muted)]">Active Templates</span>
            <div className="flex gap-2 items-center">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 flex items-center gap-1">
                            <Filter className="w-3 h-3" />
                            Browse Library
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px] sm:w-[540px] border-l border-white/20 bg-white/80 backdrop-blur-xl shadow-2xl p-0 flex flex-col gap-0 z-[100]">
                        <SheetHeader className="px-6 py-6 border-b border-white/20 bg-white/40 space-y-4">
                            <div>
                                <SheetTitle className="text-xl font-bold text-[var(--text-strong)] tracking-tight">Shot Library</SheetTitle>
                                <div className="text-sm text-[var(--text-muted)] mt-1.5 leading-relaxed">
                                    Select professional shot templates to add to your generation queue.
                                </div>
                            </div>

                            {/* Search & Filter Controls */}
                            <div className="space-y-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                    <Input 
                                        placeholder="Search templates..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 bg-white/50 border-[var(--border)] h-9 text-sm"
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`
                                                text-[10px] px-2.5 py-1 rounded-full border transition-all
                                                ${selectedCategory === cat 
                                                    ? "bg-[var(--text-strong)] text-white border-transparent" 
                                                    : "bg-transparent border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-muted)]"}
                                            `}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </SheetHeader>
                        <ScrollArea className="flex-1 px-6 py-6">
                            <div className="grid grid-cols-1 gap-4 pb-8">
                                {filteredTemplates.length === 0 ? (
                                    <div className="text-center py-12 text-[var(--text-muted)]">
                                        <p>No templates found for your search.</p>
                                    </div>
                                ) : (
                                    filteredTemplates.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                const newTemplate: ExtendedTemplate = {
                                                    name: item.title,
                                                    path: "https://placehold.co/600x400/png?text=" + encodeURIComponent(item.title), 
                                                    id: `lib_${item.id}_${Date.now()}`,
                                                    suffix: `_${item.id}`,
                                                    description: processTemplatePrompt(item), 
                                                    isCustom: false,
                                                    isText: true,
                                                    ratio_options: item.ratio_options
                                                };
                                                onSelectTemplate(newTemplate);
                                            }}
                                            className="flex flex-col items-start gap-3 p-5 rounded-2xl border border-white/60 bg-white/60 hover:bg-white hover:scale-[1.01] hover:shadow-[var(--shadow-elev-2)] hover:border-accent-200 transition-all duration-300 text-left group relative overflow-hidden"
                                        >
                                            {/* Decorative Gradient Blob */}
                                            <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent-100/50 rounded-full blur-2xl group-hover:bg-accent-200/50 transition-colors" />

                                            <div className="flex items-start justify-between w-full relative z-10">
                                                <div className="flex flex-col gap-1 pr-8">
                                                    <span className="font-bold text-[15px] text-[var(--text-strong)] group-hover:text-accent-600 transition-colors">
                                                        {item.title}
                                                    </span>
                                                    <span className="text-[10px] font-medium text-[var(--text-muted)] bg-[var(--surface-2)] px-1.5 py-0.5 rounded w-fit">
                                                        {item.category}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] bg-white/80 border border-white/50 px-2 py-1 rounded-sm shadow-sm backdrop-blur-sm">
                                                    {item.ratio_options[0]}
                                                </span>
                                            </div>
                                            
                                            <p className="text-sm text-[var(--text-muted)] leading-relaxed opacity-90 line-clamp-2">
                                                {item.prompt}
                                            </p>
                                            
                                            <div className="flex flex-wrap gap-2 mt-1 pt-3 border-t border-[var(--border)]/50 w-full relative z-10">
                                                {item.variables.map(v => (
                                                    <span key={v} className="text-[10px] font-medium font-mono text-accent-600 bg-accent-50 px-2 py-1 rounded-md border border-accent-100/50">
                                                        {v}
                                                    </span>
                                                ))}
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
                <span className="chip text-[10px] h-6 px-2 flex items-center">{selectedCount} Selected</span>
            </div>
        </div>
    )
}
