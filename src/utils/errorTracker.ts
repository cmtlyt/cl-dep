import { getDomPath } from './getSelector'
import { lazyReport } from './report'
import { getStore } from './store'

function JSOnError() {
  const oriOnError = window.onerror
  // js异步错误监听
  window.onerror = function (msg, source, row, col, error) {
    if (oriOnError) {
      oriOnError.call(window, msg, source, row, col, error)
    }
    lazyReport('error', {
      message: msg,
      file: source,
      position: `${row}:${col}`,
      level: 0,
      error,
      kind: 'jsError',
    })
  }
}

function promiseError() {
  window.addEventListener(
    'unhandledrejection',
    function (error) {
      lazyReport('error', {
        level: 0,
        message: error.reason,
        error,
        kind: 'promiseError',
      })
    },
    {
      capture: true,
      passive: true,
    }
  )
}

function resourceError() {
  const selectorType = getStore('config.selectorType')
  window.addEventListener(
    'error',
    function (error) {
      const target = error.target
      const isElementTarget =
        target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement
      if (!isElementTarget) {
        return
      }
      console.log(error)
      lazyReport('error', {
        message: `加载${target.nodeName}资源失败`,
        // @ts-expect-error
        file: target.src,
        level: 0,
        error,
        path: getDomPath(target, selectorType),
        kind: 'resourceError',
      })
    },
    {
      capture: true,
      passive: true,
    }
  )
}

export function errorTrackerReport() {
  // js异步错误监听
  JSOnError()
  // promise错误监听
  promiseError()
  // 资源加载错误监听
  resourceError()
}

/**
 * 手动上报一个错误
 * @param {any} error
 * @param {string} msg
 * @param {number|string} level
 * @param {string?} kind
 */
export function errorCaptcher(error: any, msg: string, level: number | string, kind?: string) {
  lazyReport('error', {
    error,
    message: msg,
    level: level || 0,
    kind: kind || 'customError',
  })
}
