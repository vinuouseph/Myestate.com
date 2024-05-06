import pickle
import json
import numpy as np
from geopy.geocoders import Nominatim

__locations = None
__data_columns = None
data_column = None
__model = None

nominatim_service = Nominatim(user_agent='vinuouseph4@gmail.com')

def get_estimated_price(city, location, area, bhk, resale, gymnasium, swimming_pool, landscaped_gardens, jogging_track, shopping_mall, sports_facility, atm, school, security, car_parking, restaurants, multipurpose_room, hospital, parks, lift_available):
    load_saved_artifacts(city)
    try:
        if city == 'Mumbai':
            cit=0
        elif city == 'Delhi':
            cit=1
        elif city == 'Chennai':
            cit=2
        elif city == 'Hyderabad':
            cit=3
        elif city == 'Bangalore':
            cit=4
        loc_index = data_column.index(location.lower())
        loc = nominatim_service.geocode(location)
        lat = loc.latitude
        long = loc.longitude
    except:
        loc_index = -1


    x = np.zeros(869)
    x[0] = area
    x[1] = cit
    x[2] = bhk
    x[3] = resale
    x[4] = gymnasium
    x[5] = swimming_pool
    x[6] = landscaped_gardens
    x[7] = jogging_track
    x[8] = shopping_mall
    x[9] = sports_facility
    x[10] = atm
    x[11] = school
    x[12] = security
    x[13] = car_parking
    x[14] = restaurants
    x[15] = multipurpose_room
    x[16] = hospital
    x[17] = parks
    x[18] = lift_available

    if loc_index>=0:
        x[19] = lat
        x[20] = long
        x[loc_index] = 1
    return round(__model.predict([x])[0], 2)


def load_saved_artifacts(city):
    global  __data_columns
    global __locations
    global data_column

    with open(f"./artifacts/Final_Columns.json", "r") as f:
        data = json.load(f)
        data_column = data['data_columns']

    # Load data columns and locations based on the specified city
    with open(f"./artifacts/{city}_Columns.json", "r") as f:
        data = json.load(f)
        __data_columns = data['data_columns']
        __locations = __data_columns[22:]


    global __model
    if __model is None:
        with open('./artifacts/Prediction.pickle', 'rb') as f:
            __model = pickle.load(f)

def get_location_names(city):

    load_saved_artifacts(city)
    return __locations



if __name__ == '__main__':
    print("Starting Python Flask util For Home Price Prediction...")