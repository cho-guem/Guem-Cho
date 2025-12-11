export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface GeneratedImage {
  imageUrl: string;
  prompt: string;
}

export interface HairstylePreset {
  id: string;
  label: string;
  description: string; // The prompt text
  icon: string;
}

export const SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];