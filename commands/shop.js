const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('see the shop'),
	async execute(interaction) {
        const { shop } = require('./shop.json');
        const userinit = require("./utility/userinit.js");
        fs.readFile('./commands/newmydata.json', 'utf8', async (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                return
            }
            try {
                const mydataa = JSON.parse(jsonString);
                const mydata = userinit.userinit(mydataa, interaction.user.id)
                if (mydata.users[interaction.user.id].items === {}) {
                    await interaction.reply('you don\'t have an inventory! try using /pickup');
                    return
                }
                const upgradescount = mydata.users[interaction.user.id].upgrades;
                var output = "**SHOP**\nuse **/buy** to buy something from the shop! things get more expensive the more you buy!\n";
                for (i = 0; i < shop.length; i++) {
                    output += shop[i].text;
                    output += " - BOUGHT: ";
                    output += upgradescount[shop[i].id].toString();
                    output += ", COST FOR NEXT: ";
                    output += (Math.floor(shop[i].start*Math.pow(shop[i].multiplier, upgradescount[shop[i].id]))).toString();
                    output += " - ID: "
                    output += shop[i].id.toString()
                    output += "\n"
                }

                fs.writeFile('./commands/newmydata.json', JSON.stringify(mydata, null, 2), (err) => {
                    if (err) console.log('Error writing file:', err)
                })
                
                await interaction.reply(output); 
            } catch(err) {
                console.error(err);
                return
            }
        })
		
	},
};