"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useStore } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"

export function Fab() {
    const setCommandBarOpen = useStore((state) => state.setCommandBarOpen)

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-8 right-8 z-40"
        >
            <Button
                size="icon"
                className="h-14 w-14 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-shadow duration-300 bg-primary text-primary-foreground"
                onClick={() => setCommandBarOpen(true)}
            >
                <Plus className="h-6 w-6" />
            </Button>
        </motion.div>
    )
}
