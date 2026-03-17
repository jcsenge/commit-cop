# Icon Placeholder

This is a placeholder SVG icon for Commit Cop! 🚔

## To Replace:

1. Create your custom icon (128x128 PNG recommended)
2. Save it as `icon.png` in this directory
3. Update `package.json` to reference it:
   ```json
   "icon": "icon.png"
   ```

## Current Icon:
- Blue police badge with star
- Cop sunglasses
- Whistle
- "HOOK POLICE" text

Feel free to replace `icon.svg` with your own design or convert it to PNG!

## Converting SVG to PNG:

```bash
# Using ImageMagick
convert icon.svg -resize 128x128 icon.png

# Using Inkscape
inkscape icon.svg --export-filename=icon.png --export-width=128 --export-height=128

# Or just use an online converter
```

The icon will show up in:
- VSCode Extensions marketplace
- Extension panel
- Extension icon in the sidebar
