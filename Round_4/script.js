import './leaflet/leaflet.js';
import './leaflet/leaflet.rotatedMarker.js';

;window.addEventListener('load', () => {
    // Create the map
    const map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: 0,
        maxZoom: 0,
        zoomSnap: 0.5,
        zoomDelta: 0.5,
        zoomControl: false,
    }).setView([0, 0], 0);

    // Define the image bounds and dimensions
    const bounds = [[0, 0], [500, 500]];
    const imageOptions = { opacity: 1, attribution: 'Crossroad Image' };
    
    
    const imageURL = 'https://github.com/it-dainb/it-dainb.github.io/blob/main/Round_4/image/crossroad.png?raw=true';
    const iconURL = 'https://github.com/it-dainb/it-dainb.github.io/blob/main/Round_4/image/car.png?raw=true';

    // Create the custom image overlay representing the crossroad
    const imageOverlay = L.imageOverlay(imageURL, bounds, imageOptions).addTo(map)
    var imageWidth = imageOverlay._image.width;
    var imageHeight = imageOverlay._image.height;
    
    // Fit the map to the image bounds
    map.fitBounds(imageOverlay.getBounds());
    
    // Draw the car marker
    // ambulance: 90: 70
    
    var iconSize = 70;
    const carIcon = L.icon({
        iconUrl: iconURL, // Replace with the URL to your car icon image
        iconSize: [iconSize, iconSize],
        iconAnchor: [iconSize / 2, iconSize / 2],
    });
    
    var carMarker = L.marker(
        [250 - iconSize / 2 + 10, 250],
        {   icon: carIcon ,
            rotationAngle: 0,
            rotationOrigin: "center"
        }
    ).addTo(map);

    window.carMarker = carMarker;
        
    function createUD(imageOverlay) {
        let imgBounds = imageOverlay.getBounds();
        
        let southWest = imgBounds.getSouthWest();
        let northEast = imgBounds.getNorthEast();

        let upImage = L.imageOverlay(imageURL, L.latLngBounds([northEast.lat - 4, southWest.lng], [northEast.lat + imageHeight, northEast.lng]), imageOptions).addTo(map);
        let downImage = L.imageOverlay(imageURL, L.latLngBounds([southWest.lat  - imageHeight, southWest.lng], [southWest.lat + 4, northEast.lng]), imageOptions).addTo(map);
        return [upImage, downImage];
    };

    function createLR(imageOverlay) {
        let imgBounds = imageOverlay.getBounds();
        let southWest = imgBounds.getSouthWest();
        let northEast = imgBounds.getNorthEast();

        let leftImage = L.imageOverlay(imageURL, L.latLngBounds([southWest.lat, southWest.lng - imageWidth], [northEast.lat, southWest.lng + 4]), imageOptions).addTo(map);
        let rightImage = L.imageOverlay(imageURL, L.latLngBounds([southWest.lat, northEast.lng - 4], [northEast.lat, northEast.lng + imageWidth]), imageOptions).addTo(map);
        return [leftImage, rightImage];
    }
    
    // createUD(imageOverlay);

    function createOV(imageOverlay) {
        let [U, D] = createUD(imageOverlay);
        let [cL, R] = createLR(imageOverlay);
        let [RU, RD] = createUD(R);
        let [LU, LR] = createUD(cL);

        return [imageOverlay, U, D, cL, R, RU, RD, LU, LR];
    }

    // createOV(imageOverlay);
     // Duplicate the crossroad image in four directions
    //  const leftImage = L.imageOverlay(imageURL, L.latLngBounds([imageHeight - 2, 0], [2 * imageHeight, imageWidth]), imageOptions).addTo(map);
    //  const leftImage = L.imageOverlay(imageURL, L.latLngBounds([imageHeight - 2, 0], [2 * imageHeight, imageWidth]), imageOptions).addTo(map);

    // Move the car marker
    const tick = 10; //ms
    const speed = 80; //px/s
    let carPosition = carMarker.getLatLng();
    
    var createMapOV = true;
    var chooseRoad = imageOverlay;

    window.chooseRoad = chooseRoad;

    // createOV(imageOverlay);
    var cR, cL, cU, cD;
    var C, U, D, cL, R, RU, RD, LU, LR;

    setInterval(() => {
        
        
        var carX = carPosition.lng;
        var cary = carPosition.lat;
        
        map.panTo(carPosition);
        carMarker.setLatLng(carPosition);
        
        if (createMapOV === true) {

            [C, U, D, cL, R, RU, RD, LU, LR] = createOV(chooseRoad);
            let cBounds = C.getBounds();
            let cSW = cBounds.getSouthWest();
            let cNE = cBounds.getNorthEast();
            
            cR = cNE.lng - imageWidth / 4;
            cL = cSW.lng + imageWidth / 4; 
            cU = cNE.lat - imageHeight / 4;
            cD = cSW.lat + imageHeight / 4;
        
            // console.log("CR", cR);
            // console.log("CL", cL);
            // console.log("CU", cU);
            // console.log("CD", cD);

            createMapOV = false;
        }
        


        // console.log(carX);
        // console.log(cR);
        // console.log("=====");

        if (!createMapOV && (!chooseRoad.getBounds().contains(carMarker.getLatLng()))) {
            if (carX > cR) {
                console.log("ADD RIGHT");
                chooseRoad = R;
            } else if (carX < cL) {
                console.log("ADD LEFT");
                chooseRoad = L;
            }
            if (cary > cU) {
                console.log("ADD UP");
                chooseRoad = U;
            } else if (cary < cD) {
                console.log("ADD DOWN");
                chooseRoad = D;
            }
            createMapOV = true;
            
        }
        
    }, 10);

});


