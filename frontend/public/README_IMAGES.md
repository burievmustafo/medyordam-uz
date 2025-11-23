# Favicon va OG Image Qo'shish

## Favicon

1. Favicon yaratish:
   - Favicon generator: https://realfavicongenerator.net/
   - Yoki: https://favicon.io/
   
2. Quyidagi fayllarni `frontend/public/` papkasiga qo'ying:
   - `favicon.svg` (yoki `favicon.ico`)
   - `apple-touch-icon.png` (180x180px)

## OG Image (Open Graph Image)

1. OG Image yaratish:
   - O'lchami: 1200x630px
   - Format: PNG yoki JPG
   - Nom: `og-image.png`
   
2. Faylni `frontend/public/og-image.png` ga qo'ying

## Tezkor yechim

Agar hozircha rasm yo'q bo'lsa, quyidagi buyruqlarni ishlatib, oddiy favicon yarating:

```bash
# SVG favicon yaratish (oddiy)
echo '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#0284c7"/><text x="50" y="60" font-size="40" fill="white" text-anchor="middle">M</text></svg>' > frontend/public/favicon.svg
```

Yoki online tool'lardan foydalaning:
- https://favicon.io/favicon-generator/
- https://realfavicongenerator.net/

