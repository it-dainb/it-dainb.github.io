function calculateDistance(x1, y1, x2, y2) {
    // Calculate the differences between the coordinates
    var deltaX = x2 - x1;
    var deltaY = y2 - y1;

    // Calculate the squared distances
    var squaredDeltaX = deltaX * deltaX;
    var squaredDeltaY = deltaY * deltaY;

    // Calculate the squared distance between the two points
    var squaredDistance = squaredDeltaX + squaredDeltaY;

    // Calculate the absolute distance
    var distance = Math.sqrt(squaredDistance);

    // console.log(deltaX);
    // console.log(deltaY);

    return distance;
}

;window.addEventListener('load', () => {
    // Create the map
    window.L = L;

    const map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: 0,
        maxZoom: 2,
        zoomSnap: 0.5,
        zoomDelta: 0.5,
        zoomControl: false,
        dragging: false,
    }).setView([0, 0], 0);

    window.map = map;
    var scale = 1;
    map.setZoom(scale);
    window.scale = scale;

    // Define the image bounds and dimensions
    const bounds = [[0, 0], [500, 500]];
    const imageOptions = { opacity: 1, attribution: 'Crossroad Image' };
    
    const images_path = "https://it-dainb.github.io/Round_4/images/";
    
    const imageURL = images_path + 'crossroad.png';
    const iconUrl = images_path + 'car.png';

    // Create the custom image overlay representing the crossroad
    const imageOverlay = L.imageOverlay(imageURL, bounds, imageOptions).addTo(map)
    var imageWidth = imageOverlay._image.width;
    var imageHeight = imageOverlay._image.height;
    
    // Fit the map to the image bounds
    map.fitBounds(imageOverlay.getBounds());
    
    // Draw the car marker
    // ambulance: 90: 70
    
    var iconSize = 90  * scale;
    const carIcon = L.icon({
        iconUrl: iconUrl, // Replace with the URL to your car icon image
        iconSize: [iconSize, iconSize],
        iconAnchor: [iconSize / 2, iconSize / 2],
    });

    window.carIcon = carIcon;
    
    var center = imageOverlay.getCenter();
    var carMarker = L.marker(
        [center.lat - 25, center.lng],
        {   icon: carIcon ,
            rotationAngle: 0,
            rotationOrigin: "center",
        }
    ).addTo(map);
    window.carMarker = carMarker;
    
    var green = '#c0ff33';
    var red = '#f3252e';
    var yellow = '#fbff32'

    var root_radius = 70
    var circle = L.circle(
        carMarker.getLatLng(), {
        color: 'red',
        fillColor: red,
        fillOpacity: 0.4,
        radius: 70,
        weight: 1,
    }).addTo(map);

    function changeColor(circle, color) {

        if (color === "r") {
            circle.setStyle({
                color: 'red',
                fillColor: red,
            })
        } else if (color === "y") {
            circle.setStyle({
                color: 'yellow',
                fillColor: yellow,
            })
        } else {
            circle.setStyle({
                color: 'green',
                fillColor: green,
            })
        }

    }

    changeColor(circle, 'g');

    window.changeColor = changeColor;
    window.circle = circle;

        
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

    var createMapOV = true;
    var chooseRoad = imageOverlay;
    
    let carPosition = carMarker.getLatLng();
    center = chooseRoad.getCenter();

    window.chooseRoad = chooseRoad;

    // createOV(imageOverlay);
    var cR, cL, cU, cD;
    var C, U, D, cL, R, RU, RD, LU, LR;

    var carX, carY;

    var canTurn;

    // console.log(circle);

    // carMarker.setRotationAngle(90);
    // console.log(carMarker.options.rotationAngle)
;

    var radius = 1;
    var radius_speed = root_radius / 6 / 1000 * 10;
    var radius_min = 60;
    
    var count_cross = -1;
    var oneTime = true;
    setInterval(() => {
        
        carPosition = carMarker.getLatLng();
        carX = carPosition.lng;
        carY = carPosition.lat;

        circle.setLatLng(carPosition);
        
        if (radius > root_radius) {
            radius_speed *= -1;
            radius = root_radius;
        } else if (radius < radius_min) {
            radius_speed *= -1;
            radius = radius_min;
        }
        
        radius += radius_speed;

        circle.setRadius(radius)

        // map.panTo(carPosition);
        
        // console.log(carX);
        if (createMapOV === true) {

            [C, U, D, cL, R, RU, RD, LU, LR] = createOV(chooseRoad);
            let cBounds = C.getBounds();
            let cSW = cBounds.getSouthWest();
            let cNE = cBounds.getNorthEast();
            
            cR = cNE.lng - imageWidth / 4;
            ccL = cSW.lng + imageWidth / 4; 
            cU = cNE.lat - imageHeight / 4;
            cD = cSW.lat + imageHeight / 4;
        
            // console.log("CR", cR);
            // console.log("CL", cL);
            // console.log("CU", cU);
            // console.log("CD", cD);

            createMapOV = false;
            center = chooseRoad.getCenter();
            count_cross = -1;
        }

        // console.log(center.lat);
        // console.log(carY);
        let distance = calculateDistance(center.lng, center.lat, carX, carY);
        
        canTurn = false;
        // let distance = center.distanceTo(carPosition);
        if (36 < distance && distance < 40) {
            // console.log(distance);
            canTurn = true;

            if (oneTime) {
                count_cross += 1;
                oneTime = false;
                // console.log(count_cross);
            }

            // console.log(canTurn);
            // changeColor("g");
        } else {
            if (count_cross === -1 || distance > 50 || count_cross === 2) {
                count_cross = 0;
            }

            // changeColor("y");
            oneTime = true;
        }

        window.count_cross = count_cross;
        window.canTurn = canTurn;
        
        if (!createMapOV && (!chooseRoad.getBounds().contains(carMarker.getLatLng()))) {
            if (carX > cR) {
                // console.log("ADD RIGHT");
                chooseRoad = R;
                createMapOV = true;
            } else if (carX < ccL) {
                // console.log("ADD LEFT");
                chooseRoad = cL;
                createMapOV = true;
            }
            if (carY > cU) {
                // console.log("ADD UP");
                chooseRoad = U;
                createMapOV = true;
            } else if (carY < cD) {
                // console.log("ADD DOWN");
                chooseRoad = D;
                createMapOV = true;
            }
            
        }
        // console.log(createMapOV);

        window.chooseRoad = chooseRoad;
        
    }, 10);

});


