
"use client";

import { useState } from "react";
import "./globals.css";

export default function Home() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState(
    "Backend: http://127.0.0.1:8000"
  );
  const [loading, setLoading] = useState(false);

  const examples = [
    { label: "Greeting", message: "Hi, good morning!" },
    { label: "Order tracking", message: "Where is my order?" },
    {
      label: "Payment issue",
      message: "My payment was deducted twice. Please help urgently.",
    },
    { label: "Current time", message: "What time is it now?" },
  ];

  async function analyzeMessage() {
    if (!message.trim()) {
      setStatus("Please enter a message first.");
      return;
    }

    setLoading(true);
    setStatus("Sending message to the backend...");
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      setResult(data);

      if (!response.ok) {
        setStatus(`Request failed (${response.status}).`);
      } else {
        setStatus("Success — response passed the Pydantic schema.");
      }
    } catch {
      setStatus("Could not connect. Check that FastAPI is running.");
    } finally {
      setLoading(false);
    }
  }

  async function copyJSON() {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(result, null, 2)
      );
      setStatus("JSON copied to clipboard.");
    } catch {
      setStatus("Could not copy JSON.");
    }
  }

  return (
    <main className="page">
      <header className="hero">
        <div className="eyebrow">
          AI · STRUCTURED DATA · VALIDATION
        </div>

        <h1>AI Project Enterprise Ingestion Firewall</h1>

        <p>
          Enter any message. The AI classifies its intent and
          returns data validated against a Pydantic schema.
        </p>
      </header>

      <section className="panel">
        <label htmlFor="message">Your message</label>

        <textarea
          id="message"
          rows={5}
          maxLength={5000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={"Try: Hi there!\nOr: Where is my order?\nOr: My payment was deducted twice."}
        />

        <div className="examples">
          {examples.map((item) => (
            <button
              type="button"
              className="example"
              key={item.label}
              onClick={() => setMessage(item.message)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          className="primary"
          onClick={analyzeMessage}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze message"}
          <span>→</span>
        </button>

        <p className="status">{status}</p>
      </section>

      <section className="panel result-panel">
        <div className="result-heading">
          <div>
            <div className="eyebrow">RESPONSE</div>
            <h2>Validated JSON</h2>
          </div>

          <button
            className="secondary"
            onClick={copyJSON}
            disabled={!result}
          >
            Copy JSON
          </button>
        </div>

        <pre>
          <code>
            {result
              ? JSON.stringify(result, null, 2)
              : "Your structured result will appear here."}
          </code>
        </pre>

        <p className="footnote">
          This demo classifies messages only. It does not
          actually retrieve orders or the current time.
          Token counts are estimates, not billing records.
        </p>
      </section>

      <footer>
        Built with FastAPI · Groq · Instructor · Pydantic
      </footer>
    </main>
  );
}
