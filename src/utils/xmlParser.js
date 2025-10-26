import { xml2js } from 'xml-js';

// Función para convertir una cadena XML a un objeto JavaScript
export const xmlToJson = (xmlString) => {
    // Opciones para la conversión: compact:true convierte el XML en un objeto más manejable.
    const options = { compact: true, spaces: 4 };
    try {
        const result = xml2js(xmlString, options);
        return result;
    } catch (error) {
        console.error("Error al parsear el XML:", error);
        return null;
    }
};