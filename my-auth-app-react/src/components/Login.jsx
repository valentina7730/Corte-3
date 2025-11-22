import React, { useState } from "react";
import { useEffect } from "react";

const Login = ({ onBack }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);


   // Simula una carga inicial al montar el componente
     useEffect(() => {
      setLoading(true);
      const timer = setTimeout(() => {
          setLoading(false);
      }, 1500);
  
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
      // peticion al servidor
      await new Promise((res) => setTimeout(res, 1000));

      setMessage({ type: "success", text: "Inicio de sesión exitoso" });
    } catch (err) {
      setMessage({ type: "error", text: "Error al iniciar sesión" });
    } finally {
      setLoading(false);
    }
  };


   if (loading) {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        <p className="text-gray-700 font-semibold text-lg">Cargando, por favor espera...</p>
      </div>
    </div>
  );
}

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-xl shadow-gray-400 p-6">

        {/* Botón para volver */}
        <button
          onClick={onBack}
          className="text-blue-600 underline text-sm mb-4"
        >
          ← Volver
        </button>

        <h2 className="text-2xl font-semibold mb-4">Iniciar sesión</h2>

        {message && (
          <div
            className={`mb-4 p-3 rounded text-sm ${
              message.type === "error"
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">

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
              className="mt-1 block w-full rounded border-gray-200 shadow-sm p-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
