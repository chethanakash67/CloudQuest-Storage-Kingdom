import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GAME_CONFIG } from '@/lib/gameConfig';

export interface PlayerState {
  // Player identity
  userId: string | null;
  playerName: string;
  selectedAvatar: string;
  
  // Stats
  xp: number;
  level: number;
  coins: number;
  hearts: number;
  
  // Game session
  currentLevelId: string | null;
  currentScore: number;
  isPlaying: boolean;
  
  // Level unlocks (order numbers)
  unlockedLevels: number[];
  completedLevels: number[];
  levelStars: Record<number, number>;
  
  // Badges
  unlockedBadges: string[];
  
  // Notification
  notification: { type: 'badge' | 'levelUp' | 'coins' | 'xp'; message: string } | null;
}

export interface PlayerActions {
  // Identity
  setPlayer: (name: string, avatar: string, userId?: string) => void;
  
  // Stats
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  removeHeart: () => void;
  resetHearts: () => void;
  
  // Game flow
  startLevel: (levelId: string) => void;
  endLevel: () => void;
  addScore: (points: number) => void;
  
  // Progress
  completeLevel: (order: number, stars: number) => void;
  unlockLevel: (order: number) => void;
  unlockBadge: (badgeName: string) => void;
  
  // Notifications
  setNotification: (notification: PlayerState['notification']) => void;
  clearNotification: () => void;
  
  // Reset
  resetGame: () => void;
}

const initialState: PlayerState = {
  userId: null,
  playerName: '',
  selectedAvatar: 'guardian',
  xp: 0,
  level: 1,
  coins: 0,
  hearts: GAME_CONFIG.MAX_HEARTS,
  currentLevelId: null,
  currentScore: 0,
  isPlaying: false,
  unlockedLevels: [1],
  completedLevels: [],
  levelStars: {},
  unlockedBadges: [],
  notification: null,
};

export const useGameStore = create<PlayerState & PlayerActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setPlayer: (name, avatar, userId) =>
        set({ playerName: name, selectedAvatar: avatar, userId: userId || null }),

      addXP: (amount) => {
        const current = get();
        const newXP = current.xp + amount;
        const newLevel = Math.floor(newXP / GAME_CONFIG.XP_TO_LEVEL_UP) + 1;
        const didLevelUp = newLevel > current.level;
        
        set({
          xp: newXP,
          level: newLevel,
          ...(didLevelUp ? {
            notification: { type: 'levelUp', message: `Level Up! You're now level ${newLevel}!` }
          } : {}),
        });
      },

      addCoins: (amount) =>
        set((state) => ({ coins: state.coins + amount })),

      removeHeart: () =>
        set((state) => ({
          hearts: Math.max(0, state.hearts - GAME_CONFIG.HEARTS_LOST_PER_WRONG),
        })),

      resetHearts: () =>
        set({ hearts: GAME_CONFIG.MAX_HEARTS }),

      startLevel: (levelId) =>
        set({ currentLevelId: levelId, currentScore: 0, isPlaying: true }),

      endLevel: () =>
        set({ currentLevelId: null, currentScore: 0, isPlaying: false }),

      addScore: (points) =>
        set((state) => ({ currentScore: state.currentScore + points })),

      completeLevel: (order, stars) => {
        const current = get();
        const alreadyCompleted = current.completedLevels.includes(order);
        const currentStars = current.levelStars[order] || 0;
        
        set({
          completedLevels: alreadyCompleted
            ? current.completedLevels
            : [...current.completedLevels, order],
          levelStars: {
            ...current.levelStars,
            [order]: Math.max(currentStars, stars),
          },
          unlockedLevels: current.unlockedLevels.includes(order + 1)
            ? current.unlockedLevels
            : [...current.unlockedLevels, order + 1],
        });
      },

      unlockLevel: (order) =>
        set((state) => ({
          unlockedLevels: state.unlockedLevels.includes(order)
            ? state.unlockedLevels
            : [...state.unlockedLevels, order],
        })),

      unlockBadge: (badgeName) => {
        const current = get();
        if (!current.unlockedBadges.includes(badgeName)) {
          set({
            unlockedBadges: [...current.unlockedBadges, badgeName],
            notification: { type: 'badge', message: `Badge Unlocked: ${badgeName}!` },
          });
        }
      },

      setNotification: (notification) => set({ notification }),
      clearNotification: () => set({ notification: null }),

      resetGame: () => set(initialState),
    }),
    {
      name: 'cloudquest-game-storage',
    }
  )
);
