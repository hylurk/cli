#! /usr/bin/env node

const program = require('commander')
const minimist = require('minimist') // 按照特定语法格式化 process.argv ，会将输入的参数映射成 option: boolean 语法
const chalk = require('chalk') // 5.0+ 版本只支持 ESM 格式引入

program
  .version(`ilurk-cli ${require('../package').version}`) // 读取当前包版本
  .usage('<command> [options]') // 声明语法格式

program
  .command('create <app-name>') // 指定命令为 create xxx ，xxx 为必传
  .description('create a new project powered by ilurk-cli') // 当前命令的功能描述
  .option('-p, --preset <presetName>', 'Skip prompts and use saved or remote preset')
  // .option('-d, --default', 'Skip prompts and use default preset')
  // .option('-i, --inlinePreset <json>', 'Skip prompts and use inline JSON string as preset')
  // .option('-m, --packageManager <command>', 'Use specified npm client when installing dependencies')
  // .option('-r, --registry <url>', 'Use specified npm registry when installing dependencies (only for npm)')
  // .option('-g, --git [message]', 'Force git initialization with initial commit message')
  // .option('-n, --no-git', 'Skip git initialization')
  .option('-f, --force', 'Overwrite target directory if it exists')
  .option('--merge', 'Merge target directory if it exists')
  .option('-c, --clone', 'Use git clone when fetching remote preset')
  // .option('-x, --proxy <proxyUrl>', 'Use specified proxy when creating project')
  // .option('-b, --bare', 'Scaffold project without beginner instructions')
  // .option('--skipGetStarted', 'Skip displaying "Get started" instructions')
  .action((name, options) => {
    // 如果只是加上了参数 -f ，这样 options 里会增加一个属性 { force: true }
    // 如果是 -p myOptions ，这样 options 里会增加一个属性 { preset: myOptions }
    if (minimist(process.argv.slice(3))._.length > 1) {
      // 如果输入了多个 app-name 则只会使用第一个，其余的将被忽略
      console.log(chalk.yellow('\n Info: You provided more than one argument. The first one will be used as the app\'s name, the rest are ignored.'))
    }
    // // --git makes commander to default git to true
    // if (process.argv.includes('-g') || process.argv.includes('--git')) {
    //   options.forceGit = true
    // }
    // 执行 create 命令
    require('../lib/create')(name, options)
  })

// 解析用户执行命令时传入的参数
program.parse(process.argv)