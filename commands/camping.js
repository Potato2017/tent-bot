const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { MessageEmbed } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
        .setName('camping')
        .setDescription('work in progress "idle game"')
        .addSubcommand(subcommand => subcommand
                .setName('info')
                .setDescription('get your camping info! you have to do this to collect your tents too'))
        .addSubcommand(subcommand => subcommand
                .setName('shop')
                .setDescription('see the camping shop'))
        .addSubcommand(subcommand => subcommand
            .setName('buy')
            .setDescription('buy something for your camping excursion! do /camping shop to see the available items')
            .addIntegerOption(option => option
                .setName('id')
                .setDescription('you can check id with /camping shop')
                .setRequired(true))),

	async execute(interaction) {
        if (interaction.options.getSubcommand() === 'buy') {
            const file = require('./camping/campingbuy.js');
            await file.execute(interaction);
            return;
        }
        if (interaction.options.getSubcommand() === 'shop') {
            const file = require('./camping/campingshop.js');
            await file.execute(interaction);
            return;
        }
        const userinit = require("./utility/userinit.js");
        const { campingshop } = require('./camping/campingshop.json');
		fs.readFile('./commands/newmydata.json', 'utf8', async (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                return;
            }
            try {
                const mydataa = JSON.parse(jsonString);
                const mydata = userinit.userinit(mydataa, interaction.user.id);
                const timePassed = Date.now() - mydata.users[interaction.user.id].campingLastChecked;
                var totalPerSecond = 0;
                for (var i = 0; i < campingshop.length; i++) {
                    mydata.users[interaction.user.id].tents += campingshop[i].perSecond*mydata.users[interaction.user.id].campingUpgrades[i]*timePassed/1000;
                    totalPerSecond += campingshop[i].perSecond*mydata.users[interaction.user.id].campingUpgrades[i];
                }
                mydata.users[interaction.user.id].campingLastChecked = Date.now();
                const emb = new MessageEmbed()
                    .setTitle('camping !!!');
                for (i = 0; i < campingshop.length; i++) {
                    emb.addField(campingshop[i].text, `you have ${mydata.users[interaction.user.id].campingUpgrades[i].toString()}`, true);
                }
                emb.addField('total tents', Math.round(mydata.users[interaction.user.id].tents).toString());
                emb.addField('tents per second', Math.round(totalPerSecond).toString());
                await interaction.reply({embeds: [emb]});
                fs.writeFile('./commands/newmydata.json', JSON.stringify(mydata, null, 2), (err) => {
                    if (err) console.log('Error writing file:', err);
                });
            } catch(err) {
                console.error(err);
                return;
            }
        });
	},
};