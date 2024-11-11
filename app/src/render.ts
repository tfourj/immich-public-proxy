import immich from './immich'
import { Response } from 'express-serve-static-core'
import { Asset, AssetType, ImageSize, IncomingShareRequest, SharedLink } from './types'
import { getConfigOption } from './functions'

class Render {
  lgConfig

  constructor () {
    this.lgConfig = getConfigOption('lightGallery', {})
  }

  /**
   * Stream data from Immich back to the client
   */
  async assetBuffer (req: IncomingShareRequest, res: Response, asset: Asset, size?: ImageSize) {
    // Prepare the request
    const headerList = ['content-type', 'content-length', 'last-modified', 'etag']
    size = size === ImageSize.thumbnail ? ImageSize.thumbnail : ImageSize.original
    const subpath = asset.type === AssetType.video ? '/video/playback' : '/' + size
    const headers = { range: '' }

    // Stream the video in 2.5MB chunks
    if (asset.type === AssetType.video) {
      const range = (req.range || '').replace(/bytes=/, '').split('-')
      const start = parseInt(range[0], 10) || 0
      headers.range = `bytes=${start}-${start + 2499999}`
      headerList.push('cache-control', 'content-range')
      res.setHeader('accept-ranges', 'bytes')
      res.status(206) // Partial Content
    }

    // Request data from Immich
    const url = immich.buildUrl(immich.apiUrl() + '/assets/' + encodeURIComponent(asset.id) + subpath, {
      key: asset.key,
      password: asset.password
    })
    const data = await fetch(url, { headers })

    // Return the response to the client
    if (data.status >= 200 && data.status < 300) {
      // Populate the response headers
      headerList.forEach(header => {
        const value = data.headers.get(header)
        if (value) res.setHeader(header, value)
      })
      // Return the body
      await data.body?.pipeTo(
        new WritableStream({
          write (chunk) { res.write(chunk) }
        })
      )
      res.end()
    } else {
      res.status(404).send()
    }
  }

  /**
   * Render a gallery page for a given SharedLink, using EJS and lightGallery.
   *
   * @param res - ExpressJS Response
   * @param share - Immich `shared-link` containing the assets to show in the gallery
   * @param [openItem] - Immediately open a lightbox to the Nth item when the gallery loads
   */
  async gallery (res: Response, share: SharedLink, openItem?: number) {
    const items = []
    for (const asset of share.assets) {
      let video
      if (asset.type === AssetType.video) {
        // Populate the data-video property
        video = JSON.stringify({
          source: [
            {
              src: immich.videoUrl(share.key, asset.id, asset.password),
              type: await immich.getVideoContentType(asset)
            }
          ],
          attributes: {
            preload: false,
            controls: true
          }
        })
      }
      items.push({
        originalUrl: immich.photoUrl(share.key, asset.id, undefined, asset.password),
        thumbnailUrl: immich.photoUrl(share.key, asset.id, ImageSize.thumbnail, asset.password),
        video
      })
    }
    res.render('gallery', {
      items,
      openItem,
      title: this.title(share),
      lgConfig: getConfigOption('lightGallery', {})
    })
  }

  /**
   * Attempt to get a title from the link description or the album title
   */
  title (share: SharedLink) {
    return share.description || share?.album?.albumName || ''
  }
}

const render = new Render()

export default render
