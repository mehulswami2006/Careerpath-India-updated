"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import CareerCard from "../../components/career-card";

export default function CareersPage() {

  const [careers, setCareers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {

    apiRequest("/api/careers")
      .then(data => setCareers(data));

  }, []);

  const filtered = careers.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Explore Careers
      </h1>

      <input
        type="text"
        placeholder="Search careers..."
        className="border p-2 mb-6 w-full rounded"
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid md:grid-cols-3 gap-4">

        {filtered.map((career, index) => (
          <CareerCard key={index} career={career} />
        ))}

      </div>

    </div>
  );
}
