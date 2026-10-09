import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const { data } = await api.post("/api/auth/register", form);
      localStorage.setItem("lf_token", data.token);
      localStorage.setItem("lf_user", JSON.stringify(data.user));
      navigate("/");
      window.location.reload();
    } catch (e) {
      alert(e.response?.data?.message || "Registration failed");
    }
  }

  return <div className="authPage"><div className="authCard">
    <div className="eyebrow">✨ Join the community</div>
    <h1>Create account</h1><p>Help recover items in your campus/community.</p>
    <form onSubmit={submit}>
      <label>Name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
      <label>Email<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>
      <label>Password<input type="password" minLength="6" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>
      <button className="primary full">Create account</button>
    </form>
    <p className="center">Already registered? <Link to="/login">Login</Link></p>
  </div></div>;
}
