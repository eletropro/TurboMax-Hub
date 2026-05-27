export interface RideInfo {
  id: string;
  app: 'Uber' | '99';
  category: string;
  value: number; // in BRL (R$)
  distance: number; // in km
  timeMinutes: number; // in minutes
  pickupAddress: string;
  destinationAddress: string;
  classification: 'excellent' | 'good' | 'average' | 'bad';
  timestamp: string;
  fuelCost: number;
  netProfit: number;
  earningsPerKm: number;
  earningsPerMinute: number;
  recommendation: 'accept' | 'reject' | 'attention';
  aiExplanation: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface DriverSettings {
  fuelPrice: number; // R$/L
  kmPerLiter: number; // km/L
  minPricePerKm: number; // R$/km code limits
  minPricePerMinute: number; // R$/min
  minHourlyEarnings: number; // R$/hora
  dailyTarget: number; // R$
  weeklyTarget: number; // R$
  blockedRegions: string[];
  autoOverlayEnabled: boolean;
}

export interface NotificationAlert {
  id: string;
  type: 'excellent' | 'danger' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface DriverStats {
  totalEarnings: number;
  totalKm: number;
  totalTimeMinutes: number;
  acceptedCount: number;
  rejectedCount: number;
  scannedCount: number;
}

export interface AffiliateInfo {
  referralCode: string;
  referralsCount: number;
  commissionsEarned: number;
  plan: 'gratis' | 'premium';
}
