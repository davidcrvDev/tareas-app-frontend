import axios from "axios";
import { xmlToJson } from "../utils/xmlParser";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
const SOAP_URL = `${BASE_URL}/soap`;

// Plantilla del mensaje SOAP Request para invocar la función 'ObtenerReporteTareas'
const SOAP_REQUEST_BODY = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:ObtenerReporteTareas">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:ObtenerReporteTareasRequest/>
   </soapenv:Body>
</soapenv:Envelope>
`;

// Función para invocar el servicio SOAP y obtener el informe XML
const SoapService = {
    getReporteTareas: async () => {
        try {
            const response = await axios.post(
                SOAP_URL, 
                SOAP_REQUEST_BODY, 
                {
                    headers: {
                        'Content-Type': 'text/xml;charset=UTF-8',
                        'SOAPAction': 'urn:ObtenerReporteTareas',
                    },
                }
            );

            const rawXmlResponse = response.data;
            const jsonResponse = xmlToJson(rawXmlResponse);

            // 1. Encontrar el Envelope: Buscar cualquier clave que termine en 'Envelope'
            const envelopeKey = Object.keys(jsonResponse).find(k => k.endsWith('Envelope'));
            if (!envelopeKey) throw new Error("No se encontró el Envelope SOAP en la respuesta.");

            // 2. Encontrar el Body: Buscar cualquier clave que termine en 'Body' dentro del Envelope
            const envelope = jsonResponse[envelopeKey];
            const bodyKey = Object.keys(envelope).find(k => k.endsWith('Body'));
            if (!bodyKey) throw new Error("No se encontró el Body SOAP en la respuesta.");

            // 3. Encontrar la respuesta de la función: Buscar cualquier clave que termine en 'Response'
            const body = envelope[bodyKey];
            const responseKey = Object.keys(body).find(k => k.endsWith('Response'));
            if (!responseKey) throw new Error("No se encontró la Respuesta de la función SOAP.");

            // 4. Extraer el contenido del reporte (xmlReporte)
            const reporteContent = body[responseKey].xmlReporte;
            
            // Si el contenido es un objeto con la propiedad _text (caso compact: true)
            const reporteXmlText = reporteContent._text || reporteContent; 

            if (!reporteXmlText) throw new Error("Contenido de reporte XML vacío o no encontrado.");

            // 5. Convertir el XML de Reporte real a JSON para la UI
            const finalReporteJson = xmlToJson(reporteXmlText);

            return finalReporteJson.reporte;

        } catch (error) {
            console.error("Error al consumir el servicio SOAP:", error);
            // Mostrar un error de comunicación amigable
            throw new Error(`Fallo la comunicación con el servicio SOAP: ${error.message}`);
        }
    },
};

export default SoapService;
