import React from "react";

const styles = {
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  },
  stat: {
    padding: "10px 0",
    borderBottom: "1px dotted #ccc",
    color: "#000000ff",
  },
  statValue: {
    fontWeight: "bold",
    color: "#2980b9",
    fontSize: "1.2em",
  },
  xmlView: {
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#ecf0f1",
    border: "1px solid #bdc3c7",
    borderRadius: "4px",
    overflowX: "auto",
    fontSize: "0.9em",
    whiteSpace: "pre",
    color: "#34495e",
  },
  xmlTag: {
    color: "#c0392b", // Rojo oscuro para etiquetas
  },
  xmlAttribute: {
    color: "#27ae60", // Verde para atributos
  },
};

// Función auxiliar recursiva para renderizar el árbol XML (JSON parseado)
const renderXmlTree = (data, depth = 0) => {
    // Si los datos no son un objeto, es texto puro (lo devolvemos con el estilo de texto)
    if (typeof data !== 'object' || data === null) {
        return <span style={styles.xmlText}>{String(data)}</span>;
    }

    // Si es un array, renderiza cada elemento (útil para la lista de <tarea>)
    if (Array.isArray(data)) {
        // Renderiza cada elemento del array en el nivel actual de indentación
        return data.map((item, index) => (
            <div key={index}>
                {renderXmlTree(item, depth)}
            </div>
        ));
    }

    const elements = [];
    const indent = ' '.repeat(depth * 4);
    
    // Obtener todas las claves del objeto, excluyendo las de control y las de atributos
    const tagKeys = Object.keys(data).filter(key => key !== '_attributes' && key !== '_text');

    // Procesar solo si este nodo representa una etiqueta y no solo un contenedor recursivo
    if (tagKeys.length > 0 || data._text !== undefined || data._attributes !== undefined) {
        
        for (const key of tagKeys) {
            const value = data[key];
            const attributes = value?._attributes;
            
            // Si el valor es una matriz, se maneja como una lista de etiquetas (ej: <tarea>)
            if (Array.isArray(value)) {
                // Renderizamos la lista en el nivel actual para que maneje sus propios divs
                elements.push(
                    <div key={key}>
                        <span>{indent}</span>
                        <span style={styles.xmlTag}>{'<'}{key}{'>'}</span>
                        <div style={{ paddingLeft: '20px' }}>
                            {renderXmlTree(value, depth + 1)}
                        </div>
                        <span>{indent}</span>
                        <span style={styles.xmlTag}>{'</'}{key}{'>'}</span>
                    </div>
                );
                continue;
            }

            // Es un nodo simple o complejo
            const hasChildren = Object.keys(value).some(k => k !== '_attributes' && k !== '_text');
            const innerText = value._text;
            
            elements.push(
                <div key={key + depth}>
                    <span>{indent}</span>
                    <span style={styles.xmlTag}>{'<'}{key}</span>
                    {/* Atributos */}
                    {attributes && Object.entries(attributes).map(([attrKey, attrValue]) => (
                        <span key={attrKey} style={styles.xmlAttribute}>
                            {' '}{attrKey}="{attrValue}"
                        </span>
                    ))}
                    <span style={styles.xmlTag}>{'>'}</span>
                    
                    {/* Contenido: Texto o Nodos Anidados */}
                    {innerText ? (
                         <span style={styles.xmlText}>{innerText}</span>
                    ) : hasChildren ? (
                        <div style={{ paddingLeft: '20px' }}>
                            {renderXmlTree(value, depth + 1)}
                        </div>
                    ) : null}
                    
                    {/* Cierre de etiqueta */}
                    <span style={styles.xmlTag}>{'</'}{key}{'>'}</span>
                </div>
            );
        }

    } else if (data._text !== undefined) {
        // Si el nodo es solo texto sin etiquetas
        return <span style={styles.xmlText}>{data._text}</span>;
    }
    
    return elements;
};

function XmlReporte({ reporte }) {
  if (!reporte) {
    return <div style={styles.card}>Esperando datos del servicio SOAP...</div>;
  }

  // Extraer estadísticas
  const stats = reporte.estadisticas;
  const total = stats.totalTareas._text;
  const porcentaje = stats.porcentajeCompletado._text;
  const completadas = stats.tareasCompletadas._text;

  return (
    <div style={styles.card}>
      {/* Sección de Total y Porcentaje (Requisito 2) */}
      <div style={styles.stat}>
        Tareas Totales: <span style={styles.statValue}>{total}</span>
      </div>
      <div style={styles.stat}>
        Completadas: <span style={styles.statValue}>{completadas}</span>
      </div>
      <div style={styles.stat}>
        Progreso General:{" "}
        <span style={{ ...styles.statValue, color: "#e67e22" }}>
          {porcentaje}
        </span>
      </div>

      <p style={{ marginTop: "20px", fontWeight: "bold", color: "#000000ff" }}>
        Visualización del Árbol XML (Respuesta SOAP):
      </p>

      {/* Visualización del Árbol XML (Requisito 2) */}
      <div style={styles.xmlView}>{renderXmlTree(reporte)}</div>
    </div>
  );
}

export default XmlReporte;
