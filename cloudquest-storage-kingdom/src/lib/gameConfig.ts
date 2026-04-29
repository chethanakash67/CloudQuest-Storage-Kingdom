export const GAME_CONFIG = {
  // XP & Leveling
  XP_PER_CORRECT: 10,
  XP_PER_LEVEL_COMPLETE: 100,
  XP_TO_LEVEL_UP: 250,

  // Coins
  COINS_PER_CORRECT: 5,
  COINS_PER_LEVEL_COMPLETE: 50,

  // Health
  MAX_HEARTS: 3,
  HEARTS_LOST_PER_WRONG: 1,

  // Timer defaults (seconds)
  BUCKET_SORT_TIME: 60,
  MAZE_TIME: 120,
  STORAGE_CLASS_TIME: 90,
  COST_SPEED_TIME: 120,
  PERMISSION_DEFENSE_TIME: 90,
  LEAKY_BUCKET_TIME: 60,

  // Scoring
  STAR_THRESHOLDS: {
    ONE: 50,
    TWO: 75,
    THREE: 90,
  },

  // Level completion requirements
  BUCKET_SORT_REQUIRED: 10,
  MAZE_DOORS_REQUIRED: 5,
  STORAGE_CLASS_CUSTOMERS: 8,
  COST_SPEED_CARDS: 6,
  PERMISSION_WAVES: 8,
  LEAKY_BUCKET_FIXES: 4,
} as const;

export const WORLDS = {
  BUCKET_ISLAND: 'GCS Bucket Island',
  CLASS_CAVE: 'GCP Storage Class Cave',
  ACCESS_CASTLE: 'GCP IAM Access Castle',
} as const;

export const BADGES = [
  { name: 'Bucket Builder', description: 'Complete the GCS bucket sorting game', icon: '🪣', unlockCondition: 'complete_level_1' },
  { name: 'Object Name Master', description: 'Navigate the GCS Object Name Maze', icon: '🔑', unlockCondition: 'complete_level_2' },
  { name: 'Storage Strategist', description: 'Master GCP storage class selection', icon: '📦', unlockCondition: 'complete_level_3' },
  { name: 'Cost Controller', description: 'Optimize GCS cost and access patterns', icon: '💰', unlockCondition: 'complete_level_4' },
  { name: 'IAM Defender', description: 'Defend GCS access with IAM decisions', icon: '🛡️', unlockCondition: 'complete_level_5' },
  { name: 'Leak Fixer', description: 'Fix the leaky GCS bucket', icon: '🔧', unlockCondition: 'complete_level_6' },
  { name: 'GCP Storage Guardian', description: 'Complete all GCP storage levels', icon: '☁️', unlockCondition: 'complete_all_levels' },
] as const;

export const LEVELS = [
  {
    title: 'GCS Bucket Sorting',
    description: 'Sort falling files into the correct Google Cloud Storage buckets before time runs out!',
    world: WORLDS.BUCKET_ISLAND,
    order: 1,
    xpReward: 100,
    coinReward: 50,
    unlockedByDefault: true,
  },
  {
    title: 'Object Name Maze',
    description: 'Navigate a maze by choosing correct GCS object names to unlock doors.',
    world: WORLDS.BUCKET_ISLAND,
    order: 2,
    xpReward: 150,
    coinReward: 75,
    unlockedByDefault: false,
  },
  {
    title: 'Storage Class Shop',
    description: 'Run a storage shop and assign the right GCP Cloud Storage class to each customer.',
    world: WORLDS.CLASS_CAVE,
    order: 3,
    xpReward: 150,
    coinReward: 75,
    unlockedByDefault: false,
  },
  {
    title: 'Cost vs Access Battle',
    description: 'Balance GCS storage cost, access frequency, and minimum storage duration.',
    world: WORLDS.CLASS_CAVE,
    order: 4,
    xpReward: 200,
    coinReward: 100,
    unlockedByDefault: false,
  },
  {
    title: 'GCP IAM Permission Defense',
    description: 'Guard GCS buckets by allowing or blocking IAM access requests.',
    world: WORLDS.ACCESS_CASTLE,
    order: 5,
    xpReward: 200,
    coinReward: 100,
    unlockedByDefault: false,
  },
  {
    title: 'Fix the Leaky GCS Bucket',
    description: 'Repair GCP bucket security settings to stop data from leaking.',
    world: WORLDS.ACCESS_CASTLE,
    order: 6,
    xpReward: 250,
    coinReward: 125,
    unlockedByDefault: false,
  },
] as const;

export const AVATARS = [
  { id: 'guardian', name: 'GCP Guardian', emoji: '🛡️', color: '#6366f1' },
  { id: 'wizard', name: 'Data Wizard', emoji: '🧙', color: '#8b5cf6' },
  { id: 'knight', name: 'Byte Knight', emoji: '⚔️', color: '#3b82f6' },
  { id: 'ranger', name: 'Cloud Ranger', emoji: '🏹', color: '#10b981' },
] as const;
