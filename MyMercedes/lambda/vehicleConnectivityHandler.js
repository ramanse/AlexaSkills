/* *
 * This module handles VVS routing requesting bz fetching the relevant DOM
 * entries and parsing it to the required format
 * */
const https = require("https");
//const authorization = require ('./authorizationHandler.js')
let sayResult = '';


module.exports = {
    isResultReady: false,
    init: function () {
        authorization.init();
    },

    vehicleLockStatus: function (type, accessToken) {
        return new Promise((resolve, reject) => {

            let requestType = '';
            console.error("bType is " + type);
            switch (type) {
                case 'car':
                case 'vehicle':
                    requestType = 'vehicle';
                    break;
                case 'gas':
                case 'gas lid':
                    requestType = 'gas';
                    break;
                case 'doors':
                case 'all doors':
                    requestType = 'doors';
                    break;

                default: requestType = 'vehicle';
                    break;
            }
            let url = "api.mercedes-benz.com";
            const options = {
                hostname: url,
                path: '/experimental/connectedvehicle/v2/vehicles/08748497FBE9AAADE2/doors',
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'authorization': 'Bearer ' + accessToken
                }
            };
            const req = https.request(options, response => {
                response.setEncoding('utf8');

                let returnData = '';
                if (response.statusCode != 200) {
                    console.error("error is " + response.statusCode);
                }
                response.on('data', chunk => {
                    returnData += chunk;
                });

                response.on('end', () => {
                    console.error(" received value is " + returnData);
                    let jsonResult = JSON.parse(returnData);
                    //{"fuellevelpercent":{"value":30,"retrievalstatus":"VALID","timestamp":1604779372,"unit":"PERCENT"}}'
                    var saytheword = 'No result available';
                    //Fuel level in the car is ' + jsonResult.fuellevelpercent.value + ' %
                    if (jsonResult) {
                        var status  = jsonResult['doorlockstatus'+requestType].value
                        saytheword = type + ' is ' + status;
                    }
                    resolve(saytheword);

                });

                response.on('error', error => {
                    console.log("received error " + error);
                    if (error) {
                        reject(error);
                    }
                });
            });
            req.end();
            req.on('error', function (e) {
                reject(e);
            });

        });
    },
    getVehicleStatus: function (type, accessToken) {
        return new Promise((resolve, reject) => {

            let requestType = '';
            console.error("bType is " + type);
            switch (type) {
                case 'fuel':
                case 'fuel state': requestType = 'fuel';
                    break;
                case 'battery':
                case 'stateofcharge':
                case 'charge':
                case 'state':
                case 'charge state': requestType = 'stateofcharge';
                    break;
                case 'mileage':
                case 'odometer':
                case 'odometer reading': requestType = 'odometer';
                    break;
                case 'vehicle':
                case 'my vehicle':
                case 'my auto':
                case 'Mercedes':
                case 'my mercedes':
                case 'car':
                case 'my car': requestType = '';
                    break;

                default: requestType = 'fuel';
                    break;
            }
            let url = "api.mercedes-benz.com";
            const options = {
                hostname: url,
                path: '/experimental/connectedvehicle/v2/vehicles/08748497FBE9AAADE2/' + requestType,
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'authorization': 'Bearer ' + accessToken
                }
            };
            const req = https.request(options, response => {
                response.setEncoding('utf8');

                let returnData = '';
                if (response.statusCode != 200) {
                    console.error("error is " + response.statusCode);
                }
                response.on('data', chunk => {
                    returnData += chunk;
                });

                response.on('end', () => {
                    console.error(" received value is " + returnData);
                    let jsonResult = JSON.parse(returnData);
                    //{"fuellevelpercent":{"value":30,"retrievalstatus":"VALID","timestamp":1604779372,"unit":"PERCENT"}}'
                    var saytheword = 'No result available';
                    //Fuel level in the car is ' + jsonResult.fuellevelpercent.value + ' %
                    if (jsonResult) {
                        switch (type) {
                            case 'fuel state':
                            case 'fuel':
                                saytheword = 'Fuel level in the car is ' + jsonResult.fuellevelpercent.value + ' %';
                                break;
                            case 'battery':
                            case 'stateofcharge':
                            case 'state of charge':
                            case 'charge':
                            case 'state':
                            case 'charge state':
                                saytheword = 'Charge state in the car is ' + jsonResult.stateofcharge.value + ' %';
                                break;
                            case 'mileage':
                            case 'odometer':
                            case 'odometer reading':
                                saytheword = 'The car has total mileage of ' + jsonResult.odometer.value + ' kilometers' + ' and has driven for ' + jsonResult.distancesincereset.value + ' kilometers since the reset'
                                    + '. The last travelled distance is ' + jsonResult.distancesincestart.value + ' kilometers';
                                break;
                            case 'vehicle':
                            case 'my vehicle':
                            case 'my auto':
                            case 'my mercedes':
                            case 'Mercedes':
                            case 'car':
                            case 'my car':
                                saytheword = 'It is unbeatable ' + jsonResult.modelyear + ' model ' + jsonResult.salesdesignation + ' in beautiful' + jsonResult.colorname + ' color. The fuel type is ' + jsonResult.fueltype + ' with ' + jsonResult.powerhp + ' horsepower';
                                break;
                            default: requestType = 'fuel';
                                break;
                        }
                    }
                    resolve(saytheword);

                });

                response.on('error', error => {
                    console.log("received error " + error);
                    if (error) {
                        reject(error);
                    }
                });
            });
            req.end();
            req.on('error', function (e) {
                reject(e);
            });

        });
    }
}
