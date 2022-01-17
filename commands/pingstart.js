const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pingstart')
		.setDescription('ping start'),
	async execute(interaction) {
                if (interaction.user.id !== '439888132435869706') {
			await interaction.reply( {content: 'imagine trying to restart but not having permissions', ephemeral: true});
			return;
		}
                await interaction.reply('sending');
				const message = await interaction.fetchReply();
                message.channel.send('<@&928421243399577633> bot alive lol');
                await interaction.deleteReply();
	},
};
