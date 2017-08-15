'use strict';
const uuid           = require('uuid');

module.exports.getUserId         = getUserId;
module.exports.checkUserGroup    = checkUserGroup;
module.exports.handleSuccess     = handleSuccess;
module.exports.handleError       = handleError;
module.exports.extractNew        = extractNew;
module.exports.extractData       = extractData;
module.exports.extractJwt        = extractJwt;
module.exports.getPathParam      = getPathParam;


function getUserId(event) {

    try {
        return event.requestContext.authorizer.claims.sub;

    } catch (error) {

        throw new Error(error);
    }
}

function checkUserGroup(event, group) {

    return new Promise((resolve, reject) => {

        try {

            let groups = event.requestContext.authorizer.claims['cognito:groups'].split(",");

            groups.indexOf(group) !== -1 && resolve() || reject();

        } catch (error) {

            reject(new Error(error));
        }
    });
}

function handleSuccess(data, callback) {

    let statusCode = (!!data) ? 200 : 404;

    let response = {
        statusCode: statusCode,
        headers:    {'Access-Control-Allow-Origin': '*'},
        body:       JSON.stringify(data)
    };

    callback(null, response);
}

function handleError(error, callback, message) {

    message = message || error;

    let response = {
        statusCode: 500,
        headers:    {'Access-Control-Allow-Origin': '*'},
        body:       JSON.stringify({error: message})
    };

    callback(null, response);
}

function extractNew(event, idField) {

    let data = extractData(event);

    data[idField] = uuid();

    return data;
}

function extractData(event) {

    return JSON.parse(event.body);
}

function getPathParam(param, event) {

    return event.pathParameters[param];
}

function extractJwt(event) {

    return event.authorizationToken;
}
