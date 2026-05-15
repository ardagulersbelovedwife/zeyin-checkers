# Zeyin Checkers

Zeyin Checkers is a competitive, high-quality checkers web application built with a focus on professional, distraction-free gameplay. It features a strict ruleset (mandatory captures, king promotion), real-time multiplayer, and a built-in Minimax AI engine for challenging single-player matches.

## ✨ Features

- **Strict Checkers Ruleset**: Enforces mandatory captures, proper king promotions, and accurate move validation.
- **Minimax AI Engine**: Play locally against the computer with three selectable difficulty levels (Easy, Medium, Hard). Includes an "AI Coach Analysis" feature to evaluate board states.
- **Real-time Multiplayer**: Challenge friends or other players online with real-time game state synchronization powered by Supabase.
- **Player Authentication & History**: Persistent user accounts and match history tracking.
- **Professional Dark UI**: A sleek, dark-themed, responsive interface designed for focus, built using Tailwind CSS and shadcn/ui.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Realtime, Auth)
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- A [Supabase](https://supabase.com/) account for database and authentication

### Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd zeyin-checkers
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**:
   Run the SQL migrations located in `supabase/migrations/` in your Supabase SQL editor to initialize the necessary tables (e.g., `games`, `profiles`, `game_history`).

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `src/app`: Next.js App Router pages and API routes.
- `src/components`: Reusable UI components (shadcn/ui, game board, AI coach UI, etc.).
- `src/lib/game`: Core checkers logic, rules engine, and AI implementations.
- `supabase/migrations`: SQL scripts for setting up the Supabase database schema.

## 📝 License

This project is licensed under the MIT License.
