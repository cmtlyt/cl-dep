import { setStore } from '../utils/store'
import { errorTrackerReport } from '../utils/errorTracker'
import { routerTrackerReport } from '../utils/routerTracker'
import { autoTrackerReport } from '../utils/actionTracker'

function __loadConfig(options: IConfig) {
  options = Object.assign(
    {},
    {
      appId: '',
      userId: '',
      reportURL: '',
      autoTracker: false,
      delay: 0,
      routerType: false,
      errorReport: true,
      cacheLimit: 10,
      reportLevelFilter: [],
      eventList: ['click', 'touchstart', 'mousedown'],
      selectorType: 'xpath',
    },
    options,
  )
  setStore('config', options)
  const { errorReport, routerType, autoTracker } = options
  // 开启错误监听
  if (errorReport) {
    errorTrackerReport()
  }
  // 自动埋点
  if (autoTracker) {
    window.addEventListener('DOMContentLoaded', function () {
      autoTrackerReport()
    })
  }
  // 路由埋点 pv统计
  if (routerType) {
    routerTrackerReport(routerType)
  }
}

/**
 * 加载初始化配置
 * @param {object} options
 * @param {string} options.appId default '',
 * @param {string} options.userId default '',
 * @param {string} options.reportURL default '',
 * @param {boolean} options.autoTracker default false,
 * @param {number} options.delay default 0,
 * @param {boolean} options.routerType default false,
 * @param {boolean} options.errorReport default true,
 * @param {number} options.cacheLimit default 10,
 * @param {any} options.reportLevelFilter default [],
 * @param {string[]} options.eventList default ['click', 'touchstart', 'mousedown'],
 * @param {string} options.selectorType default 'xpath',
 * @param {function?} options.reportFilter
 * @param {function?} options.generateLogItem
 *
 * ### options.selectorType 可选值
 * - xpath
 * - selector
 *
 * 默认值为 xpath
 *
 * ### options.delay 单位为毫秒
 *
 * ### cacheLimit 默认值为 10
 */
export function loadConfig(options: IConfig) {
  __loadConfig(options)
}
