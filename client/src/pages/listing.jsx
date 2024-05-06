import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { useSelector } from 'react-redux';
import { FaBath, FaBed, FaChair, FaHeart, FaMapMarkerAlt, FaParking, FaShare } from 'react-icons/fa';
import Contact from "../components/Contact";
import Spinner from "../components/Spinner";
import ReactDOM from 'react-dom';
import Modal from './Modal';
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import Comments from "../components/comment";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [newRating, setNewRating] = useState(0);

  const params = useParams();
  const link = document.location.href;
  const msg = 'Hey i found this useful';



  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };


    fetchListing();
  }, [params.listingId]);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        if (listing) {
          const response = await fetch(`/api/ratings/${listing._id}`);
          const data = await response.json();
          setRatings(data);

          const totalRatings = data.reduce((sum, rating) => sum + rating.rating, 0);
          const averageRating = totalRatings / data.length;

          // Update the rating state with the average rating
          setRating(averageRating);
        }
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    };

    fetchRatings();
  }, [listing]);




  const handleBookClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShareClick = () => {
    setShowSharePopup(true);
  };

  const handleCloseSharePopup = () => {
    setShowSharePopup(false);
  };

  const handleSubmitModal = (data) => {
    console.log('Submitted:', data);
    setShowModal(false);
    // Handle form submission, e.g., send data to server
  };

  const handleRatingChange = (newRating) => {
    setNewRating(newRating);
  };

  const handleWish = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await fetch('/api/wishlist/Wcreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: listing.name,
          userRef: currentUser._id,
          listingID: listing._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        navigate('/wishlist');
      }
    } catch (error) {
      setError(error.message);
      loading(false);
    }
  };



  const handleSubmitRating = async () => {
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingID: listing._id,
          userRef: currentUser._id,
          rating: newRating,
        }),
      });

      if (response.ok) {
        // Rating submitted successfully
        console.log('Rating submitted');
        // Refresh ratings by calling fetchRatings

        setNewRating(0);

      } else {
        // Handle error
        throw new Error('Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      // Display error message to the user or handle it appropriately
    }
  };


  return (
    <main className='bg-gray-400'>
      {loading && <span className="text-center my-7 text-2xl"><Spinner /></span>}
      {error && <p className="text-center my-7 text-2xl">Something went wrong...</p>}
      {listing && !loading && !error && (
        <div className="mb-8">
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div className="h-[550px]" style={{ background: `url(${url}) center no-repeat`, backgroundSize: 'cover' }}></div>
              </SwiperSlide>
            ))}
          </Swiper>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='m-4 flex flex-col md:flex-row w-full p-4 rounded-lg border-3 shadow-lg bg-white lg:space-x-5 mb-8 h-full'>
            <div>
              <p className='text-2xl font-semibold'>
                {listing.name} - ₹{' '}
                {listing.offer
                  ? listing.discountPrice.toLocaleString('en-US')
                  : listing.regularPrice.toLocaleString('en-US')}
                {listing.type === 'rent' && ' / month'}
              </p>
              <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
                <FaMapMarkerAlt className='text-green-700' />
                {listing.address}
              </p>
              <div className='flex gap-4 mt-8'>
                <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                </p>
                {listing.offer && (
                  <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                    ₹{+listing.regularPrice - +listing.discountPrice} OFF
                  </p>
                )}
                <div className='absolute top-[15%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                  <div className="relative group">
                    <FaHeart onClick={handleWish} className="text-red-500 cursor-pointer group-hover:text-red-800" />
                    <span className="absolute top-full left-1/2 -translate-x-1/2 bg-gray-700 text-white text-sm px-2 py-1 rounded-md mt-2 opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100">
                            Wishlist
                      </span>  
                  </div>
                </div>
                {!currentUser && <p className="font-semibold text-green-600"><span className="hover: underline"><Link to='/sign-in'>SIGN IN</Link></span> to book property</p>}
                {currentUser && <button onClick={handleBookClick} className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>Book</button>}
                {showModal &&
                  ReactDOM.createPortal(
                    <Modal onClose={handleCloseModal} onSubmit={handleSubmitModal} listing={listing} />,
                    document.getElementById('modal-root')
                  )
                }
                <div
                  className='absolute top-[30%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'
                  onClick={handleShareClick}
                >
                  <div className="relative group">
                      <FaShare className="group-hover:opacity-50" />
                      <span className="absolute top-full left-1/2 -translate-x-1/2 bg-gray-700 text-white text-sm px-2 py-1 rounded-md mt-2 opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100">
                            Share
                      </span>
                  </div>
                </div>
                {showSharePopup && (
                  <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50'>
                    <div className='bg-white p-6 rounded-lg'>
                      <div className='flex items-center justify-between mb-4'>
                        <h2 className='text-lg font-bold'>Share</h2>
                        <button onClick={handleCloseSharePopup}>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-6 w-6'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M6 18L18 6M6 6l12 12'
                            />
                          </svg>
                        </button>
                      </div>
                      <div className='flex gap-4'>
                        <FacebookShareButton url='https://estate.100jsprojects.com/' title={msg}>
                          <FacebookIcon round={true} size={40} />
                        </FacebookShareButton>
                        <WhatsappShareButton url={link} title={msg}>
                          <WhatsappIcon round={true} size={40} />
                        </WhatsappShareButton>
                        <TwitterShareButton url={link} title={msg}>
                          <TwitterIcon round={true} size={40} />
                        </TwitterShareButton>
                        <EmailShareButton url={link} title={msg}>
                          <EmailIcon round={true} size={40} />
                        </EmailShareButton>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-slate-800 mt-8"><span className="font-semibold text-black">Description - {' '} </span>{listing.description}</p>
              <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
                <li className="flex items-center gap-1 whitespace-nowrap"><FaBed className="text-lg" />
                  {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}</li>
                <li className="flex items-center gap-1 whitespace-nowrap"><FaBath className="text-lg" />
                  {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}</li>
                <li className="flex items-center gap-1 whitespace-nowrap"><FaParking className="text-lg" />
                  {listing.parking ? 'Parking spot' : 'No Parking'}</li>
                <li className="flex items-center gap-1 whitespace-nowrap"><FaChair className="text-lg" />
                  {listing.furnished ? 'Furnished' : 'Not Furnished'}</li>
              </ul>
              {currentUser && listing.userRef !== currentUser._id && !contact && (
                <button onClick={() => setContact(true)} className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3 mt-8">Contact landlord</button>
              )}
              {contact && <Contact listing={listing} />}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">Ratings</h2>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      className={`text-2xl ${index + 1 <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p>Average Rating: {rating.toFixed(1)}</p>
                <Comments listingId={listing._id} />
                <div className="flex justify-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleRatingChange(index + 1)}
                        className={`text-2xl ${index + 1 <= newRating ? 'text-yellow-400' : 'text-gray-300'} focus:outline-none`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <button onClick={handleSubmitRating} className="bg-red-900 text-white p-2 ml-4 rounded-md">Submit Rating</button>
                </div>
              </div>
            </div>
            <div className="bg-blue-300 w-screen h-[350px] md:h-[400px] z-10 overflow-x-hidden mt-6 md:mt-0 md:ml-2">
              <MapContainer center={[listing.latitude, listing.longitude]} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[listing.latitude, listing.longitude]}>
                  <Popup>
                    {listing.address}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
