var express = require('express')
var router = express.Router()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectID;
var collection = null;

/**
 * Spajanje na bazu
 */
const uri = "mongodb+srv://ja:jaja@cluster0.wgrbk.mongodb.net/or_lab?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    useNewUrlParser: true
});
client.connect(err => {
    collection = client.db("or_lab").collection("serije");
    if (err) {
        console.error(err)
    }
    console.log("Connected to `or_lab.serije`!");
});

/**
 * Dohvati sve serije
 */
router.get('/', async (request, response) => {
    collection.find({}).toArray(function (error, result) {
        if (error) {
            console.error(error)
        }
        if (!Object.keys(result).length) {
            response.status(404)
            response.json({
                status: 'Not found',
                message: 'Serije ne postoje',
                response: null
            }, [{
                href: '/serije/create',
                rel: "create serija",
                type: "POST"
            }]);

        } else {
            response.status(200)
            o = []
            for (var res of result) {
                o.push({
                    href: '/serije/' + res._id,
                    rel: "serija",
                    type: "GET"
                })
            }
            JSON.stringify(o)

            response.json({
                status: 'OK',
                message: 'Dohvaćene serije',
                response: result
            }, o);
        }
    })
})

/**
 * Dohvati podatke o jednoj seriji na osnovi id-a
 */
router.get("/:id", async (request, response) => {
    if (ObjectId.isValid(request.params.id)) {
        collection.findOne({
            "_id": new ObjectId(request.params.id)
        }, (error, result) => {
            if (result == null) {
                response.status(404)
                response.json({
                    status: 'Not found',
                    message: 'Serija ne postoji',
                    response: null
                }, [{
                    href: '/serije/create',
                    rel: "self",
                    type: "POST"
                }]);
            } else {
                response.status(200)
                response.json({
                    status: 'OK',
                    message: 'Dohvaćena serija',
                    response: result
                }, [{
                        href: '/serije/' + result._id,
                        rel: "self",
                        type: "GET"
                    },
                    {
                        href: '/serije/create',
                        rel: "create serija",
                        type: "POST"
                    },
                    {
                        href: '/serije/' + result._id + '/delete',
                        rel: "delete serija",
                        type: "DELETE"
                    },
                    {
                        href: '/serije/' + result._id + '/glumci',
                        rel: "glumci",
                        type: "GET"
                    },
                    {
                        href: '/serije/' + result._id + '/info',
                        rel: "info serija",
                        type: "GET"
                    },
                    {
                        href: '/serije/' + result._id + '/imdbOcjena',
                        rel: "ocjene serija",
                        type: "GET"
                    }
                ]);
            }
        });
    } else {
        response.status(400)
        response.json({
            status: 'Id',
            message: 'Id je krivog formata',
            response: null
        });
    }
});

/**
 * Dohvati sve glumce jedne serije
 */
router.get("/:id/glumci", async (request, response) => {
    collection.findOne({
        "_id": new ObjectId(request.params.id)
    }, (error, result) => {
        if (typeof result.glumci === 'undefined') {
            response.status(404)
            response.json({
                status: 'Not found',
                message: 'Glumci ne postoje',
                response: null
            }, [{
                    href: '/serije/' + result._id,
                    rel: "serija",
                    type: "GET"
                },
                {
                    href: '/serije',
                    rel: "get serije",
                    type: "GET"
                }
            ]);
        } else {
            response.status(200)
            response.json({
                status: 'OK',
                message: 'Dohvaćeni glumci',
                response: result.glumci
            }, [{
                    href: '/serije/' + result._id + '/glumci',
                    rel: "self",
                    type: "GET"
                },
                {
                    href: '/serije/' + result._id,
                    rel: "serija",
                    type: "GET"
                }
            ]);

        }
    });
});

/**
 * Dohvati info jedne serije
 */
