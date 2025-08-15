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

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // البحث التلقائي أثناء الكتابة
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      setError("");
      return;
    }

    const timeout = setTimeout(() => {
      handleSearch(query);
    }, 500); // الانتظار نصف ثانية قبل البحث لتقليل الطلبات

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSearch = async (term: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:4000/search?term=${encodeURIComponent(term)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (Array.isArray(data.items)) {
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

  const handleDelete = (id: number) => {
    const filtered = results.filter((item) => item.id !== id);
    setResults(filtered);
    if (filtered.length === 0) setError("");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">بحث بودكاست</h2>

      <input
        type="text"
        value={query}
        placeholder="أدخل كلمة البحث"
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {loading && <p className="text-blue-500 mb-2">جاري البحث...</p>}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {results.map((p) => (
          <li key={p.id} className="border rounded-lg p-4 flex flex-col items-center shadow hover:shadow-lg transition">
            {p.artworkUrl && (
              <img src={p.artworkUrl} alt={p.title} className="w-24 h-24 object-cover mb-2 rounded" />
            )}
            <strong className="text-center">{p.title}</strong>
            <span className="text-gray-500">{p.author ?? "—"}</span>
            {p.feedUrl && (
              <a href={p.feedUrl} target="_blank" rel="noreferrer" className="text-blue-600 mt-2 hover:underline">
                رابط RSS
              </a>
            )}
            <button
              onClick={() => handleDelete(p.id)}
              className="mt-2 text-sm text-red-600 hover:underline"
            >
              حذف
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
