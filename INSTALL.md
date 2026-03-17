# Installation Guide

## For Development

1. **Install dependencies**
   ```bash
   cd commit-cop
   npm install
   ```

2. **Compile TypeScript**
   ```bash
   npm run compile
   ```

3. **Test in VSCode**
   - Press `F5` in VSCode to open Extension Development Host
   - Open a workspace with a git repository
   - Watch the magic happen! 🚔

## For Distribution

1. **Package the extension**
   ```bash
   npm run package
   ```
   This creates a `.vsix` file.

2. **Install the VSIX**
   - Open VSCode
   - Go to Extensions (Cmd+Shift+X)
   - Click the `...` menu → "Install from VSIX..."
   - Select the `commit-cop-*.vsix` file

## Publish to Marketplace (Optional)

1. **Get a Personal Access Token** from Azure DevOps
2. **Create publisher**
   ```bash
   npx vsce create-publisher <your-publisher-name>
   ```

3. **Login**
   ```bash
   npx vsce login <your-publisher-name>
   ```

4. **Publish**
   ```bash
   npx vsce publish
   ```

## Configuration

Add to your `settings.json`:

```json
{
  "commitCop.hookCommand": "npx husky install",
  "commitCop.aggressive": true,
  "commitCop.watchHooks": true,
  "commitCop.showNotifications": true
}
```

## Usage

Once installed:
- Opens any workspace → Hooks auto-install 🚨
- Delete a hook → Gets reinstalled immediately 👮
- Run commands from Command Palette (Cmd+Shift+P):
  - "Commit Cop: Install Pre-Commit Hooks"
  - "Commit Cop: Check Hook Status"

---

**You have the right to remain hooked!** 🚔
