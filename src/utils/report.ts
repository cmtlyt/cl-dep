import { getStore, addLogCache, getLogCache, clearLogCache } from './store'
import getUserAgent from './getUserAgent'
import getStackLink from './getStackLine'

let timer: TSome<number>

function generateLogItem(type: string, data: any): ILogItem {
  const appID = getStore('config.appID')
  const userID = getStore('config.userID')
  const { kind, message, position, level, ..._other } = data
  const { error, file, _message, path, ...other } = _other
  return {
    kind,
    type,
    appID,
    position,
    stack: getStackLink(error?.stack || ''),
    selector: path,
    userID,
    level,
    filename: file,
    other,
    message: message || _message,
    timestamp: new Date().getTime(),
    currentPage: location.href,
    userAgent: getUserAgent(navigator.userAgent),
  }
}

export function lazyReport(type: string, data: any) {
  const delay = getStore('config.delay')
  const cacheLimit = getStore('config.cacheLimit')

  const logParams: ILogItem = generateLogItem(type, data)

  addLogCache(logParams)

  const cache = getLogCache()
  console.log('cache', cache)

  if (cacheLimit) {
    // 如果存在缓存上限,则优先判断缓存上线
    if (cache.length >= cacheLimit) {
      // 判断是否延迟提交
      if (delay === 0) {
        report(cache)
      } else if (delay > 0) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          report(cache)
        }, delay)
      } else {
        report(cache)
        clearTimeout(timer)
      }
    }
  } else if (delay > 0) {
    // 没有缓存上线则判断是否需要延迟提交
    clearTimeout(timer)
    timer = setTimeout(() => {
      report(cache)
    }, delay)
  } else {
    report(cache)
  }
}

export function report(data: TArray<ILogItem>) {
  const reportURL = getStore('config.reportURL')
  if (navigator.sendBeacon) {
    navigator.sendBeacon(reportURL, JSON.stringify(data))
  } else {
    let $img: TSome<HTMLImageElement> = new Image()
    $img.src = `${reportURL}?logs=${JSON.stringify(data)}`
    $img = null
  }
  clearLogCache()
}
