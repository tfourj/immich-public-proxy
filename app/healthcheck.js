(async () => {
  try {
    require('dotenv').config()
    const res = await fetch(process.env.PROXY_PUBLIC_URL + '/healthcheck')
    if (await res.text() === 'ok') {
      process.exit(0)
    }
  } catch (e) { }
  process.exit(1)
})()