router.get("/:id/info", async (request, response) => {
    collection.findOne({
        "_id": new ObjectId(request.params.id)
    }, (error, result) => {
        if (typeof result.infoSerije === 'undefined') {
            response.status(404)
            response.json({
                status: 'Not found',
                message: 'Info ne postoji',
                response: null
            }, [{
                    href: '/serije/' + result._id,
                    rel: "serija",
                    type: "GET"
                },
                {
                    href: '/serije',
                    rel: "get serije",
                    type: "GET"
                }
            ]);
        } else {
            response.status(200)
            response.json({
                status: 'OK',
                message: 'Dohvaćeni info serije',
                response: result.infoSerije
            }, [{
                    href: '/serije/' + result._id + '/info',
                    rel: "self",
                    type: "GET"
                },
                {
                    href: '/serije/' + result._id,
                    rel: "get serija",
                    type: "GET"
                }
            ]);
        }
    });
});

/**
 * Dohvati ocjene jedne serije
 */
router.get("/:id/imdbOcjena", async (request, response) => {
    collection.findOne({
        "_id": new ObjectId(request.params.id)
    }, (error, result) => {
        if (typeof result.ocjenaIMDb === 'undefined') {
            response.status(404)
            response.json({
                status: 'Not found',
                message: 'Ocjena ne postoji',
                response: null
            }, [{
                    href: '/serije/' + result._id,
                    rel: "serija",
                    type: "GET"
                },
                {
                    href: '/serije',
                    rel: "get serije",
                    type: "GET"
                }
            ]);
        } else {
            response.status(200)
            response.json({
                status: 'OK',
                message: 'Dohvaćena ocjena serije',
                response: result.ocjenaIMDb
            }, [{
                    href: '/serije/' + result._id + '/imdbOcjena',
                    rel: "self",
                    type: "GET"
                },
                {
                    href: '/serije',
                    rel: "get serije",
                    type: "GET"
                }
            ]);
        }
    });
});

router.put("/:id/update", function (request, response) {

    collection.updateOne({
        "_id": ObjectId(request.params.id)
    }, {
        $set: request.body
    });

    response.status(201)
    response.json({
        status: 'OK',
        message: 'Spremljene promjene serije',
        response: response.body
    }, [{
            href: '/serije/update',
            rel: "self",
            type: "PUT"
        },
        {
            href: '/serije',
            rel: "get serije",
            type: "GET"
        },
        {
            href: '/serije/' + request.body._id + '/imdbOcjena',
            rel: "ocjena",
            type: "GET"
        },
        {
            href: '/serije/' + request.body._id + '/glumci',
            rel: "glumci",
            type: "GET"
        },
        {
            href: '/serije/' + request.body._id + '/delete',
            rel: "delete",
            type: "DELETE"
        }
    ]);
});

/**
 * Stvori jednu seriju
 */
router.post("/create", function (request, response) {
    collection.insertOne(request.body, (err, result) => {
        if (err) {
            console.dir(err);
        }
        console.log('mongodb insert done');
    })
    response.status(201)
    response.json({
        status: 'OK',
        message: 'Spremljena nova serija',
        response: request.body
    }, [{
            href: '/serije/create',
            rel: "self",
            type: "POST"
        },
        {
            href: '/serije',
            rel: "get serije",
            type: "GET"
        },
        {
            href: '/serije/' + request.body._id + '/imdbOcjena',
            rel: "ocjena",
            type: "GET"
        },
        {
            href: '/serije/' + request.body._id + '/glumci',
            rel: "glumci",
            type: "GET"
        },
        {
            href: '/serije/' + request.body._id + '/delete',
            rel: "delete",
            type: "DELETE"
        }
    ]);
});

/**
 * Obriši jednu seriju
 */
router.delete("/:id/delete", function (request, response) {
    collection.deleteOne({
        "_id": new ObjectId(request.params.id)
    }, function (err, result) {
        if (err) {
            throw err;
        }
        if (result.deletedCount == 0) {
            response.json({
                status: 'OK',
                message: 'Serija već prije obrisana',
                response: null
            }, [{
                href: '/serije',
                rel: "get serije",
                type: "GET"
            }]);
        } else {
            response.json({
                status: 'OK',
                message: 'Serija uspješno obrisana',
                response: result.nazivSerije
            }, [{
                href: '/serije',
                rel: "get serije",
                type: "GET"
            }, ]);
        }
    });
});

module.exports = router;