import { useState } from "react";
import "./App.css";

function App() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    setErrorMsg("");
    setResultUrl("");

    if (!content.trim()) {
      setErrorMsg("Content is required");
      return;
    }

    try {
      const response = await fetch(
        "https://pastebin-backend-cjd9.onrender.com/api/pastes",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content,
            ttl_seconds: ttl ? Number(ttl) : undefined,
            max_views: maxViews ? Number(maxViews) : undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || "Something went wrong");
        return;
      }

      setResultUrl(data.url);
      setContent("");
      setTtl("");
      setMaxViews("");
    } catch {
      setErrorMsg("Failed to connect to backend");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">Pastebin Lite</h1>
        <p className="subtitle">
          Create temporary text pastes with expiry and view limits
        </p>

        <textarea
          rows="6"
          placeholder="Enter your paste content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="row">
          <input
            type="number"
            placeholder="TTL (seconds)"
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max views"
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value)}
          />
        </div>

        <button onClick={handleSubmit}>Create Paste</button>

        {errorMsg && <p className="error">{errorMsg}</p>}

        {resultUrl && (
          <div className="result">
            <span>Paste created:</span>
            <a href={resultUrl} target="_blank" rel="noreferrer">
              {resultUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
