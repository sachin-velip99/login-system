const signupUser = {
    tags:["logs"],
    description: "operations",
    requestBody:{
        content: {
            "application/json": {
                schema: {
                    type:"object",
                    properties:{
                        userId:{
                            type: "integer",
                            description: "userid",
                            example: "1",
                        },
                        username:{
                            type: "string",
                            description: "username",
                            example: "tom",
                        },
                        email:{
                            type: "string",
                            description: "email",
                            example: "tom@gmail.com",
                        },
                        phone:{
                            type: "integer",
                            description: "phone",
                            example: "tom",
                        },
                        password:{
                            type: "string",
                            description: "password",
                            example: "******",
                        },
                    }
                }
            }
        }
    },
    responses: {
        200: {
            description: "ok",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        example: {
                            username: "username",
                            email: "email",
                            phone: "phone",
                        }
                    }
                }
            }
        }
    }
}

const loginUser = {
    tags:["login"],
    description: "login operation",
    requestBody:{
        content: {
            "application/json":{
                schema: {
                    type: "object",
                    properties:{
                        username:{
                            type: "string",
                            description: "username",
                            example: "jack"
                        },
                        password:{
                            type: "string",
                            description: "pass",
                            example: "****",
                        }
                    }
                }
            }
        }
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        example: {
                            accessToken: "ejic3kf44p",
                        }
                    }
                }
            }
        }
    }
}

const profileUser = {
    tags:["profiles"],
    description:"profile authentication",
    responses:{
        200: {
            content:{
                "application/json": {
                    schema: {
                        type: "object",
                        example:{
                            resp: "profile",
                        }
                    }
                }
            }
        },
        400: {
            content:{
                "application/json": {
                    schema: {
                        type: "object",
                        example:{
                            resp: "not authenticated",
                        }
                    }
                }
            }
        }
    }
}

const signupRouteDoc = {
    "/signup": {
    post: signupUser,
},
    "/login":{
        post: loginUser,
    },
    "/profile":{
        get: profileUser,
    }
};

module.exports = signupRouteDoc;