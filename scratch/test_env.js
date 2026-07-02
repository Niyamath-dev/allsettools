// scratch/test_env.js
const { loadEnvConfig } = require('@next/env');

const projectDir = process.cwd();
const { combinedEnv } = loadEnvConfig(projectDir);

console.log("Loaded ADMIN_PASSWORD:", combinedEnv.ADMIN_PASSWORD);
console.log("Length:", combinedEnv.ADMIN_PASSWORD ? combinedEnv.ADMIN_PASSWORD.length : 0);
