#!/usr/bin/env node
/**
 * DevVerse AI - Setup Verification Script
 * Checks if all dependencies and tools are installed correctly
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n🔍 DevVerse AI - Setup Verification\n');
console.log('=====================================\n');

const checks = [];

// Helper to run command and capture output
function checkCommand(cmd, name) {
  try {
    execSync(cmd, { stdio: 'pipe' });
    return true;
  } catch (e) {
    return false;
  }
}

// Check Node.js
const nodeVersion = checkCommand('node --version', 'Node.js');
checks.push({
  name: 'Node.js 18+',
  status: nodeVersion,
  command: 'node --version',
});

// Check pnpm
const pnpmVersion = checkCommand('pnpm --version', 'pnpm');
checks.push({
  name: 'pnpm 9+',
  status: pnpmVersion,
  command: 'pnpm --version',
});

// Check npm
const npmVersion = checkCommand('npm --version', 'npm');
checks.push({
  name: 'npm',
  status: npmVersion,
  command: 'npm --version',
});

// Check PostgreSQL
const postgresVersion = checkCommand('psql --version', 'PostgreSQL');
checks.push({
  name: 'PostgreSQL 15+',
  status: postgresVersion,
  command: 'psql --version',
});

// Check Redis
const redisVersion = checkCommand('redis-cli --version', 'Redis');
checks.push({
  name: 'Redis 7+',
  status: redisVersion,
  command: 'redis-cli --version',
});

// Check Git
const gitVersion = checkCommand('git --version', 'Git');
checks.push({
  name: 'Git',
  status: gitVersion,
  command: 'git --version',
});

// Check Python (optional)
const pythonVersion = checkCommand('python --version', 'Python');
checks.push({
  name: 'Python 3.8+ (Optional)',
  status: pythonVersion,
  command: 'python --version',
});

// Check Docker (optional)
const dockerVersion = checkCommand('docker --version', 'Docker');
checks.push({
  name: 'Docker (Optional)',
  status: dockerVersion,
  command: 'docker --version',
});

// Display results
checks.forEach((check) => {
  const status = check.status ? '✅' : '❌';
  const optional = check.name.includes('Optional') ? ' (OPTIONAL)' : '';
  console.log(`${status} ${check.name}${optional}`);
});

// Summary
const required = checks.filter((c) => !c.name.includes('Optional'));
const passed = required.filter((c) => c.status).length;
const total = required.length;

console.log('\n=====================================');
console.log(`\n✅ Passed: ${passed}/${total} required tools\n`);

if (passed === total) {
  console.log('🎉 All dependencies are installed! Ready to start development.\n');
  console.log('📖 Next steps:');
  console.log('  1. node initialize-project.js');
  console.log('  2. pnpm install');
  console.log('  3. pnpm dev\n');
} else {
  console.log('⚠️  Please install missing dependencies:\n');

  if (!nodeVersion) {
    console.log('  • Node.js 18+: https://nodejs.org');
  }
  if (!pnpmVersion) {
    console.log('  • pnpm 9+: npm install -g pnpm');
  }
  if (!postgresVersion) {
    console.log('  • PostgreSQL 15+: https://www.postgresql.org/download');
  }
  if (!redisVersion) {
    console.log('  • Redis 7+: https://redis.io/download');
  }
  if (!gitVersion) {
    console.log('  • Git: https://git-scm.com/download');
  }
  console.log();
}
