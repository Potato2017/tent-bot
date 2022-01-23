const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('campingshop')
		.setDescription('see the camping shop'),
	async execute(interaction) {
        const { campingshop } = require('./campingshop.json');
        const userinit = require("./utility/userinit.js");
        fs.readFile('./commands/newmydata.json', 'utf8', async (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                return;
            }
            try {
                const mydataa = JSON.parse(jsonString);
                const mydata = userinit.userinit(mydataa, interaction.user.id);
                const upgradescount = mydata.users[interaction.user.id].campingUpgrades;
                const multiplier = 1.1;
                var output = "**SHOP**\nuse **/campingbuy** to buy something from the shop! things get more expensive the more you buy!\n";
                for (var i = 0; i < campingshop.length; i++) {
                    output += campingshop[i].text;
                    output += " - BOUGHT: ";
                    output += upgradescount[campingshop[i].id].toString();
                    output += " - PER SECOND: ";
                    output += campingshop[i].perSecond.toString();
                    output += " - COST FOR NEXT: ";
                    output += (Math.floor(campingshop[i].start*Math.pow(multiplier, upgradescount[campingshop[i].id]))).toString();
                    output += " - ID: ";
                    output += campingshop[i].id.toString();
                    output += "\n";
                }

                fs.writeFile('./commands/newmydata.json', JSON.stringify(mydata, null, 2), (err) => {
                    if (err) console.log('Error writing file:', err);
                });
                
                await interaction.reply(output); 
            } catch(err) {
                console.error(err);
                return;
            }
        });
		
	},
};