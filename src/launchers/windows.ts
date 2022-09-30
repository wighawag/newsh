import execa from "execa";
import path from "path";
import { Launcher } from "./";
import { conEmu } from "./conEmu";

const startWindows: Launcher = (execFilePath, options) => {
  let argArray = ["/C", "{{command}}"];
  if (options.terminalAppSetup !== undefined) {
    argArray = options.terminalAppSetup.split(" ");
  }
  for (let i = 0; i < argArray.length; i++) {
    if (argArray[i] === "{{command}}") {
      argArray[i] = path.join(__dirname, "../../scripts/windows.bat");
    }
  }
  
  execa.sync(
    "cmd.exe",
    argArray,
    {
      detached: true,
      stdio: "ignore",
      env: {
        FILE_PATH: execFilePath,
        CD: options.cd
      }
    }
  );
};

const tryConEmu: Launcher = (execFilePath, options) => {
  try {
    return conEmu(execFilePath, options);
  } catch (error) {
    return startWindows(execFilePath, options);
  }
};

export const windows: Launcher = (execFilePath, options) => {
 
  if (options.terminalApp !== undefined) {
    if (options.terminalApp.toLowerCase() === "cmd") {
      return startWindows(execFilePath, options);
    } else {
      if (options.terminalAppSetup !== undefined) {
        console.error(`terminalAppSetup not supported on windows yet`);
      }
      if (options.terminalApp.toLowerCase() === "conemu") {
        return tryConEmu(execFilePath, options);
      } else {
        console.error(`terminalApp "${options.terminalApp}" not supported`);
      }
    }
  }
  const isConEmu = !!process.env.ConEmuBuild;
  if (isConEmu) {
    if (options.terminalAppSetup !== undefined) {
      console.error(`terminalAppSetup not supported on windows for conEMU yet`);
    }
    return tryConEmu(execFilePath, options);
  }
  return startWindows(execFilePath, options);
};
