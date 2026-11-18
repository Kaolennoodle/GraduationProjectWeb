export function formatDate(date: Date, fmt: string): string {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substring(4 - RegExp.$1.length))
  }
  const o: Record<string, number> = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = String(o[k])
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero(str: string): string {
  return ('00' + str).substring(str.length)
}

export function getLabel(list: Array<{ label: string; value: any }>, value: any): string {
  const item = list.find((i) => i.value === value)
  return item ? item.label : String(value)
}

const campusDateFormatter = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai' })
const campusTimeFormatter = new Intl.DateTimeFormat('zh-CN', {
  timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
})

export function campusDay(value: string) {
  return campusDateFormatter.format(new Date(value))
}

export function campusTime(value: string) {
  return campusTimeFormatter.format(new Date(value))
}
