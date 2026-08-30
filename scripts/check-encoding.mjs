import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const INCLUDED_EXTENSIONS = new Set([
  '.css', '.html', '.js', '.json', '.jsx', '.md', '.mdx', '.mjs', '.scss', '.ts', '.tsx', '.txt', '.xml', '.yaml', '.yml',
]);
const IGNORED_DIRECTORIES = new Set([
  '.git', '.next', '.worktrees', 'build', 'coverage', 'dist', 'node_modules', 'out',
]);
const SUSPICIOUS_PREFIXES = new Set([0x00E2, 0x00C2, 0x00C3, 0x00EF, 0x00F0, 0xFFFD]);

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === '.DS_Store') continue;

    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORED_DIRECTORIES.has(entry.name)) files.push(...await collectFiles(absolutePath));
      continue;
    }

    if (INCLUDED_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) files.push(absolutePath);
  }

  return files;
}

const files = await collectFiles(ROOT);
const failures = [];

for (const file of files) {
  const contents = await readFile(file, 'utf8');
  const relativePath = path.relative(ROOT, file);

  if (contents.charCodeAt(0) === 0xFEFF) {
    failures.push(`${relativePath}:1: UTF-8 BOM`);
  }

  for (const [lineIndex, line] of contents.split(/\r?\n/u).entries()) {
    for (let columnIndex = 0; columnIndex < line.length; columnIndex += 1) {
      const codePoint = line.codePointAt(columnIndex);
      if (codePoint === undefined || !SUSPICIOUS_PREFIXES.has(codePoint)) continue;

      const sequence = line.slice(columnIndex, columnIndex + 6);
      failures.push(`${relativePath}:${lineIndex + 1}: ${JSON.stringify(sequence)}`);
    }
  }
}

if (failures.length > 0) {
  console.error('Encoding check failed. Suspected mojibake or BOM found:');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Encoding check passed (${files.length} text files scanned).`);
