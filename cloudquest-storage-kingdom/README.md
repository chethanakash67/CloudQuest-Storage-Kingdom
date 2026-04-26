# ☁️ CloudQuest: Storage Kingdom

An educational 2D mission-based game where students learn Cloud Storage concepts by playing interactive levels. Become a **Cloud Guardian** and protect the digital kingdom!

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4) ![Prisma](https://img.shields.io/badge/Prisma-7-2D3748)

## 🎮 Game Overview

The **Storage Kingdom** is divided into 3 lands with 6 unique game levels:

### 🏝️ Bucket Island
- **Level 1: Bucket Sorting** — Sort falling files into correct storage buckets
- **Level 2: Object Key Maze** — Navigate a maze using correct object key paths

### 🏔️ Class Cave
- **Level 3: Storage Class Shop** — Assign storage classes to customer data
- **Level 4: Cost vs Speed Battle** — Optimize storage cost with a limited budget

### 🏰 Access Castle
- **Level 5: Permission Defense** — Allow or block characters based on roles
- **Level 6: Fix the Leaky Bucket** — Toggle security settings to stop data leaks

## ⚡ Game Mechanics

- 🫀 3 Hearts (lose on wrong actions)
- ⚡ +10 XP per correct action
- 🪙 +5 Coins per correct action
- 🏆 +100 XP per level completion
- ⬆️ Level up every 250 XP
- 🏅 7 Badges to unlock
- ⏱️ Timer challenges on every level

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion |
| State | Zustand (persisted) |
| Database | PostgreSQL + Prisma 7 |
| Icons | Lucide React |

## 📁 Project Structure

```
cloudquest-storage-kingdom/
├── prisma/
│   ├── schema.prisma          # Database models
│   └── seed.ts                # Seed data (levels, badges)
├── src/
│   ├── app/
│   │   ├── api/               # Backend API routes
│   │   │   ├── user/           # User CRUD + progress + stats
│   │   │   ├── leaderboard/    # Top players
│   │   │   ├── badges/         # Badge management
│   │   │   └── game-event/     # Event logging
│   │   ├── character-select/   # Avatar & name selection
│   │   ├── map/                # Game world map
│   │   ├── level/[id]/         # Dynamic level router
│   │   ├── rewards/            # Badges page
│   │   ├── leaderboard/        # Rankings
│   │   ├── profile/            # Player stats & progress
│   │   ├── page.tsx            # Landing page
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles & animations
│   ├── components/
│   │   ├── games/              # 6 game level components
│   │   └── ui/                 # Shared UI (Hearts, XPBar, etc.)
│   ├── store/
│   │   └── gameStore.ts        # Zustand game state
│   └── lib/
│       ├── prisma.ts           # Prisma client singleton
│       ├── gameConfig.ts       # Game constants & level data
│       └── sounds.ts           # Web Audio API sound effects
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL running locally
- npm

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure database
# Edit .env with your PostgreSQL credentials:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cloudquest"

# 3. Create the database
createdb cloudquest

# 4. Run migrations
npx prisma migrate dev --name init

# 5. Seed the database
npx prisma db seed

# 6. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play!

### Without Database (Frontend Only)

The game works fully with **Zustand local storage** persistence even without PostgreSQL. The API routes are available for full-stack mode, but the game is playable immediately without database setup.

```bash
npm install
npm run dev
```

## 🎯 Game Flow

1. **Landing Page** → Animated intro with game features
2. **Character Select** → Choose avatar & enter name
3. **Game Map** → Navigate 3 lands with 6 level nodes
4. **Play Levels** → Complete interactive missions
5. **Earn Rewards** → XP, coins, badges, stars
6. **Leaderboard** → Compare with other players
7. **Profile** → Track your progress

## 🏅 Badges

| Badge | Unlock Condition |
|-------|-----------------|
| 🪣 Bucket Builder | Complete Level 1 |
| 🔑 Object Master | Complete Level 2 |
| 📦 Storage Strategist | Complete Level 3 |
| 💰 Cost Controller | Complete Level 4 |
| 🛡️ Access Defender | Complete Level 5 |
| 🔧 Leak Fixer | Complete Level 6 |
| ☁️ Cloud Guardian | Complete All Levels |

## 📖 Learning Outcomes

Through gameplay, students learn:
- **Buckets & Objects** — Containers and file storage
- **Object Keys** — Unique paths to identify stored data
- **Storage Classes** — Standard, IA, Archive, Deep Archive
- **Cost Optimization** — Balancing cost vs access speed
- **Access Control** — IAM roles, bucket policies, permissions
- **Security** — Public access, anonymous writes, private objects

## 🔊 Sound Effects

The game uses the Web Audio API to generate synthetic sound effects:
- ✅ Correct answer chime
- ❌ Wrong answer buzz
- 🎉 Level complete fanfare
- 💔 Game over sound
- 🪙 Coin collect sparkle
- 🏅 Badge unlock celebration

---

Built with ❤️ for cloud storage education
