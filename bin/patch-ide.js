import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import picocolors from 'picocolors';
import ora from 'ora';
import prompts from 'prompts';

import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { blue, green, red, yellow } = picocolors;

function idePaths(appDir) {
    const outDir = path.join(appDir, 'out');
    const wbDir = path.join(outDir, 'vs', 'code', 'electron-browser', 'workbench');
    const mainJsPath = path.join(outDir, 'main.js');
    const workbenchHtml = path.join(wbDir, 'workbench.html');
    const jetskiHtml = path.join(wbDir, 'workbench-jetski-agent.html');
    return {
        outDir, wbDir, mainJsPath, workbenchHtml, jetskiHtml,
        mainJsBak: mainJsPath + '.rtl-bak',
        workbenchHtmlBak: workbenchHtml + '.rtl-bak',
        jetskiHtmlBak: jetskiHtml + '.rtl-bak'
    };
}

function getIdeCandidatePaths() {
    const candidates = [];
    const platform = os.platform();

    if (platform === 'darwin') {
        candidates.push('/Applications/Antigravity IDE.app');
        candidates.push(path.join(os.homedir(), 'Applications', 'Antigravity IDE.app'));
    } else if (platform === 'win32') {
        // 1. Check currently running Antigravity IDE process
        try {
            const procCmd = 'powershell -NoProfile -Command "(Get-Process -Name \'Antigravity IDE\' -ErrorAction SilentlyContinue | Select-Object -First 1).Path"';
            const procPath = execSync(procCmd, { encoding: 'utf8', timeout: 3000 }).trim();
            if (procPath && fs.existsSync(procPath)) {
                candidates.push(path.dirname(procPath));
            }
        } catch (_) {}

        // 2. Standard AppData locations
        if (process.env.LOCALAPPDATA) {
            candidates.push(path.join(process.env.LOCALAPPDATA, 'Programs', 'Antigravity IDE'));
            candidates.push(path.join(process.env.LOCALAPPDATA, 'Programs', 'antigravity-ide'));
            candidates.push(path.join(process.env.LOCALAPPDATA, 'Antigravity IDE'));
        }

        // 3. Scan all system drives (C, D, E, F, G)
        const driveLetters = ['C', 'D', 'E', 'F', 'G'];
        for (const drive of driveLetters) {
            candidates.push(`${drive}:\\Program Files\\Antigravity IDE`);
            candidates.push(`${drive}:\\Program Files (x86)\\Antigravity IDE`);
            candidates.push(`${drive}:\\Program Files\\antigravity-ide`);
            candidates.push(`${drive}:\\Program Files (x86)\\antigravity-ide`);
            candidates.push(`${drive}:\\Antigravity IDE`);
            candidates.push(`${drive}:\\antigravity-ide`);
        }
    } else {
        // Linux candidates
        candidates.push(path.join(os.homedir(), 'Downloads', 'Antigravity IDE'));
        candidates.push('/opt/Antigravity IDE');
        candidates.push('/opt/antigravity-ide');
        candidates.push('/usr/share/antigravity');
        candidates.push('/usr/share/antigravity-ide');
        candidates.push(path.join(os.homedir(), '.local', 'share', 'antigravity-ide'));
    }

    return candidates;
}

export function resolveIdeAppDir(inputPath) {
    if (!inputPath || !fs.existsSync(inputPath)) return null;

    let candidate = inputPath;
    
    // Check if inputPath is already resources/app
    if (fs.existsSync(path.join(candidate, 'out', 'main.js'))) {
        return candidate;
    }

    // Check if inside macOS .app
    const macAppDir = path.join(candidate, 'Contents', 'Resources', 'app');
    if (fs.existsSync(path.join(macAppDir, 'out', 'main.js'))) {
        return macAppDir;
    }

    // Check Linux / Windows standard resources/app
    const standardAppDir = path.join(candidate, 'resources', 'app');
    if (fs.existsSync(path.join(standardAppDir, 'out', 'main.js'))) {
        return standardAppDir;
    }

    return null;
}

export function detectIdeAppPath() {
    for (const c of getIdeCandidatePaths()) {
        const resolved = resolveIdeAppDir(c);
        if (resolved) return resolved;
    }
    return null;
}

