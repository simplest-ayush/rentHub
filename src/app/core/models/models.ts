export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export type LeaseType = 'long' | 'short' | 'both';
export type PriceMode = 'perMonth' | 'utilitiesIncluded';

export const AMENITIES = [
  'Gym/Fitness Center', 'Swimming Pool', 'Car Park', 'Visitors Parking',
  'Power Backup', 'Garbage Disposal', 'Private Lawn', 'Water Heater',
  'Plant Security System', 'Laundry Service', 'Elevator', 'Club House'
] as const;

export interface Listing {
  id: string;
  ownerId: string;
  propertyType: string;
  propertyName: string;
  shared: boolean;
  street: string;
  sqft: number;
  beds: number;
  leaseType: LeaseType;
  rent: number;
  negotiable: boolean;
  priceMode: PriceMode;
  furnished: boolean;
  amenities: string[];
  title: string;
  description: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  photos: string[];
  createdAt: string;
}

export interface Comment {
  id: string; 
  listingId: string; 
  userId: string; 
  userName: string;
  text: string; 
  parentId: string | null; 
  createdAt: string;
}

export interface Inquiry {
  id: string; 
  listingId: string; 
  fromUserId: string; 
  fromName: string;
  message: string; 
  createdAt: string;
}