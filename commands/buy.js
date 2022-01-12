const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
module.exports = {
	data: new SlashCommandBuilder().setName('buy').setDescription('buy upgrades from the shop').addIntegerOption(option => option.setName('id').setDescription('you can check id with /shop').setRequired(true)),
	async execute(interaction) {
        const { shop } = require('./shop.json');
		fs.readFile('./commands/newmydata.json', 'utf8', async (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                return
            }
            try {
                const mydata = JSON.parse(jsonString);
                const id = interaction.options.getInteger('id');
                if (!((id < shop.length) && (id >= 0))) {
                    await interaction.reply('that\'s an invalid id');
                    return;
                }
                if (!(Object.hasOwn(mydata.users[interaction.user.id], 'upgrades'))) {
                    mydata.users[interaction.user.id].upgrades = {}
                }
                for (var i = 0; i < shop.length; i++) {
                    if (!(Object.hasOwn(mydata.users[interaction.user.id].upgrades, shop[i].id))) {
                        mydata.users[interaction.user.id].upgrades[shop[i].id] = 0;
                    }
                }
                if (!(Object.hasOwn(mydata.users[interaction.user.id], 'money'))) {
                    mydata.users[interaction.user.id].money = 0
                }
                const upgradescount = mydata.users[interaction.user.id].upgrades;
                const price = Math.floor(shop[id].start*Math.pow(shop[id].multiplier, upgradescount[id]));
                if (price > mydata.users[interaction.user.id].money) {
                    await interaction.reply(`you don't have enough for that, you need ${price} lol`);
                    return
                }
                mydata.users[interaction.user.id].money -= price;
                mydata.users[interaction.user.id].upgrades[id] += 1;

                fs.writeFile('./commands/newmydata.json', JSON.stringify(mydata, null, 2), (err) => {
                    if (err) console.log('Error writing file:', err)
                })
                await interaction.reply(`you bought id ${id} for ${price}!`);
            } catch(err) {
                console.error(err);
                return
            }
        })
	},
};