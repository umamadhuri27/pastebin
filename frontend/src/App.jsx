import React, { useState } from "react";

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
      const response = await fetch("/api/pastes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          ttl_seconds: ttl ? Number(ttl) : undefined,
          max_views: maxViews ? Number(maxViews) : undefined,
        }),
      });

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
    <div style={{ padding: "20px", maxWidth: "600px", fontFamily: "Arial" }}>
      <h1>Pastebin Lite</h1>

      <textarea
        rows="6"
        placeholder="Enter your paste content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <input
        type="number"
        placeholder="TTL (seconds)"
        value={ttl}
        onChange={(e) => setTtl(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <input
        type="number"
        placeholder="Max views"
        value={maxViews}
        onChange={(e) => setMaxViews(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <button onClick={handleSubmit}>Create Paste</button>

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      {resultUrl && (
        <p>
          Paste created:{" "}
          <a href={resultUrl} target="_blank" rel="noreferrer">
            {resultUrl}
          </a>
        </p>
      )}
    </div>
  );
}

export default App;
