$(function (){
    const socket = io.connect("/")
    let userId = null

    socket.on('status', (message) => {
        $('#status').html(message)
    })

    socket.on('setUserId', (id) => {
        userId = id
    })

    $('#home').click(function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(geoSuccess, geoError, { enableHighAccuracy: true });
        } else {
            $('#status').html("Your browser does not support location tracking")
        }
    })

    $('#current-location').click(function (){
        if (navigator.geolocation && userId) {
            navigator.geolocation.getCurrentPosition(sendUserPosition, geoError, { enableHighAccuracy: true });
        } else {
            $('#status').html("Set your home location first!")
        }
    })

    function geoSuccess(position){
        const {latitude, longitude} = position.coords

        socket.emit('setHomeLocation', {userId, latitude, longitude})
    }

    function sendUserPosition(position){
        const {latitude, longitude} = position.coords

        socket.emit('currentUserLocation', {userId, latitude, longitude})
    }

    function geoError(error){
        $('#status').html(error.message)
    }
})