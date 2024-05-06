import React, { useState, useEffect } from 'react';

const Prediction = () => {
    const [sqft, setSqft] = useState(1000);
    const [bhk, setBhk] = useState(2);
    const [resale, setResale] = useState('Yes');
    const [city, setCity] = useState('');
    const [location, setLocation] = useState('');
    const [estimatedPrice, setEstimatedPrice] = useState('');
    const [citys, setCitys] = useState(['Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Bangalore']);
    const [locations, setLocations] = useState([]);
    const [showAdditionalFeatures, setShowAdditionalFeatures] = useState(false);
    const [amenities, setAmenities] = useState({
        gymnasium: 0,
        swimming_pool: 0,
        landscaped_gardens: 0,
        jogging_track: 0,
        shopping_mall: 0,
        sports_facility: 0,
        atm: 0,
        school: 0,
        security: 0,
        car_parking: 0,
        restaurants: 0,
        multipurpose_room: 0,
        hospital: 0,
        parks: 0,
        lift_available: 0
    });

    useEffect(() => {
        if (city) {
            let formData = new FormData();
            formData.append('city', city);
    
            fetch(`http://127.0.0.1:5000/get_location_names`, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                return response.json();
            })
            .then(data => {
                setLocations(data.locations);
                console.log(data.locations);
            })
            .catch(function() {
                console.log("Fetch error. Please check your server and the fetch request.");
            });
        } else {
            setLocations([]);
        }
    }, [city]);
    
    const estimatePrice = () => {
        let formData = new FormData();
        formData.append('city', city);
        formData.append('location', location);
        formData.append('area', sqft);
        formData.append('bhk', bhk);
        formData.append('resale', resale === 'Yes' ? 1 : 0);
        Object.keys(amenities).forEach(key => {
            formData.append(key, amenities[key]);
        });
    
        fetch('http://127.0.0.1:5000/predict_home_price', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => setEstimatedPrice(data.estimated_price));
    };

    const handleAmenityChange = (event) => {
        const { name, checked } = event.target;
        setAmenities(prevAmenities => ({
            ...prevAmenities,
            [name]: checked ? 1 : 0
        }));
    };


    return (
            <div className= "bg-white min-h-screen flex justify-center items-center">
                <div className="max-w-4xl mx-auto px-5 py-14">
                <div className="bg-white rounded-xl shadow-2xl p-8">
                    <h1 className="text-3xl font-bold text-center mb-6 bg-custom-green5 text-transparent bg-clip-text">Myestate Estimator</h1>
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/2">
                            <h2 className="text-lg font-semibold mb-2">Area (Square Feet)</h2>
                            <input
                                className="w-full px-4 py-2 rounded-md bg-gray-200 focus:outline-none focus:bg-white focus:shadow-md appearance-none border-2 border-custom-green2"
                                type="text"
                                value={sqft}
                                onChange={e => setSqft(e.target.value)}
                            />

                            <div className="mt-6">
                                <h2 className="text-lg font-semibold mb-2">BHK</h2>
                                <div className="flex gap-4">
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <div
                                            key={index}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${
                                                bhk === index + 1
                                                    ? 'bg-custom-green2 text-white'
                                                    : 'bg-gray-200 text-gray-600'
                                            }`}
                                            onClick={() => setBhk(index + 1)}
                                        >
                                            {index + 1}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6">
                                <h2 className="text-lg font-semibold mb-2">Resale</h2>
                                <div className="flex gap-4">
                                    <button
                                        className={`px-4 py-2 rounded-full ${
                                            resale === 'Yes'
                                                ? 'bg-custom-green2 text-white'
                                                : 'bg-gray-200 text-gray-600'
                                        }`}
                                        onClick={() => setResale('Yes')}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        className={`px-4 py-2 rounded-full ${
                                            resale === 'No'
                                                ? 'bg-custom-green2 text-white'
                                                : 'bg-gray-200 text-gray-600'
                                        }`}
                                        onClick={() => setResale('No')}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="md:w-1/2">
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold mb-2">City</h2>
                                <div className="relative">
                                    <select
                                        className="w-full px-4 py-2 rounded-md bg-gray-200 focus:outline-none focus:bg-white focus:shadow-md appearance-none border-2 border-custom-green2"
                                        value={city}
                                        onChange={e => setCity(e.target.value)}
                                    >
                                        <option value="" disabled>
                                            Choose a City
                                        </option>
                                        {citys.map(c => (
                                            <option key={c}>{c}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <svg
                                            className="h-4 w-4 fill-current text-gray-500"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h2 className="text-lg font-semibold mb-2">Location</h2>
                                <div className="relative">
                                    <select
                                        className="w-full px-4 py-2 rounded-md bg-gray-200 focus:outline-none focus:bg-white focus:shadow-md appearance-none border-2 border-custom-green2"
                                        value={location}
                                        onChange={e => setLocation(e.target.value)}
                                    >
                                        <option value="" disabled>
                                            Select a location
                                        </option>
                                        {locations.map((location, index) => (
                                            <option key={index} value={location}>
                                                {location}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <svg
                                            className="h-4 w-4 fill-current text-gray-500"
                                            viewBox="0 0 20 20"
                                        >
                                        <path
                                               fillRule="evenodd"
                                               d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                               clipRule="evenodd"
                                           />
                                       </svg>
                                   </div>
                               </div>
                           </div>

                           <div className="mb-6">
                           <h2 className="text-s font-semibold mb-2">Click below for Amenities:</h2>
                                <div className="relative">
                                    <button
                                        className={`bg-custom-green2 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-300 ${showAdditionalFeatures ? 'mb-4' : ''}`}
                                        onClick={() => setShowAdditionalFeatures(!showAdditionalFeatures)}
                                    >
                                        Additional Features
                                    </button>

                                    
                                </div>
                            </div>

                            
                       </div>
                       
                   </div>
                   {showAdditionalFeatures && (
                                        <div className="mt-6">
                                            <div className="flex flex-col md:flex-row gap-4">
                                                <div className="md:w-1/2">
                                                    <h3 className="text-lg font-semibold mb-2">Inside the Property</h3>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <div className="flex items-center p-0.5 bg-custom-green2 rounded-md">
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-4 h-4 appearance-none rounded-md checked:bg-custom-green2 bg-white before:content-[''] before:absolute before:checked:bg-[url('https://www.tailwindtap.com/assets/components/gradient/check.png')] before:bg-contain before:pointer-events-none before:h-4 before:-left-[1px] before:-top-px before:w-4"
                                                                    name="swimming_pool"
                                                                    checked={amenities.swimming_pool === 1}
                                                                    onChange={handleAmenityChange}
                                                                />
                                                            </div>
                                                            Swimming Pool
                                                        </label>
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <div className="flex items-center p-0.5 bg-custom-green2 rounded-md">
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-4 h-4 appearance-none rounded-md checked:bg-custom-green2 bg-white before:content-[''] before:absolute before:checked:bg-[url('https://www.tailwindtap.com/assets/components/gradient/check.png')] before:bg-contain before:pointer-events-none before:h-4 before:-left-[1px] before:-top-px before:w-4"
                                                                    name="multipurpose_room"
                                                                    checked={amenities.multipurpose_room === 1}
                                                                    onChange={handleAmenityChange}
                                                                />
                                                            </div>
                                                            Multipurpose Room
                                                        </label>

                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <div className="flex items-center p-0.5 bg-custom-green2 rounded-md">
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-4 h-4 appearance-none rounded-md checked:bg-custom-green2 bg-white before:content-[''] before:absolute before:checked:bg-[url('https://www.tailwindtap.com/assets/components/gradient/check.png')] before:bg-contain before:pointer-events-none before:h-4 before:-left-[1px] before:-top-px before:w-4"
                                                                    name="landscaped_gardens"
                                                                    checked={amenities.landscaped_gardens === 1}
                                                                    onChange={handleAmenityChange}
                                                                />
                                                            </div>
                                                            Landscaped Gardens
                                                        </label>

                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <div className="flex items-center p-0.5 bg-custom-green2 rounded-md">
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-4 h-4 appearance-none rounded-md checked:bg-custom-green2 bg-white before:content-[''] before:absolute before:checked:bg-[url('https://www.tailwindtap.com/assets/components/gradient/check.png')] before:bg-contain before:pointer-events-none before:h-4 before:-left-[1px] before:-top-px before:w-4"
                                                                    name="car_parking"
                                                                    checked={amenities.car_parking === 1}
                                                                    onChange={handleAmenityChange}
                                                                />
                                                            </div>
                                                            Car Parking
                                                        </label>

                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <div className="flex items-center p-0.5 bg-custom-green2 rounded-md">
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-4 h-4 appearance-none rounded-md checked:bg-custom-green2 bg-white before:content-[''] before:absolute before:checked:bg-[url('https://www.tailwindtap.com/assets/components/gradient/check.png')] before:bg-contain before:pointer-events-none before:h-4 before:-left-[1px] before:-top-px before:w-4"
                                                                    name="security"
                                                                    checked={amenities.security === 1}
                                                                    onChange={handleAmenityChange}
                                                                />
                                                            </div>
                                                            24X7 Security
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="md:w-1/2">
                                                    <h3 className="text-lg font-semibold mb-2">Facilities near the Property</h3>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <div className="flex items-center p-0.5 bg-custom-green2 rounded-md">
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-4 h-4 appearance-none rounded-md checked:bg-custom-green2 bg-white before:content-[''] before:absolute before:checked:bg-[url('https://www.tailwindtap.com/assets/components/gradient/check.png')] before:bg-contain before:pointer-events-none before:h-4 before:-left-[1px] before:-top-px before:w-4"
                                                                    name="sports_facility"
                                                                    checked={amenities.sports_facility === 1}
                                                                    onChange={handleAmenityChange}
                                                                />
                                                            </div>
                                                            Sports Facility
                                                        </label>
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <div className="flex items-center p-0.5 bg-custom-green2 rounded-md">
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-4 h-4 appearance-none rounded-md checked:bg-custom-green2 bg-white before:content-[''] before:absolute before:checked:bg-[url('https://www.tailwindtap.com/assets/components/gradient/check.png')] before:bg-contain before:pointer-events-none before:h-4 before:-left-[1px] before:-top-px before:w-4"
                                                                    name="gymnasium"
                                                                    checked={amenities.gymnasium === 1}
                                                                    onChange={handleAmenityChange}
                                                                />
                                                            </div>
                                                            Gymnasium
                                                        </label>

                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <div className="flex items-center p-0.5 bg-custom-green2 rounded-md">
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-4 h-4 appearance-none rounded-md checked:bg-custom-green2 bg-white before:content-[''] before:absolute before:checked:bg-[url('https://www.tailwindtap.com/assets/components/gradient/check.png')] before:bg-contain before:pointer-events-none before:h-4 before:-left-[1px] before:-top-px before:w-4"
                                                                    name="shopping_mall"
                                                                    checked={amenities.shopping_mall === 1}
                                                                    onChange={handleAmenityChange}
                                                                />
                                                            </div>
                                                            Shopping Mall
                                                        </label>

                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <div className="flex items-center p-0.5 bg-custom-green2 rounded-md">
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-4 h-4 appearance-none rounded-md checked:bg-custom-green2 bg-white before:content-[''] before:absolute before:checked:bg-[url('https://www.tailwindtap.com/assets/components/gradient/check.png')] before:bg-contain before:pointer-events-none before:h-4 before:-left-[1px] before:-top-px before:w-4"
                                                                    name="school"
                                                                    checked={amenities.school === 1}
                                                                    onChange={handleAmenityChange}
                                                                />
                                                            </div>
                                                            School
                                                        </label>

                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <div className="flex items-center p-0.5 bg-custom-green2 rounded-md">
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-4 h-4 appearance-none rounded-md checked:bg-custom-green2 bg-white before:content-[''] before:absolute before:checked:bg-[url('https://www.tailwindtap.com/assets/components/gradient/check.png')] before:bg-contain before:pointer-events-none before:h-4 before:-left-[1px] before:-top-px before:w-4"
                                                                    name="jogging_track"
                                                                    checked={amenities.jogging_track === 1}
                                                                    onChange={handleAmenityChange}
                                                                />
                                                            </div>
                                                            Jogging Track
                                                        </label>

                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <div className="flex items-center p-0.5 bg-custom-green2 rounded-md">
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-4 h-4 appearance-none rounded-md checked:bg-custom-green2 bg-white before:content-[''] before:absolute before:checked:bg-[url('https://www.tailwindtap.com/assets/components/gradient/check.png')] before:bg-contain before:pointer-events-none before:h-4 before:-left-[1px] before:-top-px before:w-4"
                                                                    name="hospital"
                                                                    checked={amenities.hospital === 1}
                                                                    onChange={handleAmenityChange}
                                                                />
                                                            </div>
                                                            Hospital
                                                        </label>

                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <div className="flex items-center p-0.5 bg-custom-green2 rounded-md">
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-4 h-4 appearance-none rounded-md checked:bg-custom-green2 bg-white before:content-[''] before:absolute before:checked:bg-[url('https://www.tailwindtap.com/assets/components/gradient/check.png')] before:bg-contain before:pointer-events-none before:h-4 before:-left-[1px] before:-top-px before:w-4"
                                                                    name="parks"
                                                                    checked={amenities.parks === 1}
                                                                    onChange={handleAmenityChange}
                                                                />
                                                            </div>
                                                            Parks
                                                        </label>

                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <div className="flex items-center p-0.5 bg-custom-green2 rounded-md">
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-4 h-4 appearance-none rounded-md checked:bg-custom-green2 bg-white before:content-[''] before:absolute before:checked:bg-[url('https://www.tailwindtap.com/assets/components/gradient/check.png')] before:bg-contain before:pointer-events-none before:h-4 before:-left-[1px] before:-top-px before:w-4"
                                                                    name="atm"
                                                                    checked={amenities.atm === 1}
                                                                    onChange={handleAmenityChange}
                                                                />
                                                            </div>
                                                            ATM
                                                        </label>

                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <div className="flex items-center p-0.5 bg-custom-green2 rounded-md">
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-4 h-4 appearance-none rounded-md checked:bg-custom-green2 bg-white before:content-[''] before:absolute before:checked:bg-[url('https://www.tailwindtap.com/assets/components/gradient/check.png')] before:bg-contain before:pointer-events-none before:h-4 before:-left-[1px] before:-top-px before:w-4"
                                                                    name="restaurants"
                                                                    checked={amenities.restaurants === 1}
                                                                    onChange={handleAmenityChange}
                                                                />
                                                            </div>
                                                            Restaurants
                                                        </label>

                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <div className="flex items-center p-0.5 bg-custom-green2 rounded-md">
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-4 h-4 appearance-none rounded-md checked:bg-custom-green2 bg-white before:content-[''] before:absolute before:checked:bg-[url('https://www.tailwindtap.com/assets/components/gradient/check.png')] before:bg-contain before:pointer-events-none before:h-4 before:-left-[1px] before:-top-px before:w-4"
                                                                    name="lift_available"
                                                                    checked={amenities.lift_available === 1}
                                                                    onChange={handleAmenityChange}
                                                                />
                                                            </div>
                                                            Lift Available
                                                        </label>
                                                    </div>
                                                        
                                                </div>
                                            </div>
                                        </div>
                                    )}
                   

                   <div className="flex justify-center">
                        <button
                            className="bg-custom-green2 text-white py-2 px-4 rounded-lg mt-6 hover:shadow-lg transition-all duration-300"
                            onClick={estimatePrice}
                        >
                            Estimate Price
                        </button>
                    </div>

                    <div
                        id="uiEstimatedPrice"
                        className="bg-custom-green4 text-white py-2 px-4 rounded-lg mt-6 flex justify-center items-center"
                    >
                        <h2>{estimatedPrice} Lakh</h2>
                    </div>
               </div>
               </div>
            </div>
   );
};

export default Prediction;