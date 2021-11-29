const path = require('path')
const fs = require('fs-extra')

module.exports = async function loadPresetFromDir (dir) {
  const presetPath = path.join(dir, 'preset.json')
  if (!fs.existsSync(presetPath)) {
    throw new Error('remote / local preset does not contain preset.json!')
  }
  const preset = await fs.readJSON(presetPath)

  
}