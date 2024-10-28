class Immich {
  async request (endpoint, json = true) {
    const res = await fetch(process.env.IMMICH_URL + '/api' + endpoint, {
      headers: {
        'x-api-key': process.env.API_KEY
      }
    })
    if (json) {
      return res.json()
    } else {
      return res
    }
  }

  async getShareByKey (key) {
    const links = await this.request('/shared-links')
    return links.find(x => x.key === key)
  }

  async getImage (id, size) {
    size = size === 'thumbnail' ? 'thumbnail' : 'original'
    return this.request('/assets/' + id + '/' + size, false)
  }
}

const api = new Immich()
export default api
