Flask Traffic Control System
This project is a traffic control system built with Flask. It simulates a digital auto environment where cars interact with traffic lights. The system handles car data, manages traffic flow, and prevents collisions.

*Requirements
Python 3.x
Flask
Flask-CORS
How It Works
The traffic control system consists of a client-side application and a Flask server.

*Client-Side Application
The client-side application is responsible for simulating the digital auto environment. It uses JavaScript and React to create a map with cars and traffic lights. The map.js file defines a Car class and a map function that generates the simulated map.
The Car class represents a car in the simulation and includes properties for ID, color, speed, vehicle type, direction, lane, and an HTML element for visualization. It also provides methods for setting the car's position, showing/hiding the car, moving the car, and turning.
The map function creates the simulated map by generating HTML elements for roads, road markings, traffic lights, and lane labels. It appends the generated elements to the document body. Additionally, the function fetches light data from the server and updates the traffic lights accordingly.

*Server-Side Application
The server-side application is built with Flask and provides the necessary API endpoints for handling car data and traffic lights.
The server.py file defines the Flask application and sets up CORS (Cross-Origin Resource Sharing) to allow requests from the client-side application. It includes two API endpoints:

POST /api/data: This endpoint is used to send car data to the server. Car data should be sent in JSON format, including the car's ID, X and Y coordinates. The server handles collision detection and updates the car positions accordingly.
GET /api/light: This endpoint retrieves the current states of the traffic lights. It returns a JSON response with the states of light_1 and light_2, represented by integers (0 for green, 1 for yellow, and 2 for red).

*How to Run
To run the traffic control system, follow these steps:

1. Install the required dependencies by running the following command:
pip install flask flask-cors

2. Start the Flask server by running the following command:
python server.py
The server will start running on http://localhost:5000.

3. Access digital.auto in your web browser to interact with the traffic control system.

