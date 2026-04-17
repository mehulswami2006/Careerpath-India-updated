"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../services/api";
import { setToken } from "../../lib/auth";

export default function LoginPage() {

  const router = useRouter();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleLogin = async(e) => {

    e.preventDefault();

    try{

      const data = await api("/api/auth/login","POST",{
        email,
        password
      });

      setToken(data.token);

      router.push("/student-dashboard");

    }catch(err){

      alert("Login failed");

    }
  };

  return (

    <div className="flex justify-center items-center h-screen">

      <form onSubmit={handleLogin} className="bg-white p-8 shadow rounded">

        <h2 className="text-2xl mb-4">Login</h2>

        <input
          className="border p-2 mb-3 w-full"
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 mb-3 w-full"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Login
        </button>

      </form>

    </div>
  );
}