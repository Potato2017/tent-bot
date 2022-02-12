const fs = require('fs');
const { createCanvas } = require('canvas');
const { MessageAttachment } = require('discord.js');
module.exports = {
	async execute(interaction) {
		fs.readFile('./commands/newmydata.json', 'utf8', async (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                return;
            }
            try {
                // eslint-disable-next-line no-unused-vars
                const mydata = JSON.parse(jsonString);
  
                
                const {map} = mydata.factions;
                const canvas = createCanvas(500, 500);
                const ctx = canvas.getContext('2d');
                var squareCount = {
                    r: 0,
                    g: 0,
                    b: 0,
                    y: 0,
                    e: 0
                };
                for (var i = 0; i < 50; i++) {
                    for (var j = 0; j < 50; j++) {
                        switch(map[i][j]) {
                            case 'r':
                                ctx.fillStyle = 'red';
                                squareCount.r += 1;
                                break;
                            case 'g':
                                ctx.fillStyle = 'green';
                                squareCount.g += 1;
                                break;
                            case 'b':
                                ctx.fillStyle = 'blue';
                                squareCount.b += 1;
                                break;
                            case 'y':
                                ctx.fillStyle = 'yellow';
                                squareCount.y += 1;
                                break;
                            default:
                                squareCount.e += 1;
                                ctx.fillStyle = 'white';
                        }
                        ctx.fillRect(j*10, i*10, j*10+9, i*10+9);
                    }
                }
                const buffer = canvas.toBuffer('image/png');
                fs.writeFileSync('./commands/factions/map.png', buffer);
                const mapImg = new MessageAttachment("./commands/factions/map.png");
                var output = 'registration has started!\n';
                if (mydata.factions.players.r) {
                    const player = await interaction.client.users.fetch(mydata.factions.players.r);
                    output += `red: ${player.tag}`;
                } else {
                    output += 'red: None';
                }
                output += '\n';
                if (mydata.factions.players.g) {
                    const player = await interaction.client.users.fetch(mydata.factions.players.g);
                    output += `green: ${player.tag}`;
                } else {
                    output += 'green: None';
                }
                output += '\n';
                if (mydata.factions.players.b) {
                    const player = await interaction.client.users.fetch(mydata.factions.players.b);
                    output += `blue: ${player.tag}`;
                } else {
                    output += 'blue: None';
                }
                output += '\n';
                if (mydata.factions.players.y) {
                    const player = await interaction.client.users.fetch(mydata.factions.players.y);
                    output += `yellow: ${player.tag}`;
                } else {
                    output += 'yellow: None';
                }
                output += '\n';
                for (i = 0; i < Object.keys(squareCount).length; i++) {
                    output += Object.keys(squareCount)[i];
                    output += ': `';
                    output += squareCount[Object.keys(squareCount)[i]];
                    output += '`\n';
                }
                await interaction.reply({content: output, files: [mapImg]});
                fs.unlinkSync("./commands/factions/map.png");
            } catch(err) {
                console.error(err);
                return;
            }
        });
	},
};