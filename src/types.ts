export enum AssetType {
  image = 'IMAGE',
  video = 'VIDEO'
}

export interface Asset {
  id: string;
  type: AssetType;
}

export interface SharedLink {
  key: string;
  assets: Asset[]
}

export enum ImageSize {
  thumbnail = 'thumbnail',
  original = 'original'
}
