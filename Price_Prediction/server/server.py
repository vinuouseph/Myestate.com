from flask import Flask, request, jsonify
import util
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/get_location_names', methods=['POST'])
def get_location_names():
    city = request.form['city']
    response = jsonify({
        'locations': util.get_location_names(city)
    })
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response

@app.route('/predict_home_price', methods=['POST'])
def predict_home_price():
    city = request.form['city']
    location = request.form['location']
    area = float(request.form['area'])
    bhk = int(request.form['bhk'])
    resale = int(request.form['resale'])
    gymnasium = int(request.form['gymnasium'])
    swimming_pool = int(request.form['swimming_pool'])
    landscaped_gardens = int(request.form['landscaped_gardens'])
    jogging_track = int(request.form['jogging_track'])
    shopping_mall = int(request.form['shopping_mall'])
    sports_facility = int(request.form['sports_facility'])
    atm = int(request.form['atm'])
    school = int(request.form['school'])
    security = int(request.form['security'])
    car_parking = int(request.form['car_parking'])
    restaurants = int(request.form['restaurants'])
    multipurpose_room = int(request.form['multipurpose_room'])
    hospital = int(request.form['hospital'])
    parks = int(request.form['parks'])
    lift_available = int(request.form['lift_available'])

    response = jsonify({
        'estimated_price': util.get_estimated_price(city,location, area, bhk, resale, gymnasium, swimming_pool, landscaped_gardens, jogging_track, shopping_mall, sports_facility, atm, school, security, car_parking, restaurants, multipurpose_room, hospital, parks, lift_available)
    })
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response

if __name__ == "__main__":
    print("Starting Python Flask Server For Home Price Prediction...")
    app.run()