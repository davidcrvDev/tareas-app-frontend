import React, { useState } from "react";
import TareaAPI from "../api/TareaAPI";

const styles = {
  form: {
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

function TareaForm({ onTareaCreated }) {
  const [descripcion, setDescripcion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (descripcion.trim() === "") return;

    setSubmitting(true);
    try {
      await TareaAPI.create(descripcion);
      setDescripcion("");
      onTareaCreated(); // Refrescar la lista en App.jsx
    } catch (error) {
      alert("Error al crear la tarea. Verifique el backend.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Escribe la descripción de la nueva tarea..."
        required
        style={styles.input}
        disabled={submitting}
      />
      <button type="submit" style={styles.button} disabled={submitting}>
        {submitting ? "Creando..." : "➕ Agregar Tarea"}
      </button>
    </form>
  );
}

export default TareaForm;
