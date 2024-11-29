const express = require('express')
const path = require('path')

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/boostrap/dist')))

const key = '8be14fc27071cc1cd95870ea6a27e429'
let city = 'Tartu'

app.get('/', (req, res) =>{
    fetch (`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`)
    .then((response) =>{
        return response.json()
    })
    .then((data) => {
        let description = data.weather[0].description
        let city = data.name
        let temp = Math.round(parseFloat(data.main.temp)- 274.29) 
        res.render('index', {
            description: description,
            city: city,
            temp: temp
        })
    })
   
} )

app.listen(3002)