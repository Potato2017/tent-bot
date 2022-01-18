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
			await interaction.reply({content: 'imagine trying to restart but not having permissions', ephemeral: true});
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
		});
		await interaction.reply('downloading updates...');
		logger.info('downloading updates...');
		// eslint-disable-next-line no-undef
		exec("git pull origin main", {cwd: process.cwd()}, async (error, stdout, stderr) => {
			if (error) {
				logger.error(error.message);
				await interaction.followUp('downloading updates...\nsomething went wrong downloading updates');
				return;
			}
			await interaction.editReply('downloading updates...\nupdates downloaded');
			logger.info('updates downloaded');
			logger.info(`stdout: ${stdout}`);
			logger.info(`stderr: ${stderr}`);
			await interaction.editReply('downloading updates...\nupdates downloaded\ndeploying commands...');
			logger.info('deploying commands...');
			// eslint-disable-next-line no-undef
			const deploycmd = `node ${path.join(process.cwd(), 'deploy-commands.js')}`;
			logger.info(deploycmd);
			exec(deploycmd, async (error, stdout, stderr) => {
				if (error) {
					logger.error(error.message);
					logger.info(`stdout: ${stdout}`);
					logger.info(`stderr: ${stderr}`);
					await interaction.editReply('downloading updates...\nupdates downloaded\ndeploying commands...\nsomething went wrong deploying commands');
					return;
				} 
					logger.info('commands deployed');
					await interaction.editReply('downloading updates...\nupdates downloaded\ndeploying commands...\ncommands deployed');
					await interaction.editReply('downloading updates...\nupdates downloaded\ndeploying commands...\ncommands deployed\nrestarting bot...');
					logger.info('restarting bot...');
					// eslint-disable-next-line no-undef
					const startcmd = `node ${path.join(process.cwd(), 'index.js')}`;
					logger.info(startcmd);
					exec(`start cmd.exe /c${startcmd}`, async (error, stdout, stderr) => {
						if (error) {
							logger.error(error.message);
							logger.info(`stdout: ${stdout}`);
							logger.info(`stderr: ${stderr}`);
							await interaction.editReply('downloading updates...\nupdates downloaded\ndeploying commands...\ncommands deployed\nrestarting bot...\nsomething went wrong restarting the bot');
							return;
						}
					});
					logger.info('bot restarted');
					await interaction.editReply('downloading updates...\nupdates downloaded\ndeploying commands...\ncommands deployed\nrestarting bot...\nbot restarted');
					// eslint-disable-next-line no-undef
					process.kill(0);
				
			});
		});
		
	},
};