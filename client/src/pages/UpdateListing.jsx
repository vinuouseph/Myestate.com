import { getDownloadURL, getStorage, uploadBytesResumable, ref } from "firebase/storage";
import { useEffect, useState } from "react"
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from "../components/Spinner";


export default function CreateListing() {
    const params = useParams();
    const navigate = useNavigate();
    const {currentUser} = useSelector(state => state.user)
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 0,
        discountPrice: 50,
        offer: false,
        parking: false,
        furnished: false,
        latitude: 0,
        longitude: 0,
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId;
            const res = await fetch(`/api/listing/get/${listingId}`);
            const data = await res.json();
            if(data.success === false) {
                console.log(data.message);
                return;
            }
            setFormData(data);
        };
        fetchListing();
    }, []);
   const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
        setUploading(true);
        setImageUploadError(false);
        const promises = [];

        for (let i=0; i<files.length; i++) {
            promises.push(storeImage(files[i]));
        }
        Promise.all(promises).then((urls) => {
            setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
            setImageUploadError(false);
            setUploading(false);
        }).catch((error) => {
            setImageUploadError('Image upload failed (2MB max per image)');
            setUploading(false);
        });
    }
    else {
        setImageUploadError('Upload 6 images per listing');
        setUploading(false);
    }
   };
   const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`upload is ${progress}% done`);
            },
            (error)=>{
                reject(error);
            },
            ()=>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
   };

   const handleRemoveImage = (index) => {
    setFormData({
        ...formData,
        imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    })
   }

   const handleChange = (e) => {
    if(e.target.id === 'sale' || e.target.id === 'rent') {
        setFormData({
            ...formData,
            type: e.target.id
        })
    }
    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
        setFormData({
            ...formData,
            [e.target.id]: e.target.checked
        })
    }
    if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        })
    }
   };

   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (formData.imageUrls.length < 1) return setError('Upload atleast one image');
        if (+formData.regularPrice < +formData.discountPrice) return setError('Discount price must be lower than regular price');
        setLoading(true);
        setError(false);

        // Check if the listing details match any saved search
        const searchRes = await fetch('/api/save/savedsearch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const searchData = await searchRes.json();

        if (searchData.length > 0) {
            // If there are matching saved searches, get the user emails
            const SaveData = await Promise.all(
                searchData.map(async (search) => {
                    const userRes = await fetch(`/api/user/${search.userRef}`);
                    const user = await userRes.json();
                    return { email: user.email, searchName: search.name };
                })
            );
            
            console.log('Matching data:', SaveData);
        

              // Send email to matching users
      const sendEmailRes = await fetch('http://localhost:3000/send-savedsearches-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listings: [formData],
          useremail: SaveData.map(({ email }) => email).join(', '),
          searchNames: SaveData.map(({ searchName }) => searchName).join(', '),
        }),
      });

      if (!sendEmailRes.ok) {
        console.error('Failed to send email');
      }
    }

        const res = await fetch(`/api/listing/update/${params.listingId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...formData,
                userRef: currentUser._id,
            }),
        });
        const data = await res.json();
        setLoading(false);
        if (data.success === false) {
            setError(data.message);
        }
        navigate(`/listing/${data._id}`);
    } catch (error) {
        setError(error.message);
        setLoading(false);
    }
};
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Update Listing</h1>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input onChange={handleChange} value={formData.name} type="text" placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='10' required/>
                <textarea onChange={handleChange} value={formData.description} type="text" placeholder='Description' className='border p-3 rounded-lg' id='description' required/>
                <input onChange={handleChange} value={formData.address} type="text" placeholder='Address' className='border p-3 rounded-lg' id='address' required/>
                <div className="flex space-x-6 justify-start mb-6">
                    <div>
                        <p className="text-lg font-semibold ">Latitude</p>
                        <input type="number" step="0.000000000000001" id="latitude" value={formData.latitude} onChange={handleChange} required min="-90" max="90" className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"/>
                    </div>
                    <div className="">
              <p className="text-lg font-semibold">Longitude</p>
              <input
                type="number"
                step="0.000000000000001"
                id="longitude"
                value={formData.longitude}
                onChange={handleChange}
                required
                min="-180"
                max="180"
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"
              />
            </div>
            </div>
                <div className='flex gap-6 flex-wrap'>
                <div className='flex gap-2'>
                    <input type="checkbox" id='sale' className='w-5' onChange={handleChange} checked={formData.type === 'sale'}/>
                    <span>Sell</span>
                </div>
                <div className='flex gap-2'>
                    <input type="checkbox" id='rent' className='w-5' onChange={handleChange} checked={formData.type === 'rent'} />
                    <span>Rent</span>
                </div>
                <div className='flex gap-2'>
                    <input type="checkbox" id='parking' className='w-5' onChange={handleChange} checked={formData.parking} />
                    <span>Parking spot</span>
                </div>
                <div className='flex gap-2'>
                    <input type="checkbox" id='furnished' className='w-5' onChange={handleChange} checked={formData.furnished} />
                    <span>Furnished</span>
                </div>
                <div className='flex gap-2'>
                    <input type="checkbox" id='offer' className='w-5' onChange={handleChange} checked={formData.offer} />
                    <span>Offer</span>
                </div>
                </div>
                <div className='flex flex-wrap gap-6'>
                <div className='flex items-center gap-2'>
                    <input onChange={handleChange} value={formData.bedrooms} type="number" id='bedrooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg'/>
                    <p>Beds</p>
                </div>
                <div className='flex items-center gap-2'>
                    <input onChange={handleChange} value={formData.bathrooms} type="number" id='bathrooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg'/>
                    <p>Baths</p>
                </div>
                <div className='flex items-center gap-2'>
                    <input onChange={handleChange} value={formData.regularPrice} type="number" id='regularPrice' min='50' max='1000000' required className='p-3 border border-gray-300 rounded-lg'/>
                    <div className='flex flex-col items-center'>
                    <p>Regular Price</p>
                    <span className='text-xs'>($ / month)</span>
                    </div>
                </div>
                {formData.offer && (
                <div className='flex items-center gap-2'>
                    <input onChange={handleChange} value={formData.discountPrice} type="number" id='discountPrice' min='0' max='1000000' required className='p-3 border border-gray-300 rounded-lg'/>
                    <div className='flex flex-col items-center'>
                    <p>Discounted Price</p>
                    <span className='text-xs'>($ / month)</span>
                    </div>
                </div>)}
                </div>
            </div>
            <div className='flex flex-col flex-1 gap-4'>
                <p className='font-semibold'>Images:
                <span className='font-normal text-gray-700 ml-2'>The first image will be the cover (max 6)</span></p>
            <div className='flex gap-4'>
                <input onChange={(e)=>setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple/>
                <button type='button' disabled={uploading} onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>{uploading ? 'Uploading...' : 'Upload'}</button>    
            </div> 
            <p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p>
            {
                formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                    <div key={url} className="flex justify-between p-3 border items-center">
                        <img src={url} alt='listing image' className="w-20 h-20 object-contain rounded-lg" />
                        <button type='button' onClick={() => handleRemoveImage(index)} className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75">Delete</button>
                    </div>
                ))
            }
            <button disabled={loading || uploading} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? <Spinner/> : 'Update Listing'}</button>
            {error && <p className="text-red-700 text-sm">{error}</p>}         
            </div>
           
        </form>
    </main>
  )
}
