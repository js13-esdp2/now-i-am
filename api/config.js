const path = require('path');

const rootPath = __dirname;

module.exports = {
  rootPath,
  uploadPath: path.join(rootPath, 'public/uploads'),
  avatarAllowedTypes: ['.png', '.gif', '.jpg', '.jpeg'],
  mongo: {
    db: 'mongodb://localhost/now-i-am',
    options: {useNewUrlParser: true},
  },
    facebook: {
    appId: '1036035837346520',
      appSecret: '4349f330d6caa54978bfcd218e43464d'
    },
    google: {
      appId: '40811209122-h2vmbta5hlsirf6rkjtahnuiv4rdko4u.apps.googleusercontent.com',
        appSecret: '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'
    }
};