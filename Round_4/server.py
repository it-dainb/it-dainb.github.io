import os

import copy
from gevent.pywsgi import WSGIServer

from flask import Flask, request, jsonify
from flask_cors import CORS
import time

import logging
logging.getLogger('werkzeug').setLevel(logging.ERROR)
logging.getLogger('gevent').setLevel(logging.ERROR)

app = Flask(__name__)
CORS(app, origins=['https://digitalauto.netlify.app'])

i = 0
elapsed_time = None
old = None


cars = {}
cars_live = {}
current_id = 0
remove_cars = []

@app.route('/api/data', methods=['POST'])
def handle_data():
    global current_id, cars
    
    data = request.json  # Access the request data sent from the client
    # print(data)
    if data["ID"] is None :
        data["ID"] = str(current_id)
        
        # data["x"] , data["y"] = solve_collision(data, cars)
        
        current_id += 1
        print("CREATE CAR: ", data["ID"])
        # print(data)
        # print("===================================")
        # print()
        cars[data["ID"]] = data
    
    if data["ID"] not in cars:
        cars[data["ID"]] = data
        
    cars[data["ID"]]["priority"] = data["priority"]
    cars[data["ID"]]["dicision"] = data["dicision"]
    
    if not data["hidden"]:
        cars[data["ID"]] = data
    
    if not cars[data["ID"]]["hidden"]:
        # if data["hidden"]:
        #     print(data["ID"], data)
        #     print()
        #     print(data["carList"])
        #     print("=====================")
        #     print()
        cars[data["ID"]] = data

    cars_live[data["ID"]] = time.time()
    
    # print(cars_live)
    # if data["ID"] == "1":
    #     print(data["ID"], cars['0'])
    
    if not data["hidden"]:
        for car_ID in data["carList"]:
            cars[car_ID]["x"] = data["carList"][car_ID]["x"]
            cars[car_ID]["y"] = data["carList"][car_ID]["y"]
            cars[car_ID]["turn"] = data["carList"][car_ID]["turn"]
            cars[car_ID]["angle"] = data["carList"][car_ID]["angle"]
    
    
    # for key, value in cars_live.items():
    for car_ID, live in cars_live.items():
        # print(car, time.time() - live)
        
        if time.time() - live > 2:
            if car_ID not in remove_cars:
                print("\tREMOVE CAR: ", car_ID)
                remove_cars.append(car_ID)

    # print(cars_live)
    
    for car_ID in remove_cars:
        # print("REMOVE CAR", car)
        if car_ID in cars:
            del cars[car_ID]
        
        if car_ID in cars_live:
            del cars_live[car_ID]
    
    # Process the data and prepare a response
    # print(cars)
    # print(remove_cars)
    cars_response = copy.deepcopy(cars)
    if data["ID"] in cars_response:
        del cars_response[data["ID"]]
    
    # print(remove_cars)
    
    # print([car["priority"] for ID, car in cars.items()])
    
    response = {'cars': cars_response, 'ID': data["ID"], 'Remove_car': remove_cars, 
                'carX': cars[data["ID"]]["x"],
                'carY': cars[data["ID"]]["y"],
                'turn': cars[data["ID"]]["turn"],
                'angle': cars[data["ID"]]["angle"]}
    
    return jsonify(response)

if __name__ == '__main__':
    # app.run(host="0.0.0.0", port=8080, threaded=True)
    print("Start server")

    http_server = WSGIServer(('0.0.0.0', 8090), app, log=None)
    # http_server = WSGIServer(('0.0.0.0', port), app)
    http_server.serve_forever()
    print("End server")
