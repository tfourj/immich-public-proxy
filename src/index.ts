import express from 'express'
import immich from './immich'
import render from './render'
import dayjs from 'dayjs'
import { AssetType, ImageSize } from './types'
import { Request } from 'express-serve-static-core'

require('dotenv').config()

const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))

const getSize = (req: Request) => {
  return req?.query?.size === 'thumbnail' ? ImageSize.thumbnail : ImageSize.original
}

app.get('/share/:key', async (req, res) => {
  res.set('Cache-Control', 'public, max-age=' + process.env.CACHE_AGE)
  if (!immich.isKey(req.params.key)) {
    res.status(404).send()
  } else {
    const sharedLink = await immich.getShareByKey(req.params.key)
    if (!sharedLink || !sharedLink.assets.length) {
      res.status(404).send()
    } else if (sharedLink.assets.length === 1) {
      // This is an individual item (not a gallery)
      const asset = sharedLink.assets[0]
      if (asset.type === AssetType.image) {
        // For photos, output the image directly
        await render.assetBuffer(res, sharedLink.assets[0], getSize(req))
      } else if (asset.type === AssetType.video) {
        // For videos, show the video as a web player
        await render.gallery(res, sharedLink, 1)
      }
    } else {
      // Multiple images - render as a gallery
      await render.gallery(res, sharedLink)
    }
  }
})

// Output the buffer data for an photo or video
app.get('/:type(photo|video)/:key/:id', async (req, res) => {
  res.set('Cache-Control', 'public, max-age=' + process.env.CACHE_AGE)
  // Check for valid key and ID
  if (immich.isKey(req.params.key) && immich.isId(req.params.id)) {
    // Check if the key is a valid share link
    const sharedLink = await immich.getShareByKey(req.params.key)
    if (sharedLink?.assets.length) {
      // Check that the requested asset exists in this share
      const asset = sharedLink.assets.find(x => x.id === req.params.id)
      if (asset) {
        asset.type = req.params.type === 'video' ? AssetType.video : AssetType.image
        render.assetBuffer(res, asset, getSize(req)).then()
        return
      }
    }
  }
  res.status(404).send()
})

// Send a 404 for all other unmatched routes
app.get('*', (_req, res) => {
  res.status(404).send()
})

app.listen(3000, () => {
  console.log(dayjs().format() + ' Server started')
})
