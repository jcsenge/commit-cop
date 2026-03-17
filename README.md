# 🚔 Commit Cop

**You have the right to remain hooked.**

Commit Cop is an aggressively enforcing VSCode extension that automatically installs and watches your pre-commit hooks. Say goodbye to teammates bypassing hooks!

## Features

- 🚨 **Auto-installs hooks** on workspace open
- 👮 **Watches `.git/hooks`** folder and reinstalls if hooks are deleted
- 🔊 **Notifications** when hooks are installed or tampered with
- ⚙️ **Configurable** hook installation command
- 🎯 **Multi-workspace** support

## Configuration

```json
{
  "commitCop.hookCommand": "npx husky install",
  "commitCop.aggressive": true,
  "commitCop.watchHooks": true,
  "commitCop.showNotifications": true
}
```

### Settings

- **`commitCop.hookCommand`** - Command to install hooks (default: `npx husky install`)
- **`commitCop.aggressive`** - Reinstall hooks on every workspace open (default: `true`)
- **`commitCop.watchHooks`** - Watch for hook deletion and reinstall (default: `true`)
- **`commitCop.showNotifications`** - Show notifications (default: `true`)

## Commands

- `Commit Cop: Install Pre-Commit Hooks` - Manually trigger hook installation
- `Commit Cop: Check Hook Status` - Check current hook status in all workspaces

## Usage

1. Install the extension
2. Open any workspace with a `.git` folder
3. Hooks are automatically installed
4. Try to delete a pre-commit hook... I dare you 😏

## Requirements

- A hook management tool (e.g., Husky, pre-commit, etc.)
- Git repository

## FAQ

**Q: Can I disable the aggressive mode?**
A: Yes, set `commitCop.aggressive` to `false`. But why would you? 🤔

**Q: What if I use a different hook manager?**
A: Change `commitCop.hookCommand` to your installation command!

**Q: Will this work with Husky?**
A: Yes! Works great with Husky, pre-commit, or any hook installer.

**Q: I deleted the hooks and they came back!**
A: That's the point. 🚔

## License

MIT

---

*"Stop! You violated the law!"* - Commit Cop
