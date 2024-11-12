import express from 'express'
import immich from './immich'
import render from './render'
import dayjs from 'dayjs'
import { AssetType } from './types'
import { decrypt } from './encrypt'
import { log, toString, addResponseHeaders } from './functions'

require('dotenv').config()

const app = express()
// Add the EJS view engine, to render the gallery page
app.set('view engine', 'ejs')
// For parsing the password unlock form
app.use(express.json())
// Serve static assets from the /public folder
app.use(express.static('public', { setHeaders: addResponseHeaders }))

// An incoming request for a shared link
app.get('/share/:key', async (req, res) => {
  await immich.handleShareRequest({
    key: req.params.key
  }, res)
})

// Receive an unlock request from the password page
app.post('/unlock', async (req, res) => {
  await immich.handleShareRequest({
    key: toString(req.body.key),
    password: toString(req.body.password)
  }, res)
})

// Output the buffer data for a photo or video
app.get('/:type(photo|video)/:key/:id/:size?', async (req, res) => {
  addResponseHeaders(res)
  // Check for valid key and ID
  if (immich.isKey(req.params.key) && immich.isId(req.params.id)) {
    let password
    // Validate the password payload, if one was provided
    if (req.query?.cr && req.query?.iv) {
      try {
        const payload = JSON.parse(decrypt({
          iv: toString(req.query.iv),
          cr: toString(req.query.cr)
        }))
        if (payload?.expires && dayjs(payload.expires) > dayjs()) {
          password = payload.password
        } else {
          log(`Attempted to load assets from ${req.params.key} with an expired decryption token`)
        }
      } catch (e) { }
    }
    // Check if the key is a valid share link
    const sharedLink = (await immich.getShareByKey(req.params.key, password))?.link
    const request = { key: req.params.key, range: req.headers.range || '' }
    if (sharedLink?.assets.length) {
      // Check that the requested asset exists in this share
      const asset = sharedLink.assets.find(x => x.id === req.params.id)
      if (asset) {
        asset.type = req.params.type === 'video' ? AssetType.video : AssetType.image
        render.assetBuffer(request, res, asset, immich.validateImageSize(req.params.size)).then()
        return
      }
    }
  }
  log('No asset found for ' + req.path)
  res.status(404).send()
})

// Healthcheck
app.get('/healthcheck', async (_req, res) => {
  if (await immich.accessible()) {
    res.send('ok')
  } else {
    res.status(502).send()
  }
})

// Send a 404 for all other routes
app.get('*', (req, res) => {
  log('Invalid route ' + req.path)
  res.status(404).send()
})

app.listen(3000, () => {
  console.log(dayjs().format() + ' Server started')
})
