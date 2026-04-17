"use client";

import { useState } from "react";

export default function AuthForm({ fields, onSubmit, buttonText }) {

  const [form, setForm] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 shadow rounded space-y-4"
    >

      {fields.map((field) => (

        <input
          key={field.name}
          name={field.name}
          type={field.type}
          placeholder={field.placeholder}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

      ))}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        {buttonText}
      </button>

    </form>
  );
}
