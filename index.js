const express = require('express');
const path = require('path');

const app = express();

const key = '8be14fc27071cc1cd95870ea6a27e429';


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fetch weather data
const getWeatherData = (city) => {
    return new Promise((resolve, reject) => {
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('City not found');
                }
                return response.json();
            })
            .then((data) => {
                if (!data.weather || !data.main) {
                    throw new Error('Invalid data from API');
                }
                let description = data.weather[0].description;
                let city = data.name;
                let temp = Math.round(parseFloat(data.main.temp) - 273.15);
                resolve({
                    description,
                    city,
                    temp,
                    error: null,
                });
            })
            .catch((error) => {
                resolve({ error: error.message });
            });
    });
};

// Routes
app.get('/', (req, res) => {
    getWeatherData(city)
        .then((data) => {
            res.render('index', data);
        })
        .catch(() => {
            res.render('index', { error: 'Problem with getting data, try again...' });
        });
});

app.post('/', (req, res) => {
    let city = req.body.cityname.trim();

    if (city.length === 0 ) {
        return res.render('index', {
            error: 'No input inserted. Please provide a city name!',
        } )
    } 
    getWeatherData(city)
        .then((data) => {
            res.render('index', data);
        })
        .catch(() => {
            res.render('index', { error: 'Problem with getting data, try again...' });
        });
});

// Start server
app.listen(3002, () => {
    console.log('Server running on http://localhost:3002');
});
