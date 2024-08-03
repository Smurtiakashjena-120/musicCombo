import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Home() {

  const [songArray, setSongArray] = useState([]);
  const [user, setUser] = useState([]);
  const [filteredObjects, setFiltered] = useState([]);
  //variable for storing the value of initial songs
  const [referenceSongs,setReference] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);


  const logined = localStorage.getItem("username")
  const token = localStorage.getItem("token")




  // Accessing the songs
  async function getSong() {
    try {
      const response = await axios.get("http://localhost:3000/delta/user/getSongs",
        {
          headers:{"Authorization":token}
          } ,
      );

      const val = await axios.post("http://localhost:3000/delta/user/oneUser",
{
        username: logined,
      });

      setUser(val.data.favSongs);
      setSongArray(response.data);
      setReference(response.data);
    } catch (error) {
      console.error("Error fetching songs", error);
      toast.error("Can't Fetch Songs!!")
    }
  }

  useEffect(()=>{
    setTimeout(()=>{
      toast(`Welcome To Music ${logined}`)
    },500)
  },[])

  useEffect(() => {
    let filter = [];
    user.forEach((sng) => {
      songArray.forEach((song) => {
        if (sng == song._id) {
          if (!filter.includes(song)) {
            filter.push(song);
          }
        }
      });
    });

    setFiltered(filter);
  }, [referenceSongs]);


//add to private 
async function addToPrivate({song}){
  
  try {


    let user = await axios.post("http://localhost:3000/delta/user/oneUser",
{
      username: logined,
    });
let addFlag = false;
    user.data.privateSongs.forEach(id => {
      if(id == song._id){
        toast("Already Present in Private Playlist !!");
        addFlag = true
      }
    })

if(!addFlag){
      const response = await axios.put('http://localhost:3000/delta/user/privatePlaylist',
        {
          headers:{"Authorization":token}
          } ,  {
          username: logined,
          playlist: song,
      });
      console.log(response.data);
      toast("Added To Private Playlist !!",{
        onClose:()=>{
          location.reload(); ;
        }
      })
    }   



  } catch (error) {
      console.error('Error:', error);
      toast.error("can not add to playlist !!")
  }


}

//function to add favorite song
  const toPlaylist = async(song)=>{


    try {


      let user = await axios.post("http://localhost:3000/delta/user/oneUser", {
        username: logined,
      });
      


      if(!user.data.playlist){
        let playlistname = prompt("Give A Name TO Your Playlist");

        let user = await axios.put("http://localhost:3000/delta/user/playlistName",
          {
            headers:{"Authorization":token}
            } , {
          username: logined,
          title: playlistname
        });

        console.log(user.data)
      }

        const response = await axios.put('http://localhost:3000/delta/user/playlist',
          {
            headers:{"Authorization":token}
            } , {
            username: localStorage.getItem("username"),
            playlist: song,
        });
        console.log(response.data);
        toast("Added To Playlist !!",{
          onClose:()=>{
            location.reload(); ;
          }
        })
             



    } catch (error) {
        console.error('Error:', error);
        toast.error("can not add to playlist !!")
    }
  }
  useEffect(() => {
    
    getSong();
  }, []);

  // Play the selected song
  const playSong = (song) => {
    if (!song || !song.songLink) {
      console.error('Invalid song link');
      return;
    }

    // Stop the current song if it is playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setCurrentSong(song);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (currentSong) {
      audioRef.current = new Audio(currentSong.songLink);
      audioRef.current.play().catch(error => {
        toast.error('Error occurred while playing audio');
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [currentSong]);

  // Pause or resume the current song
  const pauseSong = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          toast.error('Error occurred while playing audio');
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Stop the current song
  const stopSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentSong(null);
    }
  };

