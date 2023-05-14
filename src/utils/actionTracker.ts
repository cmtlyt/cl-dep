import { getDomPath } from './getSelector'
import { lazyReport } from './report'
import { getStore } from './store'

/**
 * 手动埋点
 * @param {string} actionType
 * @param {any} data
 * @param {string|number} level
 */
export function tracker(actionType: string, data: any, level: number | string) {
  lazyReport('action', {
    actionType,
    level: level || 4,
    data,
    kind: 'event',
  })
}

export function autoTrackerReport() {
  const eventList: TArray<string> = getStore('config.eventList')
  const selectorType: TSome<string> = getStore('config.selectorType')
  eventList?.forEach((eventName) => {
    document.body.addEventListener(
      eventName,
      function (event) {
        const $dom = event.target as HTMLElement
        const depMsg = $dom?.getAttribute('data-dep-msg')
        const noDep = $dom?.getAttribute('data-no-dep')
        if (noDep !== null && (noDep.length === 0 || ~noDep.indexOf(eventName))) {
          return
        }
        if (depMsg) {
          lazyReport('action', {
            level: 4,
            actionType: eventName,
            message: depMsg,
            kind: 'autoTrackerEvent',
          })
        } else {
          const path = getDomPath($dom, selectorType)
          lazyReport('action', {
            level: 4,
            actionType: eventName,
            path,
            kind: 'autoTrackerEvent',
          })
        }
      },
      {
        capture: true,
        passive: true,
      }
    )
  })
}
