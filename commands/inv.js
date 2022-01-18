const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs');
module.exports = {
	data: new SlashCommandBuilder().setName('inv').setDescription('see what you\'ve picked up').addUserOption(option => option.setName('target').setDescription('who').setRequired(false)).addIntegerOption(option => option.setName('page').setDescription('which').setRequired(false)),
	async execute(interaction) {
        const { items } = require("./items.json");
        const userinit = require("./utility/userinit.js");
        const row = new MessageActionRow().addComponents(new MessageButton().setStyle('PRIMARY').setCustomId('hardleft').setLabel('|<'), 
            new MessageButton().setStyle('PRIMARY').setCustomId('left').setLabel('<'), 
            new MessageButton().setStyle('PRIMARY').setCustomId('right').setLabel('>'), 
            new MessageButton().setStyle('PRIMARY').setCustomId('hardright').setLabel('>|'))
		fs.readFile('./commands/newmydata.json', 'utf8', async (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                return
            }
            try {
                const mydataa = JSON.parse(jsonString);
                const targetUser = interaction.options.getUser('target');
                var page = interaction.options.getInteger('page');
                if ((page-1)*20 > Object.keys(items).length) {
                    await interaction.reply(`that's too high, try a number between 1 and ${Math.ceil(Object.keys(items).length/20)}`);
                    return
                } else if (page < 0) {
                    await interaction.reply(`that's too low, try a number between 1 and ${Math.ceil(Object.keys(items).length/20)}`);
                    return
                }
                if (page === null) {
                    page = 1
                }
                if (targetUser === null) {
                    const mydata = userinit.userinit(mydataa, interaction.user.id);
                    if (mydata.users[interaction.user.id].items !== {}) {
                        var totals = {};
                        var output = '';
                        var totalnum = 0;
                        for (var i = 0; i < Object.keys(items).length; i++) {
                            totals[i] = 0
                        }
                        for (i = 0; i < Object.keys(mydata.users[interaction.user.id].items).length; i++) {
                            totals[Object.keys(mydata.users[interaction.user.id].items)[i]] = mydata.users[interaction.user.id].items[Object.keys(mydata.users[interaction.user.id].items)[i]];
                            totalnum += mydata.users[interaction.user.id].items[Object.keys(mydata.users[interaction.user.id].items)[i]]
                        }
                        for (i = (page-1)*20; i < Math.min(Object.keys(totals).length, page*20); i++) {
                            output += `${items[i]} - ${totals[i]} - ID ${i}\n`
                        }
                        var money = mydata.users[interaction.user.id].money;
                        output += `TOTAL - ${totalnum}\n`;
                        output += `MONEY - ${money} tent coins\n`;
                        output += `page ${page} of ${Math.ceil(Object.keys(items).length/20)}`;
                        await interaction.reply({ content: output, components: [row]})
                    } else {
                        await interaction.reply('nothing lol')
                    }
                } else {
                    const targetid = targetUser.id;
                    const mydata = userinit.userinit(mydataa, targetid);
                    if (mydata.users[targetid].items !== {}) {
                        var totals = {};
                        var output = '';
                        var totalnum = 0;
                        for (i = 0; i < Object.keys(items).length; i++) {
                            totals[i] = 0
                        }
                        for (i = 0; i < Object.keys(mydata.users[targetid].items).length; i++) {
                            totals[Object.keys(mydata.users[targetid].items)[i]] = mydata.users[targetid].items[Object.keys(mydata.users[targetid].items)[i]];
                            totalnum += mydata.users[targetid].items[Object.keys(mydata.users[targetid].items)[i]]
                        }
                        for (i = (page-1)*20; i < Math.min(Object.keys(totals).length, page*20); i++) {
                            output += `${items[i]} - ${totals[i]} - ID ${i}\n`
                        }
                        var money = mydata.users[targetid].money;
                        output += `TOTAL - ${totalnum}\n`;
                        output += `MONEY - ${money} tent coins\n`;
                        output += `page ${page} of ${Math.ceil(Object.keys(items).length/20)}`;
                        await interaction.reply({ content: output, components: [row]})
                    } else {
                        await interaction.reply('nothing lol')
                    }
                }
                const collector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });
                collector.on('collect', async i => {
                    if (i.user.id !== interaction.user.id) {
                        await i.reply({ content: 'this isn\'t for you lol', ephemeral: true})
                    } else {
                        if (i.customId === 'hardleft') {
                            page = 1;
                        } else if (i.customId === 'left') {
                            if (!(page === 1)) {
                                page -= 1;
                            }
                        } else if (i.customId === 'right') {
                            if (!(page === Math.ceil(Object.keys(items).length/20))) {
                                page += 1;
                            }
                        } else if (i.customId === 'hardright') {
                            page = Math.ceil(Object.keys(items).length/20);
                        }
                        output = '';
                        for (il = (page-1)*20; il < Math.min(Object.keys(totals).length, page*20); il++) {
                            output += `${items[il]} - ${totals[il]} - ID ${il}\n`
                        }
                        output += `TOTAL - ${totalnum}\n`;
                        output += `MONEY - ${money} tent coins\n`;
                        output += `page ${page} of ${Math.ceil(Object.keys(items).length/20)}`;
                        await i.update({content: output})
                    }
                });
            } catch(err) {
                console.error(err);
                return
            }
        })
	},
};