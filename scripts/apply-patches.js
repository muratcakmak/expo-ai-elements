/**
 * Simple patch applier for bun (patch-package doesn't support bun.lock).
 * Reads patches from ./patches/ and applies them with `git apply`.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const patchDir = path.resolve(__dirname, '..', 'patches');
if (!fs.existsSync(patchDir)) process.exit(0);

const patches = fs.readdirSync(patchDir).filter(f => f.endsWith('.patch'));
for (const patch of patches) {
  const patchPath = path.join(patchDir, patch);
  try {
    execSync(`git apply --check ${patchPath}`, { cwd: path.resolve(__dirname, '..'), stdio: 'pipe' });
    execSync(`git apply ${patchPath}`, { cwd: path.resolve(__dirname, '..'), stdio: 'pipe' });
    console.log(`✓ Applied ${patch}`);
  } catch {
    // Patch already applied or doesn't apply cleanly — skip
    console.log(`⊘ Skipped ${patch} (already applied or not applicable)`);
  }
}
