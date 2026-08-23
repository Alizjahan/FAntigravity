/**
 * Antigravity RTL Client-Side Script for Antigravity IDE
 * Injected into workbench window
 */
(function() {
    try {
        if (window.__antigravity_rtl_injected) return;
        window.__antigravity_rtl_injected = true;


        const fontBase64 = '__FONT_BASE64__';
        const rtlConfig = __RTL_CONFIG__;

        // In-memory reactive state
        const state = {
            isRTL: rtlConfig.isRTL !== false,
            forceRTL: Boolean(rtlConfig.forceRTL),
            fixAtSign: rtlConfig.fixAtSign !== false,
            faFont: rtlConfig.faFont || '',
            enFont: rtlConfig.enFont || '',
            codeFont: rtlConfig.codeFont || '',
            lh: rtlConfig.lh || '1.6',
            fs: rtlConfig.fs || '16'
        };

        // Style elements
        let rtlStyle = document.getElementById('antigravity-rtl-style');
        if (!rtlStyle) {
            rtlStyle = document.createElement('style');
            rtlStyle.id = 'antigravity-rtl-style';
            document.head.appendChild(rtlStyle);
        }

        let disabledStyle = document.getElementById('antigravity-rtl-disabled-style');
        if (!disabledStyle) {
            disabledStyle = document.createElement('style');
            disabledStyle.id = 'antigravity-rtl-disabled-style';
            document.head.appendChild(disabledStyle);
        }

        function updateDynamicCSS() {
            if (!state.isRTL) {
                rtlStyle.textContent = '';
                // Strict LTR alignment when user explicitly disables RTL
                disabledStyle.textContent = `
                    [data-testid="conversation-view"] p,
                    [data-testid="conversation-view"] li,
                    [data-testid="conversation-view"] span,
                    .prose p, .prose li, .prose span,
                    .markdown-body p, .markdown-body li,
                    [data-testid="chat-message"] p,
                    .leading-relaxed, .leading-relaxed p,
                    [contenteditable="true"], [contenteditable="true"] p {
                        direction: ltr !important;
                        text-align: left !important;
                        unicode-bidi: normal !important;
                    }
                `;
                return;
            }

            disabledStyle.textContent = '';

            let faFontRule = '';
            let faFontName = "'PersianOnlyFont'";

            if (state.faFont) {
                faFontName = "'UserPersianFont', 'PersianOnlyFont'";
                const baseFaFont = state.faFont.replace(/[-\s]?Regular$/i, '');
                faFontRule = `
                    @font-face {
                        font-family: 'UserPersianFont';
                        src: local('${state.faFont}'), local('${baseFaFont}');
                        font-weight: 400;
                        unicode-range: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF;
                    }
                    @font-face {
                        font-family: 'UserPersianFont';
                        src: local('${baseFaFont} Bold'), local('${baseFaFont}-Bold'), local('${baseFaFont}Bold');
                        font-weight: 700;
                        unicode-range: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF;
                    }
                `;
            }

            const enFontStr = state.enFont ? `'${state.enFont}', ui-sans-serif, system-ui, sans-serif` : 'ui-sans-serif, system-ui, sans-serif';
            const fontStack = `${faFontName}, ${enFontStr}, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;
            const codeFontRule = state.codeFont ? `font-family: '${state.codeFont}', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;` : '';

            const forceRtlStyle = state.forceRTL ? `
                .prose > *:not(pre):not(code), 
                [data-testid="chat-message"] > *:not(pre):not(code), 
                .markdown-body > *:not(pre):not(code), 
                .leading-relaxed > *:not(pre):not(code),
                [data-testid="user-input-step"],
                [data-testid="user-input-step"] > *:not(pre):not(code),
                div:has(> [role="radiogroup"]),
                label[for^="ask-opt-"],
                [data-testid="conversation-view"] > *:not(pre):not(code) {
                    direction: rtl !important;
                    text-align: right !important;
                    unicode-bidi: isolate !important;
                }
            ` : '';

            rtlStyle.textContent = `
                ${faFontRule}
                @font-face {
                    font-family: 'PersianOnlyFont';
                    src: local('Vazirmatn'), local('Vazirmatn Variable'), local('Vazir'),
                         url('data:font/woff2;base64,${fontBase64}') format('woff2');
                    font-weight: 100 900;
                    unicode-range: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF;
                }

                :root {
                    --vscode-chat-font-family: ${fontStack} !important;
                }
                :root, :host, html, body {
                    font-family: ${fontStack} !important;
                }

                /* Apply Vazirmatn font to conversation and text elements */
                [dir="rtl"],
                [dir="rtl"] *:not(.codicon):not([class*="codicon-"]):not(.google-symbols):not(pre):not(code):not(.monaco-editor):not(.monaco-editor *),
                [data-testid="conversation-view"] p,
                [data-testid="conversation-view"] li,
                [data-testid="conversation-view"] span,
                [data-testid="conversation-view"] h1,
                [data-testid="conversation-view"] h2,
                [data-testid="conversation-view"] h3,
                [data-testid="conversation-view"] h4,
                [data-testid="conversation-view"] [contenteditable="true"],
                .leading-relaxed,
                .leading-relaxed p,
                .leading-relaxed li,
                .leading-relaxed span,
                .rendered-markdown,
                .rendered-markdown p,
                .rendered-markdown li,
                .rendered-markdown span,
                .prose,
                .prose p,
                .prose li,
                .markdown-body,
                .markdown-body p,
                .markdown-body li,
                [data-testid="chat-message"],
                [data-testid="chat-message"] p,
                [data-testid="user-input-step"],
                [data-testid="user-input-step"] *,
                [contenteditable="true"],
                [contenteditable="true"] p,
                [contenteditable="true"] span,
                [data-lexical-text="true"],
                label[for^="ask-opt-"],
                textarea[data-testid="ask-question-writein"] {
                    font-family: ${fontStack} !important;
                }

                .prose, [data-testid="chat-message"], .markdown-body, .leading-relaxed, [contenteditable="true"], [contenteditable="true"] p, [data-testid="conversation-view"] {
                    font-size: ${state.fs}px !important;
                }

                p, h1, h2, h3, h4, h5, h6, ul, ol {
                    unicode-bidi: plaintext;
                    text-align: start;
                }
                .prose > *, [data-testid="chat-message"] > *, .markdown-body > *, [data-testid="conversation-view"] * {
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
                textarea[data-testid="ask-question-writein"] {
                    unicode-bidi: plaintext;
                    text-align: start;
                }

                ${forceRtlStyle}

                /* RTL List Padding Fix */
                ul:not(#_)[dir="rtl"], ol:not(#_)[dir="rtl"],
                [dir="rtl"] ul:not(#_), [dir="rtl"] ol:not(#_) {
                    padding-left: 0 !important;
                    padding-right: 1.25rem !important;
                }

                /* Thinking Blocks (Keep LTR) */
                .cursor-edit.text-secondary-foreground,
                .cursor-edit.text-secondary-foreground * {
                    direction: ltr !important;
                    text-align: left !important;
                    unicode-bidi: isolate !important;
                }

                /* AI Response & Chat Line Height */
                .leading-relaxed,
                .prose p, .prose li, .markdown-body p, [data-testid="chat-message"] p,
                [data-testid="chat-message"] .leading-relaxed, [data-testid="user-input-step"],
                [data-testid="user-input-step"] div, [data-lexical-text="true"],
                [contenteditable="true"], [contenteditable="true"] p,
                label[for^="ask-opt-"], [data-testid="conversation-view"] p {
                    line-height: ${state.lh} !important;
                }

                [contenteditable="true"], [contenteditable="true"] * {
                    unicode-bidi: isolate !important;
                    text-align: start !important;
                }

                /* Protect icon fonts from override */
                .codicon, [class*="codicon-"] {
                    font-family: codicon !important;
                }
                .google-symbols {
                    font-family: "Google Symbols" !important;
                }

                /* Strict Protection & Custom Font for Monaco Code Editor, Diff Editor, and Terminal */
                pre, code, pre *, code *,
                .monaco-editor, .monaco-editor *,
                .monaco-diff-editor, .monaco-diff-editor *,
                .part.terminal, .part.terminal *,
                .terminal-wrapper, .terminal-wrapper *,
                .xterm, .xterm * {
                    direction: ltr !important;
                    text-align: left !important;
                    unicode-bidi: normal !important;
                    ${codeFontRule}
                }
            `;
        }

        function saveConfig() {
            try {
                const payload = JSON.stringify(state);
                console.log("SAVE_RTL_CONFIG|" + payload);
            } catch (e) {
                console.error('[Antigravity RTL] Save config error:', e);
            }
        }

        // Input & DOM Direction Logic
        function updateDir() {
            if (!state.isRTL) {
                document.querySelectorAll(`
                    .prose > *, [data-testid="chat-message"] > *, .markdown-body > *,
                    .leading-relaxed > *, [data-testid="conversation-view"] p, [data-testid="conversation-view"] li,
                    [contenteditable="true"], [contenteditable="true"] p
                `).forEach(el => {
                    if (el.getAttribute('dir') !== 'ltr') el.setAttribute('dir', 'ltr');
                });
                return;
            }

            // Editable inputs
            document.querySelectorAll('[contenteditable="true"] p, [contenteditable="true"], textarea[data-testid="ask-question-writein"]').forEach(el => {
                const raw = el.tagName === 'TEXTAREA' ? el.value : el.textContent;
                const text = (raw || '').replace(/[\u200B-\u200F\uFEFF]/g, '').trim();
                if (text.length > 0) {
                    const isRtlText = /^[^a-zA-Z]*[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(text);
                    const newDir = isRtlText ? 'rtl' : 'ltr';
                    if (el.getAttribute('dir') !== newDir) el.setAttribute('dir', newDir);
                } else {
                    if (el.hasAttribute('dir')) el.removeAttribute('dir');
                }
            });

            // Chat Output, Conversation View & Options
            document.querySelectorAll(`
                .prose > *, 
                [data-testid="chat-message"] > *, 
                .markdown-body > *, 
                .leading-relaxed > *,
                [data-testid="user-input-step"],
                [data-testid="user-input-step"] > *,
                [data-testid="conversation-view"] p,
                [data-testid="conversation-view"] li,
                div:has(> [role="radiogroup"]),
                label[for^="ask-opt-"]
            `).forEach(el => {
                if (el.tagName === 'PRE' || el.tagName === 'CODE' || el.closest('.monaco-editor') || el.closest('.terminal')) return;

                const text = (el.textContent || '').replace(/[\u200B-\u200F\uFEFF]/g, '').trim();
                let dir = 'auto';

                if (state.forceRTL) {
                    dir = 'rtl';
                } else if (text) {
                    const firstChar = text.match(/[A-Za-z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/);
                    if (firstChar) {
                        const isPersianOrArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(firstChar[0]);
                        dir = isPersianOrArabic ? 'rtl' : 'ltr';
                    }
                }

                if (el.getAttribute('dir') !== dir) {
                    el.setAttribute('dir', dir);
                }
            });
        }

        function el(tag, styles, children, attrs) {
            const element = document.createElement(tag);
            if (styles) element.style.cssText = styles;
            if (attrs) Object.assign(element, attrs);
            if (children) {
                if (typeof children === 'string') {
                    element.textContent = children;
                } else if (Array.isArray(children)) {
                    for (const child of children) {
                        if (child) element.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
                    }
                } else {
                    element.appendChild(children);
                }
            }
            return element;
        }

        // Settings Panel Creation (Pure DOM - immune to Trusted Types & CSP)
        function ensureSettingsPanel() {
            let panel = document.getElementById('antigravity-rtl-settings-panel');
            if (panel) return panel;

            panel = el('div', `
                display: none;
                position: fixed;
                z-index: 100000;
                bottom: 28px;
                right: 12px;
                width: 290px;
                background: var(--vscode-editorWidget-background, #1e293b);
                color: var(--vscode-editorWidget-foreground, #f3f4f6);
                border: 1px solid var(--vscode-widget-border, #334155);
                border-radius: 12px;
                box-shadow: 0 16px 40px rgba(0, 0, 0, 0.65);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                font-size: 12px;
                padding: 14px;
                direction: ltr;
                box-sizing: border-box;
                user-select: none;
            `, null, { id: 'antigravity-rtl-settings-panel' });

            // 1. Header
            const headerTitle = el('div', null, [
                el('span', 'font-weight:600;font-size:13px;display:block;', 'Antigravity RTL'),
                el('span', 'font-size:10px;color:var(--vscode-descriptionForeground,#94a3b8);', 'Settings & Font Control')
            ]);
            const closeBtn = el('button', 'background:none;border:none;color:inherit;cursor:pointer;font-size:16px;line-height:1;opacity:0.7;padding:4px;', '✕', { id: 'rtl-panel-close-btn', type: 'button', title: 'Close' });
            const header = el('div', 'display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--vscode-widget-border, rgba(255,255,255,0.15));', [headerTitle, closeBtn]);
            panel.appendChild(header);

            // 2. Master Toggle
            const toggleLabel = el('span', 'font-weight:500;font-size:12px;', state.isRTL ? 'Enabled' : 'Disabled', { id: 'rtl-panel-toggle-label' });
            const masterKnob = el('span', `display:block;width:16px;height:16px;border-radius:50%;background:#ffffff;position:absolute;top:3px;left:${state.isRTL ? '21px' : '3px'};transition:left 0.2s;`, null, { id: 'rtl-panel-master-knob' });
            const masterBtn = el('button', `cursor:pointer;width:40px;height:22px;border-radius:11px;border:none;background:${state.isRTL ? 'var(--vscode-button-background, #3b82f6)' : '#64748b'};position:relative;padding:0;outline:none;transition:background 0.2s;`, [masterKnob], { id: 'rtl-panel-master-btn', type: 'button' });
            const masterRow = el('div', 'display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;', [toggleLabel, masterBtn]);
            panel.appendChild(masterRow);

            // 3. Panel Body
            const panelBody = el('div', `display:flex;flex-direction:column;gap:9px;opacity:${state.isRTL ? '1' : '0.4'};pointer-events:${state.isRTL ? 'auto' : 'none'};transition:opacity 0.2s;`, null, { id: 'rtl-panel-body' });

            // Force RTL Toggle
            const forceLabel = el('span', 'font-size:11px;color:var(--vscode-descriptionForeground,#94a3b8);', 'Force RTL', { title: 'Force conversation text to RTL direction' });
            const forceKnob = el('span', `display:block;width:12px;height:12px;border-radius:50%;background:#ffffff;position:absolute;top:3px;left:${state.forceRTL ? '19px' : '3px'};transition:left 0.2s;`, null, { id: 'rtl-panel-force-knob' });
            const forceBtn = el('button', `cursor:pointer;width:34px;height:18px;border-radius:9px;border:none;background:${state.forceRTL ? 'var(--vscode-button-background, #3b82f6)' : '#64748b'};position:relative;padding:0;outline:none;transition:background 0.2s;`, [forceKnob], { id: 'rtl-panel-force-btn', type: 'button' });
            panelBody.appendChild(el('div', 'display:flex;align-items:center;justify-content:space-between;', [forceLabel, forceBtn]));

            panelBody.appendChild(el('div', 'height:1px;background:var(--vscode-widget-border,rgba(255,255,255,0.1));margin:2px 0;'));

            const inputStyle = 'width:140px;padding:4px 8px;font-size:11px;border-radius:5px;border:1px solid var(--vscode-input-border,#334155);background:var(--vscode-input-background,#0f172a);color:var(--vscode-input-foreground,#f3f4f6);outline:none;box-sizing:border-box;';

            // FA Font
            const faInput = el('input', inputStyle, null, { id: 'rtl-panel-fa-font', type: 'text', placeholder: 'Default: Vazirmatn', value: state.faFont });
            panelBody.appendChild(el('div', 'display:flex;align-items:center;justify-content:space-between;gap:8px;', [
                el('span', 'font-size:11px;white-space:nowrap;', 'FA Font', { title: 'Persian/Arabic Font' }),
                faInput
            ]));

            // EN Font
            const enInput = el('input', inputStyle, null, { id: 'rtl-panel-en-font', type: 'text', placeholder: 'Default: System', value: state.enFont });
            panelBody.appendChild(el('div', 'display:flex;align-items:center;justify-content:space-between;gap:8px;', [
                el('span', 'font-size:11px;white-space:nowrap;', 'EN Font', { title: 'English UI Font' }),
                enInput
            ]));

            // Code Font
            const codeInput = el('input', inputStyle, null, { id: 'rtl-panel-code-font', type: 'text', placeholder: 'Monaco, Consolas', value: state.codeFont });
            panelBody.appendChild(el('div', 'display:flex;align-items:center;justify-content:space-between;gap:8px;', [
                el('span', 'font-size:11px;white-space:nowrap;', 'Code Font', { title: 'Monaco Editor & Terminal Font' }),
                codeInput
            ]));

            // Line Height
            const lhInput = el('input', 'width:85px;cursor:pointer;', null, { id: 'rtl-panel-lh', type: 'range', min: '1.2', max: '2.5', step: '0.1', value: state.lh });
            const lhReset = el('button', 'background:none;border:none;color:inherit;opacity:0.6;cursor:pointer;padding:0;font-size:10px;', '↺', { id: 'rtl-panel-lh-reset', type: 'button', title: 'Reset to 1.6' });
            panelBody.appendChild(el('div', 'display:flex;align-items:center;justify-content:space-between;', [
                el('span', 'font-size:11px;', 'Line Height'),
                el('div', 'display:flex;align-items:center;gap:6px;', [lhInput, lhReset])
            ]));

            // Font Size
            const fsInput = el('input', 'width:85px;cursor:pointer;', null, { id: 'rtl-panel-fs', type: 'range', min: '11', max: '22', step: '1', value: state.fs });
            const fsReset = el('button', 'background:none;border:none;color:inherit;opacity:0.6;cursor:pointer;padding:0;font-size:10px;', '↺', { id: 'rtl-panel-fs-reset', type: 'button', title: 'Reset to 16px' });
            panelBody.appendChild(el('div', 'display:flex;align-items:center;justify-content:space-between;', [
                el('span', 'font-size:11px;', 'Font Size'),
                el('div', 'display:flex;align-items:center;gap:6px;', [fsInput, fsReset])
            ]));

            panelBody.appendChild(el('div', 'height:1px;background:var(--vscode-widget-border,rgba(255,255,255,0.1));margin:2px 0;'));

            // Shift+2 for @
            const atLabel = el('span', 'font-size:11px;color:var(--vscode-descriptionForeground,#94a3b8);', 'Shift+2 for @', { title: 'Type @ using Shift+2 in Persian layout' });
            const atKnob = el('span', `display:block;width:12px;height:12px;border-radius:50%;background:#ffffff;position:absolute;top:3px;left:${state.fixAtSign ? '19px' : '3px'};transition:left 0.2s;`, null, { id: 'rtl-panel-at-knob' });
            const atBtn = el('button', `cursor:pointer;width:34px;height:18px;border-radius:9px;border:none;background:${state.fixAtSign ? 'var(--vscode-button-background, #3b82f6)' : '#64748b'};position:relative;padding:0;outline:none;transition:background 0.2s;`, [atKnob], { id: 'rtl-panel-at-btn', type: 'button' });
            panelBody.appendChild(el('div', 'display:flex;align-items:center;justify-content:space-between;', [atLabel, atBtn]));

            panel.appendChild(panelBody);

            // 4. Footer
            const footerLink = el('a', 'color:var(--vscode-textLink-foreground,#3b82f6);text-decoration:none;font-weight:700;cursor:pointer;', 'Aliz', { href: 'https://github.com/Alizjahan', target: '_blank' });
            footerLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.require) {
                    try { window.require('electron').shell.openExternal('https://github.com/Alizjahan'); return; } catch(_) {}
                }
                window.open('https://github.com/Alizjahan', '_blank');
            });
            const footerText = el('span', 'font-size:11px;color:var(--vscode-descriptionForeground,#94a3b8);opacity:0.8;', ['توسعه‌یافته با ❤️ توسط ', footerLink]);
            const footer = el('div', 'margin-top:10px;padding-top:8px;border-top:1px solid var(--vscode-widget-border,rgba(255,255,255,0.1));text-align:center;', [footerText]);
            panel.appendChild(footer);

            document.body.appendChild(panel);

            // Bind events
            closeBtn.addEventListener('click', () => { panel.style.display = 'none'; });
            masterBtn.addEventListener('click', () => { setRTLActive(!state.isRTL); });
            forceBtn.addEventListener('click', () => {
                state.forceRTL = !state.forceRTL;
                saveConfig();
                updateUI();
            });
            atBtn.addEventListener('click', () => {
                state.fixAtSign = !state.fixAtSign;
                saveConfig();
                updateUI();
            });

            faInput.addEventListener('input', (e) => {
                state.faFont = e.target.value.trim();
                saveConfig();
                updateDynamicCSS();
            });
            enInput.addEventListener('input', (e) => {
                state.enFont = e.target.value.trim();
                saveConfig();
                updateDynamicCSS();
            });
            codeInput.addEventListener('input', (e) => {
                state.codeFont = e.target.value.trim();
                saveConfig();
                updateDynamicCSS();
            });
            lhInput.addEventListener('input', (e) => {
                state.lh = e.target.value;
                saveConfig();
                updateDynamicCSS();
            });
            lhReset.addEventListener('click', () => {
                state.lh = '1.6';
                lhInput.value = '1.6';
                saveConfig();
                updateDynamicCSS();
            });
            fsInput.addEventListener('input', (e) => {
                state.fs = e.target.value;
                saveConfig();
                updateDynamicCSS();
            });
            fsReset.addEventListener('click', () => {
                state.fs = '16';
                fsInput.value = '16';
                saveConfig();
                updateDynamicCSS();
            });

            return panel;
        }

        function toggleSettingsPanel() {
            const panel = ensureSettingsPanel();
            if (panel.style.display === 'block') {
                panel.style.display = 'none';
            } else {
                updateUI();
                panel.style.display = 'block';
            }
        }

        function updateUI() {
            updateDynamicCSS();
            updateDir();

            // Update Status Bar Item
            const statusLink = document.getElementById('antigravity-rtl-statusbar-btn');
            if (statusLink) {
                statusLink.innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAANF0lEQVR4AexZe5SV1XX/nf097vvOzGUeFAEhgoiGGJHGSqwNCNG0RExRkuaxFkmDVqM1pimpSuw0moY0LKslWBlb06axWWISH/ii0aAoA4ZEBTvCADMMzINhHty57/t93/nOyf5Y8kcSXMxkLllDnLPOWd+959t3n71/e5+9z9mX8B5v4wC8xx0A4x4w7gHvcQTGt8B73AHGg+D4FhjfAr8nBIaGvjAvd+yam92+j90nDy1+1H174aPy53+23nv+8q85jyxYWt7wyXNGI4q8Zcln5C3Lmsq3feF9I+FzWrdAc/O9kV+kV97amr52V1n07Ywmy+usKvdWo9pdbqW85cZE7yZzurfGnp5/wqjat8d7cO7u8r996AG5bsGy4kOfmTwcRQqrls2TKxc9bmScHxh5rBTHsl8czu9O0Jw2AP6357ar0u/f+7pd7d8Hmz6QcwV6BqGGMlq5Ra10CUplfOWnHaU8CbNGWWa9nBOKOzcaTuZHdueevfKuS3bIOy9f79++6MbyP1xxVfH2qz/s8ZC3ffTj3vUL71QrFrwY6R7YaWTUNbrfAgYsUNEqnFBuOM/TAsC67q+vchLmc30qct7L7aZ6sdtW2wcMtbvfQ+vRIjoGCkjnS5AkQGEbgFB+WSnlQClopUwFw0DM8OQlhlO+icq5B0KFwnORdP+rZt/gq0a6/JRZUPeIHBaKtA01mFQoJoCyBWnEtmEEreIAfL1jzeq++IRvv9Rdj+faatUb+Wq0uxH0yBD6lI0BaWCwJHE0nUd/TwbZ3hJ8X0AEQGgBuCy9MJUKh5WyeEhDqSEofYznB/n9IEHzUGlbqWxCqUINKx+HcKLwy9TRft7kZqZ81/6bLyoKwJc7HvrLdnv63Zv3NqB1aILKIo4yoighgRzFkaYYMkYMRSsKJ2TDtQTKRRfFw3nIox5AIcDmIVksT7CsJhCOA8lq6HAVA5JUSiSV1tUKsgZw2OpOCHBNQEcgLev+CxobAwj5t8PrvNLwCE9FdW9mY2p3btKG17onI+sllSficCgBHY7BiEUgYjHIaAxezIIfY24RgjSIZefvpgkv40IeyUN7BhCKMAEr5RpgJqwgP9l7mBnAisJjpcs857D4TEMIkzLd3aEZtJ5/OKLOHEZE/67Ez3TUf/WAOq82n7WUTxEY0SgE1aG763xs27EQj//fdfp7m7+o179wk27avkI/c3CxPuhOAUUlwjxU2IIEsXszCIUiwEEAhg34gaLvjDKDEiheZrEdnuPPJELkp3RGvj/yV6Kpid3oXUU86QvmdNL5EU1+tXdzbP9Q7V+nBwhGKATDTOBo6zQ0PzsPW1+4FL/cdRFaDs4Wew7PFjvb/kT8eNenjdXN3zKu2/I/9Pk37qPv5z5Fx6qnUTQVIjNiEhVZw8wQIBkIUwKsN5Tg7wSwxdl1QEFrCJN/DnW7F4avDG1Y9/aIhH6HmDm+82kUj5cPTl2YMSbXkxDQMonDzVNwaNcUuFYc9lQD9jmE8CwT9nQBc3qS7FqvHI4c21gq4uaftiz+xI0v3/HZz791w11P5S/+yTGKt4tIFBSziJRD5BaJRIEoUiKq5jGR56Yr0jMkvOnuI87FiQ9F197/Gn7HVhEADucTCzwOcMILq75f1KBcSsI+24ZdZ4ESBiI1NohdVmVTZPY5r/xRUc0tN9Z/0ru3dj3+SzyBh0OPbPnGkruXfqlpWaP43vmSGi6TOvqPPuxnpaa9ytM9vuf2+175oK8LL0uj9E1ZHfqgveHhz8a+9i89GEWrCACutC8QPqG4jyO2irDirDAZLBYhFrWhDmqUDkfIKhZ3raw5svjQPbV7+OVJ+7q/nelYq57aZt215Rvmd175C2v91tn9qYvPzcy4YMabC66dZf7w+Y9Y//34anvdw7tOymCEkxUBQJAx0e9lVgUb4aQJUgBpQiRqwN3rIdehyIgbqKn2VgUKjlBGTFy7tjChcV123g03jDjInWotOhXBcN77biik+4BQ2AD5rLwvYIcEdLcfKA9KRTiOOb3Xz0lvHQ6/3ycNjXYxrSGQMWDw8cNgZsRBO/AA09Uotvkg9gLBw4ygr3HB9DKTjKlOlZCGGABLMqfAQXnYAvB7FNwyfwgLkA1QxOCNgTHXKgKAyAEGu77ByhN7gslPZ0CDTAryNYQFBoGj5JhTn+UarUxCQFNZaIM9gFjxAAhR1JAFDdNgAARB8nwxZzMFsLH0/embSg995MXsP33i9aGvLGsbWrkom711ltbaGI4sziuLr/O2LFqd37hi4nDoT0VTEQ+wPQaB1QsAMDWg8hrKJSiec4cEqoyS+vDc/dPuHHz8zb0FteewllsGwtZP0jH6USbk//SI09HS23vV29lDizY4+z++VLff2vBrgmstvDeWzpfbL9tkU3qjqbN327nWe36N5nf8UhEABFsYLkvgCtZewM0wAGnA1D4u/Gg/Fi7bhymczXtE6sIjfjzUkTXQlrbU/nRIHciFcQRRI2sb5+qkfz2i6SfKpddavdfn/1LtvPxZueOy5/3tl7aYXu82QxeX6C5eqJsXdGDziqPuNGoOzIABYBMBgi2uSkCBo3/qbAdz/yaH+kvKyPo2hvIR5ZRIKR1VoLjSRgw+xVAQMTWgEqqLb5Bt+bDqdAilsK4yk+5ckch/zIiXr6SYmq1KLmSfp7SjFQwBHYpuxjDaqUgqAgDYIHDAdR2g3O4hPtPDtC9peEkD/f1RHBmK48BANXb1pLCjqw7NXCzZ2VuL/dkUMnyv12YVtFUFN1KFciSusmZYDYiQyouwymlSffmiGig5Kqs0dFRTyUevPfmiJ1CBVjEAhA/4gwqiTmLCChvpoo3OzjDauiM40BPFgaNRtDEY+/vjaOlLYUdPPZ7uqMfGtgY8eagO2wZT2FOoxSFZi8OiFm26Cv/vWmjhYNojbQyKCNJ2CG5tAkPJurvElWsLFdAflQFAkQa7vqt8hK62kSma6Os1MJSz4Dkmu4UFKnEulGFARCHZ/R1RhaKsRb9bj5bsRPysrwFPs4ds6qnBc71JbD0WxW6u83WoFLpEDXqtONRZVdTqRZ+ctHTzQ6hQqwgAive+m2WJLhVwooT8IOBlOSB2AXKvAdnClnsrCvf1BNw32NX3T4CTTVHeqqchmkQD/hTql1PRI89GBz8P+lPRrqagXU9Cm6hDRzhFQ2c1UGsp+bOf1/zpp3mlivWKACBzCl4dJ4CZBJeLl6pPQHWyjHkB0zRgJ0zY1TZMywKGIiT3TSDv1alwt9Z45a7qUl6fhYHIHOqx5tBhmk0HxUxqpxnUEZlBPalzqcuaLDtyqfs32auvumFeI1dJULFWEQC052s1B1B8CVI9GuCDkD1BwG4gRM8ihBIsb7+E6iWu9hiIOIVHq7K5q+s2Y3b9Y9Wzksfs+XZe3e7l7WcKxarWdLGud9Bp6Boo1+9IZ1PfKZTeN/cr8x78ctO8eUG4ZWaV61QJVn611pgESFaeuLRtp4CgwMsXIOheD7ntZThHQWRrtypWWl54IP6pgf9Mbupsbmhre3JC56Hl07Z3XTFrTc+iDy7pWDh/9oXiopmXG8vOffGSFZf+8I9vXvXd+be8VQk5T8ajIgDoKUIFcYDKgBVYm0EwbPaILonMTrY8521jSgjRGnl7/5rEYycT5MScEEI/tqA+/6/zBYfVE7On70kVYV1LmjgpWSEBUrzvScDI+ci/ybkxKoBUmEi4vZ+b2z3isjVOc6sIANJWgk+DIN7+waHI4g/OPoUgJhADQHGCbWP3uj+fycel06zRCNlXBABD03EAAuWFZBRyGk6/4GIID9s4Hg8oIjg/YMw1qoRE5AkVVII021fwmcBPayhHgILKCO9/wdkPJleOMPZaRQAQntbHre8CARAqHygqQMTsGYDgvCmMP2AAgosQcYY+PtgDNMdvEjjeiHcEFCC0YDQw5lpFhAqqQAYrHowAhGArHLc3p0MEg5OB8vgaO+bUR+Cco5eKlGEEWSDY//wPJ+9/wGSDH7c+Ky/YA4yy4hLJ6Nc6FYeRvqeR/uBk9IajQgEA4KOwz4EQHABNAU6LggeOF0xJ6u0Yg23UAFy3sTPiS5EQHAADSyuuEINBEEEQUBpCEImszNXBe3oM6o9RA3BgV7xe+KgNsgA8jSAFEgTrysrz/hchwNby3r13JPmSzNNjrNNo5clK+3xhGLZga8ss5/+SQJD3SQhQjMguuM3XDrR8E2O0jRoAp2RdE8R3VdbK5/s/h0MSJp8AooIs6b10vl1a0tRU+WtspfAcNQC+xDzFZwAliawEjyrBhQ+/25buHTfX/PMVr66pHpPR/wSAowYgpJy/g+P9wCT5WMhw1sbs0rUfSB264Mi/h77V2NjICfDEUmPzOWoAOh5MvHS0yf7ckf+wlnduCP99+3ejP37h2+dkxqa6vy3VqAH4bZZn1sw4AGeWvSov7bgHVB7TM4vjuAecWfaqvLRnvAeMFpJfAQAA//+/y5lfAAAABklEQVQDANGNpsyr6Ki1AAAAAElFTkSuQmCC" style="width:13px;height:13px;margin-right:4px;vertical-align:middle;display:inline-block;border-radius:2px;" alt="RTL" /><span>' + (state.isRTL ? '⇄ RTL: On' : '⇄ RTL: Off') + '</span>';
                statusLink.style.color = state.isRTL ? '#38bdf8' : 'inherit';
            }

            // Update Panel State
            const toggleLabel = document.getElementById('rtl-panel-toggle-label');
            if (toggleLabel) toggleLabel.textContent = state.isRTL ? 'Enabled' : 'Disabled';

            const masterBtn = document.getElementById('rtl-panel-master-btn');
            const masterKnob = document.getElementById('rtl-panel-master-knob');
            if (masterBtn && masterKnob) {
                masterBtn.style.background = state.isRTL ? 'var(--vscode-button-background, #3b82f6)' : '#64748b';
                masterKnob.style.left = state.isRTL ? '21px' : '3px';
            }

            const panelBody = document.getElementById('rtl-panel-body');
            if (panelBody) {
                panelBody.style.opacity = state.isRTL ? '1' : '0.4';
                panelBody.style.pointerEvents = state.isRTL ? 'auto' : 'none';
            }

            const forceBtn = document.getElementById('rtl-panel-force-btn');
            const forceKnob = document.getElementById('rtl-panel-force-knob');
            if (forceBtn && forceKnob) {
                forceBtn.style.background = state.forceRTL ? 'var(--vscode-button-background, #3b82f6)' : '#64748b';
                forceKnob.style.left = state.forceRTL ? '19px' : '3px';
            }

            const atBtn = document.getElementById('rtl-panel-at-btn');
            const atKnob = document.getElementById('rtl-panel-at-knob');
            if (atBtn && atKnob) {
                atBtn.style.background = state.fixAtSign ? 'var(--vscode-button-background, #3b82f6)' : '#64748b';
                atKnob.style.left = state.fixAtSign ? '19px' : '3px';
            }
        }

        function setRTLActive(active) {
            state.isRTL = active;
            saveConfig();
            updateUI();
        }

        function getStatusBarTarget() {
            return document.querySelector('.part.statusbar .right-items') || 
                   document.querySelector('.part.statusbar .items-container.right-items') ||
                   document.querySelector('[id="workbench.parts.statusbar"] .right-items') ||
                   document.querySelector('.part.statusbar') ||
                   document.querySelector('[id="workbench.parts.statusbar"]');
        }

        // Insert VS Code Status Bar Item (Right side)
        function tryInsertStatusBarItem() {
            const statusBar = getStatusBarTarget();
            if (!statusBar) return;

            let statusItem = document.getElementById('antigravity-rtl-statusbar-btn');
            if (!statusItem) {
                statusItem = document.createElement('a');
                statusItem.id = 'antigravity-rtl-statusbar-btn';
                statusItem.className = 'statusbar-item right';
                statusItem.href = '#';
                statusItem.style.cssText = `
                    cursor: pointer !important;
                    padding: 0 8px !important;
                    display: inline-flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    font-size: 11px !important;
                    height: 100% !important;
                    line-height: 22px !important;
                    user-select: none !important;
                    text-decoration: none !important;
                    white-space: nowrap !important;
                    color: ${state.isRTL ? '#38bdf8' : 'inherit'} !important;
                    opacity: 0.95;
                    box-sizing: border-box !important;
                `;
                statusItem.title = 'Antigravity RTL (Click to open settings, Alt+R to toggle)';
                statusItem.innerHTML = '<img src="data:image/png;base64,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" style="width:13px;height:13px;margin-right:4px;vertical-align:middle;display:inline-block;border-radius:2px;" alt="RTL" /><span>' + (state.isRTL ? '⇄ RTL: On' : '⇄ RTL: Off') + '</span>';

                statusItem.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleSettingsPanel();
                });

                statusItem.addEventListener('mouseenter', () => {
                    statusItem.style.backgroundColor = 'var(--vscode-statusBarItem-hoverBackground, rgba(255,255,255,0.12))';
                });
                statusItem.addEventListener('mouseleave', () => {
                    statusItem.style.backgroundColor = 'transparent';
                });
            }
            if (statusBar.firstChild !== statusItem) statusBar.prepend(statusItem);
        }

        // Outside click & Escape to close settings panel
        document.addEventListener('click', (e) => {
            const panel = document.getElementById('antigravity-rtl-settings-panel');
            const statusItem = document.getElementById('antigravity-rtl-statusbar-btn');
            if (panel && panel.style.display === 'block') {
                if (panel.contains(e.target)) return;
                if (statusItem && (statusItem === e.target || statusItem.contains(e.target))) return;
                panel.style.display = 'none';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const panel = document.getElementById('antigravity-rtl-settings-panel');
                if (panel && panel.style.display === 'block') {
                    panel.style.display = 'none';
                }
            }
        });

        // Keyboard layout shortcuts
        document.addEventListener('keydown', (e) => {
            // Alt + R to toggle RTL
            if (e.altKey && e.code === 'KeyR') {
                e.preventDefault();
                setRTLActive(!state.isRTL);
            }
        });

        // Persian Keyboard Shift + 2 fix for @
        document.addEventListener('keydown', (e) => {
            if (!state.fixAtSign) return;
            if (e.code === 'Digit2' && e.shiftKey) {
                if (e.key === '٬' || e.key === '،') {
                    e.preventDefault();
                    document.execCommand('insertText', false, '@');
                }
            }
        }, { capture: true });

        // Throttled dynamic UI updater
        let domUpdateTimer = null;

        function scheduleDOMUpdate() {
            if (domUpdateTimer) return;
            domUpdateTimer = setTimeout(() => {
                domUpdateTimer = null;
                updateDir();
                tryInsertStatusBarItem();
            }, 400);
        }

        document.body.addEventListener('input', scheduleDOMUpdate, { capture: true });
        document.body.addEventListener('focusin', scheduleDOMUpdate, { capture: true });

        const observer = new MutationObserver((mutations) => {
            const hasExternal = mutations.some(m => [...m.addedNodes].some(node => !node.id || !node.id.startsWith('antigravity-rtl')));
            if (hasExternal) scheduleDOMUpdate();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Initial run
        updateUI();
        tryInsertStatusBarItem();

    } catch (e) {
        console.error('[Antigravity RTL Client Error]', e);
    }
})();
