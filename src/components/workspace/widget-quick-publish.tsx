"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Instagram, Share2, ShoppingBag } from "lucide-react"
import { toast } from "sonner"

export function WidgetQuickPublish() {
    const handleShare = (platform: string) => {
        toast.success(`Sent to ${platform}`, { description: "Optimizing asset for social..." })
    }

    return (
        <motion.div 
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.02 }}
            className="absolute bottom-24 right-[400px] flex items-center gap-2"
        >
             <button 
                 onClick={() => handleShare('Instagram')}
                 className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-xl border border-white/30 flex items-center justify-center hover:bg-white hover:text-pink-600 transition-all shadow-sm"
             >
                 <Instagram className="w-5 h-5" />
             </button>
             <button 
                 onClick={() => handleShare('Shopify')}
                 className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-xl border border-white/30 flex items-center justify-center hover:bg-white hover:text-green-600 transition-all shadow-sm"
             >
                 <ShoppingBag className="w-5 h-5" />
             </button>
             <button 
                 onClick={() => handleShare('Team')}
                 className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-xl border border-white/30 flex items-center justify-center hover:bg-white hover:text-blue-600 transition-all shadow-sm"
             >
                 <Share2 className="w-5 h-5" />
             </button>
        </motion.div>
    )
}
