let sessionCached

module.exports = async function getVersions () {
  if (sessionCached) {
    return sessionCached
  }
  const local = require('../../package.json').version
  // 简化流程，我们直接获取当前 CLI 在 npm 上的最新版本，与本地版本进行比较
  return (sessionCached = {
    current: local
  })
}