//function for searching songs
  const searchSong=(value)=>{
 
    //ensure that if no value then all songs appear
    if(!value){
      setSongArray(referenceSongs);
      return
    }
//ensure that songArray is as initial

setSongArray(referenceSongs);

let songs = referenceSongs.filter(song => song.songName.toLowerCase().includes(value.toLowerCase()))


 setSongArray(songs)
  }

  return (
    <div>

<Navbar ></Navbar>
<SearchForm searchSong={searchSong}></SearchForm>

<div className=" flex items-center justify-center w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ">
           
            <div className="flex flex-col items-center pb-10">
                <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src="/musicPlayer.png" alt=" image"/>
                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">Music Player</h5>
                {currentSong && (
                    <>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{currentSong.songName}</span>
                        <div className="flex mt-4 md:mt-6">
                            <button
                                onClick={pauseSong}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                {isPlaying ? 'Pause' : 'Resume'}
                            </button>
                            <button
                                onClick={stopSong}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ms-2"
                            >
                                Stop
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>

        <ShowSongs playSong={playSong} toPlaylist={toPlaylist} songArray={songArray} filteredObjects={filteredObjects} addToPrivate={addToPrivate}/>
<ToastContainer  position="top-left"/>
    </div>
  );
}

function ShowSongs({  playSong,toPlaylist ,songArray,filteredObjects,addToPrivate}) {

//function to colour the like
  function handleClr(svg) {
    const isClicked = svg.dataset.clicked === "true";
    toast("Liked The Song !!",{
      onClose:()=>{
        svg.setAttribute("fill", isClicked ? "none" : "blue");
      }
    })
   
    svg.dataset.clicked = !isClicked;
  }

  //ensures that every time song array chnages this function being called
  useEffect(()=>{
// console.log("song array changed")
  },[songArray]);
  
  let [fill,setFill] = useState("slate")


  if (songArray.length === 0) {
    return <div className="text-center text-gray-500"><h1><i> OOPs !! No matches</i></h1></div>;
  }

  return (
    
    <div className='grid grid-cols-3 m-10'>
{songArray.map((song, index) => (
    <div key={index} className="relative flex flex-col mt-6 mb-6 text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96">
    <div className="relative  flex items-center justify-center h-48 mx-4 -mt-6 overflow-hidden text-white shadow-lg bg-clip-border rounded-xl  bg-slate-100 shadow-blue-gray-500/40">
        <img
            src="/songPic.jpeg"
            alt="card-image"
        />
    </div>
    <div className="p-6">
        <h5 className="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
        {song.songName}
        </h5>
        <p className="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
Trending....
        </p>
    </div>
    <div className="p-6 pt-0">
        <button onClick={() => playSong(song)} className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none mr-5">Play</button>
        <button onClick={() => addToPrivate({song})} className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none">Add To Private</button>
    </div>
{/* svg  for liked song */}
<svg xmlns="http://www.w3.org/2000/svg"  className="absolute top-5 right-5 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-clicked = "false" onClick={(event) => {
  // console.log(song)
  addToPrivate({song})
  handleClr(event.currentTarget);
  }}>
        <path strokeLinecap="round"  strokeLinejoin="round" strokeWidth={2} d="M14 9l-1-4H5a2 2 0 00-2 2v11a2 2 0 002 2h9l4-9V9h-4z" />
      </svg>
      {/* svg for add to playlist */}

{
  filteredObjects.includes(song) && ( 
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute top-5 left-5 h-5 w-5" data-char ="playlist">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
</svg>

)
}

{
  !filteredObjects.includes(song) && (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute top-5 left-5 h-5 w-5" data-char ="playlist" onClick={()=>{toPlaylist(song);}}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
  )
}



</div>
))}
<ToastContainer  position="top-left"/>
    </div>
    

  );
}


const SearchForm = ({searchSong}) => {
let searchedValue = useRef();

  return (
      <div className="max-w-md mx-auto ">   
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
              </div>
              <input 
              ref={searchedValue}
                  type="search" 
                  id="default-search" 
                  className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                  placeholder="Search Songs..." 
                  required 
              />
              <button 
                  
                  className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={()=>{
                    searchSong(searchedValue.current.value)
                  }}
              >
                  Search
              </button>
          </div>
      </div>
  );
};