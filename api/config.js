const path = require('path');

const rootPath = __dirname;

module.exports = {
  rootPath,
  uploadPath: path.join(rootPath, 'public/uploads'),
  mongo: {
    db: 'mongodb://localhost/now-i-am',
    options: {useNewUrlParser: true},
  },
  facebook: {
    appId: '1028093457819968',
    appSecret: '41fb2532328749a80db0a63c36d96fe8'
  }
};