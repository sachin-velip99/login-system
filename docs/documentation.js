const signupRouteDoc = require("../help/signup.doc");

const swaggerDocumentation = {

    openapi: "3.0.0",

    info:{

        title: "login system",

        version: "0.0.1",

        description: "this is login system",
    },

    servers: [
        {
            url: "http://localhost:3000",

            description: "login system",
        }
    ],

    tags: [
        {
            name: "logs",
            description: "routes",
        }
    ],

    paths:{
       ...signupRouteDoc,
    }
};

module.exports = swaggerDocumentation;