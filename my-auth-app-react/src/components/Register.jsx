import React, { useState } from "react";
import { useEffect } from "react";
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export const Register = () => {
	const [form, setForm] = useState({
		username: "",
		email: "",
		password: "",
		documentNumber: "",
	});
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);

   useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
        setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
}, []); 

    //extrae name y value del evento | actualiza el estado del formulario
	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};


    //construye dinámicamente una URL de endpoint, no duplicar barras / y de que exista  /api/v1.
	const buildEndpoint = () => {
		const base = API_URL.replace(/\/$/, "");
		const prefix = base.endsWith("/api/v1") ? base : `${base}/api/v1`;
		return `${prefix}/auth/register`;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

		try {
			const endpoint = buildEndpoint();
			const res = await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});

			const data = await res.json();
			if (!res.ok) {
				setMessage({ type: "error", text: data.message || "Error al registrar" });
				setLoading(false);
				return;
			}

			// Guardar token opcionalmente
			if (data.token) {
				localStorage.setItem("token", data.token);
			} else if (data.tokenJWT) {
				localStorage.setItem("token", data.tokenJWT);
			}

			setMessage({ type: "success", text: data.message || "Registro exitoso" });
			setForm({ username: "", email: "", password: "", documentNumber: "" });
		} catch (err) {
			console.error(err);
			setMessage({ type: "error", text: "Error de conexión" });
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


		<div className=" flex items-center justify-center h-screen bg-gray-100">

			<div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
				<h2 className="text-2xl font-semibold mb-4">Crear cuenta</h2>

				{message && (
					<div
						className={`mb-4 p-3 rounded text-sm ${message.type === "error" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
						{message.text}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-3">
					<div>
						<label className="block text-sm font-medium text-gray-700">Nombre de usuario</label>
						<input
							name="username"
							value={form.username}
							onChange={handleChange}
							required
							className="mt-1 block w-full rounded border-gray-200 shadow-sm p-2"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">Email</label>
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
						<label className="block text-sm font-medium text-gray-700">Contraseña</label>
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
						<label className="block text-sm font-medium text-gray-700">Documento (opcional)</label>
						<input
							name="documentNumber"
							value={form.documentNumber}
							onChange={handleChange}
							className="mt-1 block w-full rounded border-gray-200 shadow-sm p-2"
						/>
					</div>

					<div>
						<button
							type="submit"
							disabled={loading}
							className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
						>
							{loading ? "Registrando..." : "Crear cuenta"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Register;
