function initLightGallery (params = {}) {
  // Create the lightGallery instance
  const lgEl = document.getElementById('lightgallery')
  const lg = lightGallery(lgEl, Object.assign({
    plugins: [lgZoom, lgThumbnail, lgVideo, lgFullscreen],
    speed: 500,
    /*
    This license key was graciously provided by LightGallery under their
    GPLv3 open-source project license:
    */
    licenseKey: '8FFA6495-676C4D30-8BFC54B6-4D0A6CEC'
    /*
    Please do not take it and use it for other projects, as it was provided
    specifically for Immich Public Proxy.

    For your own projects you can use the default license key of
    0000-0000-000-0000 as per their docs:

    https://www.lightgalleryjs.com/docs/settings/#licenseKey
    */
  }, params.lgConfig))

  // repeat the array for testing
  let items = []
  for (let i = 0; i < 50; i++) {
    items = items.concat(params.items)
  }

  // Append thumbnails
  items.forEach(item => {
    if (item.video) {
      lgEl.insertAdjacentHTML('beforeend', `<a data-video='${item.video}'
        ${item.downloadUrl ? 'data-download-url="' + item.downloadUrl + '"' : ''}>
        <img alt="" src="${item.thumbnailUrl}"/><div class="play-icon"></div></a>`)
    } else {
      lgEl.insertAdjacentHTML('beforeend', `<a href="${item.previewUrl}"
        ${item.downloadUrl ? 'data-download-url="' + item.downloadUrl + '"' : ''}>
        <img alt="" src="${item.thumbnailUrl}"/></a>`)
    }
  })
  lg.refresh()

  let timeout
  window.addEventListener('scroll', () => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(handleScroll, 100)
  })
}

function handleScroll () {
  const scrollPosition = window.innerHeight + window.scrollY
  const pageHeight = document.documentElement.scrollHeight
  const buffer = 100 // pixels before bottom to trigger load

  if (pageHeight - scrollPosition <= buffer) {
    loadMoreItems()
  }
}
