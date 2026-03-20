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
            <!doctype html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
                rel="stylesheet"
                integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
                crossorigin="anonymous"
                />
                <script
                src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"
                crossorigin="anonymous"
                ></script>
                <link rel="stylesheet" href="https://www.nerdfonts.com/assets/css/webfont.css">
                <title>webview</title>
                <script type="module" crossorigin src="${scriptUri}"></script>
                <link rel="stylesheet" crossorigin href="${cssUri}">
            </head>
            <body>
                <div id="root"></div>
            </body>
            </html>
        `;
        },
    );

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
