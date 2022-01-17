const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('trivia')
        .addIntegerOption(option => option.setName('category').setDescription('check category numbers with /categories - empty for any category').setRequired(false))
        .addIntegerOption(option => option.setName('difficulty').setDescription('1 for easy, 2 for medium, 3 for hard - empty for random difficulty').setRequired(false))
		.setDescription('trivia q'),
	async execute(interaction) {
        const category = interaction.options.getInteger('category');
        var difficultyint = interaction.options.getInteger('difficulty');
        var difficulty = '';
        if (!([1,2,3].includes(difficultyint))) {
            difficultyint = Math.floor(Math.random()*3)+1
        }
        switch(difficultyint) {
            case 1:
                difficulty = 'easy';
                break;
            case 2:
                difficulty = 'medium';
                break;
            case 3:
                difficulty = 'hard';
                break;
        }
        if (category !== null && (category < 9 || category > 32)) {
            interaction.reply({content: 'category should be from 9 to 32', ephemeral: true});
            return;
        }
        const XMLHttpRequest = require('xhr2');
        const xhr = new XMLHttpRequest();
        if (category) {
            xhr.open("GET",`https://opentdb.com/api.php?amount=1&category=${category}&difficulty=${difficulty}&type=multiple`);
        } else {
            xhr.open("GET",`https://opentdb.com/api.php?amount=1&difficulty=${difficulty}&type=multiple`)
        }
        xhr.send();
        xhr.onload = async function() {
            if (xhr.status === 200) {
                var a = JSON.parse(xhr.responseText);
                if (a.response_code) { // response code 0 = success
                    await interaction.reply(`something went wrong.`);
                } else {
                    const q = a.results[0]
                    const correctPos = Math.floor(Math.random()*4);
                    const answers = [];
                    for (var i = 0; i < 4; i++) {
                        if (i == correctPos) {
                            answers.push(q.correct_answer)
                        } else {
                            let choice = q.incorrect_answers[Math.floor(Math.random()*3)]
                            while (answers.includes(choice)) {
                                choice = q.incorrect_answers[Math.floor(Math.random()*3)]
                            }
                            answers.push(choice)
                        }
                    }
                    const qEmbed = new MessageEmbed()
                        .setColor('00ff00')
                        .setTitle(q.question)
                        .addField(`category: ${q.category} difficulty: ${q.difficulty}`, `you have 15 seconds!`);
                    const row = new MessageActionRow()
                        .addComponents([
                            new MessageButton()
                                .setCustomId('b0')
                                .setLabel(answers[0])
                                .setStyle('PRIMARY'),
                            new MessageButton()
                                .setCustomId('b1')
                                .setLabel(answers[1])
                                .setStyle('PRIMARY'),
                            new MessageButton()
                                .setCustomId('b2')
                                .setLabel(answers[2])
                                .setStyle('PRIMARY'),
                            new MessageButton()
                                .setCustomId('b3')
                                .setLabel(answers[3])
                                .setStyle('PRIMARY')
                        ])
                    await interaction.reply({embeds: [qEmbed], components: [row]})

                    const collector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });
                    collector.on('collect', async i => {
                        if (i.user.id !== interaction.user.id) {
                            await i.reply({ content: 'this isn\'t for you lol', ephemeral: true});
                        }
                        if (i.customId === `b${correctPos}`) {
                            await i.reply('congrats, thats correct!');
                            const styles = [];
                            for (var j = 0; j < 4; j++) {
                                if (j === correctPos) {
                                    styles.push('SUCCESS')
                                } else {
                                    styles.push('SECONDARY')
                                }
                            }
                            var buttons = []
                            for (j = 0; j < 4; j++) {
                                buttons.push(new MessageButton())
                                buttons[j].setCustomId(`d${j}`).setLabel(answers[j]).setStyle(styles[j])
                            }
                            const row2 = new MessageActionRow().addComponents(buttons)
                            await interaction.editReply({embeds: [qEmbed], components: [row2]})
                            collector.stop('answered');
                        } else {
                            await i.reply(`whoops thats not right. the right answer was ${q.correct_answer}`);
                            const styles = [];
                            for (var j = 0; j < 4; j++) {
                                if (j === correctPos) {
                                    styles.push('SUCCESS')
                                } else if (`b${j}` === i.customId) {
                                    styles.push('DANGER')
                                } else {
                                    styles.push('SECONDARY')
                                }
                            }
                            var buttons = []
                            for (j = 0; j < 4; j++) {
                                buttons.push(new MessageButton())
                                buttons[j].setCustomId(`d${j}`).setLabel(answers[j]).setStyle(styles[j])
                            }
                            const row2 = new MessageActionRow().addComponents(buttons)
                            await interaction.editReply({embeds: [qEmbed], components: [row2]})
                            collector.stop('answered');
                        }
                    });
                    collector.on('end', async (_, reason) => {
                        if (reason !== 'answered') {
                            await interaction.followUp(`you ran out of time lol, the answer was ${q.correct_answer}`)
                            const styles = [];
                            for (var j = 0; j < 4; j++) {
                                if (j === correctPos) {
                                    styles.push('SUCCESS')
                                } else {
                                    styles.push('SECONDARY')
                                }
                            }
                            var buttons = []
                            for (j = 0; j < 4; j++) {
                                buttons.push(new MessageButton())
                                buttons[j].setCustomId(`d${j}`).setLabel(answers[j]).setStyle(styles[j])
                            }
                            const row2 = new MessageActionRow().addComponents(buttons)
                            await interaction.editReply({embeds: [qEmbed], components: [row2]})
                        }
                    })
                }
            } else {
                await interaction.reply(`whoops an error occured, status code ${xhr.status}`);
            }
        }
	},
};
