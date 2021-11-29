const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer') // 用来实现用户可交互的命令
const validateProjectName = require('validate-npm-package-name') // 校验项目名称是否合法
const { clearConsole } = require('./utils/clearConsole')
const Creator = require('./Creator')

// 使用 async 和 await 来执行创建命令
async function create (projectName, options) {
  const cwd = options.cwd || process.cwd() // 获取 Node.js 进程的当前工作目录
  const inCurrent = projectName === '.' // 如果输入的 app-name 是 . ，则表示在当前目录创建项目
  const name = inCurrent ? path.relative('../', cwd) : projectName // 如果输入的 app-name 是 . ，项目名称就是当前所在文件夹名称
  const targetDir = path.resolve(cwd, projectName || '.') // 获取当前文件目录

  // 校验项目名称是否合法
  const result = validateProjectName(name)
  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: '${name}'`))
    // 打印非法原因
    result.errors && result.errors.forEach(err => {
      console.error(chalk.red.dim('Error: ' + err))
    })
    result.warnings && result.warnings.forEach(warn => {
      console.error(chalk.red.dim('Warning: ' + warn))
    })
    process.exit(1) // 退出进程
  }

  // 判断文件夹是否存在，并根据参数询问是否覆盖
  if(fs.existsSync(targetDir) && !options.merge) {
    if (options.force) {
      // 如果用户选择了 force ，则直接移除已存在的文件夹
      await fs.remove(targetDir)
    } else {
      await clearConsole()
      if (inCurrent) { // 如果是在当前文件夹，进行提示即可
        const { ok } = await inquirer.prompt([
          {
            name: 'ok',
            type: 'confirm',
            message: 'Generate project in current directory?'
          }
        ])
        if (!ok) {
          return
        }
      } else { // 如果已经存在了要创建的项目，则询问用户选择覆盖还是合并？
        const { action } = await inquirer.prompt([
          {
            name: 'action',
            type: 'list',
            message: `Target directory ${chalk.cyan(targetDir)} already exists. Pick an action:`,
            choices: [
              { name: 'Overwirte', value: 'overwrite' },
              { name: 'Merge', value: 'merge' },
              { name: 'Cancel', value: false }
            ]
          }
        ])
        if (!action) {
          return
        } else if (action === 'overwrite') {
          console.log(`\nRemoving ${chalk.cyan(targetDir)}...`)
          await fs.remove(targetDir)
        }
      }
    }
  }

  // 创建 creator 实例
  const creator = new Creator(name, targetDir)
  // 真正去创建项目
  console.log(options)
  await creator.create(options)
}

module.exports = (...args) => {
  return create(...args).catch(err => {
    console.log(err)
  })
}