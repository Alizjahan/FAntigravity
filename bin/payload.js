/* FALIZ RTL CORE */
win.webContents.on('console-message', (event, ...args) => {
    let message = '';
    if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
        message = args[0].message;
    } else {
        message = args[1];
    }
    if (typeof message === 'string' && (message.startsWith('SAVE_FALIZ_CONFIG|') || message.startsWith('SAVE_RTL_CONFIG|'))) {
        try {
            const data = message.substring(message.indexOf('|') + 1);
            const homeDir = require('os').homedir();
            const configPath1 = require('path').join(homeDir, '.faliz-rtl.json');
            const configPath2 = require('path').join(homeDir, '.antigravity-rtl.json');
            let merged = JSON.parse(data);
            [configPath1, configPath2].forEach(p => {
                try {
                    let existing = {};
                    if (require('fs').existsSync(p)) {
                        existing = JSON.parse(require('fs').readFileSync(p, 'utf8'));
                    }
                    require('fs').writeFileSync(p, JSON.stringify({ ...existing, ...merged }, null, 2));
                } catch (_) {}
            });
        } catch (e) {}
    } else if (typeof message === 'string' && message.startsWith('OPEN_EXTERNAL_URL|')) {
        try {
            const urlToOpen = message.substring(message.indexOf('|') + 1).trim();
            if (urlToOpen.startsWith('https://') || urlToOpen.startsWith('http://')) {
                require('electron').shell.openExternal(urlToOpen);
            }
        } catch (_) {}
    }
});
void win.loadURL(url);

