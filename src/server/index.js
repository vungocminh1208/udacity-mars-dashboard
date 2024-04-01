require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

//get rover photos
app.get('/rovers/:name', async (req, res) => {
    try {
        if (req.params.name) {
            const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${req.params.name}/photos?sol=1000&api_key=${process.env.API_KEY}`)
            const data = await response.json()
            res.send(data)
        }
    } catch (err) {
        res.status(500)
        console.error('err: ', err)
    }
})

//get each rover info
app.get('/rover-info/:name', async (req, res) => {
    try {
        if (req.params.name) {
            const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${req.params.name}?api_key=${process.env.API_KEY}`)
            const data = await response.json()
            res.send(data)
        }
    } catch (error) {
        res.status(500)
        console.error('err: ', error)
    }
})

//get each rover latest photos
app.get('/latest-photos/:name', async (req, res) => {
    try {
        if (req.params.name) {
            const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${req.params.name}/latest_photos?api_key=${process.env.API_KEY}`)
            const data = await response.json()
            res.send(data)
        }
    } catch (error) {
        res.status(500)
        console.error('err: ', error)
    }
})

// example API call
app.get('/apod', async (req, res) => {
    try {
        let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ image })
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))