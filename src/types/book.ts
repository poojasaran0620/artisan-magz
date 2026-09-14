export type PageSide = 'standalone' | 'left' | 'right';

export interface BookPhotoSlot {
  id: string;
  label?: string;
  url: string;
  aspectRatio?: string;
  caption?: string;
  borderStyle?: 'none' | 'polaroid' | 'classic' | 'archival';
  position?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  };
}

export interface BookTextSlot {
  id: string;
  type: 'headline' | 'subheading' | 'body' | 'quote' | 'date' | 'caption' | 'folio';
  content: string;
  fontFamily?: 'serif' | 'sans' | 'mono';
  isItalic?: boolean;
  isBold?: boolean;
  letterSpacing?: string;
  alignment?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
}

export interface BookPage {
  id: string;
  pageNumber: number;
  side: PageSide;
  templateId: string;
  title?: string;
  theme?: string;
  referenceImage?: string;
  backgroundColor?: string;
  photos: BookPhotoSlot[];
  texts: BookTextSlot[];
  decorations?: {
    showFolio?: boolean;
    folioText?: string;
    borderAccent?: boolean;
    vignette?: boolean;
  };
}

export interface BookSpread {
  id: string;
  spreadIndex: number;
  type: 'single' | 'dual';
  label: string;
  subtitle?: string;
  leftPage?: BookPage;
  rightPage?: BookPage;
}

export interface MultiPageBook {
  id: string;
  title: string;
  subtitle?: string;
  totalPages: number;
  pages: BookPage[];
}
