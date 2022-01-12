const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
        .addUserOption(option => option.setName('target').setDescription('who').setRequired(false))
		.setDescription('Replies with user info!'),
	async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        if (targetUser === null) {
            await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}\nYour account was created at <t:${Math.round(interaction.user.createdTimestamp/1000)}:F>`);
        } else {
            await interaction.reply(`Their tag: ${targetUser.tag}\nTheir id: ${targetUser.id}\nTheir account was created at <t:${Math.round(targetUser.createdTimestamp/1000)}:F>`);
        }
	},
};