export function hasIdeBackup(appDir) {
    if (!appDir) return false;
    const { mainJsPath, mainJsBak, workbenchHtmlBak, jetskiHtmlBak } = idePaths(appDir);
    let hasImport = false;
    if (fs.existsSync(mainJsPath)) {
        try {
            const code = fs.readFileSync(mainJsPath, 'utf8');
            hasImport = code.includes("import './antigravity-rtl-main.js';");
        } catch (_) {}
    }
    return fs.existsSync(mainJsBak) || fs.existsSync(workbenchHtmlBak) || fs.existsSync(jetskiHtmlBak) || hasImport;
}

export async function getIdeAppPath() {
    const detected = detectIdeAppPath();
    if (detected) {
        console.log(blue(`ℹ Found Antigravity IDE installation at:`));
        console.log(`  ${detected}\n`);
        return detected;
    }

    console.log(yellow(`⚠ Could not automatically find Antigravity IDE.`));
    const response = await prompts({
        type: 'text',
        name: 'customPath',
        message: 'Please enter the path to your Antigravity IDE directory:'
    });

    if (!response.customPath) {
        console.error(red('\n✖ No path entered. Aborting.\n'));
        process.exit(1);
    }

    const resolved = resolveIdeAppDir(response.customPath);
    if (!resolved) {
        console.error(red(`\n✖ Could not find valid IDE resources in "${response.customPath}". Aborting.\n`));
        process.exit(1);
    }

    return resolved;
}

export async function restoreIde(appDir, { exitOnError = true } = {}) {
    const { outDir, wbDir, mainJsPath, mainJsBak, workbenchHtml, workbenchHtmlBak, jetskiHtml, jetskiHtmlBak } = idePaths(appDir);

    if (!hasIdeBackup(appDir)) {
        console.error(red('✖ No backup found to restore for Antigravity IDE.\n'));
        if (exitOnError) process.exit(1);
        return false;
    }

    const spinner = ora('Restoring original Antigravity IDE files...').start();
    try {
        // Restore main.js
        if (fs.existsSync(mainJsBak)) {
            fs.copyFileSync(mainJsBak, mainJsPath);
            fs.unlinkSync(mainJsBak);
        } else if (fs.existsSync(mainJsPath)) {
            let code = fs.readFileSync(mainJsPath, 'utf8');
            if (code.includes("import './antigravity-rtl-main.js';")) {
                code = code.replace("import './antigravity-rtl-main.js';\n", '');
                code = code.replace("import './antigravity-rtl-main.js';", '');
                fs.writeFileSync(mainJsPath, code, 'utf8');
            }
        }

        // Restore HTML files
        if (fs.existsSync(workbenchHtmlBak)) {
            fs.copyFileSync(workbenchHtmlBak, workbenchHtml);
            fs.unlinkSync(workbenchHtmlBak);
        }
        if (fs.existsSync(jetskiHtmlBak)) {
            fs.copyFileSync(jetskiHtmlBak, jetskiHtml);
            fs.unlinkSync(jetskiHtmlBak);
        }

        // Cleanup injected files
        const filesToClean = [
            path.join(outDir, 'antigravity-rtl-main.js'),
            path.join(outDir, 'antigravity-rtl-client.js'),
            path.join(wbDir, 'antigravity-rtl-client.js'),
            path.join(outDir, 'Vazirmatn-Variable.woff2'),
            path.join(wbDir, 'Vazirmatn-Variable.woff2')
        ];
        for (const f of filesToClean) {
            fs.rmSync(f, { force: true });
        }

        spinner.succeed('Successfully restored original Antigravity IDE!\n');
        return true;
    } catch (e) {
        spinner.fail('Failed to restore Antigravity IDE.');
        console.error(red(e.message));
        if (exitOnError) process.exit(1);
        return false;
    }
}

