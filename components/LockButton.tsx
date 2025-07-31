"use client";
import { useState, useEffect } from "react";

export default function LockButton() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locked, setLocked] = useState<boolean | null>(null);

  // Fetch current lock state to decide what to show
  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => setLocked(data.locked))
      .catch(() => setLocked(false));
  }, []);

  async function handleLock() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/lock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locked: true, password }),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to lock site");
      }
    } catch (err) {
      console.error("LockButton error:", err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  }

  if (locked === null) return null; // wait until we know the state
  if (locked) return null; // don't show anything if the site is locked

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!showPrompt ? (
        <button
          onClick={() => setShowPrompt(true)}
          className="bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-800"
        >
          🔒 Lock
        </button>
      ) : (
        <div className="bg-white text-black p-4 rounded shadow w-64">
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 mb-2 rounded"
          />
          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
          <button
            onClick={handleLock}
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Lock Site
          </button>
          <button
            onClick={() => setShowPrompt(false)}
            className="mt-2 text-xs text-gray-500 hover:text-gray-800 underline"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