win.webContents.on('dom-ready', () => {
    const currentURL = win.webContents.getURL();
    if (!currentURL || !/^https?:\/\/127\.0\.0\.1:\d+/i.test(currentURL)) {
        return;
    }
    try {
        const fontPath = require('path').join(__dirname, 'Vazirmatn-Variable.woff2');
        const fontBase64 = require('fs').existsSync(fontPath) ? require('fs').readFileSync(fontPath).toString('base64') : '';
        let snappFontBase64 = '';
        try {
            const snappPath = require('path').join(__dirname, 'SnappWeb2.0-Regular.woff');
            if (require('fs').existsSync(snappPath)) {
                snappFontBase64 = require('fs').readFileSync(snappPath).toString('base64');
            }
        } catch (_) {}

        let userConfig = { faFont: '', enFont: '', codeFont: '', lh: '1.6', fs: '16', isRTL: true, forceRTL: false, uiTheme: 'dark' };
        try {
            const homeDir = require('os').homedir();
            const cPath1 = require('path').join(homeDir, '.faliz-rtl.json');
            const cPath2 = require('path').join(homeDir, '.antigravity-rtl.json');
            const targetPath = require('fs').existsSync(cPath1) ? cPath1 : cPath2;
            if (require('fs').existsSync(targetPath)) {
                const cfg = JSON.parse(require('fs').readFileSync(targetPath, 'utf8'));
                userConfig = { ...userConfig, ...cfg };
            }
        } catch (e) {}

        win.webContents.executeJavaScript(`(() => {
            if (window.__FALIZ_RTL_LOADED__) return;
            window.__FALIZ_RTL_LOADED__ = true;

            function isAppDOMReady() {
                try {
                    if (!document || !document.body) return false;
                    const root = document.getElementById('root');
                    if (!root || !root.children || root.children.length === 0) return false;
                    return Boolean(document.querySelector('[role="navigation"]') || 
                                   document.querySelector('[role="main"]') || 
                                   document.querySelector('[contenteditable="true"]'));
                } catch (_) {
                    return false;
                }
            }

            function setupFAlizRTL() {
                const fontBase64 = '${fontBase64}';
                const snappFontBase64 = '${snappFontBase64}';
                const falizConfig = ${JSON.stringify(userConfig)};

                let isRTL = falizConfig.isRTL !== false;
                let forceRTL = Boolean(falizConfig.forceRTL);
                const savedFaFont = falizConfig.faFont || '';
                const savedEnFont = falizConfig.enFont || '';
                const savedCodeFont = falizConfig.codeFont || '';
                const savedLH = falizConfig.lh || '1.6';
                const savedFS = falizConfig.fs || '16';

                // Inject widget CSS styles
                if (!document.getElementById('faliz-widget-style')) {
                    let styleEl = document.createElement('style');
                    styleEl.id = 'faliz-widget-style';
                    styleEl.innerHTML = \`
                        #faliz-dropdown-panel,
                        #faliz-dropdown-panel[data-faliz-theme="dark"] {
                            --faliz-bg: #0d1117;
                            --faliz-bg-card: #161b22;
                            --faliz-bg-input: #10141a;
                            --faliz-border: #30363d;
                            --faliz-border-subtle: #21262d;
                            --faliz-text-primary: #f0f6fc;
                            --faliz-text-secondary: #c9d1d9;
                            --faliz-text-muted: #8b949e;
                            --faliz-accent: #0D9DF8;
                            --faliz-accent-gradient: linear-gradient(135deg, #0D9DF8 0%, #0F6FFA 100%);
                            --faliz-badge-bg: rgba(52, 198, 191, 0.15);
                            --faliz-badge-text: #34C6BF;
                            --faliz-badge-border: rgba(52, 198, 191, 0.35);
                            --faliz-shadow: 0 10px 28px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.15);
                        }
                        #faliz-dropdown-panel[data-faliz-theme="light"] {
                            --faliz-bg: #ffffff;
                            --faliz-bg-card: #f6f8fa;
                            --faliz-bg-input: #f6f8fa;
                            --faliz-border: #d0d7de;
                            --faliz-border-subtle: #e1e4e8;
                            --faliz-text-primary: #1f2328;
                            --faliz-text-secondary: #424a53;
                            --faliz-text-muted: #656d76;
                            --faliz-accent: #0F6FFA;
                            --faliz-accent-gradient: linear-gradient(135deg, #0F6FFA 0%, #0D9DF8 100%);
                            --faliz-badge-bg: rgba(26, 127, 55, 0.15);
                            --faliz-badge-text: #1a7f37;
                            --faliz-badge-border: rgba(26, 127, 55, 0.3);
                            --faliz-shadow: 0 10px 28px rgba(0, 0, 0, 0.12), 0 0 1px rgba(0, 0, 0, 0.08);
                        }
                        #faliz-dropdown-panel[data-faliz-theme="antigravity"] {
                            --faliz-bg: #050b14;
                            --faliz-bg-card: #08111f;
                            --faliz-bg-input: #02050a;
                            --faliz-border: rgba(52, 198, 191, 0.4);
                            --faliz-border-subtle: rgba(15, 111, 250, 0.3);
                            --faliz-text-primary: #ffffff;
                            --faliz-text-secondary: #34C6BF;
                            --faliz-text-muted: #0D9DF8;
                            --faliz-accent: #34C6BF;
                            --faliz-accent-gradient: linear-gradient(135deg, #0F6FFA 0%, #0D9DF8 35%, #34C6BF 65%, #89DB76 90%, #FA9138 100%);
                            --faliz-badge-bg: rgba(52, 198, 191, 0.2);
                            --faliz-badge-text: #89DB76;
                            --faliz-badge-border: rgba(52, 198, 191, 0.45);
                            --faliz-shadow: 0 10px 28px rgba(0, 0, 0, 0.7), 0 0 14px rgba(15, 111, 250, 0.3);
                        }
                        .faliz-theme-panel {
                            background-color: var(--faliz-bg) !important;
                            color: var(--faliz-text-primary) !important;
                            border: 1px solid var(--faliz-border) !important;
                            box-shadow: var(--faliz-shadow) !important;
                            border-radius: 12px !important;
                            transition: transform 0.16s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.16s ease, background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease !important;
                        }
                        #faliz-dropdown-panel * {
                            box-sizing: border-box;
                        }
                        #faliz-dropdown-panel .text-foreground,
                        #faliz-dropdown-panel span.text-foreground,
                        #faliz-dropdown-panel label {
                            color: var(--faliz-text-primary) !important;
                        }
                        #faliz-dropdown-panel .text-muted-foreground,
                        #faliz-dropdown-panel span.text-muted-foreground {
                            color: var(--faliz-text-muted) !important;
                        }
                        #faliz-dropdown-panel select.faliz-input option {
                            background-color: var(--faliz-bg-card) !important;
                            color: var(--faliz-text-primary) !important;
                        }
                        .faliz-theme-toggle-btn {
                            display: inline-flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                            width: 22px !important;
                            height: 22px !important;
                            padding: 0 !important;
                            border-radius: 6px !important;
                            background: var(--faliz-bg-card) !important;
                            border: 1px solid var(--faliz-border) !important;
                            color: var(--faliz-text-primary) !important;
                            cursor: pointer !important;
                            transition: all 0.2s ease !important;
                        }
                        .faliz-theme-toggle-btn:hover {
                            border-color: var(--faliz-accent) !important;
                            transform: scale(1.08) !important;
                        }
                        .faliz-separator {
                            height: 1px !important;
                            background-color: var(--faliz-border-subtle) !important;
                            margin: 6px -14px !important;
                            width: calc(100% + 28px) !important;
                            box-sizing: border-box !important;
                        }
                        .faliz-input {
                            font-size: 11.5px !important;
                            border-radius: 6px !important;
                            padding: 3px 8px !important;
                            height: 25px !important;
                            background-color: var(--faliz-bg-input) !important;
                            color: var(--faliz-text-primary) !important;
                            border: 1px solid var(--faliz-border) !important;
                            outline: none !important;
                            box-shadow: none !important;
                            transition: all 0.2s ease !important;
                            font-family: inherit !important;
                        }
                        .faliz-input:focus {
                            border-color: var(--faliz-accent) !important;
                            box-shadow: 0 0 0 2px rgba(13, 157, 248, 0.2) !important;
                        }
                        .faliz-input::placeholder {
                            color: var(--faliz-text-muted) !important;
                        }
                        .faliz-badge {
                            display: inline-flex !important;
                            align-items: center !important;
                            padding: 1px 6px !important;
                            border-radius: 10px !important;
                            font-size: 10px !important;
                            font-weight: 600 !important;
                            line-height: 1.3 !important;
                        }
                        .faliz-badge-active {
                            background-color: var(--faliz-badge-bg) !important;
                            color: var(--faliz-badge-text) !important;
                            border: 1px solid var(--faliz-badge-border) !important;
                        }
                        .faliz-badge-muted {
                            background-color: var(--faliz-border-subtle) !important;
                            color: var(--faliz-text-muted) !important;
                            border: 1px solid var(--faliz-border) !important;
                        }
                        .faliz-switch {
                            position: relative !important;
                            display: inline-block !important;
                            width: 36px !important;
                            height: 20px !important;
                            flex-shrink: 0 !important;
                            cursor: pointer !important;
                        }
                        .faliz-switch input {
                            opacity: 0 !important;
                            width: 0 !important;
                            height: 0 !important;
                            margin: 0 !important;
                            position: absolute !important;
                        }
                        .faliz-slider {
                            position: absolute !important;
                            cursor: pointer !important;
                            top: 0 !important;
                            left: 0 !important;
                            right: 0 !important;
                            bottom: 0 !important;
                            background-color: var(--faliz-border) !important;
                            transition: 0.22s cubic-bezier(0.16, 1, 0.3, 1) !important;
                            border-radius: 20px !important;
                        }
                        .faliz-slider:before {
                            position: absolute !important;
                            content: "" !important;
                            height: 14px !important;
                            width: 14px !important;
                            left: 3px !important;
                            bottom: 3px !important;
                            background-color: #ffffff !important;
                            transition: 0.22s cubic-bezier(0.16, 1, 0.3, 1) !important;
                            border-radius: 50% !important;
                            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35) !important;
                        }
                        .faliz-switch input:checked + .faliz-slider {
                            background: var(--faliz-accent-gradient) !important;
                        }
                        .faliz-switch input:checked + .faliz-slider:before {
                            transform: translateX(16px) !important;
                        }
                        .faliz-range {
                            -webkit-appearance: none !important;
                            appearance: none !important;
                            height: 4px !important;
                            border-radius: 4px !important;
                            background: var(--faliz-border-subtle) !important;
                            outline: none !important;
                            cursor: pointer !important;
                        }
                        .faliz-range::-webkit-slider-thumb {
                            -webkit-appearance: none !important;
                            appearance: none !important;
                            width: 12px !important;
                            height: 12px !important;
                            border-radius: 50% !important;
                            background: var(--faliz-accent) !important;
                            border: 2px solid var(--faliz-bg) !important;
                            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4) !important;
                            cursor: pointer !important;
                        }
                        .faliz-kbd {
                            display: inline-flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                            min-width: 18px !important;
                            height: 17px !important;
                            padding: 0 4px !important;
                            font-size: 10px !important;
                            font-weight: 600 !important;
                            color: var(--faliz-text-muted) !important;
                            background-color: var(--faliz-bg-card) !important;
                            border: 1px solid var(--faliz-border) !important;
                            border-radius: 4px !important;
                        }
                        [data-faliz-tooltip] {
                            position: relative !important;
                        }
                        [data-faliz-tooltip]:hover:after {
                            content: attr(data-faliz-tooltip) !important;
                            position: absolute !important;
                            bottom: 125% !important;
                            right: 50% !important;
                            transform: translateX(50%) !important;
                            background: var(--faliz-bg-card) !important;
                            color: var(--faliz-text-primary) !important;
                            border: 1px solid var(--faliz-border) !important;
                            padding: 4px 8px !important;
                            border-radius: 6px !important;
                            font-size: 11px !important;
                            white-space: normal !important;
                            width: 190px !important;
                            text-align: right !important;
                            line-height: 1.4 !important;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
                            z-index: 1000000 !important;
                            pointer-events: none !important;
                        }
                    \`;
                    document.head.appendChild(styleEl);
                }

                // Dynamic RTL typography style element
                const dynamicStyle = document.createElement('style');
                dynamicStyle.id = 'faliz-dynamic-typography';

                const applyStyleRules = (faFont, enFont, codeFont, lh, fs) => {
                    let faFontRule = '';
                    let faFontName = "'VazirmatnDefault'";

                    if (faFont === 'Snapp') {
                        faFontName = "'SnappDefault', 'VazirmatnDefault'";
                    } else if (faFont && faFont !== 'Vazirmatn') {
                        faFontName = "'UserPersianFont', 'VazirmatnDefault'";
                        let baseFaFont = faFont.replace(/[-\\s]?Regular$/i, '');
                        faFontRule = \`
                            @font-face {
                                font-family: 'UserPersianFont';
                                src: local('\${faFont}'), local('\${baseFaFont}');
                                font-weight: 400;
                                unicode-range: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF;
                            }
                            @font-face {
                                font-family: 'UserPersianFont';
                                src: local('\${baseFaFont} Bold'), local('\${baseFaFont}-Bold'), local('\${baseFaFont}Bold');
                                font-weight: 700;
                                unicode-range: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF;
                            }
                        \`;
                    }

                    let enFontStr = enFont ? \`'\${enFont}', ui-sans-serif, system-ui, sans-serif\` : 'ui-sans-serif, system-ui, sans-serif';
                    let codeFontStr = codeFont ? \`'\${codeFont}', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace\` : 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

                    let forceRtlStyle = (isRTL && forceRTL) ? \`
                        .prose > *:not(pre):not(code), 
                        [data-testid="chat-message"] > *:not(pre):not(code), 
                        .markdown-body > *:not(pre):not(code), 
                        .leading-relaxed > *:not(pre):not(code),
                        [data-testid="user-input-step"],
                        [data-testid="user-input-step"] > *:not(pre):not(code),
                        div:has(> [role="radiogroup"]),
                        label[for^="ask-opt-"] {
                            direction: rtl !important;
                            text-align: right !important;
                            unicode-bidi: isolate !important;
                        }
                    \` : '';

                    dynamicStyle.textContent = \`
                        \${faFontRule}
                        @font-face {
                            font-family: 'VazirmatnDefault';
                            src: url('data:font/woff2;base64,\${fontBase64}') format('woff2');
                            font-weight: 100 900;
                            unicode-range: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF;
                        }
                        @font-face {
                            font-family: 'SnappDefault';
                            src: url('data:font/woff;base64,\${snappFontBase64}') format('woff');
                            font-weight: 100 900;
                            unicode-range: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF;
                        }
                        :root, :host, html, body {
                            font-family: \${faFontName}, \${enFontStr}, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;
                        }
                        [dir="rtl"], [dir="rtl"] *:not(pre):not(code),
                        .prose, .prose *, [data-testid="chat-message"], [data-testid="chat-message"] *,
                        .markdown-body, .markdown-body *, .leading-relaxed, .leading-relaxed *,
                        [contenteditable="true"], [contenteditable="true"] *, [data-lexical-text="true"],
                        label[for^="ask-opt-"], textarea[data-testid="ask-question-writein"] {
                            font-family: \${faFontName}, \${enFontStr}, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;
                        }
                        .prose, [data-testid="chat-message"], .markdown-body, .leading-relaxed, [contenteditable="true"], [contenteditable="true"] p {
                            font-size: \${fs}px !important;
                        }
                        p, h1, h2, h3, h4, h5, h6, ul, ol {
                            unicode-bidi: plaintext;
                            text-align: start;
                        }
                        .prose > *, [data-testid="chat-message"] > *, .markdown-body > * {
                            unicode-bidi: plaintext;
                            text-align: start;
                        }
                        label[for^="ask-opt-"] {
                            unicode-bidi: plaintext;
                            text-align: start;
                        }
                        label[for^="ask-opt-"][dir="rtl"] {
                            direction: rtl;
                            text-align: right;
                        }
                        [data-testid="conversation-view"] {
                            text-align: start;
                        }
                        .prose pre, .prose code, .markdown-body pre, .markdown-body code,
                        [data-testid="chat-message"] pre, [data-testid="chat-message"] code,
                        .monaco-editor, .monaco-editor * {
                            direction: ltr !important;
                            text-align: left !important;
                            unicode-bidi: normal !important;
                        }
                        [data-testid="step-container"] {
                            direction: ltr !important;
                            text-align: left !important;
                        }
                        [data-testid="step-container"] pre, [data-testid="step-container"] code {
                            direction: ltr !important;
                            text-align: left !important;
                        }
                        .prose pre, .markdown-body pre, [data-testid="chat-message"] pre {
                            font-family: \${codeFontStr} !important;
                        }
                        [data-testid="conversation-view"] [data-component-name="button"]:has(span.text-xs) {
                            direction: ltr !important;
                        }
                        [data-testid="user-input-step"] {
                            text-align: start;
                        }
                        [data-testid="user-input-step"] > div {
                            text-align: start;
                        }
                        [data-testid="user-input-step"] p {
                            text-align: start;
                        }
                        div[data-testid="composer-speech-button"] {
                            direction: ltr !important;
                        }
                        [data-testid="composer-speech-button"] * {
                            direction: ltr !important;
                        }
                        [role="navigation"][aria-label="Sidebar"] *, .truncate {
                            unicode-bidi: plaintext !important;
                            text-align: start !important;
                        }
                        .prose p, .prose li, .markdown-body p, [data-testid="chat-message"] p, [data-testid="chat-message"] .leading-relaxed, .leading-relaxed, [data-testid="user-input-step"], [data-testid="user-input-step"] div, [data-lexical-text="true"], [contenteditable="true"], [contenteditable="true"] p, .pointer-events-none.absolute.overflow-hidden, label[for^="ask-opt-"] {
                            line-height: \${lh} !important;
                        }
                        \${forceRtlStyle}
                    \`;

                    if (isRTL) {
                        if (!dynamicStyle.parentNode) document.head.appendChild(dynamicStyle);
                    } else {
                        if (dynamicStyle.parentNode) dynamicStyle.parentNode.removeChild(dynamicStyle);
                    }
                    window.dispatchEvent(new Event('resize'));
                };

                // Initial CSS load
                if (isRTL) {
                    document.head.appendChild(dynamicStyle);
                    applyStyleRules(savedFaFont, savedEnFont, savedCodeFont, savedLH, savedFS);
                }

                // Text Direction Synchronizer
                function updateTextDirections() {
                    if (!isRTL) return;
                    document.querySelectorAll('[contenteditable="true"] p, [contenteditable="true"], textarea[data-testid="ask-question-writein"]').forEach(el => {
                        const raw = el.tagName === 'TEXTAREA' ? el.value : el.textContent;
                        const text = raw.replace(/[\\u200B-\\u200F\\uFEFF]/g, '').trim();
                        if (text.length > 0) {
                            const firstChar = text.match(/[\\p{L}\\p{N}]/u);
                            if (firstChar) {
                                const isPersian = /[\\u0600-\\u06FF\\u0750-\\u077F\\u08A0-\\u08FF\\uFB50-\\uFDFF\\uFE70-\\uFEFF]/.test(firstChar[0]);
                                el.setAttribute('dir', isPersian ? 'rtl' : 'ltr');
                            }
                        } else {
                            el.removeAttribute('dir');
                        }
                    });

                    document.querySelectorAll('.prose, [data-testid="chat-message"], .markdown-body, .leading-relaxed').forEach(container => {
                        container.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6').forEach(el => {
                            if (el.closest('pre, code, .monaco-editor')) return;
                            const text = el.textContent.replace(/[\\u200B-\\u200F\\uFEFF]/g, '').trim();
                            if (text.length > 0) {
                                const firstChar = text.match(/[\\p{L}\\p{N}]/u);
                                if (firstChar) {
                                    const isPersian = /[\\u0600-\\u06FF\\u0750-\\u077F\\u08A0-\\u08FF\\uFB50-\\uFDFF\\uFE70-\\uFEFF]/.test(firstChar[0]);
                                    el.setAttribute('dir', isPersian ? 'rtl' : 'ltr');
                                }
                            }
                        });
                    });
                }

                // UI Elements Construction
                const isMac = /Mac/i.test(navigator.userAgent || navigator.platform);
                const customIconSrc = 'data:image/png;base64,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';

                const triggerWrapper = document.createElement('div');
                triggerWrapper.id = 'faliz-topbar-wrapper';
                triggerWrapper.className = 'relative inline-flex items-center';
                triggerWrapper.style.appRegion = 'no-drag';
                triggerWrapper.innerHTML = \`
                    <button id="faliz-topbar-btn" type="button" class="inline-flex items-center font-medium transition-all select-none outline-none cursor-pointer justify-center disabled:opacity-50 border border-border bg-transparent text-secondary-foreground hover:text-foreground hover:bg-secondary h-7 rounded-md gap-1.5 px-2.5 text-[12.5px] whitespace-nowrap" style="app-region: no-drag; font-family: 'Vazirmatn', system-ui, sans-serif !important;" title="تنظیمات راست‌چین FAntigravity (Alt+R)">
                        <div class="relative flex items-center justify-center shrink-0 w-[15px] h-[15px]" style="width: 15px; height: 15px;">
                            <img src="\${customIconSrc}" class="w-full h-full object-contain shrink-0 rounded-[2px]" alt="FAntigravity" />
                            <span id="faliz-status-dot" class="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full \${isRTL ? 'bg-[#34C6BF]' : 'hidden'}"></span>
                        </div>
                        <span style="font-size: 12px; font-weight: 600;">FAntigravity</span>
                    </button>
                \`;

                const dropdownPanel = document.createElement('div');
                dropdownPanel.id = 'faliz-dropdown-panel';
                dropdownPanel.className = 'faliz-theme-panel fixed flex flex-col text-sm w-[290px] origin-top-right scale-0 opacity-0 pointer-events-none p-3.5 shadow-2xl';
                dropdownPanel.style.direction = 'rtl';
                dropdownPanel.style.textAlign = 'right';
                dropdownPanel.style.zIndex = '999999';
                dropdownPanel.style.fontFamily = "'Vazirmatn', system-ui, -apple-system, sans-serif !important";

                dropdownPanel.innerHTML = \`
                    <!-- Header -->
                    <div class="flex items-center justify-between pb-2">
                        <div class="flex items-center gap-2">
                            <img src="\${customIconSrc}" class="w-5 h-5 object-contain rounded-md" alt="FAntigravity" />
                            <div class="flex flex-col">
                                <span class="text-xs font-bold leading-tight" style="background: var(--faliz-accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">FAntigravity</span>
                                <span class="text-[10px] leading-none" style="color: var(--faliz-text-muted) !important;">راستچین ایجنت هوش مصنوعی</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <button id="faliz-theme-btn" type="button" class="faliz-theme-toggle-btn" title="تغییر تم">
                            </button>
                        </div>
                    </div>

                    <div class="faliz-separator"></div>

                    <!-- Toggle Controls -->
                    <div class="flex flex-col gap-2 py-1">
                        <!-- Master Enable Toggle -->
                        <div class="flex items-center justify-between gap-3 px-0.5 h-7">
                            <div class="flex items-center gap-1.5">
                                <span class="font-semibold text-xs opacity-90 text-foreground">فعال‌سازی راست‌چین</span>
                                <span id="faliz-toggle-state-badge" class="faliz-badge \${isRTL ? 'faliz-badge-active' : 'faliz-badge-muted'}">\${isRTL ? 'روشن' : 'خاموش'}</span>
                            </div>
                            <label class="faliz-switch" title="فعال / غیرفعال کردن راست‌چین">
                                <input type="checkbox" id="faliz-toggle-checkbox" \${isRTL ? 'checked' : ''}>
                                <span class="faliz-slider"></span>
                            </label>
                        </div>

                        <!-- Force RTL Toggle -->
                        <div id="faliz-force-row" class="flex items-center justify-between gap-3 px-0.5 h-7 transition-opacity \${isRTL ? '' : 'opacity-40 pointer-events-none'}">
                            <div class="flex items-center gap-1.5">
                                <span class="font-medium text-xs opacity-85 text-foreground">راست‌چین اجباری</span>
                                <span class="cursor-help inline-flex items-center text-muted-foreground hover:text-foreground" data-faliz-tooltip="اجبار تمام پیام‌ها به حالت راست‌چین حتی اگر با متن انگلیسی شروع شوند">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                </span>
                            </div>
                            <label class="faliz-switch" title="راست‌چین اجباری تمام متون">
                                <input type="checkbox" id="faliz-force-checkbox" \${forceRTL ? 'checked' : ''}>
                                <span class="faliz-slider"></span>
                            </label>
                        </div>
                    </div>

                    <div class="faliz-separator"></div>

                    <!-- Typography Controls -->
                    <div id="faliz-settings-wrapper" class="flex flex-col gap-2 py-1 transition-all duration-200 \${isRTL ? '' : 'opacity-40 pointer-events-none'}">
                        <!-- Persian Font Selection -->
                        <div class="flex items-center justify-between gap-2 px-0.5 h-7">
                            <span class="font-medium text-xs opacity-85 whitespace-nowrap text-foreground">فونت فارسی:</span>
                            <select id="faliz-fafont-select" class="faliz-input cursor-pointer" style="width: 145px;">
                                <option value="Vazirmatn" \${(!savedFaFont || savedFaFont === 'Vazirmatn') ? 'selected' : ''}>وزیرمتن (پیش‌فرض)</option>
                                <option value="Snapp" \${savedFaFont === 'Snapp' ? 'selected' : ''}>اسنپ (Snapp)</option>
                                <option value="custom" \${(savedFaFont && savedFaFont !== 'Vazirmatn' && savedFaFont !== 'Snapp') ? 'selected' : ''}>فونت دلخواه از سیستم...</option>
                            </select>
                        </div>

                        <!-- Custom Font Input -->
                        <div id="faliz-customfont-row" class="flex items-center justify-between gap-2 px-0.5 h-7 \${(savedFaFont && savedFaFont !== 'Vazirmatn' && savedFaFont !== 'Snapp') ? '' : 'hidden'}">
                            <span class="font-medium text-[11px] opacity-70 whitespace-nowrap pr-1 text-muted-foreground">↳ نام فونت:</span>
                            <input id="faliz-fafont-input" type="text" placeholder="مثلاً: IRANSans یا B Nazanin" value="\${(savedFaFont !== 'Vazirmatn' && savedFaFont !== 'Snapp') ? savedFaFont : ''}" class="faliz-input" style="width: 145px;">
                        </div>

                        <!-- English Font -->
                        <div class="flex items-center justify-between gap-2 px-0.5 h-7">
                            <span class="font-medium text-xs opacity-85 whitespace-nowrap text-foreground">فونت انگلیسی:</span>
                            <input id="faliz-enfont-input" type="text" placeholder="پیش‌فرض: سیستم" value="\${savedEnFont}" class="faliz-input" style="width: 145px;">
                        </div>

                        <!-- Code Font -->
                        <div class="flex items-center justify-between gap-2 px-0.5 h-7">
                            <span class="font-medium text-xs opacity-85 whitespace-nowrap text-foreground">فونت کد (Mono):</span>
                            <input id="faliz-codefont-input" type="text" placeholder="پیش‌فرض: سیستم" value="\${savedCodeFont}" class="faliz-input" style="width: 145px;">
                        </div>

                        <div class="faliz-separator" style="margin: 4px -14px !important;"></div>

                        <!-- Line Height -->
                        <div class="flex items-center justify-between gap-2 px-0.5 h-7">
                            <div class="flex items-center gap-1.5">
                                <span class="font-medium text-xs opacity-85 whitespace-nowrap text-foreground">فاصله خطوط:</span>
                                <span id="faliz-lh-badge" class="faliz-badge faliz-badge-muted">\${savedLH}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <input id="faliz-lh-input" type="range" min="1.2" max="2.5" step="0.1" value="\${savedLH}" class="faliz-range w-[85px] cursor-pointer">
                                <button id="faliz-lh-reset" type="button" class="opacity-60 hover:opacity-100 transition-opacity cursor-pointer p-0.5 text-muted-foreground hover:text-foreground" title="بازنشانی به ۱.۶">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                                </button>
                            </div>
                        </div>

                        <!-- Font Size -->
                        <div class="flex items-center justify-between gap-2 px-0.5 h-7">
                            <div class="flex items-center gap-1.5">
                                <span class="font-medium text-xs opacity-85 whitespace-nowrap text-foreground">اندازه فونت:</span>
                                <span id="faliz-fs-badge" class="faliz-badge faliz-badge-muted">\${savedFS}px</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <input id="faliz-fs-input" type="range" min="11" max="22" step="1" value="\${savedFS}" class="faliz-range w-[85px] cursor-pointer">
                                <button id="faliz-fs-reset" type="button" class="opacity-60 hover:opacity-100 transition-opacity cursor-pointer p-0.5 text-muted-foreground hover:text-foreground" title="بازنشانی به ۱۶">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="faliz-separator"></div>

                    <!-- Footer Developer Credit -->
                    <div class="flex items-center justify-center pt-1.5 pb-0.5 text-[11px] font-medium select-none" style="color: var(--faliz-text-muted) !important;">
                        <span>Developed with ❤️ by <a id="faliz-dev-link" href="https://github.com/Alizjahan" target="_blank" rel="noopener noreferrer" style="color: var(--faliz-accent); font-weight: 700; text-decoration: none; cursor: pointer; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.75'; this.style.textDecoration='underline';" onmouseout="this.style.opacity='1'; this.style.textDecoration='none';">Aliz</a></span>
                    </div>
                \`;

                // Themes definition & management
                const FALIZ_THEMES = [
                    {
                        id: 'dark',
                        title: 'تم دارک (ماه)',
                        icon: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
                    },
                    {
                        id: 'light',
                        title: 'تم لایت (خورشید)',
                        icon: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
                    },
                    {
                        id: 'antigravity',
                        title: 'تم ستاره آنتی‌گرویتی',
                        icon: '<svg viewBox="0 0 24 24" width="13" height="13" fill="url(#falizThemeStarGrad)" stroke="#34C6BF" stroke-width="1.2"><defs><linearGradient id="falizThemeStarGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0F6FFA"/><stop offset="35%" stop-color="#0D9DF8"/><stop offset="70%" stop-color="#34C6BF"/><stop offset="92%" stop-color="#89DB76"/><stop offset="100%" stop-color="#FA9138"/></linearGradient></defs><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
                    }
                ];

                let currentTheme = falizConfig.uiTheme || 'dark';

                // DOM Cache
                const topbarBtn = triggerWrapper.querySelector('#faliz-topbar-btn');
                const statusDot = triggerWrapper.querySelector('#faliz-status-dot');
                const themeBtn = dropdownPanel.querySelector('#faliz-theme-btn');
                const toggleCheckbox = dropdownPanel.querySelector('#faliz-toggle-checkbox');
                const toggleStateBadge = dropdownPanel.querySelector('#faliz-toggle-state-badge');
                const forceCheckbox = dropdownPanel.querySelector('#faliz-force-checkbox');
                const forceRow = dropdownPanel.querySelector('#faliz-force-row');
                const settingsWrapper = dropdownPanel.querySelector('#faliz-settings-wrapper');
                const faFontSelect = dropdownPanel.querySelector('#faliz-fafont-select');
                const customFontRow = dropdownPanel.querySelector('#faliz-customfont-row');
                const faFontInput = dropdownPanel.querySelector('#faliz-fafont-input');
                const enFontInput = dropdownPanel.querySelector('#faliz-enfont-input');
                const codeFontInput = dropdownPanel.querySelector('#faliz-codefont-input');
                const lhInput = dropdownPanel.querySelector('#faliz-lh-input');
                const lhBadge = dropdownPanel.querySelector('#faliz-lh-badge');
                const lhResetBtn = dropdownPanel.querySelector('#faliz-lh-reset');
                const fsInput = dropdownPanel.querySelector('#faliz-fs-input');
                const fsBadge = dropdownPanel.querySelector('#faliz-fs-badge');
                const fsResetBtn = dropdownPanel.querySelector('#faliz-fs-reset');

                function applyTheme(themeId) {
                    if (!['dark', 'light', 'antigravity'].includes(themeId)) themeId = 'dark';
                    currentTheme = themeId;
                    dropdownPanel.setAttribute('data-faliz-theme', themeId);
                    const themeObj = FALIZ_THEMES.find(t => t.id === themeId) || FALIZ_THEMES[0];
                    if (themeBtn) {
                        themeBtn.innerHTML = themeObj.icon;
                        themeBtn.title = 'تم فعلی: ' + themeObj.title + ' (کلیک برای تغییر)';
                    }
                }

                applyTheme(currentTheme);

                const getEffectiveFaFont = () => {
                    if (faFontSelect.value === 'Snapp') return 'Snapp';
                    if (faFontSelect.value === 'custom') return faFontInput.value.trim() || 'Vazirmatn';
                    return 'Vazirmatn';
                };

                const refreshCSS = () => applyStyleRules(getEffectiveFaFont(), enFontInput.value.trim(), codeFontInput.value.trim(), lhInput.value, fsInput.value);

                function persistUserPreferences() {
                    try {
                        const cfgObj = {
                            faFont: getEffectiveFaFont(),
                            enFont: enFontInput.value.trim(),
                            codeFont: codeFontInput.value.trim(),
                            lh: lhInput.value,
                            fs: fsInput.value,
                            isRTL: isRTL,
                            forceRTL: forceRTL,
                            uiTheme: currentTheme
                        };
                        console.log("SAVE_FALIZ_CONFIG|" + JSON.stringify(cfgObj));
                    } catch (_) {}
                }

                function setDirectionActive(active) {
                    isRTL = active;
                    persistUserPreferences();
                    toggleCheckbox.checked = isRTL;

                    if (isRTL) {
                        toggleStateBadge.textContent = 'روشن';
                        toggleStateBadge.className = 'faliz-badge faliz-badge-active';
                        forceRow.classList.remove('opacity-40', 'pointer-events-none');
                        settingsWrapper.classList.remove('opacity-40', 'pointer-events-none');
                        if (statusDot) statusDot.className = 'absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#34C6BF]';
                        if (!dynamicStyle.parentNode) document.head.appendChild(dynamicStyle);
                        refreshCSS();
                        updateTextDirections();
                    } else {
                        toggleStateBadge.textContent = 'خاموش';
                        toggleStateBadge.className = 'faliz-badge faliz-badge-muted';
                        forceRow.classList.add('opacity-40', 'pointer-events-none');
                        settingsWrapper.classList.add('opacity-40', 'pointer-events-none');
                        if (statusDot) statusDot.className = 'absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full hidden';
                        if (dynamicStyle.parentNode) dynamicStyle.parentNode.removeChild(dynamicStyle);
                        document.querySelectorAll('[dir]').forEach(el => el.removeAttribute('dir'));
                        window.dispatchEvent(new Event('resize'));
                    }
                }

                // Event Listeners
                if (themeBtn) {
                    themeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const currIdx = FALIZ_THEMES.findIndex(t => t.id === currentTheme);
                        const nextIdx = (currIdx + 1) % FALIZ_THEMES.length;
                        applyTheme(FALIZ_THEMES[nextIdx].id);
                        persistUserPreferences();
                    });
                }

                toggleCheckbox.addEventListener('change', () => {
                    setDirectionActive(toggleCheckbox.checked);
                });

                forceCheckbox.addEventListener('change', () => {
                    if (!isRTL) return;
                    forceRTL = forceCheckbox.checked;
                    persistUserPreferences();
                    refreshCSS();
                    updateTextDirections();
                });

                faFontSelect.addEventListener('change', () => {
                    if (faFontSelect.value === 'custom') {
                        customFontRow.classList.remove('hidden');
                        faFontInput.focus();
                    } else {
                        customFontRow.classList.add('hidden');
                    }
                    persistUserPreferences();
                    refreshCSS();
                });

                [faFontInput, enFontInput, codeFontInput].forEach(input => {
                    input.addEventListener('input', () => {
                        persistUserPreferences();
                        refreshCSS();
                    });
                });

                lhInput.addEventListener('input', () => {
                    lhBadge.textContent = lhInput.value;
                    persistUserPreferences();
                    refreshCSS();
                });
                lhResetBtn.addEventListener('click', () => {
                    lhInput.value = '1.6';
                    lhBadge.textContent = '1.6';
                    persistUserPreferences();
                    refreshCSS();
                });

                fsInput.addEventListener('input', () => {
                    fsBadge.textContent = fsInput.value + 'px';
                    persistUserPreferences();
                    refreshCSS();
                });
                fsResetBtn.addEventListener('click', () => {
                    fsInput.value = '16';
                    fsBadge.textContent = '16px';
                    persistUserPreferences();
                    refreshCSS();
                });

                const devLink = dropdownPanel.querySelector('#faliz-dev-link');
                if (devLink) {
                    devLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        try {
                            console.log('OPEN_EXTERNAL_URL|https://github.com/Alizjahan');
                            window.open('https://github.com/Alizjahan', '_blank');
                        } catch (_) {}
                    });
                }

                // Dropdown Toggle & Placement
                let isPanelOpen = false;
                function positionDropdown() {
                    const rect = topbarBtn.getBoundingClientRect();
                    dropdownPanel.style.top = (rect.bottom + 6) + 'px';
                    // Align right side of dropdown with right side of button
                    const rightEdge = window.innerWidth - rect.right;
                    dropdownPanel.style.right = Math.max(12, rightEdge) + 'px';
                }

                function openDropdown() {
                    positionDropdown();
                    dropdownPanel.classList.remove('scale-0', 'opacity-0', 'pointer-events-none');
                    dropdownPanel.classList.add('scale-100', 'opacity-100');
                    isPanelOpen = true;
                }

                function closeDropdown() {
                    dropdownPanel.classList.remove('scale-100', 'opacity-100');
                    dropdownPanel.classList.add('scale-0', 'opacity-0', 'pointer-events-none');
                    isPanelOpen = false;
                }

                topbarBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (isPanelOpen) closeDropdown();
                    else openDropdown();
                });

                dropdownPanel.addEventListener('click', (e) => e.stopPropagation());

                document.addEventListener('click', () => {
                    if (isPanelOpen) closeDropdown();
                });

                window.addEventListener('resize', () => {
                    if (isPanelOpen) positionDropdown();
                });

                window.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && isPanelOpen) {
                        closeDropdown();
                    } else if (e.altKey && (e.key === 'r' || e.key === 'R' || e.code === 'KeyR')) {
                        e.preventDefault();
                        setDirectionActive(!isRTL);
                    }
                });

                // Mount Components
                function mountControls() {
                    if (!document.getElementById('faliz-topbar-wrapper')) {
                        const targetArea = document.querySelector('[data-testid="titlebar-more-actions"]')?.parentElement
                            || document.querySelector('[data-testid="install-editor"]')?.parentElement;
                        if (targetArea) {
                            targetArea.appendChild(triggerWrapper);
                        }
                    }
                    if (!document.getElementById('faliz-dropdown-panel')) {
                        document.body.appendChild(dropdownPanel);
                    }
                }

                mountControls();

                const domObserver = new MutationObserver(() => {
                    if (!document.getElementById('faliz-topbar-wrapper') || !document.getElementById('faliz-dropdown-panel')) {
                        mountControls();
                    }
                    updateTextDirections();
                });
                domObserver.observe(document.body, { childList: true, subtree: true });

                setInterval(updateTextDirections, 1500);
            }

            let isStarted = false;
            let checkInterval = null;
            let observerRef = null;

            function tryStart() {
                if (isStarted) return;
                if (isAppDOMReady()) {
                    isStarted = true;
                    if (checkInterval) clearInterval(checkInterval);
                    if (observerRef) try { observerRef.disconnect(); } catch (_) {}
                    setupFAlizRTL();
                }
            }

            tryStart();
            if (!isStarted) {
                try {
                    observerRef = new MutationObserver(() => tryStart());
                    observerRef.observe(document.documentElement || document.body, { childList: true, subtree: true });
                } catch (_) {}
                checkInterval = setInterval(tryStart, 250);
            }
        })();`).catch(err => console.error("FAliz RTL initialization error:", err));
    } catch(e) {
        console.error("FAliz RTL error:", e);
    }
});
