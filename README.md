# 🚔 Commit Cop

**You have the right to remain hooked.**

Auto-installs and watches your pre-commit hooks. Delete them? They come back. 😏

> ⚠️ **VIBECODED DISCLAIMER**: Built with AI, caffeine, and chaos. Works on my machine™. If it breaks, that's a feature.

## Install

```bash
git clone https://github.com/jcsenge/commit-cop.git
cd commit-cop
npm install && npm run compile && npm run package
code --install-extension commit-cop-0.0.1.vsix
```

## Config

| Setting | Default | Description |
|---------|---------|-------------|
| `commitCop.hookCommand` | `npx husky install` | Hook install command |
| `commitCop.aggressive` | `true` | Reinstall on workspace open |
| `commitCop.watchHooks` | `true` | Watch & restore deleted hooks |
| `commitCop.showNotifications` | `true` | Show notifications |

