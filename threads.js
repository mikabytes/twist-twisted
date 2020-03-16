'use strict'

const {clubhouseToken, fetch} = window.twisted || {}
delete window.twisted

if (clubhouseToken && fetch) {
  convertClubhouseLinks(fetch, clubhouseToken)
}

function convertClubhouseLinks(fetch, token) {
  console.log(fetch)
  setInterval(run, 10)

  function run() {
    document.querySelectorAll('.mkdown a').forEach(async a => {
      if (!a.isTreated) {
        const club = a.href.match(/clubhouse.*story\/(\d+)(\/|$)/)
        if (club) {
          a.isTreated = true
          const storyId = club[1]
          a.textContent = ``

          Object.assign(a.style, {
            border: '1px solid #ddd',
            borderRadius: '1px',
            padding: '0px 3px 0px 23px',
            display: 'inline-block',
            background: '3px center / 15px 15px no-repeat',
            fontSize: '0.8em',
          })

          const span1 = document.createElement('span')
          const span2 = document.createElement('span')
          span1.textContent = storyId
          span1.style.color = '#a70210'
          span1.style.fontWeight = 'bold'
          span2.style.color = 'rgba(0, 0, 0, 0.88)'
          span2.innerHTML = `&nbsp;| ...`
          a.appendChild(span1)
          a.appendChild(span2)

          const res = await fetch(
            `https://api.clubhouse.io/api/v3/stories/${storyId}?token=${token}`
          )
          if (res.ok) {
            const json = await res.json()
            span2.innerHTML = `&nbsp;| ${json.name}`
            a.style.backgroundImage = `url("${
              json.completed ? completed : json.started ? started : unstarted
            }")`
          }
        }
      }
    })
  }
}

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

function ctrlKey() {
  setTimeout(() => {
    // After sending a message, remain in the input box so we can send another message
    const commentersField = document.querySelector(
      '.collapsed_comment_composer > .input'
    )
    console.log(commentersField)
    if (commentersField) {
      console.log('yes')
      commentersField.click()
    }
  }, 10)
}

function unblurPreviews() {
  document.body.querySelectorAll('.attachment.__image').forEach(att => {
    if (!att.isTreated) {
      if (att.children[1].src) {
        const newhref = `https://resizeist.doist.com/?maxheight=2000&url=${encodeURIComponent(
          att.children[0].href
        )}`
        att.children[1].setAttribute('src', newhref)
        att.children[1].removeAttribute('height')
        att.children[1].style.maxHeight = '300px'
        att.isTreated = true
      }
    }
  })

  const preview_image = document.body.querySelector(
    '.preview_window .preview_image'
  )
  if (preview_image && !preview_image.isTreated) {
    preview_image.isTreated = true
    preview_image.setAttribute(
      'src',
      `https://resizeist.doist.com/?maxheight=2000&url=${encodeURIComponent(
        preview_image.src
      )}`
    )
  }
}

function keydown(e) {
  if (e.key === 'Enter' && e.ctrlKey) {
    ctrlKey()
  }
}

setInterval(checkForThreads, 10)
setInterval(checkForChanges, 1000)
setInterval(unblurPreviews, 10)
document.body.addEventListener('keydown', keydown)

