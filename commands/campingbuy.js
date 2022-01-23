const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
module.exports = {
	data: new SlashCommandBuilder().setName('campingbuy').setDescription('buy upgrades from the shop').addIntegerOption(option => option.setName('id').setDescription('you can check id with /campingshop').setRequired(true)),
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
                const multiplier = 1.1;
                const id = interaction.options.getInteger('id');
                if (!((id < campingshop.length) && (id >= 0))) {
                    await interaction.reply('that\'s an invalid id');
                    return;
                }
                const upgradescount = mydata.users[interaction.user.id].campingUpgrades;
                const price = Math.floor(campingshop[id].start*Math.pow(multiplier, upgradescount[id]));
                if (price > mydata.users[interaction.user.id].tents) {
                    await interaction.reply(`you don't have enough for that, you need ${price} lol`);
                    return;
                }
                mydata.users[interaction.user.id].tents -= price;
                mydata.users[interaction.user.id].campingUpgrades[id] += 1;

                fs.writeFile('./commands/newmydata.json', JSON.stringify(mydata, null, 2), (err) => {
                    if (err) console.log('Error writing file:', err);
                });
                await interaction.reply(`you bought a ${campingshop[id].text} for ${price}!`);
            } catch(err) {
                console.error(err);
                return;
            }
        });
	},
};