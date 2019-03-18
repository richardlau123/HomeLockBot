# HomeLockbot

Application to remind users to lock their doors when they leave the house. 

## Description


Location data is provided via the Geolocation web API. 

Web socket API connection was implemented using socket.io. 

Distance from home is determined using the Haversine formula (https://www.movable-type.co.uk/scripts/latlong.html).

Technologies used to built this application include nodejs, express, socket.io, MongoDB, and JQuery. 

I have also built a simple client interface to demo the application. 

To make testing and demoing easier, I implemented a current location button that tells the client how far they are from home. 
Therefore, alerts to remind the user to lock the door are only sent if they clicked the button. 
** This change only affects the client
implementation, the back-end API still meet the logic and business requirements specified ** 

To track and send client location to the server one would use Geolocation watchPosition() which fires a callback when user moves.

## To run
clone the repo

install dependencies

run mongodb on localhost:27017

run npm start


client demo will be served on your localhost:3000

Question: This is a simple app so it’s not expected to support hundreds of thousands of concurrent users…but if it did, what kind of changes would you need to make?

In the current implementation, initially the client establishes connection to the server and sets their home location. This data is saved and 
the MongoDB ObjectID for that entry is sent back to the user. If the user sets a new home location, the same ObjectID is used to update the entry. 
However, this objectID is lost when the client closes connection (i.e closes browser). This would be problematic due to stale entries and the collection
possibly having multiple entries per user. The solution would be to save this userId in some way, such as using cookies or local storage.
Other solutions may be to simply delete old entries from the collection periodically or implement a simple authentication system.

I would also need to implement sticky load balancing (socket.io docs have details on how to do this https://socket.io/docs/using-multiple-nodes/)
Load balance would be achieved by routing clients based on their address or a cookie.