const datauri =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH5AMFAC8dQGUtYgAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAQBSURBVGje7ZpNTBxlGMd/78zssl+k3d3SgrCopa1tU9KUxoBRorQQozFpUi9VD9rERD001YuJaYyHZmM0HqpX40Wj0aR6MKlGaYxJi2SDkCK0QRbKVwsUunQL7MLOzO54AFpCdoGhA8uY/k+T7L5v/v/neeb5mDwiHA6XAiSB8xF+UAIVT7uLK1G8RWwaGAZqfIDkaAeO2dFPTxzmi4WfRDgcLm3sZm/MWXnRW17DpodhMHHlO+p2JXeVb2FWSgK2IQ8gBIFDr/FHFy0A8m3v0QuF+489is3gLjno7uq80i5JwYpabAghKcSTnJHcOw5gV0iFxXskxbfdtgIcvu1I2Bz2F3C8ykV5ULatAGEYhgEwPpWmrV+jdUCltV9jOJ7Z9OQTQ5H7ApZiJD4vaHBO0Nhkxl4CluLGRJrWfpXWAY22AY3YdGZzCPg+kjBMnzTg6rBG41U17wKUc78nbJ2FFKsv3OaTCAVkQkGJMr8y9xyQGYql+eDHyc0hIOAVhAIKoaBEyC/PPQdkygIyLofIesbjFDnvcyqCV6rd6BmDb5tnrBHgkGFfiWPeknMky/wyoaC8LJnF0NLQ1q/S1KNyqTuV9T91+5ycOuqjZKtMdFS3TsBXJ/3sLjbvoIlEhr+iKk09KSLXNWbU7Dli9w6Fdxu8VD3mXNzqWxNCDhlT5KOjOpejKZqiKteGdZZLa1vcgree83CsyoMk1ukdECuYIqUbtPapXO7RaIqmVlXkZAlePuzmzWe9FLrExr/EBvBr+yx//pvi7z6NGW315aN6p4PTDT4eL1Lyl4V+akny2W/makapX+J0vY/aJwryXwdummju3E7ByWc8nKj24FjnRtdUCK3Y2gIvHizg7Tov23zmmY/cTeevEh8odfDe8z72P7LGK4WgFmgGnjo79mAC9LRBImXgLRAYwM2JNCPx7NZRJHj/hUJeOuRCrIF0NjR/eH9OX0mMqDk7ljU6dhYp+FyC3ls6CTV3AL1a4+ZUvc8S4sshm5DEUCT3THx9XOefIW1Z8gAhv7Tu5Jd6xdqh3gwh8WAFLJuIh59VNsr6ubygrCdnLQ3fNCUYupPmI7tMZAtoH1T55JcEfbd1gHUTYHkITc0afHxhkne+vnuPfK4MYkUYWeqBxs5ZzjVOM7GGDx15C6GBWJq+cZ3PL04T6dU2PAvlrMRWw8owWqjKy1bih3Xg/ybATIts5h77e0CfHsMuXlh6XpseQ5q51bmhFluriGznMlOj3Uom1nuJiiO1+RCxmtSaS7CR0dnqISzOhMOlP/dX3sj3qoGZMRIg1vLlnTeqqVQ8QFDtqI8Nktd9iVWH1vyyx5G9PHmvlWjYQ1eSjrLzkQ5brNu8vmjd5j8p5ZSrSGlFhQAAAABJRU5ErkJggg=='

const completed = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAVCAIAAADNQonCAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH5AMLBwwX+4nSqwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAJHSURBVDjLY/z//z8DJvhxf+fzc3vf3b/z48sXBlYRVjETUR1HMSNDbnZMtYxoRvz4en7m5cUFzx8wMGAazcUg5rpWLzKIlx2XEb8ePpxlemHf63/Y3AUHTCLe2uWrVVQ4MYz4detOq/rly9gsxwRcaqrVF3S0IKYwQcQ+vpxPtH4GBoZvt253BT15y4Aw4u/Vhgu7idYPtXTHhTlrf/2HGvHy/uoJ3/4RoY3fUTl1gqQMAwMjAwMDw+8TIbceQYx4tfLRVSKcwO9p1LFPzyvfommnHMyUpzvOMTAwMfy6tuvzX6QA52dgZ8Oqf5u8BAMDAwODoJuGmzk0TG7v+fqfieHL/a1wT7DqTrGf+d+9b5GYMA79DAx/7086veok1NXPL3/5z8Tw5zdMqUi6aVW2ADsDs3SsRSPMFBF0/Yfr899/hmn5/fY3AxMDCys8kPe/fvIdwoSaohZi1IxbPwMDAysnKwMTA5e0E8zIW7frrW/dQZhi3bkan34GBgYRfS5GJgYObQ8eJniaOX8VyRQ4wK6fgYFd1YWXkYmBQTpAUgEaSVhNwaWfgYFB0skKkrRUVcJCWRmR0y/CFDz6mTTnqGkistnLBy0S58+hJjAuLWkHoy+Hlnz8gi2lscrr9jxQkUPOqV8Pn6+0e/CE2JwiXfLMzFoSo7z4eupKi/ntm4RM4RJSKLhiaCqJq9R68Xpz6eVVSz5+xW4Qj3GPXmaxuDC+gg9S/Lx4fXLFk/PbP94/8Pvrr38ssuxi1vzavjJ2gaLinBiqASi3GGP9B4WjAAAAAElFTkSuQmCC`

