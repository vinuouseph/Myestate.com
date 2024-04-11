import React, { useState,useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Modal = ({ onClose, onSubmit, listing }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [landlord, setLandlord] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
        setLandlord(null); // Set landlord to null if fetching fails
      }
    }
    fetchLandlord();
  }, [listing.userRef]);

  const handleSubmit = async () => {
    if (!landlord) {
      setError('Unable to fetch landlord information.');
      return;
    }

    console.log(currentUser);

    const bookingData = {
      date,
      time,
      name: listing.name,
      landlordEmail: landlord.email,
      user: currentUser.username,
    };

    try {
      const response = await axios.post('http://localhost:3000/send-email', bookingData);
      console.log(response.data); // Handle successful response
      alert('You are successfully booked!');
      onClose(); // Close the modal after successful email send
    } catch (err) {
      setError(err.response.data.message || 'Error sending mail'); // Handle error
    }


  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="relative w-auto max-w-lg mx-auto my-6">
        {/*content*/}
        <div className="modal-dialog bg-white shadow-lg rounded-lg">
          {/*header*/}
          <div className="modal-header p-4 border-b border-gray-200">
            <button
              className="modal-close"
              onClick={onClose}
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/*body*/}
          <div className="modal-body p-4">
            <form>
              <label className="block mb-2">Date:</label>
              <input type="date" className="w-full px-4 py-2 border rounded-lg" value={date} onChange={(e) => setDate(e.target.value)} />
              <label className="block mt-4 mb-2">Time:</label>
              <input type="time" className="w-full px-4 py-2 border rounded-lg" value={time} onChange={(e) => setTime(e.target.value)} />
            </form>
          </div>
          {/*footer*/}
          <div className="modal-footer p-4 border-t border-gray-200">
            {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error message if present */}
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-4" onClick={handleSubmit}>Submit</button>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
