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
  if (req.params.key.match(/[^\w-]/)) {
    // Invalid characters in the incoming URL
    res.status(404).send()
  } else {
    const share = await immich.getShareByKey(req.params.key)
    if (!share || !share.assets.length) {
      res.status(404).send()
    } else if (share.assets.length === 1) {
      // This is an individual item (not a gallery)
      const asset = share.assets[0]
      if (asset.type === AssetType.image) {
        // Output the image directly
        await render.assetBuffer(res, share.assets[0], getSize(req))
      } else if (asset.type === AssetType.video) {
        // Show the video as a web player
        await render.gallery(res, share.assets, 1)
      }
    } else {
      // Multiple images - render as a gallery
      await render.gallery(res, share.assets)
    }
  }
})

// Output the buffer data for an photo or video
app.get('/:type(photo|video)/:id', (req, res) => {
  if (!immich.isId(req.params.id)) {
    // Invalid characters in the incoming URL
    res.status(404).send()
    return
  }
  const asset = {
    id: req.params.id,
    type: req.params.type === 'video' ? AssetType.video : AssetType.image
  }
  switch (req.params.type) {
    case 'photo':
    case 'video':
      render.assetBuffer(res, asset, getSize(req)).then()
      break
  }
})

app.listen(3000, () => {
  console.log(dayjs().format() + ' Server started')
})
