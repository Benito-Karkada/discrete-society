"use client";
import { useState } from "react";

export default function LockButton() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLock() {
    const res = await fetch("/api/lock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locked: true, password }),
    });

    if (res.ok) {
      window.location.reload();
    } else {
      setError("Incorrect password.");
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!showPrompt ? (
        <button
          onClick={() => setShowPrompt(true)}
          className="bg-black text-white px-3 py-2 rounded border border-gray-700 hover:bg-gray-800 transition"
        >
          Lock Site
        </button>
      ) : (
        <div className="bg-white text-black p-4 rounded shadow-lg flex flex-col gap-2">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="p-2 border rounded"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            onClick={handleLock}
            className="bg-black text-white py-1 rounded hover:bg-gray-800"
          >
            Confirm Lock
          </button>
          <button
            onClick={() => setShowPrompt(false)}
            className="text-xs text-gray-500 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
