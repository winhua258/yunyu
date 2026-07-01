export interface Profile {
  code: string;
  name: string;
  age: number;
  location: string;
  tagline: string;
  bio: string;
  lifestyle: string[];
  imageUrl: string;
  cardDetail: string;
  idealMatch: string;
  contactLineUrl: string;
  imageUrls?: string[];
  isAcceptingMatches?: boolean;
}

export interface PersonalityMetrics {
  Rationality: number;           // 理性
  Spontaneity: number;           // 隨性
  Adventure: number;             // 冒險
  Hedonism: number;              // 享樂
  Dominance: number;             // 主導
  Extroversion: number;          // 外向
  SecurityNeed: number;          // 安全感需求
  EmotionalDependency: number;   // 情緒依賴
  GrowthMindset: number;         // 成長型思維
  FamilyOrientation: number;     // 家庭導向
  ConsumptionTendency: number;   // 消費傾向
  FinancialMaturity: number;     // 理財成熟度
  CommunicationEfficiency: number; // 溝通效率
  RitualNeed: number;            // 儀式感需求
  QualityOfLife: number;         // 生活品質追求
  FreedomNeed: number;           // 自由需求
  Responsibility: number;        // 責任感
  DecisionSpeed: number;         // 決策速度
  ConflictResolution: number;    // 衝突處理能力
  LongTermCommitment: number;    // 長期關係投入度
}

export interface LadyProfile {
  code: string;
  name: string;
  isVerified: boolean;
  photoUrl: string;
  pendingPhotoUrl?: string;
  notes?: string;
  quizTaken: boolean;
  matchedGentlemanCode: string | null;
  quizMetrics: PersonalityMetrics;
  membershipLevel?: string;
  assetVerified?: string;
  unlockedGentlemanCodes?: string[];
  quizAnswers?: number[];
  deviceId?: string;
  canvasFingerprint?: string;
  ipAddress?: string;
  userAgent?: string;
  deviceModel?: string;
  createdAt?: string;
  updatedAt?: string;
}
