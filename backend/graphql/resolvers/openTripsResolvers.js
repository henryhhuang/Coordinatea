const fetch = require('cross-fetch');
const { OPENTRIPS_API } = require('../../config');

const openTripsResolvers = {
    Query: {
        getPlaceSuggestions: (_, args, context) => {
            if (!context.req.session || !context.req.session.username) throw new Error("User is not authenticated.");
            
            let { latitude, longitude, radius } = args.place;

            return fetch('https://api.opentripmap.com/0.1/en/places/radius?radius=' + radius.toString() + 
            '&lon=' + longitude.toString() + '&lat=' + latitude.toString() + 
            '&rate=3&format=json&limit=10&apikey=' + OPENTRIPS_API)
            .then(res => {
                if (res.status >= 400) {
                throw new Error("Bad response from server");
                }
                return res.json();
            })
            .then(places => {
                let placeSuggestions = [];
                places.forEach(place => {
                    let placeSuggestion = {
                        xid: place.xid,
                        name: place.name,
                        distance: place.dist,
                        type: place.kinds,
                        longitude: place.point.lon,
                        latitude: place.point.lat
                    }
                    placeSuggestions.push(placeSuggestion);
                })
                return placeSuggestions;
            })
            .catch(err => {
                console.error(err);
            });
        },
    },
}

module.exports = openTripsResolvers;