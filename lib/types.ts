import type { ListingStatusValue } from '@/lib/listing-status';

export type SellerType = 'owner' | 'flip' | 'broker' | 'commission';
export type ResourceStatus = 'not_listed' | 'on_resources' | 'pre_resources';
export type PtsType = 'original' | 'duplicate' | 'epts';
export type AvtotekaStatus = 'green' | 'yellow' | 'red' | 'unknown';

export interface SaleListing {
  id: string;
  type: 'sale';
  make: string;
  model: string;
  generation?: string;
  year: number;
  price: number;
  priceInHand?: number;
  priceOnResources?: number;
  city: string;
  images: string[];
  videoUrl?: string;
  interiorImages?: string[];
  reportUrl?: string;
  vin?: string;
  engine: string;
  power: number;
  transmission: string;
  drive: string;
  bodyType: string;
  mileage: number;
  owners: number;
  registrations?: number;
  ptsType?: PtsType;
  ptsOriginal: boolean;
  avtotekaStatus?: AvtotekaStatus;
  paintedElements?: string[];
  paintCount: number;
  accident?: boolean;
  taxi?: boolean;
  carsharing?: boolean;
  keysCount?: number;
  conditionNote?: string;
  needsInvestment?: boolean;
  glassOriginal?: boolean;
  trade: boolean;
  kickback?: boolean;
  resourceStatus: ResourceStatus;
  sellerType: SellerType;
  inspectionCity?: string;
  color: string;
  steering: string;
  trim?: string;
  description: string;
  seller: SellerProfile;
  status?: ListingStatusValue;
  moderationNote?: string;
  publishedAt?: string;
  ownerUserId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface WantedListing {
  id: string;
  type: 'wanted';
  models: string[];
  budgetMin?: number;
  budgetMax: number;
  yearFrom?: number;
  mileageMax?: number;
  engine?: string;
  transmission?: string;
  drive?: string;
  ownersMax?: number;
  paintAllowed: boolean;
  restrictions?: string[];
  region?: string;
  comment?: string;
  contact: string;
  author: SellerProfile;
  status?: ListingStatusValue;
  moderationNote?: string;
  publishedAt?: string;
  ownerUserId?: string;
  createdAt: string;
}

export interface SellerProfile {
  id: string;
  name: string;
  type: 'person' | 'company';
  verified: boolean;
  onPlatformSince: string;
  phone?: string;
}

export interface VehicleReport {
  vin: string;
  avtotekaStatus?: AvtotekaStatus;
  accidentCount?: number;
  restrictions?: boolean;
  theft?: boolean;
  ptsMatch?: boolean;
}

export interface DealMeta {
  price: number;
  priceInHand?: number;
  priceOnResources?: number;
  trade: boolean;
  kickback?: boolean;
  resourceStatus: ResourceStatus;
  sellerType: SellerType;
  legalClean: boolean;
}
