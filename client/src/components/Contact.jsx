import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function Contact({ listing }) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');
    const [userEmail, setUserEmail] = useState(''); // Add this line
    const {currentUser} = useSelector(state => state.user);

    const onChange = (e) => {
        setMessage(e.target.value);
    };

    useEffect(() => {
        setUserEmail(currentUser.email);
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                setLandlord(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchLandlord();
    }, [listing.userRef]);

    const sendEmail = async () => {
        try {
            const response = await axios.post('/api/send-email', {
                message,
                userEmail, // Pass the user's email here
                landlordEmail: landlord.email,
                listingName: listing.name,
            });
            console.log(response.data);
            alert("Email has been sent.");
            // Reset the message state after sending the email
            setMessage('');
        } catch (error) {
            console.error(error);
        }
    };

    return (
      <>
          {landlord && (
              <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Contact <span className='text-blue-400'>{landlord.username}</span></h2>
                  <p className="mb-4 text-gray-600">Interested in <span className="text-blue-500 font-semibold">{listing.name.toLowerCase()}</span>? Send a message to the landlord.</p>

                  <div className="mb-4">
                      <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                          Your Email Address
                      </label>
                      <input
                          type="email"
                          id="email"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                          readOnly
                      />
                  </div>

                  <div className="mb-4">
                      <label htmlFor="message" className="block text-gray-700 font-bold mb-2">
                          Your Message
                      </label>
                      <textarea
                          id="message"
                          rows="4"
                          value={message}
                          onChange={onChange}
                          placeholder="Enter your message..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                      ></textarea>
                  </div>

                  <button
                      onClick={sendEmail}
                      className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                      Send Message
                  </button>
              </div>
          )}
      </>
  );
}