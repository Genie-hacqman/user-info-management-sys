const assert = require('node:assert/strict')

const appModule = require('../src/index.js')

async function main() {
  const app = appModule && appModule.app ? appModule.app : null

  assert.ok(app, 'Expected an Express app instance to be exported for smoke testing')
  assert.ok(app.router, 'Expected Express router to be configured')

  const routeLayers = app.router && app.router.stack ? app.router.stack.length : 0
  assert.ok(routeLayers > 0, 'Expected at least one route or middleware layer to be registered')

  console.log('Smoke test passed: backend app initializes successfully')
}

main().catch((error) => {
  console.error('Smoke test failed:', error)
  process.exit(1)
})
