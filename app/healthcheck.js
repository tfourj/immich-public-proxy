(async () => {
  try {
    const res = await fetch('http://localhost:3000/healthcheck')
    if (await res.text() === 'ok') {
      process.exit(0)
    }
  } catch (e) { }
  process.exit(1)
})()
