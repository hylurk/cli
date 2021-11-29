const EventEmitter = require('events')
const path = require('path')
const {
  defaults,
  loadOptions
} = require('./options')

module.exports = class Creator extends EventEmitter {
  constructor (name, context) {
    super()

    this.name = name
    this.context = context

    // this.run = this.run.bind(this)
  }

  async create (cliOptions = {}, preset = null) {
    const { run, name, context } = this

    // 如果没有传入预设
    if (!preset) {
      if (cliOptions.preset) { // 如果加了 -p name 参数，则直接采用之前保存的 name 预设来创建项目
        preset = await this.resolvePreset(cliOptions.preset, cliOptions.clone)
      } else if (cliOptions.default) { // 如果加了 -d 参数，直接采用默认的配置
        preset = defaults.presets.default
      }
    }
  }

  async resolvePreset (name, clone) {
    let preset
    const savedPresets = this.getPresets()
    if (name in savedPresets) {
      preset = savedPresets[name]
    } else if (name.endsWith('.json') || /^\./.test(name) || path.isAbsolute(name)) { // 处理变态的名字
      // preset = await 
    }
  }

  // 获取 presets，将默认的与预设的进行合并
  getPresets () {
    const savedPresets = loadOptions()
    return Object.assign({}, savedPresets.presets, defaults.presets)
  }
}