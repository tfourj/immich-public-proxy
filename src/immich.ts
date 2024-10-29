import { Asset, AssetType, ImageSize, SharedLink } from './types'

class Immich {
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

  async getShareByKey (key: string) {
    const res = (await this.request('/shared-links') || []) as SharedLink[]
    return res?.find(x => x.key === key)
  }

  async getAssetBuffer (asset: Asset, size?: ImageSize) {
    switch (asset.type) {
      case AssetType.image:
        size = size === ImageSize.thumbnail ? ImageSize.thumbnail : ImageSize.original
        return this.request('/assets/' + asset.id + '/' + size)
      case AssetType.video:
        return this.request('/assets/' + asset.id + '/video/playback')
    }
  }

  async getContentType (asset: Asset) {
    const assetBuffer = await this.getAssetBuffer(asset)
    return assetBuffer.headers.get('Content-Type')
  }

  photoUrl (id: string, size?: ImageSize) {
    return `${process.env.SERVER_URL}/photo/${id}` + (size ? `?size=${size}` : '')
  }

  videoUrl (id: string) {
    return `${process.env.SERVER_URL}/video/${id}`
  }

  isId (id: string) {
    return !!id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
  }
}

const immich = new Immich()

export default immich
