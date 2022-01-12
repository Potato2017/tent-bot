const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
module.exports = {
	data: new SlashCommandBuilder().setName('itemlb').setDescription('see the item leaderboard').addIntegerOption(option => option.setName('page').setDescription('which').setRequired(false)),
	async execute(interaction) {
		fs.readFile('./commands/newmydata.json', 'utf8', async (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                return
            }
            try {
                const mydata = JSON.parse(jsonString);
                var page = interaction.options.getInteger('page');
                if ((page-1)*20 > Object.keys(mydata.users).length) {
                    await interaction.reply(`that's too high, try a number between 1 and ${Math.ceil(Object.keys(mydata.users).length/20)}`);
                    return
                } else if (page < 0) {
                    await interaction.reply(`that's too low, try a number between 1 and ${Math.ceil(Object.keys(mydata.users).length/20)}`);
                    return
                }
                if (page === null) {
                    page = 1
                }
                var totals = {};
                var output = '';
                for (var i = 0; i < Object.keys(mydata.users).length; i++) {
                    totals[Object.keys(mydata.users)[i]] = 0;
                    var allvals = Object.values(mydata.users[Object.keys(mydata.users)[i]].items);
                    for (var j = 0; j < allvals.length; j++) {
                        totals[Object.keys(mydata.users)[i]] += allvals[j]
                    }
                    
                }
                var entries = Object.entries(totals).sort((a,b) => b[1]-a[1]);
                for (i = (page-1)*20; i < Math.min(entries.length, page*20); i++) {
                    let usr = await interaction.client.users.fetch(entries[i][0]);
                    output += `${usr.tag} - ${entries[i][1]}\n`
                }
                output += `page ${page} of ${Math.ceil(Object.keys(mydata.users).length/20)}`;
                await interaction.reply(output)
            
            } catch(err) {
                console.error(err);
                return
            }
        })
	},
};