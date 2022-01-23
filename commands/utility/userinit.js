var userinit = function(data, userid) {
    const { shop } = require('../shop.json');
    const { campingshop } = require('../camping/campingshop.json');
    if (!(Object.hasOwn(data.users, userid))) {
        data.users[userid] = {};
    }
    if (!(Object.hasOwn(data.users[userid], 'items'))) {
        data.users[userid].items = {};
    }
    if (!(Object.hasOwn(data.users[userid], 'money'))) {
        data.users[userid].money = 0;
    }
    if (!(Object.hasOwn(data.users[userid], 'pickupcd'))) {
        data.users[userid].pickupcd = 0;
    }
    if (!(Object.hasOwn(data.users[userid], 'upgrades'))) {
        data.users[userid].upgrades = {};
    }
    for (var i = 0; i < shop.length; i++) {
        if (!(Object.hasOwn(data.users[userid].upgrades, shop[i].id))) {
            data.users[userid].upgrades[shop[i].id] = 0;
        }
    }
    if (!(Object.hasOwn(data.users[userid], 'tents'))) {
        data.users[userid].tents = 10;
    }
    if (!(Object.hasOwn(data.users[userid], 'campingUpgrades'))) {
        data.users[userid].campingUpgrades = {};
    }
    for (i = 0; i < campingshop.length; i++) {
        if (!(Object.hasOwn(data.users[userid].campingUpgrades, campingshop[i].id))) {
            data.users[userid].campingUpgrades[campingshop[i].id] = 0;
        }
    }
    if (!(Object.hasOwn(data.users[userid], 'campingLastChecked'))) {
        data.users[userid].campingLastChecked = Date.now();
    }
    return data;
};

module.exports = { userinit };