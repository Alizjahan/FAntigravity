#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import picocolors from 'picocolors';
import figlet from 'figlet';

import {
    patchApp,
    restoreApp,
    getAppAsarPath,
    detectAppAsarPath,
    hasAppBackup
} from './patch-app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { cyan, bold, blue, green, yellow } = picocolors;

const pkgPath = path.join(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

function printBanner() {
    try {
        const cols = process.stdout.columns || 100;
        const useSmall = cols < 88;

        const font1 = useSmall ? 'Small' : 'Standard';
        const font2 = useSmall ? 'Small Slant' : 'Slant';

        const topLines = figlet.textSync('FAntigravity', { font: font1 }).split('\n').filter(l => l.trim().length > 0);
        const subLines = figlet.textSync('(Antigravity RTL)', { font: font2 }).split('\n').filter(l => l.trim().length > 0);

        const hexColors = ['#3387FF', '#F25041', '#DFAC2A', '#91C45B'];
        const colors = hexColors.map(hex => {
            const bigint = parseInt(hex.replace('#', ''), 16);
            return {
                r: (bigint >> 16) & 255,
                g: (bigint >> 8) & 255,
                b: bigint & 255
            };
        });

        const applyGradient = (text) => {
            let result = '';
            const len = text.length;
            for (let i = 0; i < len; i++) {
                const char = text[i];
                if (char === ' ' || char === '\n') {
                    result += char;
                    continue;
                }
                const factor = len > 1 ? i / (len - 1) : 0;
                const segments = colors.length - 1;
                const segmentFloat = factor * segments;
                const segmentIdx = Math.min(Math.floor(segmentFloat), segments - 1);
                const segmentFactor = segmentFloat - segmentIdx;

                const cStart = colors[segmentIdx];
                const cEnd = colors[segmentIdx + 1];

                const r = Math.round(cStart.r + segmentFactor * (cEnd.r - cStart.r));
                const g = Math.round(cStart.g + segmentFactor * (cEnd.g - cStart.g));
                const b = Math.round(cStart.b + segmentFactor * (cEnd.b - cStart.b));

                result += `\x1b[38;2;${r};${g};${b}m${char}\x1b[0m`;
            }
            return result;
        };

        const maxW = Math.max(...subLines.map(l => l.length));
        const topW = Math.max(...topLines.map(l => l.length));
        const pad = Math.max(0, Math.floor((maxW - topW) / 2));

        console.log('');
        for (const line of topLines) {
            console.log(' '.repeat(pad) + applyGradient(line));
        }
        console.log('');
        for (const line of subLines) {
            console.log(applyGradient(line));
        }
        console.log('');
        console.log(`\x1b[2m  FAntigravity (RTL) - Developed by Aliz | v${pkg.version}\x1b[0m\n`);
    } catch (err) {
        console.log(bold(cyan(`\nFAntigravity (Antigravity RTL) v${pkg.version} Developed by Aliz\n`)));
    }
}

printBanner();

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
    console.log(`Usage:
  npx -y -p github:Alizjahan/FAntigravity-App-RTL-Persian-Arabic fantigravity [options] [path]

Options:
  -r, --restore      Revert changes and restore original backup app.asar
  --path <asarFile>  Specify custom path to app.asar
  -h, --help         Show this help message

Description:
  Automated Persian & Arabic Right-to-Left (RTL) and typography patcher for Google Antigravity.
`);
    process.exit(0);
}

const isRestore = args.includes('--restore') || args.includes('-r');

// Find custom path argument if provided e.g. --path /foo/bar or last positional argument
let customPath = null;
const pathArgIdx = args.indexOf('--path');
if (pathArgIdx !== -1 && args[pathArgIdx + 1]) {
    customPath = args[pathArgIdx + 1];
} else {
    const nonFlags = args.filter(a => !a.startsWith('-'));
    if (nonFlags.length > 0) {
        customPath = nonFlags[0];
    }
}

async function main() {
    const targetPath = customPath || await getAppAsarPath();

    if (isRestore) {
        if (!hasAppBackup(targetPath)) {
            console.log(yellow('⚠ No backup file found to restore.\n'));
            process.exit(1);
        }
        console.log(blue(`ℹ Restoring Antigravity from backup...\n`));
        await restoreApp(targetPath);
    } else {
        console.log(blue(`ℹ Patching Antigravity...\n`));
        await patchApp(targetPath);
    }
}

main().catch(e => {
    console.error('\n✖ An unexpected error occurred:', e.message);
    process.exit(1);
});
