"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"
import { Badge } from "@/lib/gamification"

export function AchievementUnlock() {
    const { newlyUnlockedBadges, clearNewlyUnlockedBadge } = useStore()
    const [currentBadge, setCurrentBadge] = useState<Badge | null>(null)

    useEffect(() => {
        if (newlyUnlockedBadges.length > 0 && !currentBadge) {
            setCurrentBadge(newlyUnlockedBadges[0])
        }
    }, [newlyUnlockedBadges, currentBadge])

    useEffect(() => {
        if (currentBadge) {
            // Trigger confetti
            const duration = 3 * 1000
            const animationEnd = Date.now() + duration
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now()

                if (timeLeft <= 0) {
                    return clearInterval(interval)
                }

                const particleCount = 50 * (timeLeft / duration)
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                    zIndex: 9999
                })
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                    zIndex: 9999
                })
            }, 250)
        }
    }, [currentBadge])

    const handleClose = () => {
        if (!currentBadge) return
        clearNewlyUnlockedBadge(currentBadge.id)
        setCurrentBadge(null)
    }

    return (
        <AnimatePresence>
            {currentBadge && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    {/* Card */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, y: 100 }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            y: 0,
                            transition: { type: "spring", stiffness: 300, damping: 25 }
                        }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-[#09090b] border border-white/10 shadow-2xl p-6 text-center"
                    >
                        {/* Glow effect */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[200px] bg-primary/20 blur-[100px] pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center gap-6">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="p-6 rounded-full bg-white/5 ring-1 ring-white/10 shadow-xl"
                            >
                                <currentBadge.icon className={`h-16 w-16 ${currentBadge.color}`} />
                            </motion.div>

                            <div className="space-y-2">
                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-2xl font-bold tracking-tight"
                                >
                                    Achievement Unlocked!
                                </motion.h2>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <h3 className="text-xl text-primary font-semibold">{currentBadge.name}</h3>
                                    <p className="text-muted-foreground mt-1">{currentBadge.description}</p>
                                </motion.div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="w-full"
                            >
                                <Button size="lg" className="w-full font-semibold rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" onClick={handleClose}>
                                    Awesome!
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
