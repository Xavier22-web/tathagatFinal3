#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting services...');

// Start backend
console.log('📡 Starting backend server...');
const backend = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'Backend'),
  stdio: 'inherit'
});

backend.on('error', (err) => {
  console.error('❌ Backend error:', err);
});

// Wait a bit before starting frontend
setTimeout(() => {
  console.log('🎨 Starting frontend server...');
  const frontend = spawn('npm', ['start'], {
    cwd: path.join(__dirname, 'Frontend'),
    stdio: 'inherit'
  });

  frontend.on('error', (err) => {
    console.error('❌ Frontend error:', err);
  });
}, 3000);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down services...');
  backend.kill();
  process.exit();
});
