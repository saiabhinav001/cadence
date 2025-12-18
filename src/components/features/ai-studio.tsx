"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useStore } from "@/lib/store"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2, Copy } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { generatePerformanceReview } from "@/app/actions/ai"

export function AIStudio() {
    const { isAIStudioOpen, setAIStudioOpen, entries } = useStore()
    const [step, setStep] = React.useState<'select' | 'thinking' | 'result'>('select')
    const [timeframe, setTimeframe] = React.useState<'month' | 'quarter' | 'year'>('month')
    const [result, setResult] = React.useState("")
    const [thinkingText, setThinkingText] = React.useState("Initializing...")

    // Reset when closed
    React.useEffect(() => {
        if (!isAIStudioOpen) {
            setTimeout(() => {
                setStep('select')
                setResult("")
            }, 300)
        }
    }, [isAIStudioOpen])

    const generateReview = async () => {
        setStep('thinking')

        // Thinking Sequence
        const sequence = [
            { text: "Connecting to neural network...", delay: 0 },
            { text: "Analyzing your wins...", delay: 800 },
            { text: "Identifying key patterns...", delay: 1500 },
            { text: "Drafting impact statements...", delay: 2500 },
            { text: "Polishing the narrative...", delay: 3500 },
        ]

        let isGenerating = true
        const animateThinking = async () => {
            for (const item of sequence) {
                if (!isGenerating) break
                setThinkingText(item.text)
                await new Promise(r => setTimeout(r, 1000))
            }
        }
        animateThinking()

        try {
            const review = await generatePerformanceReview(entries, timeframe)
            setResult(review)
            isGenerating = false
            setStep('result')
        } catch (error: any) {
            isGenerating = false
            console.error(error)
            toast.error(error.message || "Failed to generate. Check GEMINI_API_KEY in .env.local")
            setStep('select')
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result)
        toast.success("Copied to clipboard")
    }

    return (
        <Dialog open={isAIStudioOpen} onOpenChange={setAIStudioOpen}>
            <DialogContent className="max-w-2xl bg-black/80 backdrop-blur-xl border-white/10 p-0 overflow-hidden shadow-2xl shadow-purple-500/20">
                <div className="relative min-h-[400px] flex flex-col">

                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <Sparkles className="h-5 w-5 text-purple-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI Review Studio</DialogTitle>
                                <p className="text-xs text-muted-foreground">Turn your wins into career growth</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 flex-1 flex flex-col items-center justify-center">
                        <AnimatePresence mode="wait">
                            {step === 'select' && (
                                <motion.div
                                    key="select"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="w-full space-y-8"
                                >
                                    <div className="text-center space-y-2">
                                        <h3 className="text-2xl font-bold tracking-tight">Choose your timeframe</h3>
                                        <p className="text-muted-foreground body-comfortable">What period should we analyze?</p>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        {(['month', 'quarter', 'year'] as const).map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setTimeframe(t)}
                                                className={cn(
                                                    "p-6 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all flex flex-col items-center gap-3 group saas-card",
                                                    timeframe === t && "border-purple-500/50 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                                                )}
                                            >
                                                <span className="capitalize font-medium text-lg">{t}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <Button
                                        variant="neon"
                                        size="lg"
                                        className="w-full text-base h-12"
                                        onClick={generateReview}
                                    >
                                        Generate Review
                                    </Button>
                                </motion.div>
                            )}

                            {step === 'thinking' && (
                                <motion.div
                                    key="thinking"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center gap-6"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-20 animate-pulse" />
                                        <Loader2 className="h-12 w-12 text-purple-400 animate-spin relative z-10" />
                                    </div>
                                    <p className="text-xl font-medium animate-pulse">{thinkingText}</p>
                                </motion.div>
                            )}

                            {step === 'result' && (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="w-full h-full flex flex-col gap-4"
                                >
                                    <div className="flex-1 bg-white/5 rounded-xl p-4 font-mono text-sm overflow-y-auto max-h-[300px] whitespace-pre-wrap border border-white/10">
                                        {result}
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setStep('select')}
                                        >
                                            Start Over
                                        </Button>
                                        <Button
                                            variant="neon"
                                            onClick={copyToClipboard}
                                            className="gap-2"
                                        >
                                            <Copy className="h-4 w-4" />
                                            Copy Markdown
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    )
}
