### 0.1.1

- `errorCaptcher` 手动错误上报
- `tracker` 手动埋点
- `loadConfig` 加载配置
- `getAllLog` 获取本次运行记录的所有日志

```javascript
/**
 *
 * @param {object?} options
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
loadConfig(options)

/**
 * 手动上报一个错误
 * @param {any} error
 * @param {string} msg
 * @param {number|string} level
 * @param {string?} kind
 */
errorCaptcher(error, msg, level, kind)

/**
 * 手动埋点
 * @param {string} actionType
 * @param {any} data
 * @param {string|number} level
 */
tracker(actionType, data, level)

/**
 * 返回本次所有的日志记录
 * @returns {array}
 */
getAllLog()
```
