const path = require('path');
const rootPath = __dirname;
let dbUrl = 'mongodb://localhost/now-i-am';
let port = 8000;

if (process.env.NODE_ENV === 'test') {
    dbUrl = 'mongodb://localhost/now-i-am-test';
    port = 8010;
}

module.exports = {
    corsWhiteList: [
        'http://localhost:4200',
        'https://localhost:4200',
        'http://localhost:4210',
        'http://159.223.23.60',
        'https://159.223.23.60',
    ],
    port,
    rootPath,
    uploadPath: path.join(rootPath, 'public/uploads'),
    avatarAllowedTypes: ['.png', '.gif', '.jpg', '.jpeg'],
    mongo: {
        db: dbUrl,
        options: {useNewUrlParser: true},
    },
    facebook: {
        appId: '1036035837346520',
        appSecret: '4349f330d6caa54978bfcd218e43464d'
    },
    google: {
        appId: '40811209122-h2vmbta5hlsirf6rkjtahnuiv4rdko4u.apps.googleusercontent.com',
        appSecret: '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'
    },
    vk: {
        appId: '8157037',
        appSecret: '185dFESEbjJ5SrpyV7xn'
    }
};
