/**
 * Parsea el texto de respuesta del LLM y extrae acuerdos estructurados
 * Formato esperado: * **Fecha:** fecha | **Título:** titulo | **Descripción:** descripcion | **Origen:** origen
 */
export const parseAgreementsFromText = (text) => {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const agreements = [];
  
  // Patrón principal para: * **Fecha:** 2024-11-33 | **Título:** Acuerdo 19 | **Descripción:** ... | **Origen:** origen19
  // Captura el formato exacto con doble asterisco en todos los campos
  const mainPattern = /\*\s*\*\*Fecha:\*\*\s*([^|]+?)\s*\|\s*\*\*Título:\*\*\s*([^|]+?)\s*\|\s*\*\*Descripción:\*\*\s*([^|]+?)\s*\|\s*\*\*Origen:\*\*\s*([^\n\*]+)/gi;
  
  let match;
  while ((match = mainPattern.exec(text)) !== null) {
    const fecha = match[1]?.trim() || '';
    const titulo = match[2]?.trim() || '';
    const descripcion = match[3]?.trim() || '';
    const origen = match[4]?.trim() || '';

    if (titulo || descripcion) {
      agreements.push({
        fecha: fecha,
        titulo: titulo,
        descripcion: descripcion,
        origen: origen,
        etiquetas: []
      });
    }
  }

  // Si no encontramos con el patrón principal, intentar variaciones
  if (agreements.length === 0) {
    // Patrón con doble asterisco solo en algunos campos: * **Fecha:** fecha | **Título:** titulo | ...
    const pattern2 = /\*\s*\*\*Fecha:\*\*\s*([^|]+?)\s*\|\s*(?:\*\*)?Título[:\*]+\s*([^|]+?)\s*\|\s*(?:\*\*)?Descripción[:\*]+\s*([^|]+?)\s*\|\s*(?:\*\*)?Origen[:\*]+\s*([^\n\*]+)/gi;
    
    while ((match = pattern2.exec(text)) !== null) {
      const fecha = match[1]?.trim() || '';
      const titulo = match[2]?.trim() || '';
      const descripcion = match[3]?.trim() || '';
      const origen = match[4]?.trim() || '';

      if (titulo || descripcion) {
        agreements.push({
          fecha: fecha,
          titulo: titulo,
          descripcion: descripcion,
          origen: origen,
          etiquetas: []
        });
      }
    }
  }

  // Si aún no encontramos, intentar patrón más flexible
  if (agreements.length === 0) {
    const flexiblePattern = /\*\s+(?:\*\*)?Fecha[:\*]+\s*([^|]+?)\s*\|\s*(?:\*\*)?Título[:\*]+\s*([^|]+?)\s*\|\s*(?:\*\*)?Descripción[:\*]+\s*([^|]+?)\s*\|\s*(?:\*\*)?Origen[:\*]+\s*([^\n\*\-]+)/gi;
    
    while ((match = flexiblePattern.exec(text)) !== null) {
      const fecha = match[1]?.trim() || '';
      const titulo = match[2]?.trim() || '';
      const descripcion = match[3]?.trim() || '';
      const origen = match[4]?.trim() || '';

      if (titulo || descripcion) {
        agreements.push({
          fecha: fecha,
          titulo: titulo,
          descripcion: descripcion,
          origen: origen,
          etiquetas: []
        });
      }
    }
  }

  // Si aún no encontramos, intentar sin asteriscos al inicio
  if (agreements.length === 0) {
    const noAsteriskPattern = /(?:Fecha[:\*]+\s*([^|]+?)\s*\|\s*)?(?:Título[:\*]+\s*([^|]+?)\s*\|\s*)?(?:Descripción[:\*]+\s*([^|]+?)\s*\|\s*)?(?:Origen[:\*]+\s*([^\n]+))/gi;
    
    while ((match = noAsteriskPattern.exec(text)) !== null) {
      const fecha = match[1]?.trim() || '';
      const titulo = match[2]?.trim() || '';
      const descripcion = match[3]?.trim() || '';
      const origen = match[4]?.trim() || '';

      if (titulo || descripcion) {
        agreements.push({
          fecha: fecha,
          titulo: titulo,
          descripcion: descripcion,
          origen: origen,
          etiquetas: []
        });
      }
    }
  }

  return agreements;
};
