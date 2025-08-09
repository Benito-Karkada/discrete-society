"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function LockButton() {
  const pathname = usePathname();
  if (pathname === "/coming-soon") return null; // hide on lock page

  const [show, setShow] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function doLock() {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/lock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locked: true, password: pw }),
      });
      setLoading(false);

      if (res.ok) {
        // Force fresh request through middleware
        window.location.href = "/?t=" + Date.now();
      } else {
        const data = await res.json();
        setErr(data.message || "Lock failed");
      }
    } catch (e) {
      console.error("Lock network error", e);
      setErr("Network error");
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4">
      {!show ? (
        <button
          onClick={() => setShow(true)}
          className="bg-red-600 text-white px-3 py-2 rounded shadow"
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
            className="w-full border p-2 mb-2 rounded"
          />
          {err && <p className="text-red-600 text-sm mb-2">{err}</p>}
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
