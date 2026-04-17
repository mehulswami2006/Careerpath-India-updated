"use client";

import AuthForm from "../../components/AuthForm";
import { apiRequest } from "../../services/api";

export default function RegisterPage() {

  const handleRegister = async (data) => {

    try {

      await apiRequest("/api/auth/register", "POST", data);

      alert("Registration successful");

    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <AuthForm
      buttonText="Register"
      onSubmit={handleRegister}
      fields={[
        { name: "name", type: "text", placeholder: "Name" },
        { name: "email", type: "email", placeholder: "Email" },
        { name: "password", type: "password", placeholder: "Password" },
      ]}
    />
  );
}
