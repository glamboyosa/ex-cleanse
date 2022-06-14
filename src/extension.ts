// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const key = "ex-cleanse-keys";

  async function getUserInput() {
    const input = await vscode.window.showInputBox({
      prompt: "Enter the name of your logger",
      placeHolder: "Enter the name of your logger e.g. `IO.puts`",
    });
    const value = input;

    return value;
  }
  function saveToGlobalState(value: string) {
    context.globalState.setKeysForSync([key]);
    const existing: string | undefined = context.globalState.get(key);
    if (existing) {
      const existingArray: string[] = JSON.parse(existing);
      // check if the value is already in the array. If it is display a message telling the user it exists and prompting them to exit
      if (existingArray.includes(value)) {
        vscode.window.showErrorMessage(
          `${value} is already in your logger list.`
        );
        return;
      }

      existingArray.push(value);
      context.globalState.update(key, JSON.stringify(existingArray));
      vscode.window.showInformationMessage(
        `Successfully added ${value} to your logger list 😄`
      );
    } else {
      context.globalState.update(key, JSON.stringify([value]));
      vscode.window.showInformationMessage(
        `Successfully added ${value} to your logger list 😄`
      );
    }
  }
  function findLogs(editor: vscode.TextEditor) {
    const text = editor.document.getText();
    const existing: string | undefined = context.globalState.get(key);
    if (existing) {
      const existingArray: string[] = JSON.parse(existing);
      const endOfRegex = existingArray.join("|");
      // regex for matching any possible value between parenthesis gotten from
      // https://stackoverflow.com/questions/546433/regular-expression-to-match-balanced-parentheses :)

      const regex = RegExp(
        `IO.(puts(\(.*\))|inspect(\(.*\)))|${endOfRegex}(\(.*\))?`,
        "g"
      );
      let logs: vscode.Range[] = [];
      let match;
      while ((match = regex.exec(text)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        let range = new vscode.Range(
          editor.document.positionAt(match.index),
          editor.document.positionAt(match.index + match[0].length)
        );
        logs.push(range);
      }
      return logs;
    } else {
      const regex = RegExp("IO.(puts((.*))|inspect((.*)))?", "g");
      let logs: vscode.Range[] = [];
      let match;
      while ((match = regex.exec(text)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        let range = new vscode.Range(
          editor.document.positionAt(match.index),
          editor.document.positionAt(match.index + match[0].length)
        );
        logs.push(range);
      }
      return logs;
    }
  }

  function deleteLogs(editor: vscode.TextEditor, logs: vscode.Range[]) {
    editor.edit((editBuilder) => {
      logs.forEach((range) => {
        editBuilder.delete(range);
      });
    });
    const lingo = logs.length > 1 ? "logs" : "log";
    vscode.window.showInformationMessage(`Deleted ${logs.length} ${lingo} 🚀`);
  }
  let disposable = vscode.commands.registerCommand("ex-cleanse.Cleanse", () => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const logs = findLogs(editor);
      deleteLogs(editor, logs);
    } else {
      vscode.window.showInformationMessage("No editor open.");
    }
  });

  let addLogger = vscode.commands.registerCommand(
    "ex-cleanse.addLogger",
    async () => {
      const input = await getUserInput();
      input && saveToGlobalState(input);
    }
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(addLogger);
}

// this method is called when your extension is deactivated
export function deactivate() {}
