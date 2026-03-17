import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const activate = (context: vscode.ExtensionContext) => {
  console.log('🚔 Commit Cop is on patrol!');

  const config = vscode.workspace.getConfiguration('commitCop');
  const hookWatchers: vscode.FileSystemWatcher[] = [];

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

  vscode.workspace.onDidChangeWorkspaceFolders(() => {
    if (config.get<boolean>('aggressive')) {
      installHooksInWorkspace();
    }
    if (config.get<boolean>('watchHooks')) {
      watchGitHooks(context);
    }
  });
};

const installHooksInWorkspace = async () => {
  const config = vscode.workspace.getConfiguration('commitCop');
  const hookCommand = config.get<string>('hookCommand') || 'npx husky install';
  const showNotifications = config.get<boolean>('showNotifications');

  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    return;
  }

  for (const folder of workspaceFolders) {
    const gitPath = path.join(folder.uri.fsPath, '.git');

    if (!fs.existsSync(gitPath)) {
      continue;
    }

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
      const errorMessage = error instanceof Error ? error.message : String(error);
      vscode.window.showWarningMessage(
        `🚔 Commit Cop: Failed to install hooks in ${folder.name}: ${errorMessage}`
      );
      console.error(`Failed to install hooks:`, error);
    }
  }
};

const checkHookStatus = async () => {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showInformationMessage('🚔 No workspace folders found.');
    return;
  }

  const results: string[] = [];

  for (const folder of workspaceFolders) {
    const hooksPath = path.join(folder.uri.fsPath, '.git', 'hooks');

    if (!fs.existsSync(hooksPath)) {
      results.push(`${folder.name}: ❌ No .git/hooks folder found`);
      continue;
    }

    const hookFiles = fs.readdirSync(hooksPath).filter(file =>
      !file.endsWith('.sample') && file.includes('pre-commit')
    );

    if (hookFiles.length > 0) {
      results.push(`${folder.name}: ✅ Hooks found: ${hookFiles.join(', ')}`);
    } else {
      results.push(`${folder.name}: ⚠️ No pre-commit hooks found`);
    }
  }

  vscode.window.showInformationMessage(
    `🚔 Hook Status:\n${results.join('\n')}`
  );
};

const watchGitHooks = (context: vscode.ExtensionContext) => {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    return;
  }

  for (const folder of workspaceFolders) {
    const hooksPath = path.join(folder.uri.fsPath, '.git', 'hooks');

    if (!fs.existsSync(hooksPath)) {
      continue;
    }

    const pattern = new vscode.RelativePattern(folder, '.git/hooks/**');
    const watcher = vscode.workspace.createFileSystemWatcher(pattern);

    watcher.onDidDelete(async (uri) => {
      if (uri.fsPath.includes('pre-commit')) {
        console.log(`🚔 Hook deleted detected: ${uri.fsPath}`);
        vscode.window.showWarningMessage(
          `🚔 Commit Cop: Pre-commit hook deleted! Reinstalling... You can't escape the law!`
        );
        await installHooksInWorkspace();
      }
    });

    context.subscriptions.push(watcher);
  }
};

export const deactivate = () => {
  console.log('🚔 Commit Cop is off duty.');
};
