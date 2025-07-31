"use client";

import { useState } from "react";

export default function ComingSoon() {
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [submitted, setSubmitted] = useState(false);

  async function handleSignup() {
    const fullNumber = phone.startsWith("+") ? phone : `${countryCode}${phone}`;
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullNumber }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to subscribe:", err);
    }
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">Something Big Is Coming</h1>
      <p className="mb-6 text-gray-400">Join the SMS list to get first access.</p>

      {!submitted ? (
        <div className="bg-white text-black p-6 rounded max-w-sm w-full">
          <div className="flex gap-2 mb-3">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-24 p-2 border rounded"
            >
              <option value="+1">+1</option>
              <option value="+44">+44</option>
              <option value="+91">+91</option>
            </select>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className="flex-1 p-2 border rounded"
            />
          </div>
          <button
            onClick={handleSignup}
            className="w-full bg-black text-white py-2 rounded"
          >
            Join SMS List
          </button>
        </div>
      ) : (
        <p className="text-green-400 font-semibold mt-4">
          You're on the list. Stay tuned.
        </p>
      )}
    </div>
  );
}
