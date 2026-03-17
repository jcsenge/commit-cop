import * as vscode from 'vscode';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

const getConfig = () => vscode.workspace.getConfiguration('commitCop');

const getGitHooksPath = (folder: vscode.WorkspaceFolder) =>
  vscode.Uri.joinPath(folder.uri, '.git', 'hooks');

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

const forEachGitFolder = async (
  callback: (folder: vscode.WorkspaceFolder) => Promise<void>
) => {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders) return;

  await Promise.all(
    folders.map(async (folder) => {
      const gitPath = vscode.Uri.joinPath(folder.uri, '.git');
      try {
        await vscode.workspace.fs.stat(gitPath);
        await callback(folder);
      } catch {
        return;
      }
    })
  );
};

let watchers: vscode.FileSystemWatcher[] = [];

export const activate = (context: vscode.ExtensionContext) => {
  console.log('🚔 Commit Cop is on patrol!');

  const config = getConfig();

  const installHooks = vscode.commands.registerCommand('commit-cop.installHooks', async () => {
    await installHooksInWorkspace();
  });

  const checkHooks = vscode.commands.registerCommand('commit-cop.checkHooks', async () => {
    await checkHookStatus();
  });

  context.subscriptions.push(installHooks, checkHooks);

  if (config.get<boolean>('aggressive')) {
    installHooksInWorkspace();
  }

  if (config.get<boolean>('watchHooks')) {
    watchGitHooks(context);
  }

  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      const updatedConfig = getConfig();
      if (updatedConfig.get<boolean>('aggressive')) {
        installHooksInWorkspace();
      }
      if (updatedConfig.get<boolean>('watchHooks')) {
        disposeWatchers();
        watchGitHooks(context);
      }
    })
  );
};

const disposeWatchers = () => {
  watchers.forEach(watcher => watcher.dispose());
  watchers = [];
};

const installHooksInWorkspace = async () => {
  const config = getConfig();
  const hookCommand = config.get<string>('hookCommand') || 'npx husky install';
  const showNotifications = config.get<boolean>('showNotifications');

  await forEachGitFolder(async (folder) => {
    try {
      const { stdout, stderr } = await execAsync(hookCommand, {
        cwd: folder.uri.fsPath
      });

      if (showNotifications) {
        vscode.window.showInformationMessage(
          `🚔 Commit Cop: Hooks installed in ${folder.name}. You have the right to remain hooked.`
        );
      }

      console.log(`🚔 Hooks installed in ${folder.name}:`, stdout);
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
    } catch (error) {
      vscode.window.showWarningMessage(
        `🚔 Commit Cop: Failed to install hooks in ${folder.name}: ${getErrorMessage(error)}`
      );
      console.error(`Failed to install hooks:`, error);
    }
  });
};

const checkHookStatus = async () => {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders) {
    vscode.window.showInformationMessage('🚔 No workspace folders found.');
    return;
  }

  const results = await Promise.all(
    folders.map(async (folder) => {
      const hooksPath = getGitHooksPath(folder);

      try {
        const entries = await vscode.workspace.fs.readDirectory(hooksPath);
        const hookFiles = entries
          .filter(([name, type]) =>
            type === vscode.FileType.File &&
            !name.endsWith('.sample') &&
            name === 'pre-commit'
          )
          .map(([name]) => name);

        if (hookFiles.length > 0) {
          return `${folder.name}: ✅ Hooks found: ${hookFiles.join(', ')}`;
        }
        return `${folder.name}: ⚠️ No pre-commit hooks found`;
      } catch {
        return `${folder.name}: ❌ No .git/hooks folder found`;
      }
    })
  );

  vscode.window.showInformationMessage(
    `🚔 Hook Status:\n${results.join('\n')}`
  );
};

const watchGitHooks = (context: vscode.ExtensionContext) => {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders) return;

  folders.forEach((folder) => {
    const pattern = new vscode.RelativePattern(folder, '.git/hooks/**');
    const watcher = vscode.workspace.createFileSystemWatcher(pattern);

    watcher.onDidDelete(async (uri) => {
      if (uri.fsPath.endsWith('/pre-commit') || uri.fsPath.endsWith('\\pre-commit')) {
        console.log(`🚔 Hook deleted detected: ${uri.fsPath}`);
        vscode.window.showWarningMessage(
          `🚔 Commit Cop: Pre-commit hook deleted! Reinstalling... You can't escape the law!`
        );
        await installHooksInWorkspace();
      }
    });

    context.subscriptions.push(watcher);
    watchers.push(watcher);
  });
};

export const deactivate = () => {
  disposeWatchers();
  console.log('🚔 Commit Cop is off duty.');
};
