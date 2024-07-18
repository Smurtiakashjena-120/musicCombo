import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignUP() {
    const Username=useRef();
    const Password=useRef();
    const navigate = useNavigate();

    async function signUp(event){
        event.preventDefault();
        try {
            console.log(Username.current.value,Password.current.value)
            const response = await axios.post('http://localhost:3000/delta/user/signup', {
                username: Username.current.value,
                password: Password.current.value,
            });
            console.log(response.data);
            localStorage.setItem("username",Username.current.value)
            toast.info("sucessfully Created an Account! !!",{
              onClose:()=>{
                navigate('/home')  ;
              }
            })
           
    
    
        } catch (error) {
            console.error('Error:', error);
            toast.info("Invalid Credentials !!")        }
    }
    





  return (
  <div className="bg-gray-900 h-full w-full">
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
          Music
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create New Account
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input ref={Username} type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Akash" required />
              </div>
              <div>
                <label  htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input ref={Password} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
              </div>
              <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" onClick={signUp}>Sign Up</button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account yet? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500" onClick={()=>{navigate("/")}}>Sign in</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
    <ToastContainer position="top-center"/>
    </div>
  );
}

export default SignUP;
