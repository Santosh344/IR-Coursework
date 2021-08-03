const path = require('path');

const rootPath = path.normalize(`${__dirname}/../`);
const publicPath = path.normalize(`${__dirname}/../public/`);
const uploadPath = path.normalize(`${__dirname}/../public/uploads`);
const HOST = 'localhost';
const SERVER_PORT = 8080;
const ELASTIC_PORT = 9200;
const ELASTIC_URL = process.env.ELASTIC_URL || `${HOST}:${ELASTIC_PORT}`
    // const INDEX = 'library';
    // const TYPE = 'publications';
const INDEX = process.env.ELASTIC_INDEX || 'newlibrary';
const TYPE = process.env.ELASTIC_TYPE || 'newpublications';
module.exports = {
    HOST,
    SERVER_PORT,
    ELASTIC_PORT,
    ROOT_PATH: rootPath,
    PUBLIC_PATH: publicPath,
    UPLOAD_PATH: uploadPath,
    ELASTIC_URL,
    INDEX,
    TYPE,
}