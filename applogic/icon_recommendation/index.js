const express = require('express')
const app = express()
const axios = require('axios');
const formData = require('form-data');
const catalyst = require("zcatalyst-sdk-node");
var iconv = require('iconv-lite');

//If you do not use the following line, then you will never receive any post data
//If you are passing data in Ajax as json, then you need to have this line
app.use(express.json());
app.use(function(req, res, next) {
    console.log('URL:  ', req.url)
    next()
})



app.post('/getRecommendation', (req, res) => {
    const catalystApp = catalyst.initialize(req);
    console.log('Received Term is  ' + req.body.text_for_recommendation);
    // let form = new formdata();

    var recommendForTerm = req.body.text_for_recommendation;

    //Starts

    var connector = catalystApp.connection({
        ConnectorName: {
            client_secret: 'a0a6671c30d6d',
            auth_url: 'https://accounts.zoho.com/oauth/v2/auth',
            refresh_url: 'https://accounts.zoho.com/oauth/v2/token',
            refresh_token: '1000.c5605b9b2.619b0a5593591ad3442caf6edfcf7c9d'
        }
    }).getConnector('ConnectorName');



    // //here onwards exception happens
    connector.getAccessToken().then((accessToken) => {
        console.log(accessToken)
        var url = 'https://ml.zoho.com/api/v2/nlp/textanalysis'
        console.log('url to be called is ' + url);


        //set form data
        var form = new formData()
        form.append('sourceWords', '[' + recommendForTerm + ']');
        form.append('modelType', 'ICON_RECOMMENDER');
        //set request parameter

        var headers = {
            'Authorization': 'Zoho-oauthtoken ' + accessToken,
            ...form.getHeaders(),
            "Accept-Charset": "utf-16"
        };
        axios({
            headers: headers,
            url: url,
            data: form,
            method: 'POST',
            responseType: 'arraybuffer'
        }).then(resp => {
            //  console.log(resp.headers);
            res.set("Content-type", resp.headers['content-type'])
            console.log('Data being sent to client is  ' + resp.data)
            res.send(resp.data)
        }).catch(err => {
            console.log(err);
            res.send(err)
        })

    }).catch(err => {
        console.log(err);
    });



})





module.exports = app;
