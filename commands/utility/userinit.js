var userinit = function(data, userid) {
    const { shop } = require('../shop.json');
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
    return data;
};

module.exports = { userinit };