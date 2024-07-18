import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UploadForm = () => {
  const [musicName, setMusicName] = useState('');
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('music', file);
console.log(fileName,musicName)
    try {
      const response = await axios.post('http://localhost:3000/delta/user/upload', formData);

      if (response.status === 200) {
try{
  const songUpdate = await axios.post('http://localhost:3000/delta/user/addSong', {
    songName:musicName,
    songLink:`/songs/${fileName}`
 });
if(songUpdate.status == 200){
 toast.info("File uploaded successfully")
}
}catch(err){
  toast.info("File uploaded successfully,but not updated to server please contact service provider")
}
   
      } else {
        toast.error("File upload failed")
       
      }
    } catch (err) {
      console.error(err);
      toast.error("File upload failed")    }
  };

  return (
   <div>
    <form onSubmit={handleSubmit}  className="max-w-xs mx-auto" >
    <div className="flex flex-col space-y-4 items-center">
    <input
          type="text"
          placeholder="Music Name..."
          value={musicName}
          onChange={(e) => setMusicName(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
          required // This makes the input compulsory
        />
        <input
          type="text"
          placeholder="File Name..."
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
          required // This makes the input compulsory
        />
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="p-2 border border-gray-300 rounded w-full"
          required // This makes the input compulsory
        />
      
      <button  type='submit' className=' max-w-48'>
        Upload Music
          </button>
          </div>
    </form>
<ToastContainer/>
</div>

  );
};

export default UploadForm;
