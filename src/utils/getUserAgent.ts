function version(str: string, name: string): string {
  if (name === 'safari') name = 'version'
  if (name) {
    return (new RegExp(name + '[\\/ ]([\\d\\w\\.-]+)', 'i').exec(str) && RegExp.$1) || ''
  } else {
    var m = str.match(/version[\/ ]([\d\w\.]+)/i)
    return m && m.length > 1 ? m[1] : ''
  }
}

const operatingSystems: IObject<RegExp> = {
  iPad: /ipad/i,
  iPhone: /iphone/i,
  'Windows Vista': /windows nt 6\.0/i,
  'Windows 10': /windows nt 10\.0/i,
  'Windows 7': /windows nt 6\.\d+/i,
  'Windows 2003': /windows nt 5\.2+/i,
  'Windows XP': /windows nt 5\.1+/i,
  'Windows 2000': /windows nt 5\.0+/i,
  'OS X $1.$2': /os x (\d+)[._](\d+)/i,
  Linux: /linux/i,
  Googlebot: /googlebot/i,
}

const osNames: TArray<string> = Object.keys(operatingSystems)

function os(str: string): string {
  let captures: TSome<string>
  for (let i = 0, len = osNames.length; i < len; ++i) {
    if ((captures = operatingSystems[osNames[i]].exec(str))) {
      return ~osNames[i].indexOf('$1')
        ? osNames[i].replace(/\$(\d+)/g, function (_, n) {
            return captures[n]
          })
        : osNames[i]
    }
  }
  return ''
}

const names = ['opera', 'konqueror', 'firefox', 'chrome', 'epiphany', 'safari', 'msie', 'curl']

function name(str: string): string {
  str = str.toLowerCase()
  for (var i = 0, len = names.length; i < len; ++i) {
    if (str.indexOf(names[i]) !== -1) return names[i]
  }
  return ''
}

export default function parse(str: string) {
  const agent = { full: str, name: name(str), os: os(str), version: '', fullName: '' }
  agent.version = version(str, agent.name)
  agent.fullName = agent.name + ' ' + agent.version
  return agent
}
