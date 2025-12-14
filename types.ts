export enum PackageTier {
  SPARK = 'Spark',
  RADIANCE = 'Radiance',
  LUMINARY = 'Luminary'
}

export interface ServicePackage {
  id: string;
  name: string;
  price?: number; // Price is now optional
  features: string[];
  recommended?: boolean;
}

export interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  details: string[];
}

export interface GraphicItem {
  id: string;
  title: string;
  description: string;
  category: 'stationery' | 'packaging';
  image?: string;
}

export interface EcomPlatform {
  id: string;
  name: string;
  type: 'marketplace' | 'food';
  logo?: string; // Placeholder for logo representation
  domain?: string; // For fetching logo
  description?: string; // For sales pitch
  availableInIndia?: boolean;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  service: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
}

export interface UserSubscription {
  id: string;
  packageName: string;
  startDate: string;
  renewalDate: string;
  status: 'Active' | 'Cancelled';
}

export type PipelineStatus = 
  | 'backlog' 
  | 'writing' 
  | 'design' 
  | 'review' 
  | 'approval' 
  | 'scheduled' 
  | 'posted';

export interface PipelinePost {
  id: string;
  title: string;
  platform: 'instagram' | 'linkedin' | 'twitter' | 'facebook';
  status: PipelineStatus;
  dueDate: string;
  thumbnail?: string;
  caption?: string;
}

// --- New Types for Profile & Admin ---

export interface BusinessDetails {
  name: string;
  address: string; // Made optional in form validation, but kept as string for state
  gstin: string;   // Made optional in form validation
  hsn: string;     // Added HSN field
  email: string;
  phone: string;
  whatsappConsent: boolean;
}

export interface ContactPersonDetails {
  salutation: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsappConsent: boolean;
}

export interface UserProfile {
  business: BusinessDetails;
  contactPerson: ContactPersonDetails;
}

export interface AdminServiceItem {
  code: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface BankDetails {
  accountName: string;
  ifsc: string;
  bankName: string;
  accountNumber: string;
}

export interface AdminCompanyDetails {
  name: string;
  address: string;
  phone: string;
  email: string;
  bankDetails: BankDetails;
  paymentModes: string[];
  paymentTerms: string[];
}