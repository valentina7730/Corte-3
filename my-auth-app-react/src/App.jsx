import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const App = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const testApi = async () => {
    try {
      const response = await fetch(`${API_URL}`);
      const data = await response.json();
      setData(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      testApi();
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 text-lg font-medium">
              Cargando información...
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Información de la API
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-700 font-mono whitespace-pre-wrap wrap-break-word">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
