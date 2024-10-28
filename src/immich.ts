import { SharedLink } from './types'

class Immich {
  async request (endpoint: string, json = true) {
    const res = await fetch(process.env.IMMICH_URL + '/api' + endpoint, {
      headers: {
        'x-api-key': process.env.API_KEY || ''
      }
    })
    if (json) {
      return res.json()
    } else {
      return res
    }
  }

  async getShareByKey (key: string) {
    const links = await this.request('/shared-links') as SharedLink[]
    return links.find(x => x.key === key)
  }

  async getImage (id: string, size = 'original') {
    size = size === 'thumbnail' ? 'thumbnail' : 'original'
    return this.request('/assets/' + id + '/' + size, false)
  }
}

const api = new Immich()

export default api
