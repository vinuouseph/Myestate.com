import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import Spinner from '../components/Spinner';
import { useSelector } from 'react-redux';

export default function Search() {
    const navigate = useNavigate();
    const location = useLocation();
    const {currentUser} = useSelector(state => state.user);
    const [sidebardata, setSidebardata] = useState({
        searchTerm: '',
        searchAdd: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc',
    });
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [error, setError] = useState(false);
    const [savedSearchCount, setSavedSearchCount] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editSaveSearchId, setEditSaveSearchId] = useState(null);
    const [editSaveSearchData, setEditSaveSearchData] = useState(null);
    const submitButtonRef = useRef(null); // ref to access the submit button

    useEffect(() => {
         // Fetch the saved searches for the current user
         const fetchSavedSearches = async () => {
            if (currentUser) {
                const res = await fetch(`/api/user/savesearches/${currentUser._id}`);
                const data = await res.json();
                setSavedSearchCount(data.length);
            }
        }
        fetchSavedSearches();

                const urlParams = new URLSearchParams(location.search);
        const isEditModeFromUrl = urlParams.get('edit') === 'true';
        const editSaveSearchIdFromUrl = urlParams.get('searchId');

        if (isEditModeFromUrl && editSaveSearchIdFromUrl) {
            setIsEditMode(true);
            setEditSaveSearchId(editSaveSearchIdFromUrl);
            setEditSaveSearchData(location.state);
            setSidebardata({
                searchTerm: '',
                searchAdd: location.state.address,
                type: location.state.type,
                parking: location.state.parking,
                furnished: location.state.furnished,
                offer: location.state.offer,
                sort: 'created_at',
                order: 'desc',
            });
        } else {

        setIsEditMode(false);
        setEditSaveSearchId(null);
        setEditSaveSearchData(null)

        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const searchAddFromUrl = urlParams.get('searchAdd');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if(
            searchTermFromUrl ||
            searchAddFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ){
            setSidebardata({
                searchTerm: searchTermFromUrl || '',
                searchAdd: searchAddFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc',

            });}
        }
        


        // Simulate button click in edit mode
        if (isEditModeFromUrl && submitButtonRef.current) {
            submitButtonRef.current.click();
        }

        if (!isEditMode) {
            fetchListings();
        }
            

    }, [currentUser, location.search, location.state, isEditMode]);

    useEffect(() => {
        if (isEditMode) {
            fetchListings();
        } 
    }, [sidebardata, isEditMode]);

    const fetchListings = async () => {
        setLoading(true);
        setShowMore(false);

        const searchQuery = new URLSearchParams({
            searchTerm: sidebardata.searchTerm,
            searchAdd: sidebardata.searchAdd,
            type: sidebardata.type,
            parking: sidebardata.parking,
            furnished: sidebardata.furnished,
            offer: sidebardata.offer,
            sort: sidebardata.sort,
            order: sidebardata.order,
        }).toString();

        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const fetchedData = await res.json();
        if (fetchedData.length > 8) {
            setShowMore(true);
        } else {
            setShowMore(false);
        }
        setListings(fetchedData);
        setLoading(false);
    }
    


    const handleChange = (e) => {
        if (e.target.id === 'name') {
            setSidebardata({ ...sidebardata, name: e.target.value });
        }
        if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setSidebardata({...sidebardata, type: e.target.id})
        }
        if(e.target.id === 'searchTerm') {
            setSidebardata({...sidebardata, searchTerm: e.target.value})
        }
        if(e.target.id === 'searchAdd') {
            setSidebardata({...sidebardata, searchAdd: e.target.value})
            if (isEditMode) {
                setEditSaveSearchData({ ...editSaveSearchData, address: e.target.value });
            }
        }
        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setSidebardata({...sidebardata, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false,});
        }
        if(e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';
            setSidebardata({ ...sidebardata, sort, order });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setShowMore(false);

        const searchQuery = new URLSearchParams({
            searchTerm: sidebardata.searchTerm,
            searchAdd: sidebardata.searchAdd,
            type: sidebardata.type,
            parking: sidebardata.parking,
            furnished: sidebardata.furnished,
            offer: sidebardata.offer,
            sort: sidebardata.sort,
            order: sidebardata.order,
        }).toString();

        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const fetchedData = await res.json();
        if (fetchedData.length > 8) {
            setShowMore(true);
        } else {
            setShowMore(false);
        }
        setListings(fetchedData);
        setLoading(false);
    }

    const handleEdit = async (e) => {
        try {
            setLoading(true);
            setError(false);
            const requestBody = {
                ...sidebardata,
                name: editSaveSearchData.name,
                address: editSaveSearchData.address,
            };
            const res = await fetch(`/api/save/update/${editSaveSearchId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
            const data = await res.json();
            await handleSaveAndSendEmail();
            setLoading(false);
            if (data.success === false) {
                setError(data.message);
            } else {
                navigate('/profile');
            }
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }

    const handleCancel = () => {
        navigate('/profile');
    }
    
    const onShowMoreClick = async () => {
        const numberOflistings = listings.length;
        const startIndex = numberOflistings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if(data.length < 9){
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    };

    const handleSave = async (e) => {
        try {
            setLoading(true);
            setError(false);
            const newSavedSearchCount = savedSearchCount + 1;
            const name = `SaveSearch${newSavedSearchCount}`;
            const res = await fetch ('/api/save/createSave', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                address: sidebardata.searchAdd,
                furnished: sidebardata.furnished,
                parking: sidebardata.parking,
                type: sidebardata.type,
                offer: sidebardata.offer,
                userRef: currentUser._id,
            })
        });
        const data = await res.json();
        setLoading(false);
        if(data.success === false) {
            setError(data.message);
        } else {
            setSavedSearchCount(newSavedSearchCount);
        }
        } catch(error) {
            setError(error.message);
            setLoading(false);
        }
    }

    const handleSaveAndSendEmail = async () => {
        try {
          // Send the save search data to the backend
          if (!isEditMode) {
            await handleSave();
          }
          // Send the email
          const res = await fetch('http://localhost:3000/send-listings-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                listings: listings,
                useremail: currentUser.email,

            })
          });

      
          if (res.ok) {
            console.log('Email sent successfully');
            alert("E-mail has sent with all the listings based on your search");
          } else {
            console.error('Error sending email');
          }
          
        } catch (error) {
          console.error('Error:', error);
        }
      };

      const handleS = async () => {
        navigate('/sign-in');
      }
  return (
    <div className='flex flex-col md:flex-row'>
        <div className='flex flex-col gap-8 p-7 border-b-2 md:border-r-2 md:min-h-screen'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                {isEditMode && (
                        <div className='flex items-center gap-2'>
                            <label className='whitespace-nowrap font-semibold'>Saved Search Name:</label>
                            <input type="text" id='searchName' placeholder='Search Name' className='border rounded-lg p-3 w-full'
                                value={editSaveSearchData.name} onChange={(e) => setEditSaveSearchData({ ...editSaveSearchData, name: e.target.value })} />
                        </div>
                    )}
                <div className='flex items-center gap-2'>
                    <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                    <input type="text" id='searchTerm' placeholder='Search...' className='border rounded-lg p-3 w-full' 
                    value={sidebardata.searchTerm} onChange={handleChange}/>
                </div>
                <div className='flex items-center gap-2'>
                    <label className='whitespace-nowrap font-semibold'>Search Address:</label>
                    <input type="text" id='searchAdd' placeholder='Search...' className='border rounded-lg p-3 w-full' 
                    value={sidebardata.searchAdd} onChange={handleChange}/>
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Type:</label>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='all' className='w-5' 
                        onChange={handleChange}
                        checked={sidebardata.type === 'all'}/>
                        <span>Rent & Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='rent' className='w-5' 
                        onChange={handleChange}
                        checked={sidebardata.type === 'rent'}/>
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='sale' className='w-5' 
                        onChange={handleChange}
                        checked={sidebardata.type === 'sale'}/>
                        <span>Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='offer' className='w-5' 
                        onChange={handleChange}
                        checked={sidebardata.offer}/>
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Amenities:</label>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='parking' className='w-5' 
                        onChange={handleChange}
                        checked={sidebardata.parking}/>
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='furnished' className='w-5' 
                        onChange={handleChange}
                        checked={sidebardata.furnished}/>
                        <span>Furnished</span>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <label className='font-semibold'>Sort:</label>
                    <select onChange={handleChange} defaultValue={'created_at_desc'} id="sort_order" className='border rounded-lg p-3'>
                        <option value='regularPrice_desc'>Price high to low</option>
                        <option value='regularPrice_asc'>Price low to high</option>
                        <option value='createdAt_desc'>Newest</option>
                        <option value='createdAt_asc'>Oldest</option>
                    </select>
                </div>
                <button ref={submitButtonRef} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Search</button>
            </form>
            {isEditMode ? (
                        <>
                            <button onClick={handleEdit} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Save</button>
                            <button onClick={handleCancel} className='bg-red-600 text-white p-3 rounded-lg uppercase hover:opacity-95'>Cancel</button>
                        </>
                    ) : (
                        <>
                            {!currentUser && (<button onClick={handleS} className='bg-blue-600 text-white p-3 rounded-lg uppercase hover:opacity-95'>Save Search</button>)}
                            {currentUser && (<button onClick={handleSaveAndSendEmail} className='bg-blue-600 text-white p-3 rounded-lg uppercase hover:opacity-95'>Save Search</button>)}
                        </>
                    )}
            {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
        <div className='flex flex-1'>
            <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing Results</h1>
            <div className='p-7 flex flex-wrap gap-4'>
                {!loading && listings.length === 0 && (
                    <p className='text-xl text-slate-700'>No listing found!</p>
                )}
                {loading && (
                    <span className='text-xl text-slate-700 text-center w-full'><Spinner/></span>
                )}
                {
                    !loading && listings && listings.map((listing) => <ListingItem key={listing._id} listing={listing}/>
                    )
                }
                {showMore && (
                    <button onClick={onShowMoreClick} className='text-green-700 hover:underline p-7 text-center w-full'>Show More</button>
                )}
            </div>
        </div>
    </div>
  )
  }
