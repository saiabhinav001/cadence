"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Sparkles } from "lucide-react"

interface ShineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    className?: string
    [key: string]: any // Allow extra props passed to motion.button
}

export const ShineButton = React.forwardRef<HTMLButtonElement, ShineButtonProps>(
    ({ children, className, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    "relative inline-flex h-10 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50",
                    className
                )}
                {...props}
            >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                    {children}
                </span>
            </motion.button>
        )
    }
)
ShineButton.displayName = "ShineButton"

// Another variant: 'Magic' Gradient Button
export const MagicButton = React.forwardRef<HTMLButtonElement, ShineButtonProps>(
    ({ children, className, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "relative inline-flex h-10 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-50 group",
                    className
                )}
                {...props}
            >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-4 py-1 text-sm font-medium text-white backdrop-blur-3xl gap-2 transition-colors group-hover:bg-slate-900">
                    <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
                    <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent font-bold">
                        {children}
                    </span>
                </span>
            </button>
        )
    }
)
MagicButton.displayName = "MagicButton"
