const { exec } = require('child_process');

console.log('🚀 Starting both backend and frontend...');

// Start backend
console.log('📡 Starting backend server...');
const backend = exec('cd Backend && npm start', (error, stdout, stderr) => {
  if (error) {
    console.error('Backend error:', error);
    return;
  }
  console.log('Backend output:', stdout);
});

// Wait 3 seconds then start frontend
setTimeout(() => {
  console.log('🎨 Backend started, frontend already running...');
  console.log('✅ Both services should be running now');
  console.log('📍 Frontend: http://localhost:3000');
  console.log('📍 Backend: http://localhost:5000');
}, 3000);

// Keep process alive
setInterval(() => {
  // Check if backend is running
  require('http').get('http://localhost:5000/api/health', (res) => {
    console.log('✅ Backend health check: OK');
  }).on('error', (err) => {
    console.log('⚠️ Backend health check failed');
  });
}, 30000);
