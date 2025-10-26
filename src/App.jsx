import React, { useState, useEffect } from "react";
import TareaAPI from "./api/TareaAPI";
import SoapService from "./api/SoapService";

import TareaList from "./components/TareaList";
import TareaForm from "./components/TareaForm";
import XmlReporte from "./components/XmlReporte";

// Estilos simples para una apariencia limpia y profesional
const styles = {
  container: {
    // ... (resto igual)
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f7f6",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    color: "#2c3e50",
    marginBottom: "30px",
  },
  contentGrid: {
    // Usamos Flexbox para control responsivo básico
    display: "flex",
    gap: "20px",
    // Permite que las columnas se envuelvan si el espacio es insuficiente
    flexWrap: "wrap",
    alignItems: "flex-start", // Mantiene los elementos alineados arriba
  },
  // Nuevo estilo para las columnas individuales
  column: {
    flexBasis: "calc(33.333% - 13.333px)", // 3 columnas de ~33% menos el espacio del gap
    minWidth: "300px", // Mínimo para que en móviles se ajusten a una columna
    flexGrow: 1, // Permite que las columnas crezcan si hay espacio
  },
  sectionTitle: {
    borderBottom: "2px solid #3498db",
    paddingBottom: "10px",
    marginBottom: "20px",
    color: "#34495e",
    gridColumn: "1 / -1", // Abarca todas las columnas
  },
};

function App() {
  const [tareas, setTareas] = useState([]);
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Cargar datos del CRUD (RESTful)
  const fetchTareas = async () => {
    try {
      const response = await TareaAPI.getAll();
      setTareas(response.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar tareas:", err);
      setError("Error al conectar con la API RESTful.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Cargar datos del Reporte (SOAP/XML)
  const fetchReporte = async () => {
    try {
      const xmlReporte = await SoapService.getReporteTareas();
      setReporte(xmlReporte);
      setError(null);
    } catch (err) {
      console.error("Error al cargar reporte SOAP:", err);
      // Mostrar un error diferente para identificar el problema del SOAP
      setError("Error al consumir el Servicio Web SOAP (XML).");
    }
  };

  // Efecto para cargar datos al inicio
  useEffect(() => {
    fetchTareas();
    fetchReporte();
  }, []);

  // Función que se pasa a los componentes para refrescar los datos
  const handleRefresh = () => {
    fetchTareas();
    fetchReporte();
  };

  if (loading) {
    return <div style={styles.container}>Cargando...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>📋 Gestor Fullstack de Tareas</h1>

      {error && (
        <div
          style={{
            color: "white",
            backgroundColor: "#e74c3c",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      <div style={styles.contentGrid}>
        {/* === COLUMNA 1: FORMULARIO === */}
        <div style={styles.column}>
          <h2 style={{ ...styles.sectionTitle }}>Crear Nueva Tarea</h2>
          <TareaForm onTareaCreated={handleRefresh} />
        </div>

        {/* === COLUMNA 2: REPORTE XML (SOAP) === */}
        <div style={styles.column}>
          <h2 style={{ ...styles.sectionTitle }}>
            Informe de Progreso (SOAP/XML)
          </h2>
          <XmlReporte reporte={reporte} />
          <button
            onClick={fetchReporte}
            style={{
              marginTop: "15px",
              padding: "10px",
              backgroundColor: "#2ecc71",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Actualizar Informe SOAP
          </button>
        </div>

        {/* === COLUMNA 3: LISTADO Y CRUD === */}
        <div
          style={{ ...styles.column, maxHeight: "600px", overflowY: "auto" }}
        >
          <h2 style={{ ...styles.sectionTitle }}>
            Listado de Tareas ({tareas.length})
          </h2>
          {/* APLICAMOS maxHeight y overflowY para hacer scroll dentro de esta columna */}
          <TareaList tareas={tareas} onTaskChange={handleRefresh} />
        </div>
      </div>
    </div>
  );
}

export default App;
