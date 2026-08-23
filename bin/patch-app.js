import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import picocolors from 'picocolors';
import ora from 'ora';
import prompts from 'prompts';
import * as asar from '@electron/asar';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { blue, green, red, yellow, cyan } = picocolors;

const PATCH_START = '/* FALIZ RTL CORE */';
const PATCH_END = '/* END FALIZ RTL CORE */';
const ANCHOR = 'void win.loadURL(url);';
const PATCH_BLOCK = /\/\* (?:ANTIGRAVITY RTL PATCH|FALIZ RTL CORE) \*\/[\s\S]*?\/\* END (?:ANTIGRAVITY RTL PATCH|FALIZ RTL CORE) \*\//;
const REINSTALL_NOTICE = 'برای پچ جدید، نیاز به فایل پشتیبان معتبر است. در صورت بروز مشکل، نرم‌افزار Antigravity را بررسی نمایید.';

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
        if (process.env.LOCALAPPDATA) {
            list.push(path.join(process.env.LOCALAPPDATA, 'Programs', 'Antigravity', 'resources', 'app.asar'));
            list.push(path.join(process.env.LOCALAPPDATA, 'Antigravity', 'resources', 'app.asar'));
        }
        if (process.env.PROGRAMFILES) {
            list.push(path.join(process.env.PROGRAMFILES, 'Antigravity', 'resources', 'app.asar'));
        }
        if (process.env['PROGRAMFILES(X86)']) {
            list.push(path.join(process.env['PROGRAMFILES(X86)'], 'Antigravity', 'resources', 'app.asar'));
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
        console.log(cyan(`ℹ محل نصب Antigravity شناسایی شد:`));
        console.log(`  ${detected}\n`);
        return detected;
    }

    console.log(yellow(`⚠ مسیر خودکار فایل app.asar یافت نشد.`));
    const response = await prompts({
        type: 'text',
        name: 'customPath',
        message: 'لطفاً مسیر کامل فایل app.asar را وارد کنید:'
    });

    if (!response.customPath || !fs.existsSync(response.customPath)) {
        console.error(red('\n✖ مسیر نامعتبر است. عملیات لغو شد.\n'));
        process.exit(1);
    }
    return response.customPath;
}
export const getAppAsarPath = resolveAppAsarLocation;

export async function restoreOriginalAntigravity(asarPath, { exitOnError = true } = {}) {
    const backupPath = asarPath + '.bak';
    if (!fs.existsSync(backupPath)) {
        console.error(red('✖ فایل پشتیبان (.bak) برای بازگردانی وجود ندارد.\n'));
        if (exitOnError) process.exit(1);
        return false;
    }
    if (extractUtilsFromAsar(backupPath).includes(PATCH_START)) {
        console.error(red('✖ فایل پشتیبان خود حاوی پچ است. لطفاً نرم‌افزار را مجدداً نصب کنید.\n'));
        if (exitOnError) process.exit(1);
        return false;
    }
    const spinner = ora('در حال بازگردانی فایل‌های اولیه Antigravity...').start();
    try {
        fs.copyFileSync(backupPath, asarPath);
        asar.uncache(asarPath);
        fs.unlinkSync(backupPath);
        spinner.succeed('فایل‌های اصلی Antigravity با موفقیت بازگردانده شدند!\n');
        return true;
    } catch (e) {
        spinner.fail('خطا در بازگردانی فایل‌ها.');
        console.error(red(e.message));
        if (exitOnError) process.exit(1);
        return false;
    }
}
export const restoreApp = restoreOriginalAntigravity;

