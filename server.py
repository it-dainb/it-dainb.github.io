from flask import Flask, request, jsonify
from flask_cors import CORS
import time, math

import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__)
CORS(app, origins=['https://digitalauto.netlify.app'])

import time

light_duration = {
    "green": 5,
    "yellow": 3,
    "red": 5
}

lights = ["green", "yellow", "red"]

light_1, light_2 = None, None

delay = 1

i = 0
elapsed_time = None
old = None
        # print(light_1, int(curr_time), light_2)
car_size = [100, 100]
def solve_collision(data, car_dict):    
    resolve_x = data["x"]
    resolve_y = data["y"]
    
    for _, value in car_dict.items():
        if data["x"] - value["x"] <= car_size[0] and data["x"] >= value["x"]:
            resolve_x = data["x"] + car_size[0]
        elif value["x"] - data["x"] <= car_size[0] and data["x"] <= value["x"]:
            resolve_x = data["x"] - car_size[0]
        
        if data["y"] - value["y"] <= car_size[1] and data["y"] >= value["y"]:
            resolve_y = data["y"] + car_size[1]
        elif value["y"] - data["y"] <= car_size[1] and data["y"] <= value["y"]:
            resolve_y = data["y"] - car_size[1]
            
    return resolve_x, resolve_y
        

cars = {}
cars_live = {}
current_id = 0
remove_cars = []

@app.route('/api/data', methods=['POST'])
def handle_data():
    global current_id, cars
    
    data = request.json  # Access the request data sent from the client
    # print(data)
    if data["ID"] is None:
        data["ID"] = str(current_id)
        
        data["x"] , data["y"] = solve_collision(data, cars)
        
        current_id += 1

        cars_live[(data["ID"])] = time.time()
    
    cars[data["ID"]] = data
    
    # for key, value in cars_live.items():
        
    
    for car, live in cars_live.items():
        # print(car, time.time() - live)
        
        if time.time() - live > 3:
            if car not in remove_cars:
                remove_cars.append(car)
        else:
            cars_live[(data["ID"])] = time.time()
    # print(cars_live)
    
    for car in remove_cars:
        # print("REMOVE CAR", car)
        if car in cars:
            del cars[car]
        
        if car in cars_live:
            del cars_live[car]
    
    # Process the data and prepare a response
    # print(cars)
    # print(remove_cars)
    cars_response = cars.copy()
    if data["ID"] in cars_response:
        del cars_response[data["ID"]]
    
    # print(remove_cars)
    
    response = {'message': 'Data received', 'cars': cars_response, 'ID': data["ID"], 'Remove_car': remove_cars}
    return jsonify(response)


light_duration = {
    "green": 2,
    "yellow": 1,
    "red": 2
}

light_to_int = {
    "green": 0,
    "yellow": 1,
    "red": 2
}

lights = ["green", "yellow", "red"]

light_1, light_2 = None, None
countLight = 0

elapsed_time = None
@app.route('/api/light', methods=['GET'])
def get_light():
    global elapsed_time, light_1, light_2, countLight

    light_1 = lights[countLight % len(lights)] 
    
    if not elapsed_time:
        # print(light_1)
        elapsed_time = time.time()
    
    curr_time = time.time() - elapsed_time
    if curr_time >= light_duration[light_1]:
        countLight += 1
        elapsed_time = None

    light_2 = "red"
    
    if light_1 == "green":
        light_2 = "red"
    elif light_1 == "red":
        light_2 = "green"
        
        if int(curr_time)  >= (light_duration["red"] - light_duration["yellow"]):
            light_2 = "yellow"
    # print(light_1, int(curr_time), light_2)

    response = {
        'light_1': light_to_int[light_1],
        'light_2': light_to_int[light_2]
    }
    
    
    return jsonify(response)

if __name__ == '__main__':
    app.run()