try {
  const script = document.createElement('script')
  script.setAttribute(
    'src',
    new URL(document.currentScript.src + '/../threads.js')
  )
  document.head.appendChild(script)

  const link = document.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.href = new URL(document.currentScript.src + '/../style.css')
  document.head.appendChild(link)
} catch (e) {
  console.error(e)
}
