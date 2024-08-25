const { exec } = require("child_process");

class ReloadExtensionWebpackPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tap("ReloadExtensionPlugin", () => {
      exec("node reloadExtensions.js", (err, stdout, stderr) => {
        if (err) {
          console.error(`Error reloading extension: ${stderr}`);
          return;
        }
        console.log(`Extension reloaded: ${stdout}`);
      });
    });
  }
}

module.exports = ReloadExtensionWebpackPlugin;
