const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping2')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong! PLEASE DISPLAY THIS');
	},
};