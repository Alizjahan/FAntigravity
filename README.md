<p align="center">
  <img src="./header.jpg" alt="FAntigravity Banner" width="100%">
</p>

<div align="center">

# FAntigravity 🌌
### Smart RTL & Persian Typography Engine for Antigravity (Standalone App & IDE)

[![GitHub Release](https://img.shields.io/badge/Release-v2.0.0-0D9DF8?style=for-the-badge&logo=github)](https://github.com/Alizjahan/FAntigravity)
[![License: MIT](https://img.shields.io/badge/License-MIT-34C6BF?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.0-89DB76?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-FA9138?style=for-the-badge)]()
[![Maintained by](https://img.shields.io/badge/Author-Alizjahan-0F6FFA?style=for-the-badge&logo=github)](https://github.com/Alizjahan)

**Read and write naturally in Persian, Arabic, and Hebrew inside Google Antigravity, without breaking code blocks, terminal, or English text.**

[English](#features) · [فارسی](#فارسی) · [Installation](#installation) · [CLI Commands](#cli-options--flags) · [Keyboard Shortcuts](#keyboard-shortcuts) · [Architecture](#how-it-works) · [Uninstall](#uninstall)

</div>

---

## ✨ Features

- 🎯 **Dual Environment Support**: Seamlessly detects and patches both **Antigravity Standalone (Electron App)** and **Antigravity IDE (VS Code Edition)**.
- 🔄 **Smart Bi-Directional Engine**: Text direction automatically isolates and conforms to Persian/Arabic while keeping numbers, code tags, and English phrases correctly ordered.
- 💻 **Strict Code & Terminal Isolation**: Code blocks (`<pre>`, `<code>`), the Monaco editor, diff views, and built-in terminals remain strictly Left-to-Right (LTR).
- 🔤 **Offline Typography & Multi-Font Selection**:
  - Embedded **Vazirmatn Variable** font (offline base64).
  - Embedded **Snapp Web** font.
  - Support for any **Custom System Font** (e.g., IRANSans, B Nazanin, Tahoma).
  - Independent font selection for Persian, English, and Monospace Code.
  - Live adjustable **Font Size** and **Line Height**.
- 🎨 **Tri-State Theme Switcher**:
  - ☀️ **Light Mode** (Crisp clean layout)
  - 🌙 **Dark Mode** (Deep charcoal palette)
  - ⭐️ **Antigravity Star Mode** (Vibrant cyan-blue aurora gradient palette)
- ⌨️ **Persian Keyboard `@` Fix**: Fixes the frustrating Persian layout bug where `Shift + 2` outputs `٬` instead of `@` for mentioning agent tools.
- ⚡ **Zero Cloud Dependencies**: Runs 100% locally with zero analytics, zero external network requests, and zero data telemetry.
- 🛡️ **Non-Destructive Backups**: Automatically creates `.bak` backups before modifying files, allowing 1-click instant rollback at any time.

---

## 🚀 Installation

Node.js **20 or newer** is required. You can run the patcher directly via `npx` or clone the repository:

### Quick Run via NPX

#### Windows (PowerShell / Command Prompt as Administrator)
```powershell
npx fantigravity-rtl
```

#### macOS (Terminal)
```bash
npx fantigravity-rtl
```
*(If prompted for permission, grant **App Management** in System Settings → Privacy & Security → App Management).*

#### Linux (Terminal)
```bash
sudo npx fantigravity-rtl
```

---

### Manual Clone & Run
```bash
git clone https://github.com/Alizjahan/FAntigravity.git
cd FAntigravity
npm install
node bin/index.js
```

---

## 🛠️ CLI Options & Flags

| Command | Description |
| :--- | :--- |
| `npx fantigravity-rtl` | **Interactive Auto-detect**: Scans system for Antigravity App & IDE and patches detected targets |
| `npx fantigravity-rtl --app` | Directly patches Antigravity Standalone Desktop App |
| `npx fantigravity-rtl --ide` | Directly patches Antigravity IDE (VS Code Edition) |
| `npx fantigravity-rtl --restore` | Reverts all patches and restores clean original backups |
| `npx fantigravity-rtl --restore --app` | Restores only the Antigravity Standalone App |
| `npx fantigravity-rtl --restore --ide` | Restores only the Antigravity IDE |
| `npx fantigravity-rtl --path "/path/to/app.asar"` | Specifies a custom manual path to `app.asar` |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Description |
| :--- | :--- |
| `Alt + R` *(Windows / Linux)* | Open / Close FAntigravity Settings Dropdown |
| `⌥ + R` *(macOS)* | Open / Close FAntigravity Settings Dropdown |
| `Shift + 2` *(Persian Layout)* | Types `@` directly when `@ Fix` is enabled |

---

## 🏗️ How It Works

1. **Detection**: Automatically locates the Antigravity installation on Windows (`AppData/Local/Programs/Antigravity`), macOS (`/Applications`), or Linux (`/opt/Antigravity`).
2. **Safe Backup**: Verifies file permissions and takes a byte-level `.bak` backup of `app.asar` before any modification.
3. **Core Injection**:
   - Injects the lightweight `payload.js` engine into `utils.js` within the Electron app package.
   - For Antigravity IDE, registers an isolated workbench hook injecting `ide-client.js`.
4. **Offline Assets**: Bundles high-performance WOFF2 font binaries directly into the ASAR package so no external CDN or internet connection is required.
5. **Persistence**: Saves user preferences to `~/.faliz-rtl.json` and synchronizes them instantly across restarts.

---

## ↩️ Uninstall

To remove the patch and restore the original Antigravity files at any time, run:

```bash
npx fantigravity-rtl --restore
```

---

<div dir="rtl">

## 🇮🇷 راهنمای فارسی

**خواندن و نوشتن روان و بی‌نقص متون فارسی در Antigravity (اپلیکیشن دسکتاپ و محیط IDE) بدون به‌هم‌ریختگی کدها و زبان انگلیسی.**

### 🌟 ویژگی‌های کلیدی

- **پشتیبانی دوگانه**: هماهنگی کامل هم با نرم‌افزار مستقل **Antigravity** و هم با نسخه **Antigravity IDE**.
- **تشخیص هوشمند جهت (Smart RTL)**: تنظیم جهت متون فارسی به راست‌چین و انگلیسی به چپ‌چین به صورت خودکار و برخط.
- **ایزولاسیون کامل کدها و ترمینال**: متون داخل بلوک‌های کد (`pre` و `code`)، محیط Monaco Editor و خط فرمان کاملاً دست‌نخورده و چپ‌چین (LTR) باقی می‌مانند.
- **تایپوگرافی آفلاین با قابلیت انتخاب فونت**:
  - فونت توکار و چشم‌نواز **وزیرمتن (Vazirmatn Variable)** بدون نیاز به اینترنت.
  - فونت محبوب **اسنپ (Snapp Web)**.
  - امکان تعریف هرگونه **فونت دلخواه نصب‌شده روی سیستم** (مانند ایران‌یکان، بی نازنین و ...).
  - امکان تنظیم اندازه قلم و فاصله بین خطوط (Line Height) با دکمه بازنشانی پیش‌فرض.
- **سوییچ سه‌حالته تم**:
  - ☀️ **تم لایت (Light)**
  - 🌙 **تم دارک (Dark)**
  - ⭐️ **تم ستاره آنتی‌گرویتی (Antigravity Star Aurora)**
- **اصلاح هوشمند کلید `@` در کیبورد فارسی**: حل مشکل دیرینه تایپ `٬` به جای علامت `@` هنگام فشردن `Shift + 2`.
- **کلید میانبر سریع**: امکان باز و بسته کردن منوی تنظیمات با فشردن `Alt + R` در ویندوز/لینوکس یا `Option + R` در مک.
- **امنیت و پشتیبان‌گیری خودکار**: تهیه فایل پشتیبان تمیز (`.bak`) پیش از هرگونه تغییر برای بازگردانی آنی و بدون دردسر.

### 📦 نصب سریع

در محیط خط فرمان (PowerShell در ویندوز با دسترسی Administrator یا Terminal در مک و لینوکس) دستور زیر را وارد نمایید:

```bash
npx fantigravity-rtl
```

برای بازگردانی برنامه به حالت کارخانه‌ای نیز کافی است دستور زیر را اجرا کنید:
```bash
npx fantigravity-rtl --restore
```

</div>

---

## 👨‍💻 Maintainer & Author

Crafted with dedication & ❤️ by **Alireza Jahanbakhsh ([@Alizjahan](https://github.com/Alizjahan))**

- **GitHub:** [https://github.com/Alizjahan](https://github.com/Alizjahan)
- **Telegram:** [@Alizjahan](https://t.me/Alizjahan)
- **LinkedIn:** [Alireza Jahanbakhsh](https://linkedin.com/in/Alirezajahanbakhsh)

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
Feel free to use, contribute, and customize!
