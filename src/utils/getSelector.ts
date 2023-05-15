export function getSelector($dom: TSome<Node>): string {
  function __getDomSelector($dom: Node): string {
    const domTag: string = $dom.nodeName.toLowerCase()
    if ($dom instanceof Element) {
      if ($dom.id) {
        return domTag + `#${$dom.id}`
      } else if ($dom.classList.length) {
        return domTag + `.${Array.from($dom.classList).join('.')}`
      }
      const idx: number = [...($dom.parentNode?.children || [])].findIndex(item => item === $dom)
      if (~idx) {
        return `${domTag}:nth-child(${idx + 1})`
      }
      console.warn('当前选择不准确')
      return domTag
    }
    return ''
  }
  function __getSelectors($dom: TSome<Node>, suffix: string = ''): string {
    if (!$dom || ~suffix.indexOf('#')) {
      return suffix
    }
    return __getSelectors($dom.parentElement, `${__getDomSelector($dom)}>${suffix}`)
  }
  return __getSelectors($dom).slice(0, -1)
}

function __getXPath($dom: TSome<Node>): string {
  if ($dom instanceof Element) {
    if ($dom.id !== '') {
      return `//*[@id="${$dom.id}"]`
    }
    if ($dom === document.body) {
      return $dom.nodeName
    }
    let ix = 0
    let siblings = $dom.parentNode?.childNodes || []
    for (let i = 0; i < siblings.length; i++) {
      let sibling = siblings[i]
      if (sibling === $dom) {
        return `${__getXPath($dom.parentNode)}/${$dom.nodeName}[${ix + 1}]`
      }
      if (sibling.nodeType === 1 && sibling.nodeName === $dom.nodeName) {
        ++ix
      }
    }
    return ''
  }
  return ''
}

export function getXPath($dom: Node): string {
  return __getXPath($dom)
}

export function getDomPath($dom: Node, type: string = 'xpath') {
  if (type === 'xpath') {
    return getXPath($dom)
  } else {
    return getSelector($dom)
  }
}
