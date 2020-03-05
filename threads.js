const holder = document.createElement('div')
holder.innerHTML = `
<section id="archived">
  <h3>Archived</h3>
  <ul></ul>
</section>
`

const archiveEl = holder.children[0]
const archiveUlEl = archiveEl.querySelector('ul')

function treat(el) {
  const container = el.querySelector('.scrollable')

  if (!container.isTreated) {
    container.isTreated = true

    const newList = document.createElement('div')

    el.querySelectorAll('.thread.item').forEach(thread => {
      treatThread(thread)
    })

    const observer = new MutationObserver(list => {
      for (const mutation of list) {
        mutation.addedNodes.forEach(node => {
          if (node.tagName === 'LI') {
            const thread = node.children[0]
            treatThread(thread)
          }
        })
      }
    })
    observer.observe(container, {subtree: true, childList: true})
  }
}

function treatThread(thread) {
  if (thread.querySelector('.thread_closed_status_icon')) {
    if (!thread.parentElement.classList.contains('archived')) {
      !thread.parentElement.classList.add('archived')
    }
  }
}

function checkForThreads() {
  const els = document.querySelectorAll(
    '#threads-list-center-col,#search-results-center-col'
  )

  els.forEach(el => {
    if (!el.treated) {
      treat(el)
    }
  })
}

function checkForChanges() {
  const [threads, messages] = document.querySelectorAll('.switch_pane > a')

  const hasChanges =
    threads.classList.contains('unread') ||
    messages.classList.contains('unread')

  if (hasChanges !== checkForChanges.last) {
    checkForChanges.last = hasChanges

    document.querySelectorAll('link[rel*="icon"]').forEach(link => {
      link.parentElement.removeChild(link)
    })

    const newlink = document.createElement('link')
    newlink.setAttribute('rel', 'icon')

    if (hasChanges) {
      newlink.setAttribute('href', getAlertIcon())
    } else {
      newlink.setAttribute('href', `/a/img/fav/favicon.ico`)
    }

    document.head.insertBefore(newlink, null)
  }
}

function removeLinkSummaries() {
  document.querySelectorAll('.message_body a, .comments p > a').forEach(a => {
    if (!a.isTreated) {
      a.isTreated = true
      a.textContent = `${a.href}`
    }
  })
}

setInterval(checkForThreads, 10)
setInterval(checkForChanges, 1000)
setInterval(removeLinkSummaries, 10)

const datauri =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH5AMFAC8dQGUtYgAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAQBSURBVGje7ZpNTBxlGMd/78zssl+k3d3SgrCopa1tU9KUxoBRorQQozFpUi9VD9rERD001YuJaYyHZmM0HqpX40Wj0aR6MKlGaYxJi2SDkCK0QRbKVwsUunQL7MLOzO54AFpCdoGhA8uY/k+T7L5v/v/neeb5mDwiHA6XAiSB8xF+UAIVT7uLK1G8RWwaGAZqfIDkaAeO2dFPTxzmi4WfRDgcLm3sZm/MWXnRW17DpodhMHHlO+p2JXeVb2FWSgK2IQ8gBIFDr/FHFy0A8m3v0QuF+489is3gLjno7uq80i5JwYpabAghKcSTnJHcOw5gV0iFxXskxbfdtgIcvu1I2Bz2F3C8ykV5ULatAGEYhgEwPpWmrV+jdUCltV9jOJ7Z9OQTQ5H7ApZiJD4vaHBO0Nhkxl4CluLGRJrWfpXWAY22AY3YdGZzCPg+kjBMnzTg6rBG41U17wKUc78nbJ2FFKsv3OaTCAVkQkGJMr8y9xyQGYql+eDHyc0hIOAVhAIKoaBEyC/PPQdkygIyLofIesbjFDnvcyqCV6rd6BmDb5tnrBHgkGFfiWPeknMky/wyoaC8LJnF0NLQ1q/S1KNyqTuV9T91+5ycOuqjZKtMdFS3TsBXJ/3sLjbvoIlEhr+iKk09KSLXNWbU7Dli9w6Fdxu8VD3mXNzqWxNCDhlT5KOjOpejKZqiKteGdZZLa1vcgree83CsyoMk1ukdECuYIqUbtPapXO7RaIqmVlXkZAlePuzmzWe9FLrExr/EBvBr+yx//pvi7z6NGW315aN6p4PTDT4eL1Lyl4V+akny2W/makapX+J0vY/aJwryXwdummju3E7ByWc8nKj24FjnRtdUCK3Y2gIvHizg7Tov23zmmY/cTeevEh8odfDe8z72P7LGK4WgFmgGnjo79mAC9LRBImXgLRAYwM2JNCPx7NZRJHj/hUJeOuRCrIF0NjR/eH9OX0mMqDk7ljU6dhYp+FyC3ls6CTV3AL1a4+ZUvc8S4sshm5DEUCT3THx9XOefIW1Z8gAhv7Tu5Jd6xdqh3gwh8WAFLJuIh59VNsr6ubygrCdnLQ3fNCUYupPmI7tMZAtoH1T55JcEfbd1gHUTYHkITc0afHxhkne+vnuPfK4MYkUYWeqBxs5ZzjVOM7GGDx15C6GBWJq+cZ3PL04T6dU2PAvlrMRWw8owWqjKy1bih3Xg/ybATIts5h77e0CfHsMuXlh6XpseQ5q51bmhFluriGznMlOj3Uom1nuJiiO1+RCxmtSaS7CR0dnqISzOhMOlP/dX3sj3qoGZMRIg1vLlnTeqqVQ8QFDtqI8Nktd9iVWH1vyyx5G9PHmvlWjYQ1eSjrLzkQ5brNu8vmjd5j8p5ZSrSGlFhQAAAABJRU5ErkJggg=='

let bloburi
fetch(datauri)
  .then(res => res.blob())
  .then(blob => (bloburi = URL.createObjectURL(blob)))

function getAlertIcon() {
  return bloburi
}
