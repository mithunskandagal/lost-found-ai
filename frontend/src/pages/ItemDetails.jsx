import React from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";

export default function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const user = JSON.parse(localStorage.getItem("lf_user") || "null");

  useEffect(() => {
    api.get(`/items/${id}`).then(r => setItem(r.data)).catch(() => {});
  }, [id]);

  async function findMatches() {
    if (!user) return alert("Login first.");
    setLoadingMatches(true);
    try {
      const {data} = await api.get(`/items/${id}/matches`);
      setMatches(data);
    } catch (e) {
      alert(e.response?.data?.message || "Could not find matches");
    } finally { setLoadingMatches(false); }
  }

  async function claim() {
    if (!user) return alert("Login first.");
    const message = prompt("Why do you believe this item belongs to you?");
    if (message === null) return;
    try {
      await api.post(`/items/${id}/claim`, {message});
      alert("Claim submitted successfully.");
    } catch (e) {
      alert(e.response?.data?.message || "Claim failed");
    }
  }

  if (!item) return <div className="empty">Loading item...</div>;

  return <div className="detailsPage">
    <Link to="/" className="back">← Back to reports</Link>
    <div className="detailGrid">
      <div className="detailImage">
        {item.imageUrl ? <img src={`http://localhost:5000${item.imageUrl}`} alt={item.title}/> : "📦"}
      </div>
      <div className="detailInfo">
        <span className={item.type==="lost"?"badge lost":"badge found"}>{item.type}</span>
        <h1>{item.title}</h1>
        <p className="large">{item.description}</p>
        <div className="detailList">
          <div><b>Category</b><span>{item.category}</span></div>
          <div><b>Color</b><span>{item.color || "Not specified"}</span></div>
          <div><b>Brand</b><span>{item.brand || "Not specified"}</span></div>
          <div><b>Location</b><span>{item.location}</span></div>
          <div><b>Date</b><span>{new Date(item.date).toLocaleDateString()}</span></div>
        </div>
        {item.aiSummary && <div className="aiBox"><b>✨ AI summary</b><p>{item.aiSummary}</p></div>}
        <div className="actions">
          <button className="primary" onClick={findMatches}>{loadingMatches ? "AI is matching..." : "✨ Find AI matches"}</button>
          <button className="secondary" onClick={claim}>Claim this item</button>
        </div>
      </div>
    </div>

    {matches.length > 0 && <section className="matches">
      <h2>Possible matches</h2>
      <p>AI-ranked suggestions. A high score is a lead, not proof of ownership.</p>
      <div className="grid">
        {matches.map(m => <Link className="itemCard" to={`/items/${m._id}`} key={m._id}>
          {m.imageUrl ? <img src={`http://localhost:5000${m.imageUrl}`} alt={m.title}/> : <div className="imagePlaceholder">📦</div>}
          <div className="cardBody">
            <div className="score">{m.matchScore}% match</div>
            <h3>{m.title}</h3>
            <p>{m.matchReason}</p>
            <div className="meta">{m.location}</div>
          </div>
        </Link>)}
      </div>
    </section>}
  </div>;
}
