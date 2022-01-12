const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tent')
        .addIntegerOption(option => option.setName('amount').setDescription('HOW MANY ⛺').setRequired(false))
		.setDescription('⛺'),
	async execute(interaction) {
        const row = new MessageActionRow().addComponents(new MessageButton().setLabel('⛺').setStyle('LINK').setURL('https://www.tent.com/'), 
            new MessageButton().setStyle('PRIMARY').setCustomId('m1').setEmoji('<:baicaijiaozi:925508535398305814>').setLabel(''), 
            new MessageButton().setStyle('PRIMARY').setCustomId('m2').setEmoji('<:ianbike:926329527280496670>').setLabel(''), 
            new MessageButton().setStyle('PRIMARY').setCustomId('m3').setEmoji('<:jacqheart:926260527813001327>').setLabel(''), 
            new MessageButton().setStyle('PRIMARY').setCustomId('m4').setEmoji('<:vishnuwireless:901905052531298364>').setLabel(''))
        const amount = interaction.options.getInteger("amount");
        if (amount === null) {
            await interaction.reply({content: '⛺', components: [row] });
        } else if (amount <= 0) {
            await interaction.reply({content: 'positive integer please ⛺', components: [row] });
        } else {
		await interaction.reply({content: '⛺'.repeat(amount), components: [row] });
        }

        const collector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                await i.reply({ content: 'this isn\'t for you lol', ephemeral: true})
            }
            if (i.customId === 'm1') {
                await i.reply('mmm cabbage dumpling');
            } else if (i.customId === 'm2') {
                await i.reply('waow ian bike');
            } else if (i.customId === 'm3') {
                await i.reply('wo jacq ❤️');
            } else if (i.customId === 'm4') {
                await i.reply('mango pudding wireless !!!!');
            }
        });
	},
};