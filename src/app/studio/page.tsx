"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Download, Image as ImageIcon, Loader2, UploadCloud, Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileUpload } from "@/components/ui/file-upload"
import { cn } from "@/lib/utils"
// Import Brand Context
import { useBrand } from "@/lib/brand-context"
import { SHOT_TEMPLATES, processTemplatePrompt } from "@/lib/shot-templates"
import { toast } from "sonner"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShotLibrary } from "@/components/studio/shot-library"
import { ActiveTemplatesList } from "@/components/studio/active-templates-list"
import { ResultsGrid } from "@/components/studio/results-grid"

export default function Home() {
  // apiKey removed

  const [modelId, setModelId] = React.useState("gemini-3-pro-image-preview")
  // Brand Context
  const { logoUrl, companyName } = useBrand()
  
  // Custom Templates State - Start Empty per user request
  const [templates, setTemplates] = React.useState<any[]>([])
  
  // Persist Templates
  React.useEffect(() => {
    const saved = localStorage.getItem("custom_templates")
    if (saved) {
        try {
            const parsed = JSON.parse(saved)
            // Merge saved custom templates with defaults (in case defaults change in code)
            // Or just append custom ones. Let's replace state if it exists, or merge.
            // Simple: saved state is the source of truth if it has data.
            setTemplates(parsed)
        } catch (e) {
            console.error("Failed to parse templates", e)
        }
    }
  }, [])

  const saveTemplates = (newTemplates: any[]) => {
      setTemplates(newTemplates)
      localStorage.setItem("custom_templates", JSON.stringify(newTemplates))
  }

  const [objectFiles, setObjectFiles] = React.useState<File[]>([])
  const [results, setResults] = React.useState<Record<string, string>>({}) 
  const [loadingState, setLoadingState] = React.useState<Record<string, boolean>>({}) 
  const [errorState, setErrorState] = React.useState<Record<string, string | null>>({})
  const [globalError, setGlobalError] = React.useState<string | null>(null)
  const [productBaseName, setProductBaseName] = React.useState<string>("product")

  // Extract base name
  React.useEffect(() => {
    if (objectFiles.length > 0) {
      const firstName = objectFiles[0].name;
      const withoutExt = firstName.replace(/\.[^/.]+$/, "");
      const baseName = withoutExt.replace(/_\d+$/, "");
      setProductBaseName(baseName || "product");
    }
  }, [objectFiles]);




  


  // Handle Custom Template Upload
  const handleAddTemplate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
        const base64 = reader.result as string;
        const newTemplate = {
            name: `Custom View ${templates.filter(t => t.isCustom).length + 1}`,
            path: base64, // Store base64 directly for custom templates
            id: `custom_${Date.now()}`,
            suffix: `_c${Date.now()}`,
            description: "Match the camera angle and lighting of this reference image strictly.",
            isCustom: true
        };
        saveTemplates([...templates, newTemplate]);
    }
    reader.readAsDataURL(file);
    // Reset input
    e.target.value = '';
  }

  const handleDeleteTemplate = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const templateName = templates.find(t => t.id === id)?.name;
      const newTemplates = templates.filter(t => t.id !== id);
      saveTemplates(newTemplates);
      toast.info("Template removed", { description: templateName });
  }

  // Handle Template Image Override (Hybrid Mode)
  const handleUpdateTemplateImage = async (templateId: string, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
          const base64 = reader.result as string;
          setTemplates(prev => prev.map(t => {
              if (t.id === templateId) {
                  return {
                      ...t,
                      path: base64,
                      isText: false, // Switch to image/hybrid mode
                      isCustom: true // Mark as custom now
                  }
              }
              return t;
          }));
      }
      reader.readAsDataURL(file);
      e.target.value = ''; // Reset input
  }

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
    })
  }
  
  const fetchTemplateAsBase64 = async (path: string): Promise<string> => {
      // If it's already base64 (custom template), return it
      if (path.startsWith("data:")) return path;

      const res = await fetch(path);
      const blob = await res.blob();
      return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
      });
  }

  const handleGenerateValues = async () => {
    // apiKey check removed

    if (objectFiles.length === 0) {
      setGlobalError("Please upload at least one product image.")
      toast.error("No Input Image", { description: "Please upload a product image first." })
      return
    }

    setGlobalError(null)
    setResults({})
    setErrorState({})
    
    // Initialize loading state
    const initialLoading: Record<string, boolean> = {};
    templates.forEach(t => initialLoading[t.id] = true);
    setLoadingState(initialLoading);

    // Promise wrapper for Toast
    const generationPromise = async () => {
        try {
            const objectBase64s = await Promise.all(objectFiles.map(toBase64))
      
            const generateForTemplate = async (template: typeof templates[0]) => {
                try {
                    // For text-only templates (isText=true), we don't fetch a base64 style image
                    let templateBase64 = null;
                    if (!(template as any).isText) {
                         templateBase64 = await fetchTemplateAsBase64(template.path);
                    }
                    
                    const response = await fetch("/api/generate", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        // apiKey removed from body

                        modelId,
                        styleImage: templateBase64, // Can be null
                        objectImages: objectBase64s,
                        angleDescription: template.description,
                        angleName: template.name,
                        textPrompt: (template as any).isText ? template.description : undefined,
                        aspectRatio: template.ratio_options?.[0] || "1:1"
                      }),
                    })
              
                    const data = await response.json()
              
                    if (!response.ok) throw new Error(data.error || data.message || "Failed");
                    
                    if (data.image) {
                      // Optimistically update UI with high-res original
                      const imgData = `data:${data.mimeType || 'image/jpeg'};base64,${data.image}`;
                      setResults(prev => ({ ...prev, [template.id]: imgData }));
                      
                      // Convert to WebP for storage (Background process)
                      import("@/lib/utils").then(({ convertToWebP }) => {
                          convertToWebP(imgData, 0.8).then(webpData => {
                             import("@/lib/storage").then(async ({ saveGeneration }) => {
                                await saveGeneration({
                                    id: crypto.randomUUID(),
                                    templateName: template.name,
                                    templateId: template.id,
                                    timestamp: Date.now(),
                                    imageUrl: webpData // Store optimized WebP
                                });
                             });
                          }).catch(err => console.error("WebP conversion failed, saving original", err));
                      });
                    }
                } catch (e: any) {
                    console.error(`Error generating ${template.name}`, e);
                    setErrorState(prev => ({ ...prev, [template.id]: e.message || "Unknown error" }))
                    // Don't re-throw here so other templates continue
                    throw e; 
                } finally {
                    setLoadingState(prev => ({...prev, [template.id]: false}));
                }
            };
            
            // Run all in parallel
            await Promise.all(templates.map(generateForTemplate));
            
        } catch (err: any) {
            setGlobalError(err.message)
            setLoadingState({})
            throw err; // Re-throw for toast.promise to catch
        }
    };

    toast.promise(generationPromise(), {
        loading: "Generating your assets...",
        success: "Generation complete!",
        error: "Some assets failed to generate."
    });
  }
  
  const isGenerating = Object.values(loadingState).some(Boolean);

  return (
    <main className="app-canvas p-6 lg:p-8 relative overflow-hidden selection:bg-accent-300/30 w-full">
        
      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        
        {/* Main Workspace */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4 space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-accent-300/10">
                        <ImageIcon className="w-4 h-4 text-accent-500" />
                    </div>
                    Input
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="space-y-2">
                    <ShotLibrary 
                        onSelectTemplate={(newTemplate: any) => {
                            if (templates.some(t => t.id === newTemplate.id)) {
                                toast.error("Template already added")
                                return
                            }
                            setTemplates([...templates, newTemplate])
                            toast.success(`Added "${newTemplate.name}"`, { description: "Template added to your queue." })
                        }}
                        selectedCount={templates.length}
                    />
                    <ActiveTemplatesList 
                        templates={templates}
                        onUpdateImage={handleUpdateTemplateImage}
                        onDelete={handleDeleteTemplate}
                        onAddCustom={handleAddTemplate}
                    />
                </div>

                <div className="h-px bg-[var(--border)]" />

                <FileUpload 
                    label="Product Images (Glasses)" 
                    value={objectFiles} 
                    onChange={setObjectFiles}
                    acceptMultiple={true}
                />
                
                <Button 
                    onClick={handleGenerateValues} 
                    disabled={isGenerating || objectFiles.length === 0}
                    className="w-full shadow-lg h-14 text-base relative overflow-hidden group btn-primary"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
                        {isGenerating ? "Generate Collection" : "Generate Collection"}
                    </span>
                </Button>
                
                {globalError && (
                    <div className="p-4 rounded-[var(--radius-tile)] bg-[var(--danger)]/10 border border-[var(--danger)]/20 text-[var(--danger)] text-sm flex items-start gap-2">
                        <div className="mt-1 w-2 h-2 rounded-full bg-[var(--danger)] flex-shrink-0" />
                        {globalError}
                    </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Collection Results */}
          <div className="lg:col-span-8">
            <ResultsGrid 
                templates={templates}
                results={results}
                loadingState={loadingState}
                errorState={errorState}
                productBaseName={productBaseName}
            />
          </div>

        </div>
      </div>
    </main>
  )
}
