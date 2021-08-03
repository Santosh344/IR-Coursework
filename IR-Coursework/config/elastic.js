const fs = require('fs');
const elasticsearch = require('elasticsearch');
const config = require('./index');
const esClient = new elasticsearch.Client({
    host: config.ELASTIC_URL,
    log: 'error'
});

module.exports.cleanIndex = () => new Promise((resolve, reject) => {
    console.log(`Cleaning index: ${config.INDEX}`);
    esClient.indices.exists({
        index: config.INDEX,
    }).then(exists => {
        if (!exists) {
            resolve();
        } else {
            esClient.indices.delete({
                index: config.INDEX,
            }).then(del => {
                resolve();
            }).catch(err => {
                reject(err);
            })
        }
    }).catch(err => {
        reject(err);
    })
})


module.exports.massIndexer = (data) => new Promise((resolve, reject) => {
    let massBody = [];
    console.log(`Indexing ${data.length} items..`);
    data.forEach(item => {
        massBody.push({
            index: {
                _index: config.INDEX,
                _type: config.TYPE,
                _id: item._id
            }
        });

        massBody.push(item);
    });

    esClient.mass({ body: massBody })
        .then(response => {
            let errorCount = 0;
            response.items.forEach(item => {
                if (item.index && item.index.error) {
                    console.log(++errorCount, item.index.error);
                }
            });
            console.log(`Successfully indexed ${data.length - errorCount} out of ${data.length} items`);
            return resolve();
        })
        .catch(err => {
            reject(err);
        });
});