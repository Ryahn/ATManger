
function loadCommands(client) {
  const fs = require("fs");
  const readdirClean = require('readdir-clean');
  const ascii = require("ascii-table");
  const table = new ascii().setHeading("Commands", "Load Status");

  const commandFolders = readdirClean('./Commands').then(paths => {
    for (const folder in paths) {
        const commandFiles = fs
      .readdirSync(`./Commands/${paths[folder]}`)
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(`../Commands/${paths[folder]}/${file}`);
      if (command.name) {
        client.commands.set(command.name, command);
        table.addRow(file, "✔️");
      } else {
        table.addRow(
          file,
          "❌ => Missing a help.name or help.name is not in string"
        );
        continue;
      }
      if (command.aliases && Array.isArray(command))
        command.aliases.forEach((alias) =>
          client.aliases.set(alias, command.name)
        );
    }
    console.log(table.toString());
    }
})
}

module.exports = {
  loadCommands,
};
