import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import Listing from "./listing";

const Wishlist = () => {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);


  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        const res = await fetch('/api/wishlist/');
        const data = await res.json();
        console.log("Response data:", data); // Log the response data
        setWishlists(data);
      } catch (err) {
        console.error("Error fetching wishlists:", err); // Log the error
        setError("Failed to fetch wishlists.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      console.log("Fetching wishlists for user:", currentUser); // Log the current user
      fetchWishlists();
    } else {
      console.log("No user logged in"); // Log if no user is logged in
    }
  }, [currentUser]);

  const handleRemoveWishlist = async (wishlistId) => {
    try {
      setLoading(true);
      setError(null);
      await axios.delete(`/api/wishlist/${wishlistId}`, {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
      });
      // Filter out the removed wishlist from the local state
      setWishlists(wishlists.filter((wishlist) => wishlist._id !== wishlistId));
    } catch (err) {
      setError("Failed to remove wishlist.");
      console.error("Error removing wishlist:", err);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="mx-auto pl-20 bg-white">
      <h1 className="text-3xl font-semibold mb-4">Wishlist</h1>
      <div className="flex flex-wrap">
        {wishlists.length === 0 ? (
          <p className="text-gray-600">Your wishlist is empty.</p>
        ) : (
          wishlists.map((wishlist) => (
            <div key={wishlist._id} className="max-w-xs bg-white shadow-lg rounded-lg overflow-hidden m-4">
              <div className="px-4 py-2">
                <h2 className="text-xl font-semibold text-gray-800">{wishlist.name}</h2>
              </div>
              <div className="px-4 py-2">
                <button
                  onClick={() => handleRemoveWishlist(wishlist._id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                >
                  Remove
                </button>
                <Link to={`/listing/${wishlist.listingID}`}>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  View
                </button>
                </Link>
                
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Wishlist;
