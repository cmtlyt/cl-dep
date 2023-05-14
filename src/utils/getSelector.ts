function __getDomSelector($dom: Node) {
  const domTag = $dom.nodeName.toLowerCase()
  if ($dom instanceof Element) {
    if ($dom.id) {
      return domTag + `#${$dom.id}`
    } else if ($dom.classList.length) {
      return domTag + `.${Array.from($dom.classList).join('.')}`
    }
  }
  return domTag
}

function __getSelectors($dom: TSome<Node>, suffix: string = ''): string {
  if (!$dom || ~suffix.indexOf('#')) {
    return suffix
  }
  return __getSelectors($dom.parentElement, `${__getDomSelector($dom)}>${suffix}`)
}

export function getSelector($dom: Node) {
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
