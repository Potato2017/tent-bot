const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
module.exports = {
	data: new SlashCommandBuilder().setName('pickup').setDescription('pick up something from the ground 👀'),
	async execute(interaction) {
        const { items } = require("./items.json");
        const { shop } = require("./shop.json")
		fs.readFile('./commands/newmydata.json', 'utf8', async (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                return
            }
            try {
                if (!(Object.hasOwn(mydata.users, interaction.user.id))) {
                    mydata.users[interaction.user.id] = {}
                }
                const mydata = JSON.parse(jsonString);
                if (!(Object.hasOwn(mydata.users[interaction.user.id], 'upgrades'))) {
                    mydata.users[interaction.user.id].upgrades = {}
                }
                for (var i = 0; i < shop.length; i++) {
                    if (!(Object.hasOwn(mydata.users[interaction.user.id].upgrades, shop[i].id))) {
                        mydata.users[interaction.user.id].upgrades[shop[i].id] = 0;
                    }
                }
                if (!(Object.hasOwn(mydata.users[interaction.user.id], 'pickupcd'))) {
                    mydata.users[interaction.user.id].pickupcd = 0;
                }
                if ((Date.now() - mydata.users[interaction.user.id].pickupcd) < (1000 + 2000*Math.pow(0.9, mydata.users[interaction.user.id].upgrades[3]))) {
                    interaction.reply(`that's still on cooldown! wait ${((1000 + 2000*Math.pow(0.9, mydata.users[interaction.user.id].upgrades[3]))-((Date.now() - mydata.users[interaction.user.id].pickupcd)))/1000} more seconds`);
                    return
                }
                var balancedList = [];
                var weight = null;
                for (i = 0; i < Object.keys(items).length; i++) {
                    if (items[i].startsWith('***')) {
                        
                        weight = Math.round(1+Math.pow(1.05,mydata.users[interaction.user.id].upgrades[0]))
                        for (var j = 0; j < weight; j++) {
                            balancedList.push(i)
                        }

                    } else if (items[i].startsWith('**')) {

                        weight = Math.round(1+2*Math.pow(1.03,mydata.users[interaction.user.id].upgrades[0]))
                        for (j = 0; j < weight; j++) {
                            balancedList.push(i)
                        }

                    } else if (items[i].startsWith('*')) {

                        weight = Math.round(1+3*Math.pow(0.97,mydata.users[interaction.user.id].upgrades[0]))
                        for (j = 0; j < weight; j++) {
                            balancedList.push(i)

                        }
                    } else {

                        weight = Math.round(1+5*Math.pow(0.95,mydata.users[interaction.user.id].upgrades[0]))
                        for (j = 0; j < weight; j++) {
                            balancedList.push(i)
                        }
                    }
                }
                const num = Math.floor(Math.random()*balancedList.length)
                if (Object.hasOwn(mydata.users, interaction.user.id)) {
                    if (Object.hasOwn(mydata.users[interaction.user.id].items, balancedList[num])) {
                        mydata.users[interaction.user.id].items[balancedList[num]] += 1;
                    } else {
                        mydata.users[interaction.user.id].items[balancedList[num]] = 1;
                    }
                } else {
                    mydata.users[interaction.user.id] = {items: {}};
                    mydata.users[interaction.user.id].items[balancedList[num]] = 1;
                }
                var output = `you picked up a ${items[balancedList[num]]}`
                if (Math.random() < (0.8)/(1+Math.exp(-0.3*mydata.users[interaction.user.id].upgrades[2]+2.4))) {
                    const num2 = Math.floor(Math.random()*balancedList.length);
                    if (Object.hasOwn(mydata.users[interaction.user.id].items, balancedList[num2])) {
                        mydata.users[interaction.user.id].items[balancedList[num2]] += 1;
                    } else {
                        mydata.users[interaction.user.id].items[balancedList[num2]] = 1;
                    }
                    output += `\nyou lucky! you also picked up a ${items[balancedList[num2]]}`;
                }
                mydata.users[interaction.user.id].pickupcd = Date.now();
                fs.writeFile('./commands/newmydata.json', JSON.stringify(mydata, null, 2), (err) => {
                    if (err) console.log('Error writing file:', err)
                })
                await interaction.reply(output);
            } catch(err) {
                console.error(err);
                return
            }
        })
	},
};