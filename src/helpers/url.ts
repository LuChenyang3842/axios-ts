/**
 * @fileoverview: Mainly focus on building url
 * @description: Achieves following requirements:
 * - assemble the params
 * - when params are array
 * - when params are object
 * - when params are date type
 * - ignore null or undefined value
 * - reserve the origin params in url
 * - ignore hash tag
 * - support special letters like @, ', +, etc
 *
 */

import { isDate, isPlainObject } from './utils'

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildUrl(url: string, params?: any) {
  if (!params) {
    return url
  }

  const parts: string[] = []
  Object.keys(params).forEach(key => {
    let val = params[key]
    if (val === null || val === undefined) {
      return
    }
    let values: string[]
    if (Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      values = [val]
    }
    // note: here we only consider 1-d array
    values.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val)
      }
    })
    parts.push(`${encode(key)}=${encode(val)}`)
  })

  let serializedParams = parts.join('&')

  if (serializedParams) {
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex) // eliminate hash tag
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams // keep the old url
  }

  return url
}
