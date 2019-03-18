const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io').listen(server)
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const Calculations = require('./calculations.js')

const MAX_DISTANCE_FROM_HOME = 200

// Enables client side demo by static serving of files in public directory
app.use(express.static('public'))
app.get('/', (req, res) => {    
    res.sendFile('public/index.html' , { root : __dirname});
});

// Connect to MongoDB
MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (err, client) => {
    if(err){
        throw err
    }
    
    const db = client.db('local')
    let userHomes = db.collection('userhomes')
    
    io.sockets.on('connection', (socket) => {
        // Saves home location in db or updates location if user already exists in db
        socket.on('setHomeLocation', (location) => {
            const {userId, latitude, longitude} = location

            if(userId){
                userHomes.findOneAndUpdate({"_id": new ObjectID(userId)},{ $set: {"latitude": latitude, "longitude": longitude}}, (err, res) => {
                    if(err) { socket.emit('status', err.message) }
                    else if(res){
                        socket.emit('status', `Your home location has been updated! latitude: ${latitude} longitude: ${longitude}`) 
                    } else {socket.emit('status', `Error, could not find user ${userId} in database`)}
                })
            } else {
                userHomes.insertOne({latitude, longitude}, (err, res) => {
                    if(err){ socket.emit('status', err.message) } 
                    else {
                        socket.emit('status', `Your home location has been set; latitude: ${latitude} longitude: ${longitude}`)
                        socket.emit('setUserId', res.insertedId)
                    }
                })
            }
        });
        
        // Receives current user location, compares with home location and sends alert if they left the house
        socket.on('currentUserLocation', (location) => {
            const {userId, latitude, longitude} = location

            userHomes.findOne({"_id": new ObjectID(userId)}, (err, res) => {
                if(err){socket.emit('status', err.message)}
                else if(res){
                    let distance = Calculations.calculateDistance(latitude, longitude, res.latitude, res.longitude)
                    if(distance >= MAX_DISTANCE_FROM_HOME){
                        socket.emit('status', "Lockbot has detected you left the house! Did you lock your door?")
                    } else {
                        socket.emit('status', `You are ${distance}m away from home`)
                    }
                } else { socket.emit('status', `Could not find your home location, please reset your location`) }
            })
        });
    });
})

const port = process.env.PORT || 3000

server.listen(port)
