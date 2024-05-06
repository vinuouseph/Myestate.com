import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../assets/svg/spinner.json';

export default function Spinner() {
  return (
    <div className='bg-white bg-opacity-50 flex items-center justify-center fixed left-0 right-0 top-0 bottom-0'>
      <div>
        <Lottie animationData={animationData} loop={true} className='h-24' />
      </div>
    </div>
  );
}
