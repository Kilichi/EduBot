import { useState } from 'react';
import { previewRegistroAPI, confirmRegistroAPI } from '../../services/api';
import './AgreementModal.css';

const AgreementModal = ({ isOpen, onClose, onAgreementCreated }) => {
  const [step, setStep] = useState(1); // 1: Texto libre, 2: Preview y confirmación
  const [rawText, setRawText] = useState('');
  const [previewData, setPreviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTextSubmit = async () => {
    if (!rawText.trim()) {
      setError('Por favor, ingresa un texto para procesar.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await previewRegistroAPI(rawText);
      setPreviewData(data);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Error al procesar el texto. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!previewData) return;

    setIsLoading(true);
    setError('');

    try {
      await confirmRegistroAPI(previewData);
      onAgreementCreated(previewData);
      handleClose();
    } catch (err) {
      setError(err.message || 'Error al guardar el acuerdo. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setRawText('');
    setPreviewData(null);
    setError('');
    onClose();
  };

  const handleEdit = () => {
    setStep(1);
    setPreviewData(null);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Crear Nuevo Acuerdo</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <div className="modal-body">
          {step === 1 ? (
            <div className="step-1">
              <p className="step-description">
                Escribe el texto del acuerdo tal como apareció en la reunión. 
                La IA lo estructurará automáticamente.
              </p>
              <textarea
                className="agreement-textarea"
                placeholder="Ejemplo: Hoy 29 de enero en el claustro hemos acordado que el próximo viernes será jornada de puertas abiertas para las familias. Usaremos el hashtag #PuertasAbiertas y habrá café en la biblioteca."
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                rows={8}
                disabled={isLoading}
              />
              {error && <div className="error-message">{error}</div>}
            </div>
          ) : (
            <div className="step-2">
              <p className="step-description">
                Revisa la información extraída. Puedes editarla antes de confirmar.
              </p>
              
              {previewData && (
                <div className="preview-container">
                  <div className="preview-field">
                    <label>Fecha</label>
                    <input
                      type="text"
                      value={previewData.fecha || ''}
                      onChange={(e) => setPreviewData({ ...previewData, fecha: e.target.value })}
                      className="preview-input"
                    />
                  </div>

                  <div className="preview-field">
                    <label>Título</label>
                    <input
                      type="text"
                      value={previewData.titulo || ''}
                      onChange={(e) => setPreviewData({ ...previewData, titulo: e.target.value })}
                      className="preview-input"
                    />
                  </div>

                  <div className="preview-field">
                    <label>Descripción</label>
                    <textarea
                      value={previewData.descripcion || ''}
                      onChange={(e) => setPreviewData({ ...previewData, descripcion: e.target.value })}
                      className="preview-textarea"
                      rows={4}
                    />
                  </div>

                  <div className="preview-field">
                    <label>Origen</label>
                    <input
                      type="text"
                      value={previewData.origen || ''}
                      onChange={(e) => setPreviewData({ ...previewData, origen: e.target.value })}
                      className="preview-input"
                      placeholder="Ej: Claustro, CCP, Departamento"
                    />
                  </div>

                  <div className="preview-field">
                    <label>Etiquetas</label>
                    <input
                      type="text"
                      value={Array.isArray(previewData.etiquetas) ? previewData.etiquetas.join(', ') : ''}
                      onChange={(e) => {
                        const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                        setPreviewData({ ...previewData, etiquetas: tags });
                      }}
                      className="preview-input"
                      placeholder="Separadas por comas"
                    />
                  </div>
                </div>
              )}

              {error && <div className="error-message">{error}</div>}
            </div>
          )}
        </div>

        <div className="modal-footer">
          {step === 1 ? (
            <>
              <button className="btn-cancel" onClick={handleClose} disabled={isLoading}>
                Cancelar
              </button>
              <button 
                className="btn-primary" 
                onClick={handleTextSubmit}
                disabled={isLoading || !rawText.trim()}
              >
                {isLoading ? 'Procesando...' : 'Procesar con IA'}
              </button>
            </>
          ) : (
            <>
              <button className="btn-secondary" onClick={handleEdit} disabled={isLoading}>
                Editar Texto
              </button>
              <button className="btn-cancel" onClick={handleClose} disabled={isLoading}>
                Cancelar
              </button>
              <button 
                className="btn-primary" 
                onClick={handleConfirm}
                disabled={isLoading}
              >
                {isLoading ? 'Guardando...' : 'Confirmar y Guardar'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgreementModal;