const started = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAZCAIAAACgvKk3AAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH5AMLBxQjWCa+RwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAANsSURBVDjLrZVrTFJhGIBfrQOFDpVGIZCUtnKh001rKpndzKZZbt2MplQDLf/U1g9n9d/WZqFdtrQLWDK6aRt1ErGbodWihoaXLPNQgYktQQVTlNOPg9ymE6v35/ue7znf3ud7vw/w/xBjxjdorbJzGMfnw7/FKNYkk9QoOwaBksTaGv0POOvnJ5Krt158sQIAwCSdwwD4O5yl61H1lbtqgw1fwEnNywl5W/6wk81cMnfc+E9tfXXVndcD43jIik1FwrwNkcG6KgVAOIdFnhNuwqC5J5EqWvvtCHVVZmEBP3UpCQDAihnMgCQw6eAvzqp/Kbt2U9VlBmRRXHa+aG/yYrKraMBMAIzlLLI/OFtPQ3Wl7FmvDZ/HTNgrEu3m0oi8ERtjLgsDsPQazYBEMekBs+CG2h9Lq+68NFpxSsQ6oTBvazRtyqnict0k/0QOAEAfNuCYZC6LIM2Ms5va6qVX5W9/2IEamX6kgL8xMiiAKP1uV5wV3+7nnTrHCgQAMOsNFkdgDHMJwHS4ceO7u9duoB9MdiR49bZC0YH1LLL7fDy4cE7W9oueWsyPdma/f/0xpdUHZ/v2XF5Zo/xowefTY7MEoty1DHfDzZ1ysbi2YxBgYTxfsIbk3KynVjdutLtRWiV7qh8BJDxeIDySFUvz+M+wVn7+Up3OggMAmZsr5FGn1UrgBt5fPHOh6ZsVFrLTDhccyIgODfAcAJ2krAztIiYJkKhsYQbDo+qplcANffpsIr6eMH/FMAM7nh1MFE1tN8vFik8jrtX09PydhAFneGklcFH7xFeSmxsfqVTq1sbrrY1S+ork9My00O57EuVHG+5a6qCnHnQZcDbUS6urd5QI3o6jvB0CQ+srFH3YrFXLKtS+yqlxArcBmE4rAHjuHCisuM2ikvOVlaWChFBvWCB3l2gt1Xf2MIMZENaUVl+cM0ghUfFcmnfO0X2/XFzbhA16Jn20+n0FAEJBRnta5Bdb5NWcxOSszKyUGAbJV6u/uLCUwtLjSY72VyoUfabVKC9r6iXhsbyVduOkp1a/cGTuodNF62kAwE3bz03bb9VrVCiqatapXgBAINutdXbcPM72kyXbiGvSGUGcxJyjiTmCPm1Lw3Nd0JYYr6Mz/VPXX1+8Z0/usQrNoGNOT+QMONyqf6PunCMLx/E/Ldg6bRSTl4EAAAAASUVORK5CYII=`

const unstarted = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAVCAIAAADNQonCAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH5AMLBxYOL8+AsAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAD4SURBVDjLY/z/5+6bUxNev//0n4F0wOMgbZHAwvB6zbP7J38xMDMyMZKknfHfn38fbj17EsDC8PcXAwMzh8EKHS050pzwoPzcscMMfxmYGCgGo0aMGkEjI1hI1fDv7w8o6+8v0o34svHOru4PP34jCTGTaMSbY59+/GYSNOXlZGdg+PXn45WvX/8ysrGT6hFmTvUWVSWBf1+239t1hoHVSEiMg5zg/Pdl+/29bR9+iPCa1YlxMpIcnH/fbrh/ee77rwK81tPU5cUZGBgY/z/vvLRv7S/SUoK4gOVsFXlxWIxIRMuqvH71+RNxutkYuXUF1cNFBfnhQgC/1VgP1WI4zAAAAABJRU5ErkJggg==`

let bloburi
fetch(datauri)
  .then(res => res.blob())
  .then(blob => (bloburi = URL.createObjectURL(blob)))

function getAlertIcon() {
  return bloburi
}
