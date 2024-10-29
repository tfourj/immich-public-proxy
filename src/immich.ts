import { Asset, AssetType, ImageSize, SharedLink } from './types'
import dayjs from 'dayjs'

class Immich {
  /**
   * Make a request to Immich API. We're not using the SDK to limit
   * the possible attack surface of this app.
   */
  async request (endpoint: string) {
    const res = await fetch(process.env.IMMICH_URL + '/api' + endpoint, {
      headers: {
        'x-api-key': process.env.API_KEY || ''
      }
    })
    if (res.status === 200) {
      const contentType = res.headers.get('Content-Type') || ''
      if (contentType.includes('application/json')) {
        return res.json()
      } else {
        return res
      }
    }
  }

  /**
   * Query Immich for the SharedLink metadata for a given key.
   * The key is what is returned in the URL when you create a share in Immich.
   * Immich doesn't have a method to query by key, so this method gets all
   * known shared links, and returns the link which matches the provided key.
   */
  async getShareByKey (key: string) {
    const res = (await this.request('/shared-links') || []) as SharedLink[]
    const link = res.find(x => x.key === key)
    if (link) {
      // Filter assets to exclude trashed assets
      link.assets = link.assets.filter(x => !x.isTrashed)
      if (link.expiresAt && dayjs(link.expiresAt) < dayjs()) {
        // This link has expired
      } else {
        return link
      }
    }
  }

  /**
   * Stream asset buffer data from Immich.
   * For photos, you can request 'thumbnail' or 'original' size.
   * For videos, it is Immich's streaming quality, not the original quality.
   */
  async getAssetBuffer (asset: Asset, size?: ImageSize) {
    switch (asset.type) {
      case AssetType.image:
        size = size === ImageSize.thumbnail ? ImageSize.thumbnail : ImageSize.original
        return this.request('/assets/' + asset.id + '/' + size)
      case AssetType.video:
        return this.request('/assets/' + asset.id + '/video/playback')
    }
  }

  /**
   * Get the content-type of an Immich asset
   */
  async getContentType (asset: Asset) {
    const assetBuffer = await this.getAssetBuffer(asset)
    return assetBuffer.headers.get('Content-Type')
  }

  /**
   * Return the image data URL for a photo
   */
  photoUrl (key: string, id: string, size?: ImageSize) {
    return `/photo/${key}/${id}` + (size ? `?size=${size}` : '')
  }

  /**
   * Return the video data URL for a video
   */
  videoUrl (key: string, id: string) {
    return `/video/${key}/${id}`
  }

  /**
   * Check if a provided ID matches the Immich ID format
   */
  isId (id: string) {
    return !!id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
  }

  /**
   * Check if a provided key matches the Immich shared-link key format
   */
  isKey (key: string) {
    return !!key.match(/^[\w-]+$/)
  }
}

const immich = new Immich()

export default immich
