const fs = require('fs');
module.exports = {
	async execute(interaction) {
		fs.readFile('./commands/newmydata.json', 'utf8', async (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                return;
            }
            try {
                if (interaction.user.id !== '439888132435869706') {
                    await interaction.reply({content: 'no perms lol', ephemeral: true});
                    return;
                }
                const mydata = JSON.parse(jsonString);
                mydata.factions = {map: []};
                for (var i = 0; i < 50; i++) {
                    var temp = [];
                    for (var j = 0; j < 50; j++) {
                        if (i < 25) {
                            if (j < 25) {
                                temp.push('r');
                            } else {
                                temp.push('g');
                            }
                        } else if (j < 25) {
                                temp.push('b');
                        } else {
                                temp.push('y');
                        }
                    }
                    mydata.factions.map.push(temp);
                }
                mydata.factions.players = {
                    r: '',
                    g: '',
                    b: '',
                    y: ''
                };
                mydata.factions.cds = {
                    r: 0,
                    g: 0,
                    b: 0,
                    y: 0
                };
                fs.writeFile('./commands/newmydata.json', JSON.stringify(mydata, null, 2), (err) => {
                    if (err) console.log('Error writing file:', err);
                });
                await interaction.reply('it has been done.');
            
            } catch(err) {
                console.error(err);
                return;
            }
        });
	},
};