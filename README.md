<p align="center">
  <img src="https://raw.githubusercontent.com/Alizjahan/FAntigravity-App-RTL-Persian-Arabic/main/header2.jpg" alt="FAntigravity Banner" width="100%">
</p>

<div align="center">

# FAntigravity-App-RTL-Persian-Arabic
### Smart Persian & Arabic RTL Typography Engine for Antigravity (Standalone App)

[![Release](https://img.shields.io/badge/Release-v2.0.0-0D9DF8?style=flat-square&logo=github)](https://github.com/Alizjahan/FAntigravity-App-RTL-Persian-Arabic)
[![License](https://img.shields.io/badge/License-MIT-34C6BF?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.0-89DB76?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-FA9138?style=flat-square)]()
[![Maintainer](https://img.shields.io/badge/Maintainer-Alizjahan-0F6FFA?style=flat-square&logo=github)](https://github.com/Alizjahan)

Read and write naturally in Persian, Arabic, and Hebrew inside Google Antigravity Desktop, without breaking code blocks, terminal sessions, or English text.

[English Documentation](#overview) | [راهنمای فارسی](./README_FA.md) | [الدليل العربي](./README_AR.md)

</div>

---

## Overview

**FAntigravity-App-RTL-Persian-Arabic** is a non-invasive right-to-left (RTL) injection engine and typography system tailored specifically for the official **Google Antigravity Standalone Desktop Application** (Electron).

By analyzing text streams in real time using Unicode-aware heuristics, it dynamically isolates Persian and Arabic sentences while keeping code snippets, backtick literals, terminal buffers, and prompt templates strictly Left-to-Right (LTR).

---

## Features

- **Trilingual Topbar UI (Persian | Arabic | English)**:
  - Interactive language switcher in the settings panel with instant live localization.
- **Three Embedded Offline Fonts**:
  - **Dubai Font**: Contemporary, elegant, and high-readability typeface bundled locally for Arabic and Persian.
  - **Vazirmatn Variable**: Standard Persian & Arabic font embedded offline in WOFF2 format.
  - **Snapp Web**: Clean alternative Persian typeface embedded offline.
  - **System Fonts**: Instant support for any locally installed system font (Amiri, Cairo, IRANSans, Tahoma, Segoe UI...).
- **Automated Standalone Application Detection**: Recursively locates the official Antigravity desktop installation across standard operating system directories on Windows, macOS, and Linux.
- **Smart Bi-Directional Isolation**: Inspects incoming tokens and isolates direction per paragraph, preventing mixed-script punctuation and bracket inversions.
- **Strict Code & Terminal Preservation**: Blocks within `<pre>`, `<code>`, Monaco editor widgets, diff views, and command outputs remain intact in LTR.
- **Custom English & Code Fonts**: Assign distinct font families for English phrases and code blocks without affecting Arabic/Persian glyphs.
- **Force RTL Mode**: Enforce RTL on all conversational messages even if they start with English characters or tokens.
- **Tri-State Theme System**:
  - Light Theme (High-contrast day layout)
  - Dark Theme (Deep charcoal low-luminance palette)
  - Antigravity Star Theme (Multi-stop aurora cyan/blue palette)
- **Persian Keyboard Symbol Fix**: Corrects the Persian keyboard mapping where `Shift + 2` incorrectly outputs `٬` instead of `@`.
- **Zero Network Telemetry**: Completely self-contained; makes no external calls, tracks no metrics, and runs strictly within local process boundaries.
- **Atomic Backup Protection**: Creates byte-level `.bak` snapshots prior to any package manipulation, enabling instant single-command restoration.

---

## Installation & Usage

### Method 1: Instant NPX Run (Recommended)

Run directly from your terminal without cloning or manual installation:

```bash
npx -y -p github:Alizjahan/FAntigravity-App-RTL-Persian-Arabic fantigravity
```

### Method 2: Single-Command Restore (Uninstallation)

To revert changes and restore your pristine original installation:

```bash
npx -y -p github:Alizjahan/FAntigravity-App-RTL-Persian-Arabic fantigravity --restore
```

---

## CLI Reference

```text
Usage:
  npx -y -p github:Alizjahan/FAntigravity-App-RTL-Persian-Arabic fantigravity [options] [path]

Options:
  -r, --restore      Revert changes and restore original backup app.asar
  --path <asarFile>  Specify custom path to app.asar
  -h, --help         Show this help message
```

---

## Keyboard Shortcuts & Controls

- **`Alt + R`**: Instant hotkey toggle between RTL and LTR modes.
- **FAntigravity Button (Topbar)**: Opens the interactive dropdown settings menu to configure typography, fonts, line height, font size, themes, and language.

---

## Multi-Language Documentation

- [راهنمای فارسی (Persian Documentation)](./README_FA.md)
- [الدليل العربي (Arabic Documentation)](./README_AR.md)

---

## Author & Maintainer

Developed with ❤️ by **Alireza Jahanbakhsh (Aliz)**
- GitHub: [@Alizjahan](https://github.com/Alizjahan)
- Telegram: [@Alizjahan](https://t.me/Alizjahan)

---

## License

This project is licensed under the [MIT License](LICENSE).
