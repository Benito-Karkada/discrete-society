"use client";

import { useState } from "react";

export default function LockButton() {
  const [show, setShow] = useState(false);
  const [adminPass, setAdminPass] = useState("");

  async function handleLock() {
    const res = await fetch("/api/lock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locked: true, password: adminPass }),
    });
    if (res.ok) window.location.reload();
  }

  return (
    <div className="fixed bottom-4 right-4">
      {!show && (
        <button
          onClick={() => setShow(true)}
          className="bg-gray-800 text-white px-3 py-2 rounded-full text-sm"
        >
          🔒
        </button>
      )}
      {show && (
        <div className="bg-white text-black p-3 rounded shadow-lg flex flex-col gap-2">
          <input
            type="password"
            value={adminPass}
            onChange={(e) => setAdminPass(e.target.value)}
            placeholder="Password"
            className="p-2 border rounded"
          />
          <button onClick={handleLock} className="bg-red-600 text-white py-1 rounded">
            Lock Site
          </button>
        </div>
      )}
    </div>
  );
}
