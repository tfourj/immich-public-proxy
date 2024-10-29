import immich from './immich'
import { Response } from 'express-serve-static-core'
import { Asset, AssetType, ImageSize } from './types'
import dayjs from 'dayjs'

class Render {
  async assetBuffer (res: Response, asset: Asset, size?: ImageSize) {
    const data = await immich.getAssetBuffer(asset, size)
    if (data) {
      for (const header of ['content-type', 'content-length']) {
        res.set(header, data.headers[header])
      }
      console.log(`${dayjs().format()} Serving asset ${asset.id}`)
      res.send(Buffer.from(await data.arrayBuffer()))
    } else {
      res.status(404).send()
    }
  }

  async gallery (res: Response, assets: Asset[], openItem?: number) {
    const items = []
    for (const asset of assets) {
      let video
      if (asset.type === AssetType.video) {
        // Populate the data-video property
        video = JSON.stringify({
          source: [
            {
              src: immich.videoUrl(asset.id),
              type: await immich.getContentType(asset)
            }
          ],
          attributes: {
            preload: false,
            controls: true
          }
        })
      }
      items.push({
        originalUrl: immich.photoUrl(asset.id),
        thumbnailUrl: immich.photoUrl(asset.id, ImageSize.thumbnail),
        video
      })
    }
    res.render('gallery', {
      items,
      openItem
    })
  }
}

const render = new Render()

export default render
