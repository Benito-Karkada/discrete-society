"use client";
import { useState } from "react";

export default function ComingSoon() {
  const [phone, setPhone] = useState("");
  const [success, setSuccess] = useState(false);
  const [unlockVisible, setUnlockVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSignup() {
    const fullNumber = `+1${phone.replace(/\D/g, "")}`;
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullNumber }),
      });
      if (res.ok) setSuccess(true);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUnlock() {
    const res = await fetch("/api/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      setError("Incorrect password.");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="bg-white text-black p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
        <h1 className="text-3xl font-bold mb-2">COMING SOON</h1>
        <p className="text-gray-700 mb-6">Sign up to get early access & 10% off</p>

        {!success ? (
          <>
            <div className="flex items-center mb-4 border rounded overflow-hidden">
              <span className="bg-gray-200 px-3 py-2 text-gray-700">+1</span>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className="flex-1 p-2 outline-none"
              />
            </div>
            <button
              onClick={handleSignup}
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
            >
              Sign Up
            </button>
          </>
        ) : (
          <p className="text-green-600 font-semibold">You're signed up!</p>
        )}

        {/* Admin Unlock */}
        <div className="mt-6">
          {!unlockVisible ? (
            <button
              onClick={() => setUnlockVisible(true)}
              className="text-xs text-gray-500 hover:text-gray-800 underline"
            >
              Admin Unlock
            </button>
          ) : (
            <div className="mt-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full p-2 border rounded mb-2"
              />
              {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
              <button
                onClick={handleUnlock}
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
              >
                Unlock
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
