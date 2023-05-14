// 空类型
type TEmpty = undefined | null
// 可为空类型
type TSome<T> = Empty | T
// 数组
type TArray<T> = T[]
// 元组
type TTuple<T extends TArray<unknown>> = T
// 对象
interface IObject<T> extends Object {
  [key: string]: T
}

interface IConfig {
  appId: string
  userId: string
  reportURL: string
  autoTracker: boolean
  delay: number
  routerType: boolean | string
  errorReport: boolean
  cacheLimit: number
  reportLevelFilter: TArray<string | number>
  eventList: TArray<string>
  selectorType: string
}

interface IUserAgent {
  version: string
  os: string
  name: string
  full: string
  fullName: string
}

interface ILogItem {
  appID: string
  userID: string
  kind: string
  type: string
  url: string
  level: number
  message: string | Event
  filename?: string
  position: string
  stack: string
  selector: string
  title?: string
  url?: string
  timestamp?: number
  userAgent?: IUserAgent
  currentPage?: string
  other?: any
}
