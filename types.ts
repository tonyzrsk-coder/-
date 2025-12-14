export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

export interface GeneratedItem {
  id: string;
  type: MediaType;
  url: string;
  prompt: string;
  createdAt: number;
  aspectRatio?: string;
}

export interface GenerationConfig {
  prompt: string;
  aspectRatio: string;
  model: string; // 'flash' | 'pro' | 'veo-fast'
}

// Window interface for Veo key selection
// Augment the AIStudio interface to ensure required methods exist on the globally defined window.aistudio
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}