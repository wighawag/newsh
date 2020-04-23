import execa from "execa";
import { Launcher } from "./";
import commandExists = require("command-exists");
const commandExistsSync = commandExists.sync;

export const linux: Launcher = (execFilePath, options) => {
  const terminal = options.terminalApp
    ? options.terminalApp
    : ["gnome-terminal", "konsole", "xterm", "io.elementary.terminal"].find(
        commandExistsSync
      );
  let argArray = ["-e", "{{file}}"];
  if (options.terminalAppSetup !== undefined) {
    argArray = options.terminalAppSetup.split(" ");
  }
  for (let i = 0; i < argArray.length; i++) {
    if (argArray[i] === "{{file}}") {
      argArray[i] = `sh ${execFilePath}`;
    }
  }
  try {
    execa.sync(terminal!, argArray, {
      detached: true
    });
  } catch (error) {
    execa.sync("sh", [execFilePath]);
  }
};
