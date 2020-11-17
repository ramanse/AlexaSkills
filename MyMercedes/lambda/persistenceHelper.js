const fs = require('fs');

const filePath = './lambda/tempaccess.json';


module.exports = {
    updateTokenDetails: function (accessToken, refreshToken) {
        let userAccess = {
            accessToken: accessToken,
            refreshToken: refreshToken
        };
        try {
            fs.writeFileSync(filePath, JSON.stringify(userAccess, null, 2), 'utf8');
        }
        catch (err) {
            console.err("An error has ocurred when saving the file.");
        }
    },

    getStoredAccessToken: function () {
        const fileObject = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return fileObject.accessToken;

    }
};