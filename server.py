from flask import Flask, request, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app, origins=['https://digitalauto.netlify.app'])

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
        current_id += 1

        cars_live[(data["ID"])] = time.time()
    
    cars[data["ID"]] = data
    
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
    
    cars_response = cars.copy()
    if data["ID"] in cars_response:
        del cars_response[data["ID"]]
    
    # print(remove_cars)
    
    response = {'message': 'Data received', 'cars': cars_response, 'ID': data["ID"], 'Remove_car': remove_cars}
    return jsonify(response)


if __name__ == '__main__':
    app.run()