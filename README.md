<p align="center">
  <img src="./header.jpg" alt="FAntigravity Banner" width="100%">
</p>

<div align="center">

# FAntigravity
### Smart RTL & Persian Typography Engine for Antigravity (Standalone App & IDE)

[![Release](https://img.shields.io/badge/Release-v2.0.0-0D9DF8?style=flat-square&logo=github)](https://github.com/Alizjahan/FAntigravity)
[![License](https://img.shields.io/badge/License-MIT-34C6BF?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.0-89DB76?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-FA9138?style=flat-square)]()
[![Author](https://img.shields.io/badge/Maintainer-Alizjahan-0F6FFA?style=flat-square&logo=github)](https://github.com/Alizjahan)

Read and write naturally in Persian, Arabic, and Hebrew inside Google Antigravity, without breaking code blocks, terminal sessions, or English text.

[Overview](#overview) | [Features](#features) | [Installation](#installation) | [CLI Reference](#cli-reference) | [Shortcuts](#keyboard-shortcuts) | [Architecture](#how-it-works) | [Rollback](#uninstallation) | [راهنمای فارسی](#راهنمای-فارسی)

</div>

---

## Overview

FAntigravity is a non-invasive right-to-left (RTL) injection engine and typography system designed specifically for the **Antigravity Standalone Application** (Electron) and the **Antigravity IDE** (VS Code edition). 

By analyzing text streams in real time using Unicode-aware heuristics, it dynamically isolates Persian and Arabic sentences while keeping code snippets, backtick literals, terminal sessions, and Monaco editor buffers strictly Left-to-Right (LTR).

---

## Features

- **Dual-Target Support**: Automatically identifies and patches both Antigravity Standalone (Electron ASAR) and Antigravity IDE (workbench runtime).
- **Smart Bi-Directional Isolation**: Inspects incoming tokens and isolates direction per paragraph, preventing mixed-script punctuation inversions.
- **Strict Code & Terminal Preservation**: Blocks within `<pre>`, `<code>`, Monaco editor instances, diff views, and integrated terminals remain unaffected in LTR.
- **Offline Typography Engine**:
  - Embedded **Vazirmatn Variable** font (zero-network base64 format).
  - Embedded **Snapp Web** font for alternative contemporary Persian typography.
  - Runtime support for any locally installed system font (e.g., IRANSans, B Nazanin, Tahoma).
  - Independent font assignment for Persian, English, and Monospace code blocks.
  - Real-time sliders for live line-height and font-size scaling.
- **Tri-State Theme System**:
  - Light Theme (High-contrast day layout)
  - Dark Theme (Deep charcoal low-luminance palette)
  - Antigravity Star Theme (Multi-stop aurora cyan/blue palette)
- **Persian Keyboard Symbol Fix**: Corrects the Persian keyboard mapping where `Shift + 2` incorrectly outputs `٬` instead of `@`.
- **Zero Network Telemetry**: Completely self-contained; makes no external calls, tracks no metrics, and runs strictly within local process boundaries.
- **Atomic Backup Protection**: Takes byte-level `.bak` snapshots prior to any package manipulation, enabling instant single-command restoration.

---

## Installation

Node.js **20 or newer** is required.

### Quick Start via NPX

#### Windows (PowerShell or Command Prompt as Administrator)
```powershell
npx fantigravity-rtl
```

#### macOS (Terminal)
```bash
npx fantigravity-rtl
```

#### Linux (Terminal)
```bash
sudo npx fantigravity-rtl
```

---

### Manual Installation from Source

```bash
git clone https://github.com/Alizjahan/FAntigravity.git
cd FAntigravity
npm install
node bin/index.js
```

---

## CLI Reference

| Command | Action |
| :--- | :--- |
| `npx fantigravity-rtl` | Interactive scan: detects installed Antigravity targets and applies patch |
| `npx fantigravity-rtl --app` | Targets Antigravity Standalone Desktop App directly |
| `npx fantigravity-rtl --ide` | Targets Antigravity IDE (VS Code Edition) directly |
| `npx fantigravity-rtl --restore` | Reverts all patches and restores clean original backups |
| `npx fantigravity-rtl --restore --app` | Reverts patch and restores Antigravity Standalone App |
| `npx fantigravity-rtl --restore --ide` | Reverts patch and restores Antigravity IDE |
| `npx fantigravity-rtl --path "<path>"` | Specifies custom path to `app.asar` or IDE installation directory |

---

## Keyboard Shortcuts

| Shortcut | Scope | Action |
| :--- | :--- | :--- |
| `Alt + R` | Windows / Linux | Toggle FAntigravity Settings Dropdown |
| `Option + R` | macOS | Toggle FAntigravity Settings Dropdown |
| `Shift + 2` | Global (Persian Layout) | Outputs `@` character directly when `@ Fix` is active |

---

## How It Works

1. **Target Identification**: Recursively resolves installation directories across standard operating system locations (Windows, macOS, and Linux).
2. **Integrity Validation**: Verifies write permissions and generates an intact `.bak` replica before altering any archive.
3. **Engine Injection**:
   - For Antigravity Standalone: Unpacks `app.asar`, injects the `payload.js` engine into `dist/utils.js`, and repacks the archive.
   - For Antigravity IDE: Injects an isolated workbench initialization hook via `ide-client.js`.
4. **Asset Inlining**: Bundles pre-compiled WOFF2 fonts directly into the package structure, eliminating CDN latency and offline failures.
5. **Configuration Persistence**: Stores user preferences in `~/.faliz-rtl.json` and synchronizes them across application lifecycles.

---

## Uninstallation

To remove all injected modifications and restore original Antigravity binaries:

```bash
npx fantigravity-rtl --restore
```

---

<div dir="rtl">

## راهنمای فارسی

ابزار FAntigravity جهت فراهم‌سازی پشتیبانی پیشرفته از زبان فارسی، چیدمان راست‌به‌چپ (RTL) و شخصی‌سازی فونت در نرم‌افزار Antigravity و محیط Antigravity IDE توسعه یافته است.

### قابلیت‌های اصلی

- **سازگاری دوگانه**: پشتیبانی هم‌زمان از اپلیکیشن مستقل Antigravity و نسخه مبتنی بر VS Code.
- **تشخیص هوشمند جهت متن**: تنظیم خودکار جهت جملات فارسی به راست‌چین و انگلیسی به چپ‌چین بدون تداخل.
- **حفظ ساختار کدها و ترمینال**: محیط‌های ویرایش کد (Monaco Editor)، بلوک‌های کد (`pre` و `code`) و پنجره ترمینال کاملاً در حالت استاندارد چپ‌چین (LTR) باقی می‌مانند.
- **مدیریت تایپوگرافی آفلاین**:
  - فونت متغیر وزیرمتن (Vazirmatn Variable) به صورت آفلاین و تعبیه‌شده.
  - فونت اسنپ (Snapp Web) برای نگارش امروزی.
  - امکان تعریف هر نوع فونت نصب‌شده در سیستم‌عامل (نظیر ایران‌یکان، بی نازنین و غیره).
  - تنظیم بلادرنگ اندازه فونت و فاصله خطوط به همراه دکمه بازنشانی.
- **سیستم سه‌گانه تم**:
  - تم روشن (Light)
  - تم تاریک (Dark)
  - تم ستاره آنتی‌گرویتی (Antigravity Star)
- **اصلاح کلید `@` در صفحه کلید فارسی**: تبدیل خودکار `Shift + 2` به علامت `@` به جای کامای فارسی.
- **کلید میانبر**: دسترسی سریع به منوی تنظیمات با فشردن کلیدهای `Alt + R` در ویندوز و لینوکس یا `Option + R` در مکینتاش.
- **پشتیبان‌گیری خودکار**: تهیه نسخه پشتیبان پیش از هرگونه تغییر جهت بازگردانی آنی برنامه.

### نحوه اجرا و نصب

در خط فرمان سیستم‌عامل (PowerShell در ویندوز با دسترسی Administrator یا Terminal در مک و لینوکس):

```bash
npx fantigravity-rtl
```

### بازگردانی به نسخه اولیه

```bash
npx fantigravity-rtl --restore
```

</div>

---

## Maintainer & Author

Developed by **Aliz ([@Alizjahan](https://github.com/Alizjahan))**

- GitHub: [https://github.com/Alizjahan](https://github.com/Alizjahan)
- Telegram: [@Alizjahan](https://t.me/Alizjahan)

---

## License

This project is licensed under the [MIT License](LICENSE).
