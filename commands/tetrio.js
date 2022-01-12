const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tetrio')
        .addStringOption(option => option.setName('username').setDescription('who').setRequired(true))
		.setDescription('mmm teto'),
	async execute(interaction) {
        const username = interaction.options.getString('username');
        const XMLHttpRequest = require('xhr2');
        const xhr = new XMLHttpRequest();
        xhr.open("GET",`https://ch.tetr.io/api/users/${username}`);
        xhr.send();
        xhr.onload = async function() {
            if (xhr.status === 200) {
                var a = JSON.parse(xhr.responseText);
                if (!a.success) {
                    await interaction.reply(`something went wrong.\n${a.error}`);
                } else {
                    switch(a.data.user.role) {
                        case 'anon':
                            await interaction.reply(`${a.data.user.username} is an anon user`);
                            break;
                        case 'bot':
                            interaction.reply(`${a.data.user.username} is a bot operated by ${a.data.user.botmaster}`);
                            break;
                        default:
                            interaction.reply(`**${a.data.user.username}**\n**${a.data.user.league.rank}** RANK - **${a.data.user.league.rating}** TR - **${a.data.user.league.gameswon} / ${a.data.user.league.gamesplayed}** GAMES WON - IN **${a.data.user.league.standing}** PLACE GLOBALLY\n**${a.data.user.league.apm}** APM / **${a.data.user.league.pps}** PPS / **${a.data.user.league.vs}** VS => **${a.data.user.league.apm/a.data.user.league.pps/60}** APP\n**${a.data.user.xp}** XP - **${a.data.user.gameswon} / ${a.data.user.gamesplayed}** TOTAL ONLINE GAMES WON - **${a.data.user.gametime}** SECONDS PLAYED\nAVATAR: https://tetr.io/user-content/avatars/${a.data.user._id}.jpg`)
                    }
                }
            } else {
                await interaction.reply(`whoops an error occured, status code ${xhr.status}`);
            }
        }
	},
};