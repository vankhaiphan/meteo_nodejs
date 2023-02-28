
const url_parser = require('url');
const http = require('http');
const express = require("express");
const fs = require('fs');
const cors = require('cors');
const fetch = require('cross-fetch');
const mustache = require('mustache')
const PORT = 3000;
const app = express();
app.use(cors());

//let url = 'http://api.weatherstack.com/current?access_key=acedf0354c74668f46adb6a91d33c6ba&query=Marseille';
//const apiKey = 'dccbb4d34cf12ba42513fa5be1e3e88c';
//let location = process.argv[2];
//console.log(`Location:::${location}`)
//const api = "http://api.weatherstack.com/current?access_key=dccbb4d34cf12ba42513fa5be1e3e88c&query=${location}";

app.get("/", (req, res) => {
    // http://127.0.0.1:3000/?city=Marseille
    let url = url_parser.parse(req.url, true);
    if (url.query.city !== undefined) {
        console.log(url.query.city);
        let location = url.query.city;
        let api = "http://api.weatherstack.com/current?access_key=dccbb4d34cf12ba42513fa5be1e3e88c&query=" + location;

        fetch(api)
            .then((response) => response.json())
            .then((weatherData) => {
                const info = {
                    "city": weatherData.location.name,
                    "country": weatherData.location.country,
                    "wind_speed": weatherData.current.wind_speed,
                    "temperature": weatherData.current.temperature,
                    "weather_descriptions": weatherData.current.weather_descriptions[0],
                }
                fs.readFile('info.html', function (err, data) {
                    if (err) {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.write('File not found');
                        res.end();
                    } else {
                        const template = data.toString();
                        const rendered = mustache.render(template, 
                            { 
                                city: info.city, 
                                country: info.country,
                                wind_speed: info.wind_speed,
                                temperature: info.temperature,
                                weather_descriptions: info.weather_descriptions
                            }
                        );
                        res.send(rendered);
                    }
                })
            });
    }
    else {
        const info = {}
        fs.readFile('index.html', function (err, data) {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write('File not found');
                res.end();
            } else {
                const template = data.toString();
                const rendered = mustache.render(template, info);
                res.writeHead(200, { 'content-type': 'text/html; charset=UTF-8' });
                res.write(rendered);
                res.end();
            }
        })
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
