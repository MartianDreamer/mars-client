// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "mars-client" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "mars-client.openWebview",
    () => {
      const panel = vscode.window.createWebviewPanel(
        "marsClientWebview",
        "Mars Client Webview",
        vscode.ViewColumn.One,
        { enableScripts: true },
      );

      // Get the path to the Svelte build
      const scriptPath = vscode.Uri.file(
        path.join(context.extensionPath, "dist", "assets", "index.js"),
      );
      const scriptUri = panel.webview.asWebviewUri(scriptPath);

      const cssPath = vscode.Uri.file(
        path.join(context.extensionPath, "dist", "assets", "index.css"),
      );
      const cssUri = panel.webview.asWebviewUri(cssPath);

      // Set the HTML to load the Svelte app
      panel.webview.html = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <link rel="stylesheet" href="${cssUri}">
                </head>
                <body>
                    <div id="app"></div>
                    <script type="module" src="${scriptUri}"></script>
                </body>
                </html>
            `;
    },
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
