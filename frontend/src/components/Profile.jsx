
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// let songs = referenceSongs.filter(song => song.songName.toLowerCase().includes(value.toLowerCase()))



import axios from 'axios';

export default function Profile(){

  const [user,setUser] = useState("");
  const [searchVal,setSearch] = useState("")
  const [alluser,setAlluser] = useState([]);
const navigate =useNavigate();
const username = localStorage.getItem("username");

async function getUser(){
  const val = await axios.post("http://localhost:3000/delta/user/oneUser", {
    username: username,
  });
  const alluser = await axios.get("http://localhost:3000/delta/user/getUsers");

  setUser(val.data);
  setAlluser(alluser.data)
  
}

//declaring variable for passing as value to show user for searched value
const [filteredVal,setFilter]=useState([])

useEffect(()=>{
  let vals = alluser.filter(user => user.username.toLowerCase().includes(searchVal.toLowerCase()));
  setFilter(vals)

},[searchVal])

useEffect(()=>{ 
  getUser()
},[])


//function to handle friend request

async function friendRequest({user}){

  const val = await axios.put("http://localhost:3000/delta/user/friendRequest", {
    from: username,
    to:user.username,
    cause:"request"
  });

  toast.info(val.data,{
    onClose : ()=>{
      location.reload()
    }
  })


}
async function acceptRequest(name){

  const val = await axios.put("http://localhost:3000/delta/user/friendRequest", {
    from:name ,
    to:username,
    cause:"accept"
  });

  toast.info(val.data,{
    onClose : ()=>{
      location.reload()
    }
  })


}






    return(
        <div className="h-screen bg-slate-300 flex flex-col items-center">
          <div className='m-5'>
          <SearchForm setSearch={setSearch}></SearchForm>      
          </div>
<div className='flex items-center justify-around w-screen'>
  <div className='w-1/2 m-3'>
  <UserProfileCard username={username.toUpperCase()} navigate={navigate} user={user}/>
  <ShowRequest user={user} acceptRequest={acceptRequest}></ShowRequest>
  </div>

{/* div for friend request */}
<div  className='border-2 border-black p-5  w-1/2 max-h-full rounded' >
<div className='font-serif'>Platform Users</div>
  <ShowUser alluser={alluser} currentuser={username} friendRequest={friendRequest} logined={user} searched={filteredVal}></ShowUser>
</div>
</div>
           
<ToastContainer/>
        </div>
    )
}


function UserProfileCard({username , navigate,user}) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
  let privatename;

   async function checkPrivate(){
      if(user.privateName == null){
     privatename = prompt("Give A Name To Playlist !!")

     let response =await axios.put("http://localhost:3000/delta/user/privateName", {
      username: user.username,
      title: privatename
    }); 
   toast.info(response.data,{
    onClose: ()=>{
      navigate("/private")
    }
   })
      }else{
        navigate("/private")
      }

   

    }
  
    const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
    };
  
    return (
      <div className="relative w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-end px-4 pt-4">
          <button
            id="dropdownButton"
            onClick={toggleDropdown}
            className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
            type="button"
          >
            <span className="sr-only">Open dropdown</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M6 10c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zm6 0c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zm6 0c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2z" />
            </svg>
          </button>
          {/* Dropdown menu */}
          <div
            id="dropdown"
            className={`absolute right-4 top-12 z-10 ${dropdownOpen ? 'block' : 'hidden'} text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}
          >
            <ul className="py-2" aria-labelledby="dropdownButton">
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white" onClick={()=>{navigate("/home")}}
                >
                Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  onClick={()=>{navigate("/playlist")}}
                >
                 Playlist
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  onClick={()=>{navigate("/artist")}}
                >
                  Artist
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center pb-10">
          <img
            className="w-24 h-24 mb-3 rounded-full shadow-lg"
            src="/profile.jpeg"
            alt="Bonnie"
          />
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            {username}
          </h5>
         
          <div className="flex mt-4 md:mt-6">
            <a
              href="#"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={()=>{checkPrivate()}}

            >
              Private Songs
            </a>
            <a
              href="#"
              className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              onClick={()=>{navigate("/party")}}
            >
              Party Mode
            </a>
          </div>
        </div>
      </div>
    );
  }


  const SearchForm = ({setSearch}) => {
    return (
        <form className="flex items-center max-w-sm mx-auto">
            <label htmlFor="simple-search" className="sr-only">Search</label>
            <div className="relative w-full">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 18 20"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
                        />
                    </svg>
                </div>
                <input
                    type="text"
                    id="simple-search"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search Platform Users..."
                    required
                    onChange={(e)=>{console.log(setSearch(e.target.value))}}
                />
            </div>

        </form>
    );
};


const ShowUser = ({alluser,currentuser,friendRequest,logined,searched}) => {



  if(searched && searched.length){
    return( <div>

      {
              searched.map((user,index) => ( user.username !=currentuser &&
                <div key={index} className='flex items-center justify-around p-1 border border-black m-1 rounded'>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 m-1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
      
                 <p className="font-serif">{user.username}</p>
      
                 {
                  !user.friendRequest.includes(currentuser) && !logined.friendRequest.includes(user.username) &&
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" onClick={()=>{friendRequest({user})}}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                 }




      
                </div>
              ))
            }
      
      </div>)
  }else{

  

return( <div >

{
        alluser.map((user,index) => ( user.username !=currentuser &&
          <div key={index} className='flex items-center justify-around p-1 border border-black m-1 rounded'>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 m-1">
  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>

           <p className="font-serif">{user.username}</p>

           {
            !user.friendRequest.includes(currentuser) && !logined.friendRequest.includes(user.username) &&
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" onClick={()=>{friendRequest({user})}}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
           }



          </div>
        ))
      }

</div>)

}}

const ShowRequest = ({user,acceptRequest}) => {

const requestArray = user.friendRequest;
// console.log("request array",requestArray)

if(requestArray && requestArray.length != 0){
return <div>
<h1 className='flex justify-center font-mono mt-2'>Friend Requests</h1>
  {
    requestArray.map((userName,index) => ( 
      <div key={index} className='flex items-center justify-around p-1 border border-black m-1 rounded'>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 m-1">
  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>

           <p className="font-serif">{userName}</p>

           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" onClick={()=>{acceptRequest(userName)}}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
</svg>





          </div>

    ))
  }

</div>
}else{
  return <div>

<h1 className='flex justify-center font-mono mt-2'>Friend Requests</h1>
<div className='flex justify-center font-serif mt-2'>
No Requests!!
</div>
  
  </div>
}



}