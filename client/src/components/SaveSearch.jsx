import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

export default function SaveSearch() {
const navigate = useNavigate();
const [saveSearches, setSaveSearches] = useState([]);
const [showSaveSearchesError, setShowSaveSearchesError] = useState(false);
const {currentUser} = useSelector(state => state.user);


useEffect(() => {
    const fetchSaveSearches = async () => {
      try {
        setShowSaveSearchesError(false);
        const res = await fetch(`/api/user/savesearches/${currentUser._id}`);
        const data = await res.json();

        if (data.success === false) {
          setShowSaveSearchesError(true);
          return;
        }

        setSaveSearches(data);
      } catch (error) {
        setShowSaveSearchesError(true);
      }
    };

    if (currentUser) {
      fetchSaveSearches();
    }
  }, [currentUser]);

  const handleSaveDelete = async (searchId) => {
    try{
      const res = await fetch(`/api/save/delete/${searchId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if(data.success === false) {
        console.log(data.message);
        return;
      }
      setSaveSearches((prev) => prev.filter((search) => search._id !== searchId));
    } catch(error) {
      console.log(error.message);
    }
   }

   const handleEditSearch = (searchData) => {
    navigate(`/search?edit=true&searchId=${searchData._id}`, { state: searchData });
}
 
  return (
  <div className='py-3 px-4 max-w-6xl mx-auto'>
    
    <h1 className='text-center mt-7 text-2xl font-semibold'>Your Saved Searches</h1>
    <div>
    <p className="text-red-700 mt-5">{showSaveSearchesError ? 'Error showing listings' : ''}</p>
    <div className='flex flex-col gap-4'>
    {saveSearches.map((saveSearch) => (<div key={saveSearch._id} className="border-4 border-blue-200 rounded-lg p-3 flex justify-between items-center gap-4 w-96">
        <Link to={`/search/?searchTerm=&searchAdd=${saveSearch.address}&type=${saveSearch.type}&parking=${saveSearch.parking}&furnished=${saveSearch.furnished}&offer=${saveSearch.offer}&sort=created_at&order=desc`}>
        <p className="text-slate-700 font-semibold hover:underline truncate">{saveSearch.name}</p>
        </Link>
        <div className="flex flex-col items-center">
              <button onClick={() => handleSaveDelete(saveSearch._id)} className="text-red-700 uppercase hover:underline">
                Delete
              </button>
                <button onClick={() => handleEditSearch(saveSearch)} className="text-green-700 uppercase hover:underline">Edit</button>
            </div>
      </div>
    )) }
    </div>
    </div>
  </div>
  )
}
