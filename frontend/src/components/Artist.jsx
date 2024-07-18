import UploadForm from "./Upload";
import React from "react";

import { useNavigate } from "react-router-dom";

export default function Artist () {
  const navigate = useNavigate();
    return (
      <div className="h-screen bg-slate-400">
        <Navbar navigate={navigate}/>
        <div className="flex justify-center items-center flex-col mt-10">
          <i className="">UPLOAD YOUR MUSIC HERE</i><br></br>
          <p >* Music name should contain the name which should be displayed </p>
          <p >* file name should contain the real file name other wise it will not be visible </p>
          <p className="mb-10">* if Uploaded and it's not visible then please contact to the app holder </p>
        <UploadForm />
        </div>
     
      </div>
    );
  };




  const Navbar = ({navigate})=>{


    return <div>
<nav className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
     
      <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Creator Mode</span>
    </a>
    <button
      data-collapse-toggle="navbar-dropdown"
      type="button"
      className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      aria-controls="navbar-dropdown"
      aria-expanded="false"
    >
      <span className="sr-only">Open main menu</span>
      <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M1 1h15M1 7h15M1 13h15"
        />
      </svg>
    </button>
    <div className="hidden w-full md:block md:w-auto" id="navbar-dropdown">
      <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
        <li>
          <a href="#" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent" aria-current="page" onClick={()=>{navigate("/home")}}>
            Home
          </a>
        </li>
        <li>
          <a href="#" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent" aria-current="page" onClick={()=>{navigate("/playlist")}}>
            Playlist
          </a>
        </li>
        <li>
          <a href="#" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent" aria-current="page" onClick={()=>{
            localStorage.removeItem("username")
            navigate("/")}}>
           Sign Out
          </a>
        </li>
        </ul>
    </div>
  </div>
</nav>


    </div>
  }