export async function patchIde(appDir, { exitOnError = true } = {}) {
    const { outDir, wbDir, mainJsPath, mainJsBak, workbenchHtml, workbenchHtmlBak, jetskiHtml, jetskiHtmlBak } = idePaths(appDir);

    const spinner = ora('Checking permissions and backing up IDE files...').start();
    let failLabel = 'Permission Denied.';
    try {
        fs.accessSync(outDir, fs.constants.W_OK);
        fs.accessSync(mainJsPath, fs.constants.W_OK);

        failLabel = 'Failed to create backup.';
        if (!fs.existsSync(mainJsBak) && fs.existsSync(mainJsPath)) {
            fs.copyFileSync(mainJsPath, mainJsBak);
        }
        if (!fs.existsSync(workbenchHtmlBak) && fs.existsSync(workbenchHtml)) {
            fs.copyFileSync(workbenchHtml, workbenchHtmlBak);
        }
        if (!fs.existsSync(jetskiHtmlBak) && fs.existsSync(jetskiHtml)) {
            fs.copyFileSync(jetskiHtml, jetskiHtmlBak);
        }

        failLabel = 'Failed to copy RTL assets.';
        spinner.text = 'Copying RTL assets and injection scripts...';
        
        // Copy fonts
        const vazirSrc = path.join(__dirname, 'Vazirmatn-Variable.woff2');
        if (fs.existsSync(vazirSrc)) {
            fs.copyFileSync(vazirSrc, path.join(outDir, 'Vazirmatn-Variable.woff2'));
            fs.copyFileSync(vazirSrc, path.join(wbDir, 'Vazirmatn-Variable.woff2'));
        }

        // Pre-bundle self-contained client script
        const fontBase64 = fs.existsSync(vazirSrc) ? fs.readFileSync(vazirSrc).toString('base64') : '';
        let clientCode = fs.readFileSync(path.join(__dirname, 'ide-client.js'), 'utf8');
        clientCode = clientCode
            .replaceAll('__FONT_BASE64__', fontBase64)
            .replaceAll('__RTL_CONFIG__', 'JSON.parse(localStorage.getItem("antigravity-rtl-config") || \'{"isRTL":true,"forceRTL":false,"fixAtSign":true}\')');

        fs.writeFileSync(path.join(outDir, 'antigravity-rtl-client.js'), clientCode, 'utf8');
        fs.writeFileSync(path.join(wbDir, 'antigravity-rtl-client.js'), clientCode, 'utf8');
        fs.copyFileSync(path.join(__dirname, 'ide-main.js'), path.join(outDir, 'antigravity-rtl-main.js'));

        failLabel = 'Injection into Antigravity IDE failed.';
        spinner.text = 'Injecting RTL hooks into main.js and HTML files...';
        let mainCode = fs.readFileSync(mainJsPath, 'utf8');
        const importHook = "import './antigravity-rtl-main.js';\n";

        if (!mainCode.includes("import './antigravity-rtl-main.js';")) {
            mainCode = importHook + mainCode;
            fs.writeFileSync(mainJsPath, mainCode, 'utf8');
        }

        // Patch CSP and inject script into HTML files
        const patchHtmlFile = (filePath) => {
            if (!fs.existsSync(filePath)) return;
            let content = fs.readFileSync(filePath, 'utf8');
            if (content.includes("font-src") && !/font-src[^;]*\bdata:/.test(content)) {
                content = content.replace(/(font-src[\s\S]*?'self')/i, "$1\n\t\t\t\t\tdata:");
            }
            const scriptTag = '<script src="./antigravity-rtl-client.js" type="module"></script>';
            if (!content.includes('antigravity-rtl-client.js')) {
                if (content.includes('</body>')) {
                    content = content.replace('</body>', `${scriptTag}\n</body>`);
                } else if (content.includes('</html>')) {
                    content = content.replace('</html>', `${scriptTag}\n</html>`);
                } else {
                    content += `\n${scriptTag}\n`;
                }
            }
            fs.writeFileSync(filePath, content, 'utf8');
        };

        patchHtmlFile(workbenchHtml);
        patchHtmlFile(jetskiHtml);

        spinner.succeed('Successfully patched Antigravity IDE!');
        console.log(green('\n✨ RTL Features have been enabled for Antigravity IDE.'));
        console.log(green('✨ Please restart Antigravity IDE to see the changes.\n'));
        return true;
    } catch (e) {
        spinner.fail(failLabel);
        if (failLabel === 'Permission Denied.') {
            console.error(red('\nSystem Error: ' + e.message));
            console.error(yellow(os.platform() === 'win32'
                ? '\nPlease run your terminal as Administrator and try again.\n'
                : '\nPlease run this command with sudo.\n'));
        } else {
            console.error(red(e.message));
        }
        if (exitOnError) process.exit(1);
        return false;
    }
}
