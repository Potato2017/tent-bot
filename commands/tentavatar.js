const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require("discord.js");
const fs = require('fs');
const sharp = require('sharp');
const axios = require('axios');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('tentavatar')
		.setDescription('tent avatar')
        .addUserOption(option => option.setName('target').setDescription('who').setRequired(false)),
	async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        var url = null;
        if (targetUser === null) url = interaction.user.displayAvatarURL();
        else url = targetUser.displayAvatarURL();
        const imageResponse = await axios({url: url, responseType: 'arraybuffer'});
        // eslint-disable-next-line no-undef
        const buffer = Buffer.from(imageResponse.data, 'binary');
        var src = new sharp(buffer);
        try {
            await src.resize({width: 120, height: 120});
            await src.composite(
                [
                    {
                        input: "./commands/tent.png",
                        top: 0,
                        left: 0,
                        blend: "dest-atop"
                    }
                ]
            );
            await src.toFile("tentavatar.png");
            const avatar = new MessageAttachment("./tentavatar.png");
            await interaction.reply({content: "here you go ⛺", files: [avatar]});
            fs.unlinkSync("./tentavatar.png");
        } catch(e) {
            interaction.reply("something went wrong");
            console.log(e);
        }
	},
};