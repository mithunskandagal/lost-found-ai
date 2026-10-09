import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function ReportItem() {
  const user = JSON.parse(localStorage.getItem("lf_user") || "null");
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: "lost", title: "", description: "", category: "Other",
    color: "", brand: "", location: "", date: new Date().toISOString().slice(0,10)
  });
  const [image, setImage] = useState(null);
  const [busy, setBusy] = useState(false);

  if (!user) return <div className="empty">Please login before reporting an item.</div>;

  function update(k, v) { setForm(f => ({...f, [k]: v})); }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    const data = new FormData();
    Object.entries(form).forEach(([k,v]) => data.append(k,v));
    if (image) data.append("image", image);

    try {
      const res = await api.post("/api/items", data, { headers: {"Content-Type": "multipart/form-data"} });
      navigate(`/items/${res.data._id}`);
    } catch (e) {
      alert(e.response?.data?.message || "Could not create report");
    } finally {
      setBusy(false);
    }
  }

  return <div className="formPage">
    <div className="formIntro"><div className="eyebrow">📌 New report</div><h1>Report an item</h1><p>Give as much detail as possible. Give as much detail as possible to help find potential matches.</p></div>
    <form className="formCard" onSubmit={submit}>
      <div className="segmented">
        <button type="button" className={form.type==="lost"?"selected":""} onClick={()=>update("type","lost")}>I lost an item</button>
        <button type="button" className={form.type==="found"?"selected":""} onClick={()=>update("type","found")}>I found an item</button>
      </div>
      <div className="two">
        <label>Title<input required placeholder="e.g. Black Samsung phone" value={form.title} onChange={e=>update("title",e.target.value)}/></label>
        <label>Category<select value={form.category} onChange={e=>update("category",e.target.value)}>
          {["Other","Mobile Phone","Wallet","Bag","ID Card","Keys","Laptop","Books","Clothing","Electronics"].map(x=><option key={x}>{x}</option>)}
        </select></label>
      </div>
      <label>Description<textarea required rows="5" placeholder="Describe unique marks, stickers, model, case, contents, etc." value={form.description} onChange={e=>update("description",e.target.value)}/></label>
      <div className="three">
        <label>Color<input value={form.color} onChange={e=>update("color",e.target.value)}/></label>
        <label>Brand<input value={form.brand} onChange={e=>update("brand",e.target.value)}/></label>
        <label>Date<input type="date" required value={form.date} onChange={e=>update("date",e.target.value)}/></label>
      </div>
      <label>Location<input required placeholder="Where was it lost/found?" value={form.location} onChange={e=>update("location",e.target.value)}/></label>
      <label>Photo<input type="file" accept="image/*" onChange={e=>setImage(e.target.files?.[0] || null)}/></label>
      <button className="primary full" disabled={busy}>{busy ? "Processing..." : "Submit report"}</button>
    </form>
  </div>;
}
