import React, { useState, useEffect } from 'react';
import './Prediction.css';
import img from "../assets/img1.jpg";

const Prediction = () => {
    const [sqft, setSqft] = useState(1000);
    const [bhk, setBhk] = useState(2);
    const [resale, setResale] = useState('Yes');
    const [city, setCity] = useState('');
    const [location, setLocation] = useState('');
    const [estimatedPrice, setEstimatedPrice] = useState('');
    const [citys, setCitys] = useState([]);
    const [locations, setLocations] = useState([]);
    const [showAdditionalFeatures, setShowAdditionalFeatures] = useState(false);

    useEffect(() => {
        // Fetch locations from your API when component mounts
        fetch('/api/get_city_names')
            .then(response => response.json())
            .then(data => setCitys(data.citys));
        fetch('/api/get_location_names')
            .then(response => response.json())
            .then(data => setLocations(data.locations));
    }, []);

    const estimatePrice = () => {
        // Post data to your API and update estimated price
        fetch('/api/predict_home_price', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ total_sqft: sqft, bhk, resale, city, location })
        })
            .then(response => response.json())
            .then(data => setEstimatedPrice(data.estimated_price));
    };

    return (
        <div style={{ backgroundImage: `url(${img})`,backgroundSize: 'cover',backgroundRepeat: 'no-repeat' }}>
                <div className="form-container">
                    <h1 className="headline">Myestate Estimator</h1>
                    <div className="form">
                        <h2>Area (Square Feet)</h2>
                        <input className="area" type="text" value={sqft} onChange={e => setSqft(e.target.value)} />

                        <h2>BHK</h2>
                        <div className="switch-field">
                            {Array.from({ length: 5 }, (_, index) => (
                                <React.Fragment key={index}>
                                    <input
                                        type="radio"
                                        id={`radio-bhk-${index + 1}`}
                                        name="uiBHK"
                                        value={index + 1}
                                        checked={bhk === index + 1}
                                        onChange={() => setBhk(index + 1)}
                                    />
                                    <label htmlFor={`radio-bhk-${index + 1}`}>{index + 1}</label>
                                </React.Fragment>
                            ))}
                        </div>

                        <h2>Resale</h2>
                        <div className="switch-field">
                            <input
                                type="radio"
                                id="radio-resale-yes"
                                name="uiResale"
                                value="Yes"
                                checked={resale === "Yes"}
                                onChange={() => setResale("Yes")}
                            />
                            <label htmlFor="radio-resale-yes">Yes</label>

                            <input
                                type="radio"
                                id="radio-resale-no"
                                name="uiResale"
                                value="No"
                                checked={resale === "No"}
                                onChange={() => setResale("No")}
                            />
                            <label htmlFor="radio-resale-no">No</label>
                        </div>

                        <h2>City</h2>
                        <select className="city" value={city} onChange={e => setCity(e.target.value)}>
                            <option value="" disabled>Choose a City</option>
                            {citys.map(c => <option key={c}>{c}</option>)}
                        </select>

                        <h2>Location</h2>
                        <select className="location" value={location} onChange={e => setLocation(e.target.value)}>
                            <option value="" disabled>Choose a Location</option>
                            {locations.map(loc => <option key={loc}>{loc}</option>)}
                        </select>

                        <button className="additional-features-button" onClick={() => setShowAdditionalFeatures(!showAdditionalFeatures)}>
                        Additional Features
                        </button>

                        {showAdditionalFeatures && (
                           <div className="checkbox-container">
                            <h3>Inside the Property</h3>
                            <div className="checkbox-container1">
                                
                                    <label>
                                        <input type="checkbox" value="Option 1" />
                                        Swimming Pool
                                    </label>
                                    <label>
                                        <input type="checkbox" value="Option 2" />
                                        Multipurpose Room
                                    </label>
                                
                                
                                    <label>
                                        <input type="checkbox" value="Option 3" />
                                        Landscaped Gardens
                                    </label>
                                    <label>
                                        <input type="checkbox" value="Option 4" />
                                        Car Parking
                                    </label>

                                    <label>
                                        <input type="checkbox" value="Option 5" />
                                        24X7Security
                                    </label>
                            
                                
                            </div>
                           <h3>Facities near the Property</h3>
                           <div className="checkbox-container1">
                           <div className="checkbox-row">
                               <label>
                                   <input type="checkbox" value="Option 6" />
                                   Sports Facility
                               </label>
                               <label>
                                   <input type="checkbox" value="Option 7" />
                                   Gymnasium
                               </label>
                           </div>
                           <div className="checkbox-row">
                               <label>
                                   <input type="checkbox" value="Option 8" />
                                   Shopping Mall
                               </label>
                               <label>
                                   <input type="checkbox" value="Option 9" />
                                   School
                               </label>
                           </div>
                           <div className="checkbox-row">
                               <label>
                                   <input type="checkbox" value="Option 10" />
                                   Jogging Track
                               </label>
                               <label>
                                   <input type="checkbox" value="Option 11" />
                                   Hospital
                               </label>
                           </div>
                           <div className="checkbox-row">
                               <label>
                                   <input type="checkbox" value="Option 12" />
                                   Children's Playarea
                               </label>
                               <label>
                                   <input type="checkbox" value="Option 13" />
                                   ATM
                               </label>
                           </div>
                           </div>
                       </div>
                        )}

                        <button className="submit" onClick={estimatePrice}>Estimate Price</button>
                        <div id="uiEstimatedPrice" className="result">
                            <h2>{estimatedPrice} Lakh</h2>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default Prediction;
