const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const elasticsearch = require("elasticsearch");
const multer = require("multer");

const config = require("./config");
const bulk = require("./config/elastic");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, config.UPLOAD_PATH);
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + ".json");
    },
});

const upload = multer({ storage: storage });

const esClient = new elasticsearch.Client({
    host: config.ELASTIC_URL,
    log: "error",
});

const app = express();
app.use(bodyParser.json());
app.use(express.static(config.PUBLIC_PATH));

app.post("/api/bulk", upload.single("bulk"), (req, res) => {
    const jsonFile = req.file;
    if (
        jsonFile.mimetype !== "application/json" &&
        jsonFile.mimetype !== "application/octet-stream"
    ) {
        return res.status(400).send("Can only process json file");
    }
    bulk.cleanIndex().then((data) => {
        bulk
            .bulkIndexer(JSON.parse(fs.readFileSync(jsonFile.path)))
            .then(() => {
                res.status(200).send({
                    message: "Bulk Indexing complete!",
                    data: {
                        INDEX: config.INDEX,
                        TYPE: config.TYPE,
                    },
                });
            })
            .catch((err) => {
                res.status(500).send(err);
            });
    });
});

app.get("/api/search", (req, res) => {
    const queryString = req.query.queryString;
    const page = req.query.page - 1 || 0;
    const searchParams = {
        size: 10,
        from: page,
        index: config.INDEX,
        body: {
            query: {
                multi_match: {
                    query: queryString,
                    fields: ["title", "author", "concepts", "link", "date"],
                },
            },
        },
    };
    console.log("Searching params: ", searchParams);
    esClient
        .search({
            ...searchParams,
        })
        .then((match) => {
            res.status(200).send({
                message: "Query success!",
                data: match,
            });
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});

app.listen(config.SERVER_PORT);
console.log(`Tunneling through: ${config.SERVER_PORT}`);