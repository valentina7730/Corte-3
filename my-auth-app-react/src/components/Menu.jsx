import React, { useState } from "react";
import Register from "./Register"; 
import Login from "./Login";         

export const Menu = () => {
  const [view, setView] = useState("menu");
  



  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">

      {/* Vista del menú */}
      {view === "menu" && (
        <div className="bg-white p-6 rounded-lg  shadow-xl shadow-gray-400  w-full max-w-sm space-y-4 text-center">

          <h2 className="text-2xl font-semibold">Bienvenido</h2>
          <p className="text-gray-600">Selecciona una opción</p>

          <button
            onClick={() => setView("login")}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Iniciar sesión
          </button>

          <button
            onClick={() => setView("register")}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Registrarse
          </button>
        </div>
      )}

      {/* Vista del login */}
      {view === "login" && (
        <Login onBack={() => setView("menu")} />
      )}

      {/* Vista del registro */}
      {view === "register" && (
        <Register onBack={() => setView("menu")} />
      )}

    </div>
  );
};

export default Menu;
