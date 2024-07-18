import {useNavigate} from "react-router-dom"
import axios from "axios";
import { useEffect, useState, useRef } from "react";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




export default function Playlist() {
  const navigate =useNavigate();


  const [user, setUser] = useState([]);
  const [playlist, setPlaylist] = useState([]);

  const [songs, setSongs] = useState([]);
  const [filteredObjects, setFiltered] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const logined = localStorage.getItem("username");

  async function getUser() {
    try{
      const val = await axios.post("http://localhost:3000/delta/user/oneUser", {
        username: logined,
      });
      const getSongs = await axios.get("http://localhost:3000/delta/user/getSongs");
  
      setUser(val.data.favSongs);
      setPlaylist(val.data.playlist)
      setSongs(getSongs.data);
    }
    catch(error){
      toast.error("Unexpected Error : ",error)
    }

  }

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    let filter = [];
    user.forEach((sng) => {
      songs.forEach((song) => {
        if (sng == song._id) {
          if (!filter.includes(song)) {
            filter.push(song);
          }
        }
      });
    });

    setFiltered(filter);
  }, [songs]);

  const playSong = (song) => {
    if (currentSong && audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentSong(song);
    audioRef.current.src = song.songLink;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const playAllSongs = async () => {
    for (const song of filteredObjects) {
      playSong(song);
      await new Promise((resolve) => {
        audioRef.current.onended = resolve;
      });
    }
  };

  const PlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const stopSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentSong(null);
    }
  };

  if(filteredObjects.length == 0){
    return(
      <div className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% flex flex-col justify-center items-center p-5 min-h-screen ">
        <img src="/opps.png" className=" m-5"></img>
   <h1>No Songs Added!! </h1>
   <button
              onClick={()=>{
                toast("Returning to Homepage!!!",{
                  onClose:()=>{
                    navigate('/home')  ;
                  }
                })
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 mr-2"
            >
             Return Home
            </button>
            <ToastContainer/>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% flex flex-col justify-center items-center p-5">
      <div className="m-3">
      <p className="m-5 font-serif size-9 inline">Playlist : {playlist}</p>
      <button
        onClick={playAllSongs}
        className="mt-5 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
      >
        Play All
      </button>
      </div>
  

      {currentSong && (
        <div className="bg-white p-4 rounded-lg shadow mb-5 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-2">Now Playing: {currentSong.songName}</h2>
          <div>
            <button
              onClick={PlayPause}
              className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 mr-2"
            >
              {isPlaying ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={stopSong}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Stop
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen grid grid-cols-3 gap-5">
        {filteredObjects.map((item, index) => (
          <Card key={index} song={item} onPlay={playSong} />
        ))}
      </div>

      <audio ref={audioRef} />
    </div>
  );
}

const Card = ({ song, onPlay }) => {
  return (
    <div className="max-w-sm p-2 m-1 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex justify-around h-1/5">
      <a href="#">
        <p className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {song.songName}
        </p>
      </a>

      <button
        onClick={() => onPlay(song)}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-5"
      >
        Listen
        <svg
          className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </button>
    </div>
  );
};
