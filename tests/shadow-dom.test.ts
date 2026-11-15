import { expect, test, vi } from 'vite-plus/test'
import scrollIntoView from '../src'

// https://github.com/scroll-into-view/smooth-scroll-into-view-if-needed/issues/1042
test('scrolls to targets inside a shadow root', async () => {
  const host = document.createElement('div')
  document.body.append(host)
  const target = document.createElement('div')
  host.attachShadow({ mode: 'open' }).append(target)
  target.getBoundingClientRect = () => DOMRect.fromRect({ y: 500, height: 10 })
  // jsdom has no layout, so make the page tall enough to scroll to the target
  const html = document.documentElement
  vi.spyOn(html, 'scrollHeight', 'get').mockReturnValue(2000)
  vi.spyOn(html, 'clientHeight', 'get').mockReturnValue(window.innerHeight)

  await expect(
    scrollIntoView(target, {
      behavior: 'smooth',
      block: 'start',
      scrollMode: 'always',
      duration: 1,
    })
  ).resolves.toEqual([
    { el: document.documentElement, top: [0, 500], left: [0, 0] },
  ])
})
