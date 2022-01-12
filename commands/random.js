const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('random')
        .addIntegerOption(option => option.setName('low').setDescription('lower bound (inclusive)').setRequired(true))
        .addIntegerOption(option => option.setName('high').setDescription('higher bound (inclusive)').setRequired(true))
        .addIntegerOption(option => option.setName('amount').setDescription('lower bound (inclusive)').setRequired(false))
		.setDescription('random num'),
	async execute(interaction) {
        const low = interaction.options.getInteger('low');
        const high = interaction.options.getInteger('high');
        var amount = interaction.options.getInteger("amount");
        if (amount === null) {
            amount = 1
        }
        if (amount <= 0) {
            await interaction.reply('positive integer amount please');
            return
        }
        if (high < low) {
            await interaction.reply('high should be higher than or equal to low');
            return
        }
        var output = ''
        for (var i = 0; i < amount; i++) {
            output += Math.floor(Math.random()*(high+1-low)+low).toString();
            output += " "
        }
        await interaction.reply(output)
	},
};