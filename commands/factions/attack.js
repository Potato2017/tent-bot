/* eslint-disable complexity */
/* eslint-disable no-undef */
/* eslint-disable no-empty */
const fs = require('fs');
module.exports = {
	async execute(interaction) {
		fs.readFile('./commands/newmydata.json', 'utf8', async (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                return;
            }
            try {
                if (interaction.user.id !== '439888132435869706') {
                    interaction.reply({content: 'factions will be starting soon!', ephemeral: true});
                    return;
                }
                // eslint-disable-next-line no-unused-vars
                const mydata = JSON.parse(jsonString);
                const COOLDOWN = 600000;
                if (!Object.values(mydata.factions.players).includes(interaction.user.id)) {
                    await interaction.reply({content: 'you arent registered for this season of factions 😔'});
                    return;
                }
                const direction = interaction.options.getInteger('direction');
                const transpose = mydata.factions.map[0].map((col, i) => mydata.factions.map.map(row => row[i]));
                const facmap = mydata.factions.map;
                var color = '';
                var eliminated = true;
                for (var i = 0; i < Object.keys(mydata.factions.players).length; i++) {
                    if (mydata.factions.players[Object.keys(mydata.factions.players)[i]] === interaction.user.id) {
                        color = Object.keys(mydata.factions.players)[i];
                        break;
                    }
                }
                for (i = 0; i < facmap.length; i++) {
                    for (var j = 0; j < facmap[i].length; j++) {
                        if (facmap[i][j] === color) {
                            eliminated = false;
                            break;
                        }
                    }
                }
                if (eliminated) {
                    interaction.reply(`sorry, you've been eliminated. :(`);
                    return;
                }
                if (Date.now()-mydata.factions.cds[color] < COOLDOWN) {
                    interaction.reply(`you're still on cooldown! wait ${Math.floor((COOLDOWN-(Date.now()-mydata.factions.cds[color]))/1000)} more seconds`);
                }
                const attack = Math.floor(Math.random()*40)+30;
                switch(direction) {
                    case 1:
                        var firstEnemyTerritory = [];
                        for (i = 0; i < transpose.length; i++) {
                            const column = transpose[i];
                            var found = false;
                            var foundEnemy = false;
                            for (j = 0; j < column.length; j++) {
                                if (found) {
                                    if (column[column.length-j-1] !== color) {
                                        firstEnemyTerritory.push(column.length-j-1);
                                        foundEnemy = true;
                                        break;
                                    }
                                }
                                if (column[column.length-j-1] === color) {
                                    found = true;
                                }
                            }
                            if (!foundEnemy || !found) firstEnemyTerritory.push(-1);
                        }
                        var attacks = false;
                        for (j = 0; j < firstEnemyTerritory.length; j++) {
                            if (firstEnemyTerritory[j] !== -1) {
                                attacks = true;
                            }
                        }
                        if (!attacks) {
                            await interaction.reply({content: 'theres nothing to attack in that direction!', ephemeral: true});
                            return;
                        }
                        var won = 0;
                        for (var n = 0; n < attack; n++) {
                            firstEnemyTerritory = [];
                            for (i = 0; i < transpose.length; i++) {
                                const column = transpose[i];
                                found = false;
                                foundEnemy = false;
                                for (j = 0; j < column.length; j++) {
                                    if (found) {
                                        if (column[column.length-j-1] !== color) {
                                            firstEnemyTerritory.push(column.length-j-1);
                                            foundEnemy = true;
                                            break;
                                        }
                                    }
                                    if (column[column.length-j-1] === color) {
                                        found = true;
                                    }
                                }
                                if (!foundEnemy || !found) firstEnemyTerritory.push(-1);
                            }
                            attacks = false;
                            for (j = 0; j < firstEnemyTerritory.length; j++) {
                                if (firstEnemyTerritory[j] !== -1) {
                                    attacks = true;
                                }
                            }
                            if (!attacks) break;
                            var targetColumn = -1;
                            var targetRow = -1;
                            while (targetRow === -1) {
                                targetColumn = Math.floor(Math.random()*transpose.length);
                                targetRow = firstEnemyTerritory[targetColumn];
                            }
                            console.log(firstEnemyTerritory);
                            console.log(firstEnemyTerritory.length);
                            console.log(targetRow);
                            console.log(targetColumn);
                            mydata.factions.map[targetRow][targetColumn] = color;
                            won += 1;
                        }
                        await interaction.reply(`you attacked and gained ${won} squares!`);
                        break;
                    case 2:
                        firstEnemyTerritory = [];
                        for (i = 0; i < facmap.length; i++) {
                            const row = facmap[i];
                            found = false;
                            foundEnemy = false;
                            for (j = 0; j < row.length; j++) {
                                if (found) {
                                    if (row[j] !== color) {
                                        firstEnemyTerritory.push(j);
                                        foundEnemy = true;
                                        break;
                                    }
                                }
                                if (row[j] === color) {
                                    found = true;
                                }
                            }
                            if (!foundEnemy || !found) firstEnemyTerritory.push(-1);
                        }
                        attacks = false;
                        for (j = 0; j < firstEnemyTerritory.length; j++) {
                            if (firstEnemyTerritory[j] !== -1) {
                                attacks = true;
                            }
                        }
                        if (!attacks) {
                            await interaction.reply({content: 'theres nothing to attack in that direction!', ephemeral: true});
                            return;
                        }
                        won = 0;
                        for (n = 0; n < attack; n++) {
                            firstEnemyTerritory = [];
                            for (i = 0; i < facmap.length; i++) {
                                const row = facmap[i];
                                found = false;
                                foundEnemy = false;
                                for (j = 0; j < row.length; j++) {
                                    if (found) {
                                        if (row[j] !== color) {
                                            firstEnemyTerritory.push(j);
                                            foundEnemy = true;
                                            break;
                                        }
                                    }
                                    if (row[j] === color) {
                                        found = true;
                                    }
                                }
                                if (!foundEnemy || !found) firstEnemyTerritory.push(-1);
                            }
                            attacks = false;
                            for (j = 0; j < firstEnemyTerritory.length; j++) {
                                if (firstEnemyTerritory[j] !== -1) {
                                    attacks = true;
                                }
                            }
                            if (!attacks) break;
                            targetColumn = -1;
                            targetRow = -1;
                            while (targetColumn === -1) {
                                targetRow = Math.floor(Math.random()*facmap.length);
                                targetColumn = firstEnemyTerritory[targetRow];
                            }
                            console.log(firstEnemyTerritory);
                            console.log(firstEnemyTerritory.length);
                            console.log(targetRow);
                            console.log(targetColumn);
                            mydata.factions.map[targetRow][targetColumn] = color;
                            won += 1;
                        }
                        await interaction.reply(`you attacked and gained ${won} squares!`);
                        break;
                    case 3:
                        firstEnemyTerritory = [];
                        for (i = 0; i < transpose.length; i++) {
                            const column = transpose[i];
                            found = false;
                            foundEnemy = false;
                            for (j = 0; j < column.length; j++) {
                                if (found) {
                                    if (column[j] !== color) {
                                        firstEnemyTerritory.push(j);
                                        foundEnemy = true;
                                        break;
                                    }
                                }
                                if (column[j] === color) {
                                    found = true;
                                }
                            }
                            if (!foundEnemy || !found) firstEnemyTerritory.push(-1);
                        }
                        attacks = false;
                        for (j = 0; j < firstEnemyTerritory.length; j++) {
                            if (firstEnemyTerritory[j] !== -1) {
                                attacks = true;
                            }
                        }
                        if (!attacks) {
                            await interaction.reply({content: 'theres nothing to attack in that direction!', ephemeral: true});
                            return;
                        }
                        won = 0;
                        for (n = 0; n < attack; n++) {
                            firstEnemyTerritory = [];
                            for (i = 0; i < transpose.length; i++) {
                                const column = transpose[i];
                                found = false;
                                foundEnemy = false;
                                for (j = 0; j < column.length; j++) {
                                    if (found) {
                                        if (column[j] !== color) {
                                            firstEnemyTerritory.push(j);
                                            foundEnemy = true;
                                            break;
                                        }
                                    }
                                    if (column[j] === color) {
                                        found = true;
                                    }
                                }
                                if (!foundEnemy || !found) firstEnemyTerritory.push(-1);
                            }
                            attacks = false;
                            for (j = 0; j < firstEnemyTerritory.length; j++) {
                                if (firstEnemyTerritory[j] !== -1) {
                                    attacks = true;
                                }
                            }
                            if (!attacks) break;
                            targetColumn = -1;
                            targetRow = -1;
                            while (targetRow === -1) {
                                targetColumn = Math.floor(Math.random()*transpose.length);
                                targetRow = firstEnemyTerritory[targetColumn];
                            }
                            console.log(firstEnemyTerritory);
                            console.log(firstEnemyTerritory.length);
                            console.log(targetRow);
                            console.log(targetColumn);
                            mydata.factions.map[targetRow][targetColumn] = color;
                            won += 1;
                        }
                        await interaction.reply(`you attacked and gained ${won} squares!`);
                        break;
                    case 4:
                        firstEnemyTerritory = [];
                        for (i = 0; i < facmap.length; i++) {
                            const row = facmap[i];
                            found = false;
                            foundEnemy = false;
                            for (j = 0; j < row.length; j++) {
                                if (found) {
                                    if (row[row.length-j-1] !== color) {
                                        firstEnemyTerritory.push(row.length-j-1);
                                        foundEnemy = true;
                                        break;
                                    }
                                }
                                if (row[row.length-j-1] === color) {
                                    found = true;
                                }
                            }
                            if (!foundEnemy || !found) firstEnemyTerritory.push(-1);
                        }
                        attacks = false;
                        for (j = 0; j < firstEnemyTerritory.length; j++) {
                            if (firstEnemyTerritory[j] !== -1) {
                                attacks = true;
                            }
                        }
                        if (!attacks) {
                            await interaction.reply({content: 'theres nothing to attack in that direction!', ephemeral: true});
                            return;
                        }
                        won = 0;
                        for (n = 0; n < attack; n++) {
                            firstEnemyTerritory = [];
                            for (i = 0; i < facmap.length; i++) {
                                const row = facmap[i];
                                found = false;
                                foundEnemy = false;
                                for (j = 0; j < row.length; j++) {
                                    if (found) {
                                        if (row[row.length-j-1] !== color) {
                                            firstEnemyTerritory.push(row.length-j-1);
                                            foundEnemy = true;
                                            break;
                                        }
                                    }
                                    if (row[row.length-j-1] === color) {
                                        found = true;
                                    }
                                }
                                if (!foundEnemy || !found) firstEnemyTerritory.push(-1);
                            }
                            attacks = false;
                            for (j = 0; j < firstEnemyTerritory.length; j++) {
                                if (firstEnemyTerritory[j] !== -1) {
                                    attacks = true;
                                }
                            }
                            if (!attacks) break;
                            targetColumn = -1;
                            targetRow = -1;
                            while (targetColumn === -1) {
                                targetRow = Math.floor(Math.random()*facmap.length);
                                targetColumn = firstEnemyTerritory[targetRow];
                            }
                            console.log(firstEnemyTerritory);
                            console.log(firstEnemyTerritory.length);
                            console.log(targetRow);
                            console.log(targetColumn);
                            mydata.factions.map[targetRow][targetColumn] = color;
                            won += 1;
                        }
                        await interaction.reply(`you attacked and gained ${won} squares!`);
                        break;
                    default:
                        interaction.reply({content: 'please use a number from 1-4!', ephemeral: true});
                }
                for (i = 0; i < Object.keys(mydata.factions.players).length; i++) {
                    const checkingColor = Object.keys(mydata.factions.players)[i];
                    eliminated = true;
                    for (j = 0; j < facmap.length; j++) {
                        for (var k = 0; k < facmap[j].length; k++) {
                            if (facmap[j][k] === checkingColor) {
                                eliminated = false;
                                break;
                            }
                        }
                    }
                    if (eliminated) {
                        interaction.followUp(`${checkingColor} HAS BEEN ELIMINATED!`);
                    }
                }
                mydata.factions.cds[color] = Date.now();
                fs.writeFile('./commands/newmydata.json', JSON.stringify(mydata, null, 2), (err) => {
                    if (err) console.log('Error writing file:', err);
                });
            } catch(err) {
                console.error(err);
                return;
            }
        });
	},
};