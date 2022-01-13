const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const winston = require('winston');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });
const logger = winston.createLogger({
	'transports': [
		new winston.transports.File({
			filename: 'logs/logs.log'
		})
	],
	format: winston.format.combine(winston.format.timestamp({
		format: 'MMM-DD-YY HH:mm:ss'
	}),
	winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`)
	)
})
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		logger.error(error);
		try {
			return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		} catch (error2) {
			return interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true })
		}
	}
});

client.login(token);