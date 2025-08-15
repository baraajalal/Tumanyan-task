"use client";

import { useState, useEffect } from "react";

type Podcast = {
  id: number;
  title: string;
  author?: string;
  artworkUrl?: string;
  feedUrl?: string;
};

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // البحث أثناء الكتابة (Live Search)
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`http://localhost:4000/search?term=${encodeURIComponent(query)}`);

        const data = await res.json();

        if (Array.isArray(data.items)) {
          setResults(data.items);
        } else {
          setResults([]);
          setError("لا توجد نتائج");
        }
      } catch {
        setError("حدث خطأ أثناء البحث");
      }

      setLoading(false);
    }, 400); // تأخير 400ms لتقليل عدد الاستدعاءات

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 15 }}>بحث بودكاست</h2>
      <div style={{ display: "flex", marginBottom: 20 }}>
        <input
          type="text"
          placeholder="أدخل اسم البودكاست..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading && <p>جاري البحث...</p>}
      {error && <p className="error">{error}</p>}

      <ul>
        {results.map((p) => (
          <li key={p.id}>
            {p.artworkUrl && <img src={p.artworkUrl} alt={p.title} />}
            <div>
              <strong>{p.title}</strong>
              <p>{p.author ?? "—"}</p>
              {p.feedUrl && (
                <a href={p.feedUrl} target="_blank" rel="noreferrer">
                  رابط RSS
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
