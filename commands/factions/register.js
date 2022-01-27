const fs = require('fs');
module.exports = {
	async execute(interaction) {
		fs.readFile('./commands/newmydata.json', 'utf8', async (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                return;
            }
            try {
                const color = interaction.options.getString('color');
                if (!['r','g','b','y'].includes(color)) { 
                    await interaction.reply({content: 'r, g, b, or y only please', ephemeral: true});
                    return;
                }
                const mydata = JSON.parse(jsonString);
                if (mydata.factions.players[color]) { 
                    await interaction.reply({content: 'that color has been taken!', ephemeral: true});
                    return;
                }
                if (Object.values(mydata.factions.players).includes(interaction.user.id)) {
                    await interaction.reply({content: 'you already registered!', ephemeral: true});
                    return;
                }
                mydata.factions.players[color] = interaction.user.id;
                fs.writeFile('./commands/newmydata.json', JSON.stringify(mydata, null, 2), (err) => {
                    if (err) console.log('Error writing file:', err);
                });
                await interaction.reply(`you registered for ${color}!`);
            } catch(err) {
                console.error(err);
                return;
            }
        });
	},
};