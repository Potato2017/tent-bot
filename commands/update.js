const { SlashCommandBuilder } = require('@discordjs/builders');
const { exec } = require("child_process");
const path = require("path");
const winston = require('winston');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('update')
		.setDescription('updates the bot - for meeeeee'),
	async execute(interaction) {
		if (interaction.user.id !== '439888132435869706') {
			await interaction.reply( {content: 'imagine trying to restart but not having permissions', ephemeral: true});
			return;
		}
		const logger = winston.createLogger({
			'transports': [
				new winston.transports.File({
					filename: 'logs/logs.log'
				})
			],
			format: winston.format.timestamp({
				format: 'MMM-DD-YY HH:mm:ss'
			})
		})
		await interaction.reply('downloading updates...');
		logger.info('downloading updates...');
		exec("git pull", async function () {
			await interaction.followUp('updates downloaded');
			logger.info('updates downloaded')
		});
		await interaction.followUp('restarting bot...');
		logger.info('restarting bot...');
        exec("node "+path.join(__dirname, '..', 'index.js'), async function () {
			logger.info('bot restarted');
			await interaction.followUp('bot restarted');
			process.kill();
		})
	},
};