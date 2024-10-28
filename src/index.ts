import express from 'express'
import api from './immich'
import immich from './immich'
import dayjs from 'dayjs'
import { AssetType, ImageSize } from './types'
import { Request, Response } from 'express-serve-static-core'

require('dotenv').config()

const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))

async function serveImage (res: Response, id: string, size?: ImageSize) {
  const image = await api.getAssetBuffer({
    id,
    type: AssetType.image
  }, size)
  if (image) {
    for (const header of ['content-type', 'content-length']) {
      res.set(header, image.headers[header])
    }
    console.log(`${dayjs().format()} Serving image ${id}`)
    res.send(Buffer.from(await image.arrayBuffer()))
  } else {
    res.status(404).send()
  }
}

const getSize = (req: Request) => {
  return req?.query?.size === 'thumbnail' ? ImageSize.thumbnail : ImageSize.original
}

app.get('/share/:key', async (req, res) => {
  if (req.params.key.match(/[^\w-]/)) {
    // Invalid characters in the incoming URL
    res.status(404).send()
  } else {
    const share = await api.getShareByKey(req.params.key)
    if (!share || !share.assets.length) {
      res.status(404).send()
    } else if (share.assets.length === 1) {
      // This is an individual item (not a gallery)
      await serveImage(res, share.assets[0].id, getSize(req))
    } else {
      // Multiple images - render as a gallery
      res.render('gallery', {
        photos: share.assets.map(photo => {
          return {
            originalUrl: immich.imageUrl(photo.id),
            thumbnailUrl: immich.imageUrl(photo.id, ImageSize.thumbnail)
          }
        })
      })
    }
  }
})

app.get('/photo/:id', (req, res) => {
  if (req.params.id.match(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/)) {
    // Check for photo
    serveImage(res, req.params.id, getSize(req)).then()
  } else {
    // Invalid characters in the incoming URL
    res.status(404).send()
  }
})

app.listen(3000, () => {
  console.log(dayjs().format() + ' Server started')
})
