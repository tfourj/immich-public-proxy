export interface SharedLinkAsset {
  id: string;
}

export interface SharedLink {
  key: string;
  assets: SharedLinkAsset[]
}
