import {FaSearch} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
export default function Header() {
  const {currentUser} = useSelector(state => state.user)
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const link=encodeURI(window.location.href);
  const flink='https://estate.100jsprojects.com/'
  const msg='Hey I found this useful';

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if(searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-1 h-[100px]'>
      <img src="/assets/logo.png" alt="logo" className='flex flex-wrap h-[190px] w-[190px]' />
      <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center'>
        <input type="text" placeholder="Search" className='bg-transparent focus:outline-none w-24 sm:w-64'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}/>
        <button>
        <FaSearch className='text-slate-600' />
        </button>
      </form>
      <ul className='flex gap-4'>
      <li className='text-slate-700 hover:underline'>Buy</li>
        <li className='text-slate-700 hover:underline'>Sell</li>
        <Link to='/'>
        <li className='text-slate-700 hover:underline'>Home</li>
        </Link>
        <Link to='/wishlist'>
        <li className='text-slate-700 hover:underline'>wishlist</li>
        </Link>
        <Link to='/about'>
        <li className='text-slate-700 hover:underline'>About</li>
        </Link>
        <Link to='/profile'>
        {currentUser ? (
          <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='profile' />
        ):(
        <li className='text-slate-700 hover:underline'>Sign in</li>
        )}
        </Link>
      </ul>
      </div>
    </header>
  )
}
