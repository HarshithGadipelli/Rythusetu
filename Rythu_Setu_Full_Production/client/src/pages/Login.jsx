import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import VoiceInput from "../components/VoiceInput";

const Field = ({ label, value, onChange, type = "text", voice = true }) => (
  <label className="field">
    <span>{label}</span>
    <div className="field-row">
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
      {voice && <VoiceInput onResult={onChange} />}
    </div>
  </label>
);

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user.role;
      if (role === "admin") navigate("/admin");
      else if (role === "farmer") navigate("/farmer");
      else navigate("/market");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="page narrow">
      <div className="card">
        <h2>Login</h2>
        <form onSubmit={submit} className="form">
          <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Field label="Password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
          <button className="btn btn-primary" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
