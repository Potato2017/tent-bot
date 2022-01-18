const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
module.exports = {
	data: new SlashCommandBuilder().setName('sell').setDescription('sell stuff from your inv').addIntegerOption(option => option.setName('id').setDescription('you can check id with /puinv').setRequired(true)).addIntegerOption(option => option.setName('amount').setDescription('how many').setRequired(true)),
	async execute(interaction) {
        const { items } = require("./items.json");
        const userinit = require("./utility/userinit.js");
		fs.readFile('./commands/newmydata.json', 'utf8', async (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                return
            }
            try {
                const mydataa = JSON.parse(jsonString);
                const mydata = userinit.userinit(mydataa, interaction.user.id)
                const id = interaction.options.getInteger('id');
                const amount = interaction.options.getInteger('amount');
                if (!((id < Object.keys(items).length) && (id >= 0))) {
                    await interaction.reply('that\'s an invalid id');
                    return;
                }
                if (amount <= 0) {
                    await interaction.reply('that amount is too low');
                    return
                }
                if (amount > mydata.users[interaction.user.id].items[id.toString()]) {
                    await interaction.reply('you don\'t have that many');
                    return
                }
                mydata.users[interaction.user.id].items[id.toString()] -= amount;
                var gained = null;
                if (items[id].startsWith("***")) {
                    gained = 100*amount;
                } else if (items[id].startsWith("**")) {
                    gained = 50*amount;
                } else if (items[id].startsWith("*")) {
                    gained = 20*amount;
                } else {
                    gained = 10*amount;
                }
                gained = Math.round(gained*Math.log(mydata.users[interaction.user.id].upgrades[1]+2.5)/Math.log(2.5));
                if (Object.hasOwn(mydata.users[interaction.user.id], 'money')) {
                    mydata.users[interaction.user.id].money += gained
                } else {
                    mydata.users[interaction.user.id].money = gained
                }
                fs.writeFile('./commands/newmydata.json', JSON.stringify(mydata, null, 2), (err) => {
                    if (err) console.log('Error writing file:', err)
                })
                await interaction.reply(`you sold ${amount} of your ${items[id]}s and made ${gained} tent coins`);
            } catch(err) {
                console.error(err);
                return
            }
        })
	},
};