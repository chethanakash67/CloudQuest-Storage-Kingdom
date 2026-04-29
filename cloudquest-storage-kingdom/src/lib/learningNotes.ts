export interface LearningNote {
  levelOrder: number;
  title: string;
  category: 'Buckets & Objects' | 'Storage Classes' | 'Access Control';
  icon: string;
  summary: string;
  gameConnection: {
    gameName: string;
    gameEmoji: string;
    howItTeaches: string;
    whatYouPracticed: string[];
  };
  keyConcepts: {
    term: string;
    definition: string;
    emoji: string;
  }[];
  realWorldExample: string;
  proTip: string;
}

export const LEARNING_NOTES: LearningNote[] = [
  {
    levelOrder: 1,
    title: 'Understanding Buckets & Object Organization',
    category: 'Buckets & Objects',
    icon: '🪣',
    summary:
      'In Google Cloud Storage (GCS), a bucket is a top-level container for objects — the files you store in GCP. Organizing objects into logically named buckets keeps your GCP environment clean, searchable, and cost-efficient.',
    gameConnection: {
      gameName: 'GCS Bucket Island: Sorting Game',
      gameEmoji: '🏝️',
      howItTeaches: 'In this game, files fall from the sky and you must sort them into the correct GCS buckets (Images, Videos, Documents, Backups, Logs). This directly simulates how GCP engineers organize objects into logically separated Cloud Storage buckets. Each file has metadata (content-type, size) shown on hover — just like objects in GCS carry metadata. The time pressure mirrors real-world scenarios where miscategorized objects cause downstream problems in pipelines and billing.',
      whatYouPracticed: [
        'Identifying file types and matching them to appropriate bucket categories',
        'Reading object metadata (file name, type, size) to make sorting decisions',
        'Understanding that GCS buckets are logical containers for grouping related objects',
        'Working under time pressure — like managing live data ingestion into Cloud Storage',
      ],
    },
    keyConcepts: [
      {
        term: 'Bucket',
        definition:
          'A uniquely named Google Cloud Storage container that holds objects. Bucket names are globally unique across GCS.',
        emoji: '🪣',
      },
      {
        term: 'Object',
        definition:
          'Any file stored inside a GCS bucket — images, videos, documents, backups, logs, etc. Each object has a name, metadata, and a body (the data).',
        emoji: '📦',
      },
      {
        term: 'Metadata',
        definition:
          'Key-value pairs attached to an object describing properties like content-type, encoding, custom tags, and creation date.',
        emoji: '🏷️',
      },
      {
        term: 'Bucket-Level IAM Policy',
        definition:
          'A GCP IAM policy on a bucket that defines which principals can read, create, delete, or manage the bucket and its objects.',
        emoji: '📋',
      },
    ],
    realWorldExample:
      'A university on GCP might have buckets like "student-uploads", "course-videos", and "backup-archives" — each holding different objects with different IAM access rules.',
    proTip:
      'Use a consistent GCS naming convention for buckets (e.g., project-env-purpose like "myapp-prod-assets") to avoid confusion as your GCP projects grow.',
  },
  {
    levelOrder: 2,
    title: 'GCS Object Names & Prefix Structure',
    category: 'Buckets & Objects',
    icon: '🔑',
    summary:
      'A GCS object name is the unique identifier of an object within a bucket. Object names often use forward-slash (/) prefixes that mimic a folder hierarchy, but Cloud Storage is flat — there are no real folders, only object name prefixes.',
    gameConnection: {
      gameName: 'GCS Object Name Maze',
      gameEmoji: '🔑',
      howItTeaches: 'The maze doors are locked, and you unlock them by choosing the correct GCS object name. For example, finding "students/101/profile.jpg" instead of incorrect names like "photos/student101.jpg". This teaches you the critical skill of constructing hierarchical object names with proper prefixes and delimiters. Wrong object names don\'t open the door — just like wrong object names in GCS API calls return not-found errors.',
      whatYouPracticed: [
        'Constructing proper hierarchical GCS object names using / delimiters',
        'Choosing the right prefix structure (e.g., courses/CS201/assignments/3/)',
        'Distinguishing well-structured object names from poorly named flat objects',
        'Navigating a logical GCS hierarchy — simulating folder-like prefix browsing',
      ],
    },
    keyConcepts: [
      {
        term: 'Object Name',
        definition:
          'The full path-like name of an object inside a GCS bucket. Example: "students/101/profile.jpg". The name uniquely identifies the object.',
        emoji: '🔑',
      },
      {
        term: 'Prefix',
        definition:
          'A common beginning of an object name used to simulate folders. Listing objects with prefix "students/101/" acts like opening that folder.',
        emoji: '📂',
      },
      {
        term: 'Delimiter',
        definition:
          'The character (usually "/") used to separate logical directory levels in a GCS object name. Helps list results appear grouped like folders.',
        emoji: '➗',
      },
      {
        term: 'Naming Best Practices',
        definition:
          'Use lowercase, hyphens, and a hierarchical structure. Avoid special characters. Good: "courses/cs201/assignments/3/submission.pdf". Bad: "CS201 hw3(final).pdf".',
        emoji: '✅',
      },
    ],
    realWorldExample:
      'A video platform on GCP can organize Cloud Storage objects with names like "content/movies/action/movie-id/1080p.mp4" — enabling efficient lookups by genre, resolution, and ID.',
    proTip:
      'Keep GCS object names descriptive but concise, use lowercase prefixes, and avoid unnecessary nesting so browser views and API calls stay easy to reason about.',
  },
  {
    levelOrder: 3,
    title: 'GCP Storage Classes: Cost vs Access Pattern',
    category: 'Storage Classes',
    icon: '📦',
    summary:
      'Google Cloud Storage classes let you choose storage based on access frequency and retention needs. GCP classes are Standard, Nearline, Coldline, and Archive. All provide low-latency access, but colder classes trade lower storage price for retrieval fees and minimum storage durations.',
    gameConnection: {
      gameName: 'Storage Class Shop',
      gameEmoji: '🏪',
      howItTeaches: 'You run a storage shop where customers describe their data and how often they access it. You must assign each customer the right GCP storage class (Standard, Nearline, Coldline, or Archive). Budget and satisfaction meters react to your choices — wrong picks waste money or create retrieval-fee surprises. This mirrors real GCP architecture decisions where picking wrong storage classes leads to inflated bills.',
      whatYouPracticed: [
        'Matching data access frequency to the correct storage tier',
        'Understanding the 4 GCP Cloud Storage classes and when to use each',
        'Reading customer requirements and translating them into technical decisions',
        'Balancing cost-efficiency (budget meter) with performance (satisfaction meter)',
      ],
    },
    keyConcepts: [
      {
        term: 'Standard',
        definition:
          'For frequently accessed data. Highest cost but instant retrieval. Use for live websites, APIs, and active user data.',
        emoji: '⚡',
      },
      {
        term: 'Nearline',
        definition:
          'Lower storage cost with retrieval fees and a 30-day minimum storage duration. Best for data accessed about once a month.',
        emoji: '📦',
      },
      {
        term: 'Coldline',
        definition:
          'Lower storage cost than Nearline with a 90-day minimum storage duration. Best for data accessed about once a quarter.',
        emoji: '🗄️',
      },
      {
        term: 'Archive',
        definition:
          'The lowest-cost GCP storage class with a 365-day minimum storage duration. Best for long-term retention and rarely accessed compliance data.',
        emoji: '🏔️',
      },
    ],
    realWorldExample:
      'A hospital on GCP stores active patient records in Standard, monthly reports in Nearline, quarterly audit data in Coldline, and decade-old compliance records in Archive.',
    proTip:
      'Enable Cloud Storage lifecycle rules to transition objects automatically. Example: move objects to Nearline after 30 days, Coldline after 90 days, and Archive after 365 days.',
  },
  {
    levelOrder: 4,
    title: 'Optimizing GCS Cost & Access Trade-offs',
    category: 'Storage Classes',
    icon: '⚖️',
    summary:
      'Choosing GCS storage classes is about understanding storage price, retrieval fees, minimum storage duration, and access patterns. Miscategorizing data wastes budget even when the objects are still immediately accessible.',
    gameConnection: {
      gameName: 'Cost vs Access Battle',
      gameEmoji: '⚔️',
      howItTeaches: 'You receive data cards showing datasets with different access frequencies and sizes. You assign each card to a GCP storage class, and the game tracks your total cost in credits. After assigning all cards, a review screen shows which were correct and which were wrong — teaching you that overspending on Standard for rarely accessed data is wasteful, while using Archive for hot data creates retrieval-fee and minimum-duration problems. The review phase simulates a real GCP cost audit.',
      whatYouPracticed: [
        'Analyzing access frequency descriptions (hourly, monthly, quarterly, yearly) to pick GCP classes',
        'Tracking cumulative storage costs as you assign classes to datasets',
        'Understanding that wrong assignments have compounding financial impact',
        'Performing a GCP cost review/audit — comparing actual vs optimal storage assignments',
      ],
    },
    keyConcepts: [
      {
        term: 'Retrieval Cost',
        definition:
          'Colder GCS classes have lower storage prices but retrieval fees. Frequent access on Archive can cost more than Standard. Always factor in access patterns.',
        emoji: '💸',
      },
      {
        term: 'Lifecycle Policy',
        definition:
          'A Cloud Storage lifecycle rule that transitions objects between classes or deletes them based on age, version count, or other conditions.',
        emoji: '🔄',
      },
      {
        term: 'Intelligent Tiering',
        definition:
          'GCP Cloud Storage offers Autoclass, which automatically moves objects between storage classes based on actual usage patterns. Great when you\'re unsure about access frequency.',
        emoji: '🧠',
      },
      {
        term: 'Minimum Storage Duration',
        definition:
          'Nearline, Coldline, and Archive have minimum storage durations of 30, 90, and 365 days. Deleting early can still incur charges.',
        emoji: '⏳',
      },
    ],
    realWorldExample:
      'A streaming platform on GCP keeps current season shows in Standard, older seasonal content in Coldline, and removed catalog assets in Archive to optimize a multi-petabyte bill.',
    proTip:
      'Use Cloud Monitoring, Cloud Storage inventory reports, and billing exports to analyze actual access patterns before setting lifecycle rules. Guessing costs you money.',
  },
  {
    levelOrder: 5,
    title: 'Access Control: GCP IAM & Bucket Permissions',
    category: 'Access Control',
    icon: '🛡️',
    summary:
      'Access control determines who can read, create, list, delete, or manage GCS objects. Google Cloud Storage uses IAM roles, bucket-level IAM policies, service accounts, and optional public access controls to enforce least privilege.',
    gameConnection: {
      gameName: 'GCP IAM Permission Defense',
      gameEmoji: '🏰',
      howItTeaches: 'You guard a castle gate where principals with different GCP identities (Teacher Role, Student Role, Storage Admin, Service Account, allUsers) request access to GCS resources. You must decide to ALLOW or BLOCK each request based on the IAM role, requested permission, and gs:// resource path. This directly simulates evaluating Cloud Storage IAM access — a daily task for GCP security engineers.',
      whatYouPracticed: [
        'Evaluating GCS access requests by matching principal + IAM role + permission + resource',
        'Applying the principle of least privilege (students can upload but not delete)',
        'Identifying public principals like allUsers/allAuthenticatedUsers and blocking them for private buckets',
        'Understanding how IAM grants and public access controls shape GCS access decisions',
      ],
    },
    keyConcepts: [
      {
        term: 'IAM Role',
        definition:
          'A named set of GCP permissions granted to users, groups, or service accounts. Roles like Storage Object Viewer, Storage Object Creator, and Storage Admin provide different access levels.',
        emoji: '👤',
      },
      {
        term: 'Bucket-Level IAM Policy',
        definition:
          'An IAM policy attached to a GCS bucket. It specifies which principals can perform Cloud Storage permissions on that bucket and its objects.',
        emoji: '📜',
      },
      {
        term: 'Least Privilege',
        definition:
          'The security principle of granting only the minimum permissions necessary. A student should upload to their own folder, but not delete assignments.',
        emoji: '🔐',
      },
      {
        term: 'ACL (Access Control List)',
        definition:
          'Legacy per-object permissions. Modern GCP best practice is to enable Uniform Bucket-Level Access and manage access with IAM.',
        emoji: '📃',
      },
    ],
    realWorldExample:
      'A company gives developers object creator access to the "staging" bucket but object viewer access to "production". Admins get Storage Admin. CI/CD pipelines use scoped service accounts.',
    proTip:
      'Always start with zero permissions and add access as needed. Avoid allUsers and allAuthenticatedUsers unless the bucket is intentionally public, such as a static website bucket.',
  },
  {
    levelOrder: 6,
    title: 'Securing Buckets: Preventing Data Leaks',
    category: 'Access Control',
    icon: '🔧',
    summary:
      'Misconfigured GCS bucket permissions are a common cause of data exposure. Public buckets, allUsers write grants, disabled uniform bucket-level access, and weak IAM hygiene can expose sensitive records. Securing a GCS bucket means preventing public access, using IAM, enabling audit logs, and reviewing permissions regularly.',
    gameConnection: {
      gameName: 'Fix the Leaky GCS Bucket',
      gameEmoji: '🔧',
      howItTeaches: 'A bucket is visually leaking data (animated water drops). You toggle GCP security settings ON/OFF — like "Public Access Prevention", "Uniform Bucket-Level Access", "allUsers Write Grant", and "Teacher Custom IAM Role". Each correct toggle reduces the leak. When all settings are correct, the bucket is sealed. This mirrors a real GCS security audit where you review and remediate IAM and public access misconfigurations.',
      whatYouPracticed: [
        'Auditing security settings and identifying which toggles prevent data leaks',
        'Understanding that multiple security layers must ALL be correct simultaneously',
        'Learning common GCS misconfigurations (public access, allUsers write, legacy ACLs)',
        'Performing a GCP security remediation — the same process used after real data exposure incidents',
      ],
    },
    keyConcepts: [
      {
        term: 'Public Access Prevention',
        definition:
          'A GCS setting that prevents public principals like allUsers and allAuthenticatedUsers from accessing a bucket. Use it for private buckets.',
        emoji: '🚫',
      },
      {
        term: 'Server-Side Encryption',
        definition:
          'Automatically encrypts objects at rest using Google-managed keys, Customer-Managed Encryption Keys (CMEK) via Cloud KMS, or Customer-Supplied Encryption Keys (CSEK). Enabled by default on all GCS buckets.',
        emoji: '🔒',
      },
      {
        term: 'Access Logging',
        definition:
          'Cloud Audit Logs record administrative and data access activity for Cloud Storage. They are essential for security audits and breach detection.',
        emoji: '📋',
      },
      {
        term: 'Versioning',
        definition:
          'Keeps noncurrent versions of objects. Helps recover from accidental deletes and overwrites when paired with lifecycle rules.',
        emoji: '📚',
      },
    ],
    realWorldExample:
      'Misconfigured GCS buckets can expose sensitive records. The fix: enable Uniform Bucket-Level Access, turn on Public Access Prevention, remove allUsers/allAuthenticatedUsers grants, and use IAM Recommender to audit permissions.',
    proTip:
      'Use GCP Organization Policies (like constraints/storage.uniformBucketLevelAccess) and Security Command Center to automatically flag and remediate any bucket that becomes publicly accessible.',
  },
];

// Map category to gradient colors for styling
export const CATEGORY_STYLES: Record<string, { gradient: string; border: string; text: string; bg: string; glow: string }> = {
  'Buckets & Objects': {
    gradient: 'from-cyan-500 to-blue-600',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    glow: 'shadow-cyan-500/20',
  },
  'Storage Classes': {
    gradient: 'from-emerald-500 to-green-600',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    glow: 'shadow-emerald-500/20',
  },
  'Access Control': {
    gradient: 'from-red-500 to-pink-600',
    border: 'border-red-500/30',
    text: 'text-red-400',
    bg: 'bg-red-500/10',
    glow: 'shadow-red-500/20',
  },
};
