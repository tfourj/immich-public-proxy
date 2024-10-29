export enum AssetType {
  image = 'IMAGE',
  video = 'VIDEO'
}

export interface Asset {
  id: string;
  type: AssetType;
  isTrashed: boolean;
}

export interface SharedLink {
  key: string;
  assets: Asset[];
  expiresAt: string | null;
}

export enum ImageSize {
  thumbnail = 'thumbnail',
  original = 'original'
}
