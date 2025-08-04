"use client";
import { useState } from "react";

export default function LockButton() {
  const [show, setShow] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function doLock() {
    setLoading(true);
    const res = await fetch("/api/lock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locked: true, password: pw }),
    });
    setLoading(false);

    if (res.ok) window.location.reload();
    else {
      const { message } = await res.json();
      setErr(message);
    }
  }

  return (
    <div className="fixed bottom-4 right-4">
      {!show ? (
        <button
          onClick={() => setShow(true)}
          className="bg-red-600 text-white px-3 py-2 rounded"
        >
          Lock Site
        </button>
      ) : (
        <div className="bg-white text-black p-4 rounded shadow w-64">
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />
          {err && <p className="text-red-600 text-sm">{err}</p>}
          <button
            disabled={loading}
            onClick={doLock}
            className="w-full bg-red-600 text-white py-2 rounded"
          >
            {loading ? "Locking…" : "Confirm Lock"}
          </button>
          <button
            onClick={() => setShow(false)}
            className="mt-2 text-xs text-gray-500 underline"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
