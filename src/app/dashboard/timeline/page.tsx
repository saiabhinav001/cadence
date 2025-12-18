import { TimelineView } from "@/components/timeline-view"

export default function TimelinePage() {
    return (
        <div className="space-y-8 p-6 lg:p-10 max-w-[1200px] mx-auto">
            <h1 className="h1-hero tracking-tight text-foreground/90">Timeline</h1>
            <TimelineView />
        </div>
    )
}
