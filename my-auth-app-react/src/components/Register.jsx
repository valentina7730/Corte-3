import React, { useState, useEffect } from "react";

const API_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3001").replace(/\/$/, "");

const Register = ({ onBack = () => {} }) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    documentNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Carga inicial "fake" al montar el componente (opcional)
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
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
      const endpoint = `${API_URL}/auth/register`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // Intentamos leer el body como JSON, pero sin reventar si viene HTML (404, etc.)
      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        let errText = res.statusText || `HTTP ${res.status}`;
        if (data && (data.error || data.message)) {
          errText = data.error || data.message;
        }
        setMessage(
          `Error al hacer proceso de registro de nuevo usuario, error: ${errText}`
        );
        return;
      }

      // Intentar leer el token con los nombres posibles
      const token = data?.token || data?.tokenJWT;

      if (!token) {
        setMessage(
          "Error al hacer proceso de registro de nuevo usuario, error: token no recibido"
        );
        return;
      }

      // Guardar token opcionalmente
      try {
        localStorage.setItem("token", token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch {
        // Si localStorage falla, no rompemos el flujo
      }

      // Mensaje EXACTO que pide el enunciado
      setMessage(
        `Usuario registrado correctamente, el token generado es ${token}`
      );

      // Limpiar formulario
      setForm({
        username: "",
        email: "",
        password: "",
        documentNumber: "",
      });
    } catch (err) {
      setMessage(
        `Error al hacer proceso de registro de nuevo usuario, error: ${
          err.message || err
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          <p className="text-gray-700 font-semibold text-lg">
            Cargando, por favor espera...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl shadow-gray-400 p-6">
        <button
          onClick={onBack}
          className="mb-3 text-blue-600 hover:underline text-sm"
        >
          ← Volver
        </button>

        <h2 className="text-2xl font-semibold mb-4">Crear cuenta</h2>

        {message && (
          <div className="mb-4 p-3 rounded text-sm bg-gray-100">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre de usuario
            </label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded border-gray-200 shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded border-gray-200 shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="mt-1 block w-full rounded border-gray-200 shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Documento (opcional)
            </label>
            <input
              name="documentNumber"
              value={form.documentNumber}
              onChange={handleChange}
              className="mt-1 block w-full rounded border-gray-200 shadow-sm p-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Registrando..." : "Crear cuenta"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
