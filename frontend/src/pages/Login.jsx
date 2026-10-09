import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const { data } = await api.post("/api/auth/login", form);
      localStorage.setItem("lf_token", data.token);
      localStorage.setItem("lf_user", JSON.stringify(data.user));
      navigate("/");
      window.location.reload();
    } catch (e) {
      alert(e.response?.data?.message || "Login failed");
    }
  }

  return <AuthCard title="Welcome back" subtitle="Login to manage your reports.">
    <form onSubmit={submit}>
      <label>Email<input type="email" required value={form.email} onChange={e => setForm({...form,email:e.target.value})}/></label>
      <label>Password<input type="password" required value={form.password} onChange={e => setForm({...form,password:e.target.value})}/></label>
      <button className="primary full">Login</button>
    </form>
    <p className="center">New user? <Link to="/register">Create an account</Link></p>
  </AuthCard>;
}

function AuthCard({title, subtitle, children}) {
  return <div className="authPage"><div className="authCard"><div className="eyebrow">🔐 Account</div><h1>{title}</h1><p>{subtitle}</p>{children}</div></div>;
}
