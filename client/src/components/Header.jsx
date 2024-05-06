
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
export default function Header() {
  const {currentUser} = useSelector(state => state.user)
  

  
  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-1 h-[100px]'>
      <ul className='flex gap-4 items-center'>
      <Link to='/search?searchTerm=&searchAdd=&type=sale&parking=false&furnished=false&offer=false&sort=created_at&order=desc'>
        <li className='text-slate-700 rounded-md px-2 py-1 transition-hover duration-300 hover:bg-white hover:text-blue-800 font-semibold'>Buy</li>
        </Link>
        <Link to='/search?searchTerm=&searchAdd=&type=rent&parking=false&furnished=false&offer=false&sort=created_at&order=desc'>
        <li className='text-slate-700 rounded-md px-2 py-1 transition-hover duration-300 hover:bg-white hover:text-blue-800 font-semibold'>Rent</li>
        </Link>
        <Link to='/create-listing'>
        <li className='text-slate-700 rounded-md px-2 py-1 transition-hover duration-300 hover:bg-white hover:text-blue-800 font-semibold'>Sell</li>
        </Link>
        <Link to='/prediction'>
            <li className='text-slate-700 rounded-md px-2 py-1 transition-hover duration-300 hover:bg-white hover:text-blue-800 font-semibold'>Price Estimator</li>
          </Link>
      </ul>
      <img src="/assets/logo.png" alt="logo" className='flex flex-wrap h-[190px] w-[190px]' />
      <ul className='flex gap-4 items-center'>
        <Link to='/'>
        <li className='text-slate-700 rounded-md px-2 py-1 transition-hover duration-300 hover:bg-white hover:text-blue-800 font-semibold'>Home</li>
        </Link>
        
        <Link to='/wishlist'>
            <li className='text-slate-700 rounded-md px-2 py-1 transition-hover duration-300 hover:bg-white hover:text-blue-800 font-semibold'>wishlist</li>
          </Link>
        <Link to='/about'>
        <li className='text-slate-700 rounded-md px-2 py-1 transition-hover duration-300 hover:bg-white hover:text-blue-800 font-semibold'>About</li>
        </Link>
        <Link to='/profile'>
        {currentUser ? (
          <img className='rounded-full h-14 w-14 p-2 transition-hover duration-300 hover:bg-white object-cover' src={currentUser.avatar} alt='profile' />
        ):(
        <li className='text-slate-700 rounded-md px-2 py-1 transition-hover duration-300 hover:bg-white hover:text-blue-800 font-semibold'>Sign in</li>
        )}
        </Link>
      </ul>
      </div>
    </header>
  )
}
