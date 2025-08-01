"use client";
import { useState } from "react";

export default function LockButton() {
  const [showInput, setShowInput] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLock() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/lock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locked: true, password }),
    });

    setLoading(false);

    if (res.ok) {
      window.location.reload();
    } else {
      const data = await res.json();
      setError(data.message || "Failed to lock");
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          className="bg-black text-white px-3 py-2 rounded shadow-lg border border-gray-700 hover:bg-gray-800"
        >
          🔒 Lock Site
        </button>
      ) : (
        <div className="bg-white text-black p-4 rounded shadow-lg w-64">
          <input
            type="password"
            placeholder="Admin password"
            className="w-full border p-2 mb-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
          <button
            onClick={handleLock}
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            {loading ? "Locking..." : "Confirm Lock"}
          </button>
        </div>
      )}
    </div>
  );
}
