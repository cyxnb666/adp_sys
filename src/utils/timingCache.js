const oldTime = localStorage.getItem('adp-time')
console.log('adp-time', oldTime)

if (!oldTime) {
  setTime()
}
if (oldTime) {
  const d = new Date(oldTime)
  const now = new Date()
  const diff = (now - d) / 1000

  if (diff > 3600 * 24 * 2) { // 一天前
    clearLocalItem()
    setTime()
  }
}

function setTime() {
  const time = new Date()
  localStorage.setItem('adp-time', time)
}

function clearLocalItem() {
  localStorage.removeItem('ListByField')
  localStorage.removeItem('BaseTypeExpressionList')
  localStorage.removeItem('CodeService')
  localStorage.removeItem('IdExpressionList')
}
