export type ProductCategory = 'magazine' | 'mini-magazine' | 'frame' | 'newspaper' | 'songbook' | 'hamper' | 'combo';

export interface MagazineTemplate {
  id: string;
  name: string;
  tagline: string;
  suitableFor: string;
  coverImage: string;
  previewPages: string[];
  themeColor: string;
  description: string;
  badge?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description?: string;
  recommendedPhotos?: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: ProductCategory;
  basePrice: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  images: string[];
  description: string;
  variants: ProductVariant[];
  whatsIncluded: string[];
  thingsRequired: string[];
  dispatchesIn: string;
  deliveryTimeline: string;
  features: string[];
}

export interface HamperGoodie {
  id: string;
  name: string;
  category: 'beauty' | 'jewelry' | 'accessory' | 'keepsake' | 'treat';
  price: number;
  image: string;
  detailedImage?: string;
  description: string;
  specs?: string[];
  material?: string;
  dimensions?: string;
  tag?: string;
}

export interface HamperBoxOption {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
  colorHex: string;
  dimensions: string;
}

export interface HamperSelection {
  box: HamperBoxOption;
  lidTag?: string;
  items: { goodie: HamperGoodie; quantity: number }[];
  card: {
    design: string;
    waxSealColor?: string;
    recipientName: string;
    message: string;
    senderName: string;
  };
}

export interface HamperInspirationLook {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  boxId: string;
  lidTagId: string;
  includedGoodieIds: string[];
  price: number;
  highlight: string;
}

export interface CustomizationData {
  variantId?: string;
  variantName?: string;
  // Magazine inputs
  format?: 'standard-a4' | 'mini-a5';
  selectedPages?: number;
  selectedTemplates?: string[];
  addOns?: {
    giftWrap?: boolean;
    handwrittenLetter?: boolean;
    combo?: boolean;
  };
  addOnPrice?: number;
  selectedTemplate?: string;
  occasion?: string;
  headline?: string;
  storyMessage?: string;
  spotifyLink?: string;
  uploadedPhotoCount?: number;
  uploadedPhotos?: string[]; // base64 or object URLs
  
  // Frame inputs
  frameSize?: string;
  frameStyle?: string;
  orientation?: 'portrait' | 'landscape';
  captionDate?: string;
  collageStyle?: 'single' | 'grid9' | 'cutout';

  // Newspaper Card inputs
  newspaperEdition?: string;
  newspaperHeadline?: string;
  newspaperSubheadline?: string;
  anniversaryDate?: string;
  articleStory?: string;
  coupleNames?: string;
  city?: string;

  // Song Book inputs
  songTitle?: string;
  artistName?: string;
  playlistDedication?: string;
  timestamp?: string;

  // Hamper inputs
  hamperDetails?: HamperSelection;

  // General notes
  specialInstructions?: string;
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
  customization: CustomizationData;
  unitPrice: number;
  totalPrice: number;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  avatar?: string;
  rating: number;
  date: string;
  productTitle: string;
  comment: string;
  verifiedBuyer: boolean;
  image?: string;
}

export interface StoryHighlight {
  id: string;
  title: string;
  coverImage: string;
  stories: {
    id: string;
    title: string;
    image: string;
    caption: string;
  }[];
}
