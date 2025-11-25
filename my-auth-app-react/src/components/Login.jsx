
import React, { useState, useEffect } from "react";

const getRuntimeEnv = () => {
 
  try {
    const env = new Function('try { return import.meta.env } catch (e) { return undefined }')();
    if (env) {
      return env;
    }
  } catch {
    // ignore 
  }
  if (typeof globalThis !== "undefined" && globalThis.process && globalThis.process.env) {
    return globalThis.process.env;
  }
  return {};
};

const API_URL = (getRuntimeEnv().VITE_API_URL || getRuntimeEnv().REACT_APP_API_URL) || "http://localhost:3001";

const Login = ({ onBack = () => {} }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      if (!res.ok) {
        // intenta leer mensaje de error del body si existe
        let errText = res.statusText || `HTTP ${res.status}`;
        try {
          const errBody = await res.json();
          if (errBody && (errBody.error || errBody.message)) {
            errText = errBody.error || errBody.message;
          }
        } catch {
          // Si ocurre un error al leer el body, continuar con el mensaje por defecto
        }
        setMessage(`Error al hacer proceso de login, error: ${errText}`);
        return;
      }

      const data = await res.json();
      if (data && data.token) {
        // muestra exactamente el mensaje solicitado
        setMessage(`Usuario logueado, el token generado es ${data.token}`);
       
        localStorage.setItem("token", data.token);
        if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        setMessage("Error al hacer proceso de login, error: token no recibido");
      }
    } catch (err) {
      setMessage(`Error al hacer proceso de login, error: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600" />
          <p className="text-gray-700 font-semibold">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow p-6">
        <button onClick={onBack} className="text-blue-600 underline text-sm mb-4">
          ← Volver
        </button>

        <h2 className="text-2xl font-semibold mb-4">Iniciar sesión</h2>

        {message && (
          <div className="mb-4 p-3 rounded text-sm bg-gray-100">{message}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded border-gray-200 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded border-gray-200 p-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
