"use client";

import { useState } from "react";
import { api } from "../../services/api";

export default function RegisterPage(){

  const [form,setForm]=useState({
    name:"",
    email:"",
    password:"",
    role:"STUDENT"
  });

  const register=async(e)=>{
    e.preventDefault();
    await api("/api/auth/register","POST",form);
    alert("Registered successfully");
  };

  return(
    <form
      onSubmit={register}
      className="max-w-md mx-auto mt-20 bg-white p-8 shadow"
    >

      <input placeholder="Name" onChange={(e)=>setForm({...form,name:e.target.value})} />

      <input placeholder="Email" onChange={(e)=>setForm({...form,email:e.target.value})} />

      <input type="password" placeholder="Password" onChange={(e)=>setForm({...form,password:e.target.value})} />

      <select onChange={(e)=>setForm({...form,role:e.target.value})}>
        <option value="STUDENT">Student</option>
        <option value="TEACHER">Teacher</option>
      </select>

      <button className="bg-indigo-600 text-white p-2 mt-4">
        Register
      </button>

    </form>
  );
}