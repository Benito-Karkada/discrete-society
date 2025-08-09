"use client";
import { useState } from "react";

export default function ComingSoon() {
  const [phone, setPhone] = useState("");
  const [signed, setSigned] = useState(false);
  const [unlock, setUnlock] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function subscribe() {
    const num = `+1${phone.replace(/\D/g, "")}`;
    await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: num }),
    });
    setSigned(true);
  }

  async function doUnlock() {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/lock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locked: false, password: pw }),
      });
      setLoading(false);

      if (res.ok) {
        // Full network request with cache-busting param
        window.location.assign("/?ts=" + Date.now());
      } else {
        const data = await res.json();
        setErr(data.message || "Incorrect password");
      }
    } catch (e) {
      console.error("Unlock network error", e);
      setErr("Network error");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-white text-black p-8 rounded shadow max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold mb-4">COMING SOON</h1>

        {!signed ? (
          <>
            <div className="flex mb-4 border rounded overflow-hidden">
              <span className="bg-gray-200 px-3 py-2">+1</span>
              <input
                className="flex-1 p-2"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <button
              onClick={subscribe}
              className="w-full bg-black text-white py-2 rounded mb-2"
            >
              Sign Up
            </button>
          </>
        ) : (
          <p className="text-green-600 mb-4">You're signed up!</p>
        )}

        {!unlock ? (
          <button
            onClick={() => setUnlock(true)}
            className="text-xs text-gray-500 underline"
          >
            Admin Login
          </button>
        ) : (
          <>
            <input
              type="password"
              placeholder="Password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="w-full border p-2 mb-2 rounded"
            />
            {err && <p className="text-red-600 text-sm mb-2">{err}</p>}
            <button
              disabled={loading}
              onClick={doUnlock}
              className="w-full bg-black text-white py-2 rounded"
            >
              {loading ? "Unlocking…" : "Unlock"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
