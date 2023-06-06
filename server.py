from flask import Flask, request, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app, origins=['https://digitalauto.netlify.app'])

cars = {}
cars_live = {}
current_id = 0
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
    
    remove_cars = []
    for car, live in cars_live.items():
        if time.time() - live > 1:
            remove_cars.append(car)
        else:
            cars_live[(data["ID"])] = time.time()
    # print(cars_live)
    
    for car in remove_cars:
        print("REMOVE CAR", car)
        del cars[car]
        del cars_live[car]
    
    # Process the data and prepare a response
    response = {'message': 'Data received', 'cars': cars, 'ID': data["ID"]}
    return jsonify(response)


if __name__ == '__main__':
    app.run()