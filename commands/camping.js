const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { MessageEmbed } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder().setName('camping').setDescription('work in progress "idle game"'),
	async execute(interaction) {
        const userinit = require("./utility/userinit.js");
        const { campingshop } = require('./campingshop.json');
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
                    console.log(timePassed);
                    mydata.users[interaction.user.id].tents += campingshop[i].perSecond*mydata.users[interaction.user.id].campingUpgrades[i]*timePassed/1000;
                    totalPerSecond += campingshop[i].perSecond*mydata.users[interaction.user.id].campingUpgrades[i];
                }
                mydata.users[interaction.user.id].campingLastChecked = Date.now();
                const emb = new MessageEmbed()
                    .setTitle('camping !!!');
                for (i = 0; i < campingshop.length; i++) {
                    emb.addField(campingshop[i].text, `you have ${mydata.users[interaction.user.id].campingUpgrades[i].toString()}`, true);
                }
                emb.addField('total tents', mydata.users[interaction.user.id].tents.toString());
                emb.addField('tents per second', totalPerSecond.toString());
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