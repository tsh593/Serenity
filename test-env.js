// test-env.js - UPDATED FOR ES MODULES
import dotenv from 'dotenv';
dotenv.config();

console.log('🔍 Environment Debug:');
console.log('ASYNC_API_KEY:', process.env.ASYNC_API_KEY ? '✅ EXISTS' : '❌ MISSING');
console.log('SPEECHMATICS_API_KEY:', process.env.SPEECHMATICS_API_KEY ? '✅ EXISTS' : '❌ MISSING');
console.log('All env vars:', process.env);