<p align="center">
  <img src="https://raw.githubusercontent.com/Alizjahan/FAntigravity-App-RTL-Persian-Arabic/main/header2.jpg" alt="FAntigravity App Banner" width="100%">
</p>

# دليل أداة FAntigravity-App-RTL-Persian-Arabic

أداة **FAntigravity-App-RTL-Persian-Arabic** هي محرك ذكي مخصص لتطبيق **Google Antigravity Standalone Desktop (Electron)** لتفعيل المحاذاة من اليمين إلى اليسار (RTL) وضبط الخطوط العربية والفارسية باحترافية تامة، دون المساس بالأكواد البرمجية أو الطرفية المدمجة.

[English Documentation](./README.md) | [راهنمای فارسی](./README_FA.md) | [الدليل العربي](./README_AR.md)

---

## 🎯 الميزات الرئيسية

- **واجهة مستخدم ثلاثية اللغات (عربي - فارسي - إنجليزي)**:
  - زر تبديل اللغة المباشر في رأس النافذة للتبديل الفوري بين العربية، الفارسية، والإنجليزية.
- **۳ خطوط مدمجة تعمل محلياً دون إنترنت (Offline Fonts)**:
  - **خط دبي (Dubai Font)**: خط عصري متناسق وعالي الوضوح للغتين العربية والفارسية.
  - **خط وزير متن (Vazirmatn Variable)**: خط فارسي وعربي عالي الدقة.
  - **خط سناب (Snapp Web)**: خط أنيق إضافي مدمج.
  - **خطوط النظام المخصصة**: إمكانية استخدام أي خط مثبت على جهازك (Amiri, Cairo, Traditional Arabic, Segoe UI...).
- **عزل الأكواد البرمجية (Strict Code Preservation)**:
  - كتل الأكواد البرمجية داخل `<pre>` و `<code>` والطرفية تبقى دائماً من اليسار لليمين وبخط Monospace البرمجي.
- **تخصيص مستقل لخط النصوص الإنجليزية وخط الأكواد**:
  - إمكانية اختيار خط مستقل للكلمات الإنجليزية وخط خاص للأكواد.
- **وضع المحاذاة الإجبارية (Force RTL)**:
  - خيار لمحاذاة كافة الرسائل لليمين حتى لو بدأت بأرقام أو مصطلحات إنجليزية.
- **نظام السمات الثلاثي (Themes)**:
  - سمة داكنة (Dark)، سمة فاتحة (Light)، وسمة أنتجرافيتي الخاصة (Antigravity Star).
- **أمان كامل ونسخ احتياطي فوري (.bak)**:
  - إنشاء نسخة احتياطية فورية قبل أي تعديل لتمكين استعادة النسخة الأصلية بنقرة واحدة.

---

## 🚀 التثبيت والاستخدام السريع

يمكنك تفعيل المحرك بضغطة واحدة وبدون الحاجة لتحميل المشروع:

```bash
npx -y -p github:Alizjahan/FAntigravity-App-RTL-Persian-Arabic fantigravity
```

### استعادة النسخة الأصلية (Uninstallation)
لاسترجاع تطبيق Antigravity إلى حالته الأصلية بدون أي تعديل:

```bash
npx -y -p github:Alizjahan/FAntigravity-App-RTL-Persian-Arabic fantigravity --restore
```

---

## ⌨️ اختصارات لوحة المفاتيح

- **`Alt + R`**: تفعيل أو تعطيل المحاذاة لليمين فوراً.
- **زر الواجهة في الشريط العلوي**: فتح لوحة التحكم بالخطوط، تباعد الأسطر، وحجم الخط.

---

## 👨‍💻 المطور

تم التطوير بواسطة **Aliz ([@Alizjahan](https://github.com/Alizjahan))**
- غيت هاب: [https://github.com/Alizjahan](https://github.com/Alizjahan)
- تيليجرام: [https://t.me/Alizjahan](https://t.me/Alizjahan)

---

## 📄 الترخيص

هذا المشروع مرخص بموجب رخصة [MIT License](LICENSE).
