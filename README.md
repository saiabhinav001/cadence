# Cadence

**The High-Performance Engineering Log.**

Cadence is a developer-first journaling tool designed to track your engineering impact, maintain flow state, and generate data-driven performance reviews using AI. Built with a stunning glassmorphism UI and gamification elements to keep you consistent.

---

## Features

-   **Seamless Logging**: Capture micro-wins and daily progress without breaking flow.
-   **AI-Powered Insights**: Automatically generate summaries and performance review drafts from your entries.
-   **Visual Momentum**: GitHub-style activity heatmaps and bento grid visualizations of your "brag document".
-   **Gamified Growth**: Streak tracking and XP system to encourage daily habits.
-   **Secure & Private**: Enterprise-grade authentication and data protection.

## Tech Stack

Built with a focus on performance, type safety, and modern UX.

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Custom Design System
-   **Database & Auth**: [Supabase](https://supabase.com/)
-   **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)
-   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
-   **Animations**: CSS Transitions & Framer Motion concepts

## Getting Started

### Prerequisites

-   Node.js 18+
-   npm or pnpm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/saiabhinav001/cadence.git
    cd cadence
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    GEMINI_API_KEY=your_google_gemini_api_key
    ```

    > **Note**
    > You can get your Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey).

4.  **Run the development server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```text
src/
├── app/              # Next.js App Router pages and layouts
├── components/       # React components
│   ├── auth/         # Authentication related components
│   ├── features/     # Core feature components (Command Bar, Heatmap)
│   ├── layout/       # Layout components (Sidebar, Navbar)
│   └── ui/           # Reusable UI primitives
├── lib/              # Utilities, hooks, and store configurations
└── types/            # TypeScript type definitions
```

## Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'feat: Add some amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
