import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import picocolors from 'picocolors';
import ora from 'ora';
import prompts from 'prompts';
import * as asar from '@electron/asar';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { blue, green, red, yellow, cyan } = picocolors;

const PATCH_START = '/* FALIZ RTL CORE */';
const PATCH_END = '/* END FALIZ RTL CORE */';
const ANCHOR = 'void win.loadURL(url);';
const PATCH_BLOCK = /\/\* (?:ANTIGRAVITY RTL PATCH|FALIZ RTL CORE|FANTIGRAVITY RTL CORE) \*\/[\s\S]*?\/\* END (?:ANTIGRAVITY RTL PATCH|FALIZ RTL CORE|FANTIGRAVITY RTL CORE) \*\//;
const REINSTALL_NOTICE = 'Valid backup file is required for a new patch. Please verify your Antigravity installation.';

function extractUtilsFromAsar(asarFile) {
    asar.uncache(asarFile);
    return asar.extractFile(asarFile, 'dist/utils.js').toString('utf8');
}

function removeExistingPatch(sourceCode) {
    return PATCH_BLOCK.test(sourceCode) ? sourceCode.replace(PATCH_BLOCK, ANCHOR) : null;
}

function scanAppCandidates() {
    const list = [];
    const platform = os.platform();

    if (platform === 'darwin') {
        list.push('/Applications/Antigravity.app/Contents/Resources/app.asar');
        list.push(path.join(os.homedir(), 'Applications', 'Antigravity.app', 'Contents', 'Resources', 'app.asar'));
    } else if (platform === 'win32') {
        // 1. Check currently running Antigravity standalone process
        try {
            const procCmd = 'powershell -NoProfile -Command "(Get-Process -Name \'Antigravity\' -ErrorAction SilentlyContinue | Where-Object { $_.Path -notlike \'*IDE*\' } | Select-Object -First 1).Path"';
            const procPath = execSync(procCmd, { encoding: 'utf8', timeout: 3000 }).trim();
            if (procPath && fs.existsSync(procPath)) {
                list.push(path.join(path.dirname(procPath), 'resources', 'app.asar'));
            }
        } catch (_) {}

        // 2. Standard AppData locations
        if (process.env.LOCALAPPDATA) {
            list.push(path.join(process.env.LOCALAPPDATA, 'Programs', 'Antigravity', 'resources', 'app.asar'));
            list.push(path.join(process.env.LOCALAPPDATA, 'Programs', 'antigravity', 'resources', 'app.asar'));
            list.push(path.join(process.env.LOCALAPPDATA, 'Antigravity', 'resources', 'app.asar'));
        }

        // 3. Scan all system drives (C, D, E, F, G)
        const driveLetters = ['C', 'D', 'E', 'F', 'G'];
        for (const drive of driveLetters) {
            list.push(`${drive}:\\Program Files\\Antigravity\\resources\\app.asar`);
            list.push(`${drive}:\\Program Files (x86)\\Antigravity\\resources\\app.asar`);
            list.push(`${drive}:\\Program Files\\antigravity\\resources\\app.asar`);
            list.push(`${drive}:\\Program Files (x86)\\antigravity\\resources\\app.asar`);
            list.push(`${drive}:\\Antigravity\\resources\\app.asar`);
            list.push(`${drive}:\\antigravity\\resources\\app.asar`);
        }
    } else {
        list.push('/opt/Antigravity/resources/app.asar');
        list.push('/opt/antigravity/resources/app.asar');
        list.push('/usr/share/antigravity/resources/app.asar');
        list.push(path.join(os.homedir(), '.local', 'share', 'antigravity', 'resources', 'app.asar'));
    }
    return list;
}

export function findAppAsarLocation() {
    return scanAppCandidates().find(item => fs.existsSync(item)) || null;
}
export const detectAppAsarPath = findAppAsarLocation;

export function checkAppBackupExists(asarPath) {
    return asarPath ? fs.existsSync(asarPath + '.bak') : false;
}
export const hasAppBackup = checkAppBackupExists;

export async function resolveAppAsarLocation() {
    const detected = findAppAsarLocation();
    if (detected) {
        console.log(cyan(`ℹ Antigravity installation detected:`));
        console.log(`  ${detected}\n`);
        return detected;
    }

    console.log(yellow(`⚠ Could not automatically locate app.asar file.`));
    const response = await prompts({
        type: 'text',
        name: 'customPath',
        message: 'Please enter the full path to app.asar:'
    });

    if (!response.customPath || !fs.existsSync(response.customPath)) {
        console.error(red('\n✖ Invalid path. Operation aborted.\n'));
        process.exit(1);
    }
    return response.customPath;
}
export const getAppAsarPath = resolveAppAsarLocation;

export async function restoreOriginalAntigravity(asarPath, { exitOnError = true } = {}) {
    const backupPath = asarPath + '.bak';
    if (!fs.existsSync(backupPath)) {
        console.error(red('✖ No backup file (.bak) found to restore.\n'));
        if (exitOnError) process.exit(1);
        return false;
    }
    if (extractUtilsFromAsar(backupPath).includes(PATCH_START)) {
        console.error(red('✖ Backup file already contains patch. Please reinstall Antigravity.\n'));
        if (exitOnError) process.exit(1);
        return false;
    }
    const spinner = ora('Restoring original Antigravity files...').start();
    try {
        fs.copyFileSync(backupPath, asarPath);
        asar.uncache(asarPath);
        fs.unlinkSync(backupPath);
        spinner.succeed('Original Antigravity files restored successfully!\n');
        return true;
    } catch (e) {
        spinner.fail('Failed to restore files.');
        console.error(red(e.message));
        if (exitOnError) process.exit(1);
        return false;
    }
}
export const restoreApp = restoreOriginalAntigravity;

