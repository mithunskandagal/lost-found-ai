import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, CalendarDays, Sparkles } from "lucide-react";
import api from "../api";

export default function Home() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/items", { params: { search, type } });
      setItems(data);
    } catch (e) {
      alert(e.response?.data?.message || "Could not load items");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [type]);

  return (
    <div className="page">
      <section className="hero">
        <div>
          <div className="eyebrow"><Sparkles size={16}/> AI-powered recovery</div>
          <h1>Find what you lost.<br/><span>Return what you found.</span></h1>
          <p>Report lost and found items, search the community database, and let AI identify possible matches.</p>
          <Link to="/report" className="primary">+ Report an item</Link>
        </div>
        <div className="heroCard">
          <div className="scanCircle">🔍</div>
          <b>Smart matching</b>
          <small>AI compares descriptions, categories, colors, brands, locations and dates.</small>
        </div>
      </section>

      <section className="toolbar">
        <div className="searchBox">
          <Search size={20}/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && load()}
            placeholder="Search phone, wallet, ID card, bag..." />
          <button onClick={load}>Search</button>
        </div>
        <div className="chips">
          <button className={!type ? "chip active" : "chip"} onClick={() => setType("")}>All</button>
          <button className={type === "lost" ? "chip active" : "chip"} onClick={() => setType("lost")}>Lost</button>
          <button className={type === "found" ? "chip active" : "chip"} onClick={() => setType("found")}>Found</button>
        </div>
      </section>

      <section>
        <div className="sectionTitle">
          <div><h2>Recent reports</h2><p>{items.length} active reports</p></div>
        </div>

        {loading ? <div className="empty">Loading...</div> : (
          <div className="grid">
            {items.map(item => (
              <Link className="itemCard" to={`/items/${item._id}`} key={item._id}>
                {item.imageUrl ? (
                  <img src={`http://localhost:5000${item.imageUrl}`} alt={item.title}/>
                ) : <div className="imagePlaceholder">📦</div>}
                <div className="cardBody">
                  <span className={item.type === "lost" ? "badge lost" : "badge found"}>{item.type}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="meta"><MapPin size={15}/>{item.location}</div>
                  <div className="meta"><CalendarDays size={15}/>{new Date(item.date).toLocaleDateString()}</div>
                  {item.aiTags?.length > 0 && (
                    <div className="tags">{item.aiTags.slice(0,4).map(t => <span key={t}>#{t}</span>)}</div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
        {!loading && items.length === 0 && <div className="empty">No matching reports found.</div>}
      </section>
    </div>
  );
}
