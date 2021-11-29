const chalk = require('chalk')
const readline = require('readline') // 这是个神奇的包，你会发现引用的方法并不在包里，而是在 TypeScript 的 type 里，什么鬼，看不懂了
const getVersions = require('./getVersions')

exports.generateTitle = async function (checkUpdate) {
  console.log(checkUpdate)
  const { current } = await getVersions()
  let title = chalk.bold.blue(`Ilurk CLI v${current}`)
  return title
}

exports.clearConsole = async function clearConsoleWithTitle (checkUpdate) {
  const title = await exports.generateTitle(checkUpdate)
  // 判断是否运行在终端中
  if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows) // 创建与终端窗口行数等量的换行符
    console.log(blank) // 将这些换行符插入到终端中，将之前的 logger 顶到上面看不到的地方去
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
    if (title) {
      console.log(title)
    }
  }
}