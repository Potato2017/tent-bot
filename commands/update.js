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
			format: winston.format.combine(winston.format.timestamp({
				format: 'MMM-DD-YY HH:mm:ss'
			}),
			winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`))
		})
		await interaction.reply('downloading updates...');
		logger.info('downloading updates...');
		exec("git pull origin main", {cwd: path.join(__dirname, '..')}, async function (error, stdout, stderr) {
			if (error) {
				logger.error(error.message);
				await interaction.followUp('something went wrong downloading updates');
				return;
			}
			await interaction.followUp('updates downloaded');
			logger.info('updates downloaded');
			logger.info('stdout: ' + stdout);
			logger.info('stderr: ' + stderr);
			
		});
		await interaction.followUp('restarting bot...');
		logger.info('restarting bot...');
		logger.info(path.join(__dirname, '..', 'index.js'))
        exec("node "+path.join(__dirname, '..', 'index.js'), async function (error, stdout, stderr) {
			if (error) {
				logger.error(error.message)
				await interaction.followUp('something went wrong restarting the bot');
				return;
			}
			logger.info('bot restarted');
			logger.info('stdout: ' + stdout);
			logger.info('stderr: ' + stderr);
			await interaction.followUp('bot restarted');
		})
	},
};