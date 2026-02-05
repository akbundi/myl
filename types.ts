
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum ModerationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface BiometricProfile {
  facialGeometry?: string;
  microExpressions?: string;
  skinTexture?: string;
  personalityArchetype?: string;
}

export interface BehavioralProfile {
  location?: { lat: number; lng: number; city?: string; weather?: string; temp?: number };
  usageHabits?: string;
  activityLevel?: 'low' | 'medium' | 'high';
  dayNightBehavior?: 'diurnal' | 'nocturnal';
  timestamp: string;
}

export interface VoiceProfile {
  mood?: string;
  pitch?: string;
  tempo?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  image: string;
  role: Role;
  biometricProfile?: BiometricProfile;
  behavioralProfile?: BehavioralProfile;
  voiceProfile?: VoiceProfile;
  sensorConsent: boolean;
  createdAt: string;
}

export interface Fragrance {
  id: string;
  name: string;
  brand: string;
  notes: string[];
  family: string;
  priceEUR: number;
  imageUrl?: string;
  isActive: boolean;
}

export interface Recipe {
  id: string;
  userId: string;
  name: string;
  ratios: { fragranceId: string; percentage: number }[];
  isPublic: boolean;
  status: ModerationStatus;
  createdAt: string;
  analysis?: string;
}

export interface AppState {
  user: User | null;
  currentProfileStep: number;
  isPremium: boolean;
}
