// run-jest.js
import { spawn } from 'child_process';

const jestProcess = spawn('cross-env', ['NODE_OPTIONS=--experimental-vm-modules', 'jest', '--config=./jest.config.cjs'], { stdio: 'inherit', shell: true });

jestProcess.on('error', (err) => {
  console.error(`Error: ${err.message}`);
});

jestProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`Jest process exited with code ${code}`);
  }
});
