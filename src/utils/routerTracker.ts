import { lazyReport } from './report'

const beforeInfo = { time: 0, page: '' }

function getStayTime() {
  let currTime: number = Date.now()
  let stayTime: number = currTime - beforeInfo.time
  beforeInfo.time = currTime
  return stayTime
}

function listener() {
  const stayTime = getStayTime()
  const currentPage = window.location.href
  lazyReport('visit', {
    stayTime,
    level: 4,
    page: beforeInfo.page,
  })
  beforeInfo.page = currentPage
}

function createHistoryEvent(name: string) {
  // @ts-expect-error
  const origin = window.history[name]
  return function (this: any, event: any) {
    if (name === 'replaceState') {
      const { current } = event
      const pathName = location.pathname
      if (current === pathName) {
        let res = origin.apply(this, arguments)
        return res
      }
    }
    let res = origin.apply(this, arguments)
    let e = new Event(name)
    // @ts-expect-error
    e.arguments = arguments
    window.dispatchEvent(e)
    return res
  }
}

function __routerTrackerReport(eventName: string) {
  window.history.pushState = createHistoryEvent('pushState')
  window.history.replaceState = createHistoryEvent('replaceState')
  ;['load', 'unload', 'pushState', 'replaceState', eventName].forEach((eventName) => {
    window.addEventListener(eventName, function () {
      listener()
    })
  })
}

function hashRouterTrackerReport() {
  __routerTrackerReport('hashchange')
}

function historyRouterTrackerReport() {
  __routerTrackerReport('popstate')
}

export function routerTrackerReport(type: string | boolean) {
  if (type && typeof type === 'string') {
    if (type === 'history') {
      historyRouterTrackerReport()
    } else if (type === 'hash') {
      hashRouterTrackerReport()
    } else {
      console.error(`暂不支持${type}类型的路由`)
    }
  }
}
