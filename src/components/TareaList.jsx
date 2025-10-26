import React from "react";
import TareaAPI from "../api/TareaAPI";

const styles = {
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: (completada) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    marginBottom: "8px",
    backgroundColor: completada ? "#e6f7e9" : "white", // Verde claro para completadas
    borderLeft: completada ? "5px solid #2ecc71" : "5px solid #95a5a6",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    transition: "background-color 0.3s",
  }),
  description: (completada) => ({
    flexGrow: 1,
    marginRight: "15px",
    textDecoration: completada ? "line-through" : "none",
    color: completada ? "#27ae60" : "#34495e",

    // --- AÑADIR ESTAS PROPIEDADES ---
    wordWrap: "break-word", // Rompe palabras largas que desbordan
    overflowWrap: "break-word", // Alternativa moderna
    maxWidth: "calc(100% - 100px)", // Restringe el ancho para dejar espacio a los botones
    // --------------------------------
  }),
  button: (color) => ({
    padding: "5px 10px",
    marginLeft: "8px",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
    color: "white",
    backgroundColor: color,
  }),
};

function TareaList({ tareas, onTaskChange }) {
  // Manejar el cambio de estado (marcar como completada/pendiente)
  const handleToggleComplete = async (tarea) => {
    try {
      // Envía la actualización del estado opuesto
      await TareaAPI.update(tarea.id, { completada: !tarea.completada });
      onTaskChange();
    } catch (error) {
      alert("Error al actualizar la tarea.");
      console.error(error);
    }
  };

  // Manejar la eliminación de la tarea
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta tarea?"))
      return;
    try {
      await TareaAPI.delete(id);
      onTaskChange();
    } catch (error) {
      alert("Error al eliminar la tarea.");
      console.error(error);
    }
  };

  return (
    <ul style={styles.list}>
      {tareas.length === 0 ? (
        <p>No hay tareas registradas. ¡Crea una!</p>
      ) : (
        tareas.map((tarea) => (
          <li key={tarea.id} style={styles.listItem(tarea.completada)}>
            <span style={styles.description(tarea.completada)}>
              {tarea.descripcion}
            </span>
            <div>
              {/* Botón de actualizar estado (U) */}
              <button
                onClick={() => handleToggleComplete(tarea)}
                style={styles.button(tarea.completada ? "#e67e22" : "#27ae60")}
                title={
                  tarea.completada
                    ? "Marcar como Pendiente"
                    : "Marcar como Completada"
                }
              >
                {tarea.completada ? "🔄" : "✅"}
              </button>
              {/* Botón de eliminar (D) */}
              <button
                onClick={() => handleDelete(tarea.id)}
                style={styles.button("#c0392b")}
                title="Eliminar Tarea"
              >
                🗑️
              </button>
            </div>
          </li>
        ))
      )}
    </ul>
  );
}

export default TareaList;
