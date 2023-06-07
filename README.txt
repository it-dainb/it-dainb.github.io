Requirement
* flask
* flask-cors

How it work ?
digital.auto -> plugin -> simulate, logic -> send HTTPS to the sêrver -> get response from the server -> Update information (Car position, light trafic, ...)

* map.js
This code defines a Car class and a map function that creates a simulated map with cars and traffic lights. Here's a breakdown of the code:

The Car class represents a car in the simulation. It has properties such as ID, color, speed, vehicle type, direction, lane, and an HTML element that represents the car on the map. It also has methods for setting the car's position, showing/hiding the car, moving the car, turning right/left, and updating the car's position.
The map function is responsible for creating the simulated map. It creates a div element and sets its HTML content to define the road, road markings, traffic lights, and lane labels. It appends the div element to the document body. The function also fetches light data from a specified URL and updates the traffic lights accordingly.

Here's a high-level overview of what the code does:

The Car class represents a car in the simulation. It has properties and methods related to the car's behavior and position.
The map function creates a simulated map with road elements, traffic lights, and lane labels. It also fetches light data and updates the traffic lights accordingly.

* position.js
This code defines a React component called PositionPlugin. The purpose of this component seems to be displaying the latitude and longitude of a vehicle's current location.

Here's a breakdown of the code:

The module imports the SignalTile and SignalPills components from their respective file locations.

The PositionPlugin component is defined as a function that takes two parameters: widgets and vehicle.

Two objects, LatitudeTile and LongitudeTile, are created to configure the SignalTile components for latitude and longitude respectively. Each object specifies the signal, label, and icon properties.

The widgets.register function is called three times to register the components with the provided names and configurations. The first two calls register the SignalTile components for latitude and longitude, and the last call registers the SignalPills component for both latitude and longitude.

Finally, the PositionPlugin component is exported as the default export of the module.

* server.py: API Endpoints
POST /api/data
This endpoint is used to send car data to the server. The car data should be sent in JSON format, including the car's ID, X and Y coordinates. The server will handle collisions and update the car positions accordingly.

GET /api/light
This endpoint retrieves the current states of the traffic lights. It returns a JSON response with the states of light_1 and light_2, represented by integers (0 for green, 1 for yellow, and 2 for red).

How to run ?
Step 1: Run server.py first to start server
Step 2: Access digital.auto and enjoy
