const { SlashCommandBuilder } = require('@discordjs/builders');
const { exec } = require("child_process");
const path = require("path");
const winston = require('winston');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('restart')
		.setDescription('restarts the bot - only for me'),
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
        await interaction.reply('restarting bot...');
        logger.info('restarting bot...');
        const cmd = "node "+path.join(__dirname, '..', 'index.js');
        logger.info(cmd);
        exec('start cmd.exe /c ' + cmd, async function (error, stdout, stderr) {
            if (error) {
                logger.error(error.message)
                logger.info('stdout: ' + stdout);
                logger.info('stderr: ' + stderr);
                await interaction.editReply('restarting bot...\nsomething went wrong restarting the bot');
                return;
            } else {
				logger.info('bot restarted');
				await interaction.editReply('restarting bot...\nbot restarted');
				process.exit();
			}
        })
	},
};