export async function installFAlizPatch(asarPath, { exitOnError = true } = {}) {
    const backupPath = asarPath + '.bak';
    const tempExtractDir = path.join(path.dirname(asarPath), 'faliz-extracted-temp');
    const spinner = ora('بررسی دسترسی و ایجاد نسخه پشتیبان...').start();
    let failureStep = 'خطای عدم دسترسی فایل.';

    try {
        fs.accessSync(path.dirname(asarPath), fs.constants.W_OK);

        failureStep = 'خطا در خواندن فایل app.asar.';
        const currentUtilsCode = extractUtilsFromAsar(asarPath);
        const backupUtilsCode = fs.existsSync(backupPath) ? extractUtilsFromAsar(backupPath) : null;
        let cleanUtilsCode;
        let shouldRebuildBackup = false;

        const isCurrentlyPatched = currentUtilsCode.includes('/* ANTIGRAVITY RTL PATCH */') || currentUtilsCode.includes(PATCH_START);
        if (!isCurrentlyPatched) {
            failureStep = 'خطای دسترسی در کپی فایل پشتیبان.';
            fs.copyFileSync(asarPath, backupPath);
            asar.uncache(backupPath);
            cleanUtilsCode = currentUtilsCode;
        } else {
            const isBackupClean = backupUtilsCode !== null && !(backupUtilsCode.includes('/* ANTIGRAVITY RTL PATCH */') || backupUtilsCode.includes(PATCH_START));
            cleanUtilsCode = removeExistingPatch(currentUtilsCode) ?? (isBackupClean ? backupUtilsCode : null);
            if (cleanUtilsCode === null) throw new Error(REINSTALL_NOTICE);
            shouldRebuildBackup = !isBackupClean;
            spinner.text = 'به‌روزرسانی پچ راست‌چین FAliz به نسخه جدید...';
        }

        failureStep = 'خطا در استخراج پکیج ASAR.';
        spinner.text = 'استخراج محتویات بسته نرم‌افزار...';
        fs.rmSync(tempExtractDir, { recursive: true, force: true });
        asar.extractAll(asarPath, tempExtractDir);

        const utilsScriptPath = path.join(tempExtractDir, 'dist', 'utils.js');
        const vazirDestPath = path.join(tempExtractDir, 'dist', 'Vazirmatn-Variable.woff2');
        const snappDestPath = path.join(tempExtractDir, 'dist', 'SnappWeb2.0-Regular.woff');

        if (shouldRebuildBackup) {
            failureStep = 'خطا در ایجاد نسخه پشتیبان تمیز.';
            spinner.text = 'بازسازی نسخه پشتیبان اولیه...';
            fs.writeFileSync(utilsScriptPath, cleanUtilsCode);
            fs.rmSync(vazirDestPath, { force: true });
            if (fs.existsSync(snappDestPath)) fs.rmSync(snappDestPath, { force: true });
            await asar.createPackage(tempExtractDir, backupPath);
            asar.uncache(backupPath);
        }

        failureStep = 'خطا در تزریق کدهای راست‌چین.';
        spinner.text = 'اعمال تنظیمات و تزریق افزونه FAliz RTL...';
        let finalUtilsCode = cleanUtilsCode;

        const payloadCode = fs.readFileSync(path.join(__dirname, 'payload.js'), 'utf8');
        if (!finalUtilsCode.includes(ANCHOR)) {
            throw new Error('نقطه تزریق کدها در نسخه فعلی Antigravity یافت نشد.');
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

        failureStep = 'خطا در بسته‌بندی مجدد ASAR.';
        spinner.text = 'بسته‌بندی مجدد نرم‌افزار با قابلیت‌های FAliz...';
        await asar.createPackage(tempExtractDir, asarPath);
        asar.uncache(asarPath);
        fs.rmSync(tempExtractDir, { recursive: true, force: true });

        spinner.succeed('افزونه FAliz RTL با موفقیت روی Antigravity نصب شد!');
        console.log(green('\n✨ امکانات راست‌چین فارسی FAliz و فونت‌های سفارشی فعال گردید.'));
        console.log(green('✨ برای مشاهده تغییرات و محیط جدید، لطفاً Antigravity را ری‌استارت کنید.\n'));
        return true;
    } catch (e) {
        spinner.fail(failureStep);
        console.error(red('\nخطا: ' + e.message));
        if (fs.existsSync(tempExtractDir)) {
            fs.rmSync(tempExtractDir, { recursive: true, force: true });
        }
        if (exitOnError) process.exit(1);
        return false;
    }
}
export const patchApp = installFAlizPatch;