export async function installFAntigravityPatch(asarPath, { exitOnError = true } = {}) {
    const backupPath = asarPath + '.bak';
    const tempExtractDir = path.join(path.dirname(asarPath), 'fantigravity-extracted-temp');
    const spinner = ora('Checking permissions and creating backup...').start();
    let failureStep = 'Permission denied.';

    try {
        fs.accessSync(path.dirname(asarPath), fs.constants.W_OK);

        failureStep = 'Failed to read app.asar file.';
        const currentUtilsCode = extractUtilsFromAsar(asarPath);
        const backupUtilsCode = fs.existsSync(backupPath) ? extractUtilsFromAsar(backupPath) : null;
        let cleanUtilsCode;
        let shouldRebuildBackup = false;

        const isCurrentlyPatched = currentUtilsCode.includes('/* ANTIGRAVITY RTL PATCH */') || currentUtilsCode.includes(PATCH_START);
        if (!isCurrentlyPatched) {
            failureStep = 'Permission error while creating backup file.';
            fs.copyFileSync(asarPath, backupPath);
            asar.uncache(backupPath);
            cleanUtilsCode = currentUtilsCode;
        } else {
            const isBackupClean = backupUtilsCode !== null && !(backupUtilsCode.includes('/* ANTIGRAVITY RTL PATCH */') || backupUtilsCode.includes(PATCH_START));
            cleanUtilsCode = removeExistingPatch(currentUtilsCode) ?? (isBackupClean ? backupUtilsCode : null);
            if (cleanUtilsCode === null) throw new Error(REINSTALL_NOTICE);
            shouldRebuildBackup = !isBackupClean;
            spinner.text = 'Updating FAntigravity RTL patch to latest version...';
        }

        failureStep = 'Failed to extract ASAR package.';
        spinner.text = 'Extracting application package...';
        fs.rmSync(tempExtractDir, { recursive: true, force: true });
        asar.extractAll(asarPath, tempExtractDir);

        const utilsScriptPath = path.join(tempExtractDir, 'dist', 'utils.js');
        const vazirDestPath = path.join(tempExtractDir, 'dist', 'Vazirmatn-Variable.woff2');
        const snappDestPath = path.join(tempExtractDir, 'dist', 'SnappWeb2.0-Regular.woff');
        const dubaiDestPath = path.join(tempExtractDir, 'dist', 'Dubai-Regular.ttf');

        if (shouldRebuildBackup) {
            failureStep = 'Failed to rebuild clean backup.';
            spinner.text = 'Rebuilding original clean backup...';
            fs.writeFileSync(utilsScriptPath, cleanUtilsCode);
            fs.rmSync(vazirDestPath, { force: true });
            if (fs.existsSync(snappDestPath)) fs.rmSync(snappDestPath, { force: true });
            if (fs.existsSync(dubaiDestPath)) fs.rmSync(dubaiDestPath, { force: true });
            await asar.createPackage(tempExtractDir, backupPath);
            asar.uncache(backupPath);
        }

        failureStep = 'Failed to inject RTL patch.';
        spinner.text = 'Injecting FAntigravity RTL core engine...';
        let finalUtilsCode = cleanUtilsCode;

        const payloadCode = fs.readFileSync(path.join(__dirname, 'payload.js'), 'utf8');
        if (!finalUtilsCode.includes(ANCHOR)) {
            throw new Error('Injection anchor point not found in current Antigravity version.');
        }
        finalUtilsCode = finalUtilsCode.replace(ANCHOR, () => `${payloadCode.trimEnd()}\n${PATCH_END}`);
        finalUtilsCode = finalUtilsCode.replace(/devTools:\s*!electron_1?\.app\.isPackaged/g, 'devTools: true');
        fs.writeFileSync(utilsScriptPath, finalUtilsCode);

        // Copy font assets
        const vazirSrcPath = path.join(__dirname, 'Vazirmatn-Variable.woff2');
        if (fs.existsSync(vazirSrcPath)) {
            fs.copyFileSync(vazirSrcPath, vazirDestPath);
        }
        const snappSrcPath = path.join(__dirname, 'SnappWeb2.0-Regular.woff');
        if (fs.existsSync(snappSrcPath)) {
            fs.copyFileSync(snappSrcPath, snappDestPath);
        }
        const dubaiSrcPath = path.join(__dirname, 'Dubai-Regular.ttf');
        if (fs.existsSync(dubaiSrcPath)) {
            fs.copyFileSync(dubaiSrcPath, dubaiDestPath);
        }

        failureStep = 'Failed to repack ASAR package.';
        spinner.text = 'Repacking application package with FAntigravity RTL...';
        await asar.createPackage(tempExtractDir, asarPath);
        asar.uncache(asarPath);
        fs.rmSync(tempExtractDir, { recursive: true, force: true });

        spinner.succeed('Successfully installed FAntigravity RTL on Antigravity!');
        console.log(green('\nPersian RTL features and custom typography are now enabled.'));
        console.log(green('Please restart Antigravity to experience the new interface.\n'));
        return true;
    } catch (e) {
        spinner.fail(failureStep);
        console.error(red('\nError: ' + e.message));
        if (fs.existsSync(tempExtractDir)) {
            fs.rmSync(tempExtractDir, { recursive: true, force: true });
        }
        if (exitOnError) process.exit(1);
        return false;
    }
}
export const patchApp = installFAntigravityPatch;
export const installFAlizPatch = installFAntigravityPatch;
