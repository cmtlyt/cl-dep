const store: IObject<any> = {}
const logCache: TArray<ILogItem> = []
const oldCache: TArray<ILogItem> = []

export function setStore(key: string, value: any) {
  return (store[key] = value)
}

export function getStore(key: string): any {
  let tempStore = store
  const keyPath = key.split('.')
  keyPath.forEach((key) => {
    tempStore = tempStore?.[key]
  })
  return tempStore
}

export function addLogCache(logParams: ILogItem) {
  return logCache.push(logParams)
}

export function getLogCache(): TArray<ILogItem> {
  const reportLevelFilter = getStore('config.reportLevelFilter')
  return logCache.filter((logItem) => ~reportLevelFilter.indexOf(logItem.level))
}

export function clearLogCache() {
  oldCache.concat(logCache.splice(0))
}

/**
 * 返回本次所有的日志记录
 * @returns {array}
 */
export function getAllLog() {
  return JSON.parse(JSON.stringify(oldCache))
}
