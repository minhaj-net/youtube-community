require('dotenv').config({ path: __dirname + '/../.env' });
const app = require('../src/app');
const http = require('http');

async function test() {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5099, '127.0.0.1', resolve));

  try {
    const res = await fetch('http://127.0.0.1:5099/api/v1/health');
    console.log('Health check status:', res.status);
    const data = await res.json();
    console.log('Health check data:', data);

    const userReg = await fetch('http://127.0.0.1:5099/api/v1/auth/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    });
    console.log('User reg status:', userReg.status);
    console.log('User reg data:', await userReg.json());

    const adminDash = await fetch('http://127.0.0.1:5099/api/v1/admin/dashboard');
    console.log('Admin dashboard status without token:', adminDash.status);
    console.log('Admin dashboard data:', await adminDash.json());

    const userOrders = await fetch('http://127.0.0.1:5099/api/v1/orders/my-orders');
    console.log('User orders status without token:', userOrders.status);
    console.log('User orders data:', await userOrders.json());
  } catch (err) {
    console.error('Error in fetch:', err);
  } finally {
    server.close();
  }
}

test();
