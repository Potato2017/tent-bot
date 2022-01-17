const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('categories')
		.setDescription('see the trivia categories'),
	async execute(interaction) {
		await interaction.reply('9 - General Knowledge\n10 - Entertainment: Books\n11 - Entertainment: Film\n12 - Entertainment: Music\n13 - Entertainment: Musicals & Theatres\n14 - Entertainment: Television\n15 - Entertainment: Video Games\n16 - Entertainment: Board Games\n17 - Science & Nature\n18 - Science: Computers\n19 - Science: Mathematics\n20 - Mythology\n21 - Sports\n22 - Geography\n23 - History\n24 - Politics\n25 - Art\n26 - Celebrities\n27 - Animals\n28 - Vehicles\n29 - Entertainment: Comics\n30 - Science: Gadgets\n31 - Entertainment: Japanese Anime & Manga\n32 - Entertainment: Cartoon & Animations');
	},
};