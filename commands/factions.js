const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
        .setName('factions')
        .setDescription('work in progress factions thing')
        .addSubcommand(subcommand => subcommand
            .setName('info')
            .setDescription('see the map'))

        
          .addSubcommand(subcommand => subcommand
              .setName('init')
              .setDescription('initiate the data'))
         
        .addSubcommand(subcommand => subcommand
            .setName('attack')
            .setDescription('attack !!!')
            .addIntegerOption(option => option
                .setName('direction')
                .setDescription('1 - up, 2 - right, 3 - down, 4 - left')
                .setRequired(true)))
        .addSubcommand(subcommand => subcommand
            .setName('register')
            .setDescription('register with a color!')
            .addStringOption(option => option
                .setName('color')
                .setDescription('r (red), g (green), b (blue), or y (yellow)')
                .setRequired(true))),

	async execute(interaction) {
        if (interaction.options.getSubcommand() === 'info') {
            const file = require('./factions/info.js');
            await file.execute(interaction);
            return;
        }
        if (interaction.options.getSubcommand() === 'init') {
            const file = require('./factions/init.js');
            await file.execute(interaction);
            return;
        }
        if (interaction.options.getSubcommand() === 'attack') {
            const file = require('./factions/attack.js');
            await file.execute(interaction);
            return;
        }
        if (interaction.options.getSubcommand() === 'register') {
            const file = require('./factions/register.js');
            await file.execute(interaction);
            return;
        }
	},
};