import { Asset, AssetType, ImageSize, SharedLink } from './types'

class Immich {
  async request (endpoint: string, json = true) {
    const res = await fetch(process.env.IMMICH_URL + '/api' + endpoint, {
      headers: {
        'x-api-key': process.env.API_KEY || ''
      }
    })
    if (res.status === 200) {
      if (json) {
        return res.json()
      } else {
        return res
      }
    }
  }

  async getShareByKey (key: string) {
    const links = await this.request('/shared-links') as SharedLink[]
    return links.find(x => x.key === key)
  }

  async getAssetBuffer (asset: Asset, size?: ImageSize) {
    switch (asset.type) {
      case AssetType.image:
        size = size === ImageSize.thumbnail ? ImageSize.thumbnail : ImageSize.original
        return this.request('/assets/' + asset.id + '/' + size, false)
      case AssetType.video:
        return this.request('/assets/' + asset.id + '/video/playback', false)
    }
  }

  imageUrl (id: string, size?: ImageSize) {
    return `${process.env.SERVER_URL}/photo/${id}` + (size ? `?size=${size}` : '')
  }
}

const api = new Immich()

export default api
