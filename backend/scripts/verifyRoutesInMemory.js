require('dotenv').config({ path: __dirname + '/../.env' });
const app = require('../src/app');

function printRoutes() {
  console.log('--- Registered Express Routes ---');
  const routes = [];

  function processMiddleware(middleware, basePath = '') {
    if (middleware.route) {
      const methods = Object.keys(middleware.route.methods).join(', ').toUpperCase();
      routes.push(`${methods.padEnd(8)} ${basePath}${middleware.route.path}`);
    } else if (middleware.name === 'router' && middleware.handle.stack) {
      let routerPath = '';
      if (middleware.regexp) {
        const match = middleware.regexp.source
          .replace('^\\', '')
          .replace('\\/?(?=\\/|$)', '')
          .replace('?(?=\\/|$)', '')
          .replace(/\\\//g, '/');
        routerPath = match.replace(/^\^/, '').replace(/\$$/, '');
      }
      middleware.handle.stack.forEach((handler) => {
        processMiddleware(handler, routerPath);
      });
    }
  }

  app._router.stack.forEach((m) => processMiddleware(m));

  routes.forEach((r) => console.log('  ✓', r));
  console.log(`\nTotal routes registered: ${routes.length}`);
}

printRoutes();

