function toRadians(degrees){
    return degrees * (Math.PI / 180)
}

module.exports = {
// Use haversine formula to determine distance between points (meters)
    calculateDistance: function (lat, long, homeLat, homeLong){
        var R = 6371e3; // metres
        var φ1 = toRadians(homeLat)
        var φ2 = toRadians(lat)
        var Δφ = φ2 - φ1 
        var Δλ = toRadians(long) - toRadians(homeLong)
        
        var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        
        var d = R * c;
    
        return d
    }
}