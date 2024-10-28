const express = require('express')
const api = require('./immich').default
const dayjs = require('dayjs')

const app = express()

require('dotenv').config()

app.get('/share/:key', async (req, res) => {
  if (req.params.key.match(/[^A-Za-z0-9\-]/)) {
    // Invalid characters in the incoming URL
    res.status(404).send()
  } else {
    const share = await api.getShareByKey(req.params.key)
    if (share?.assets?.length === 1) {
      // This is an individual item (not a gallery)
      // Return the full-size image.
      const image = await api.getImage(share.assets[0].id, req.query.size)
      for (const header of ['content-type', 'content-length']) {
        res.set(header, image.headers[header])
      }
      const data = await image.arrayBuffer()
      res.send(Buffer.from(data))
    } else {
      res.send()
    }
  }
})

app.listen(3000, () => {
  console.log(dayjs().format() + ' Server started')
})
