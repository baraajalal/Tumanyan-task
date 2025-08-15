"use client";

import { useState, useEffect } from "react";

type Podcast = {
  id: number;
  itunesId: number;
  title: string;
  author?: string | null;
  feedUrl?: string | null;
  artworkUrl?: string | null;
};

type SearchResponse = {
  query: string;
  count: number;
  items: Podcast[];
};

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Debounce للبحث بعد 400ms
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setError("");
      return;
    }

    const timeout = setTimeout(() => {
      handleSearch();
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSearch = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:4000/search?term=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: SearchResponse = await res.json();

      if (Array.isArray(data.items) && data.items.length > 0) {
        setResults(data.items);
      } else {
        setResults([]);
        setError("لا توجد نتائج");
      }
    } catch (err) {
      setError("حدث خطأ أثناء البحث. تأكد أن الـ API يعمل.");
      setResults([]);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        fontFamily: "'IBMPlexSansArabic', sans-serif",
        background: "linear-gradient(135deg, #f9fafb, #e0f2fe)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: 20,
      }}
    >
      <h2 style={{ marginBottom: 15, color: "#1e40af", fontSize: 24 }}>بحث بودكاست</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input
          type="text"
          value={query}
          placeholder="أدخل كلمة البحث"
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #93c5fd",
            fontSize: 14,
            width: 250,
          }}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{
            padding: "8px 14px",
            backgroundColor: "#1e40af",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          {loading ? "جاري البحث..." : "بحث"}
        </button>
      </div>

      {error && <p style={{ color: "red", marginBottom: 20, fontSize: 14 }}>{error}</p>}

      <ul style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", width: "100%" }}>
        {results.map((p) => (
          <li
            key={p.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: 10,
              borderRadius: 10,
              background: "#fef3c7",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer",
              width: 300,
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget;
              target.style.transform = "scale(1.03)";
              target.style.boxShadow = "0 4px 16px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget;
              target.style.transform = "scale(1)";
              target.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
            }}
          >
            {p.artworkUrl && (
              <img
                src={p.artworkUrl}
                alt={p.title}
                style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover" }}
              />
            )}
            <div style={{ flex: 1, fontSize: 12 }}>
              <strong style={{ display: "block", color: "#1e3a8a" }}>{p.title}</strong>
              <span style={{ color: "#374151" }}>{p.author ?? "—"}</span>
              {p.feedUrl && (
                <div>
                  <a
                    href={p.feedUrl}
                    target="_blank"
                    style={{ color: "#2563eb", textDecoration: "none", fontSize: 12 }}
                  >
                    رابط RSS
                  </a>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
