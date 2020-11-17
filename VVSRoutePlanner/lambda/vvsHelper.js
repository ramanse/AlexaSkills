/* *
 * This module handles VVS routing requesting bz fetching the relevant DOM
 * entries and parsing it to the required format
 * */
const http = require("https");

let sayResult = '';
let receivedAddress = '';

function processRoutingQueryResult(jsonResult) {
    sayResult = "No route details available for " + receivedAddress;
    if (jsonResult.departureList && jsonResult.departureList.length > 0) {
        //each stops has two way directions provide both option
        var route1Result = "";
        var route2Result = "";
        if (jsonResult.departureList[0] && jsonResult.departureList[0].servingLine) {
            var route1TransitMode = jsonResult.departureList[0].servingLine.name;
            var route1TransitNumber = jsonResult.departureList[0].servingLine.number;
            var route1towards = jsonResult.departureList[0].servingLine.direction.toLowerCase();
            var route1Time = jsonResult.departureList[0].dateTime.hour + ":" + jsonResult.departureList[0].dateTime.minute;
            route1Result = route1TransitMode + " " + route1TransitNumber + " towards " + route1towards + " at " + route1Time;
        }
        if (jsonResult.departureList[1] && jsonResult.departureList[1].servingLine) {
            var route2TransitMode = jsonResult.departureList[1].servingLine.name;
            var route2TransitNumber = jsonResult.departureList[1].servingLine.number;
            var route2towards = jsonResult.departureList[1].servingLine.direction.toLowerCase();
            var route2Time = jsonResult.departureList[1].dateTime.hour + ":" + jsonResult.departureList[1].dateTime.minute;
            route2Result = route2TransitMode + " " + route2TransitNumber + " towards " + route2towards + " at " + route2Time;
        }
        isResultReady = true;
        sayResult = route1Result + " and " + route2Result;

        var replace = new Array('ä', 'ö', 'ü', 'ß', "(f)", "()");
        var by = new Array('a', 'o', 'u', "ss", 'f', "");
        for (var i = 0; i < replace.length; i++) {
            sayResult = sayResult.replace(new RegExp(replace[i], "g"), by[i]);
        }

    }
}

module.exports = {
    isResultReady: false,
    getResult: function () {
        return sayResult;
    },
    routingDetails: function (address) {
        return new Promise((resolve, reject) => {
            let url = "https://www2.vvs.de/vvs/XSLT_DM_REQUEST?language=en";
            let params = "?" +
                "&type_dm=stop" +
                "&mode=direct&dmLineSelectionAll=1&depType=STOPEVENTS" +
                "&includeCompleteStopSeq=0&useRealtime=1&outputFormat=json" +
                "&name_dm=" + address + "&limit=8&timeOffset=0";
            var final = url + params;
            receivedAddress = address;
            const request = http.get(url + params, response => {
                response.setEncoding('utf8');

                let returnData = '';
                if (response.statusCode < 200 || response.statusCode >= 300) {
                    return reject(new Error(`${response.statusCode}: ${response.req.getHeader('host')} ${response.req.path}`));
                }
                response.on('data', chunk => {
                    returnData += chunk;
                });

                response.on('end', () => {
                    processRoutingQueryResult(JSON.parse(returnData));
                    resolve(sayResult);
                });

                response.on('error', error => {
                    reject(error);
                });
            });
            request.end();
        });

    }
}
