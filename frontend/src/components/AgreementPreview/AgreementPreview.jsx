import { useState } from 'react';
import { FaEdit, FaUpload, FaTimes, FaCalendarAlt, FaTag, FaBuilding } from 'react-icons/fa';
import './AgreementPreview.css';

const AgreementPreview = ({ agreement, onEdit, onUpload, onCancel, isLoading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAgreement, setEditedAgreement] = useState(agreement);

  const handleSaveEdit = () => {
    onEdit(editedAgreement);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedAgreement(agreement);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="agreement-preview editing">
        <div className="preview-header">
          <h3 className="preview-title">Editar Acuerdo</h3>
        </div>
        
        <div className="preview-form">
          <div className="form-field">
            <label>
              <FaCalendarAlt className="field-icon" />
              Fecha
            </label>
            <input
              type="text"
              value={editedAgreement.fecha || ''}
              onChange={(e) => setEditedAgreement({ ...editedAgreement, fecha: e.target.value })}
              className="form-input"
              placeholder="DD/MM/AAAA"
            />
          </div>

          <div className="form-field">
            <label>Título</label>
            <input
              type="text"
              value={editedAgreement.titulo || ''}
              onChange={(e) => setEditedAgreement({ ...editedAgreement, titulo: e.target.value })}
              className="form-input"
              placeholder="Título del acuerdo"
            />
          </div>

          <div className="form-field">
            <label>Descripción</label>
            <textarea
              value={editedAgreement.descripcion || ''}
              onChange={(e) => setEditedAgreement({ ...editedAgreement, descripcion: e.target.value })}
              className="form-textarea"
              rows={4}
              placeholder="Descripción detallada"
            />
          </div>

          <div className="form-field">
            <label>
              <FaBuilding className="field-icon" />
              Origen
            </label>
            <input
              type="text"
              value={editedAgreement.origen || ''}
              onChange={(e) => setEditedAgreement({ ...editedAgreement, origen: e.target.value })}
              className="form-input"
              placeholder="Ej: Claustro, CCP, Departamento"
            />
          </div>

          <div className="form-field">
            <label>
              <FaTag className="field-icon" />
              Etiquetas
            </label>
            <input
              type="text"
              value={Array.isArray(editedAgreement.etiquetas) ? editedAgreement.etiquetas.join(', ') : ''}
              onChange={(e) => {
                const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                setEditedAgreement({ ...editedAgreement, etiquetas: tags });
              }}
              className="form-input"
              placeholder="Separadas por comas"
            />
          </div>
        </div>

        <div className="preview-actions">
          <button className="btn-cancel-edit" onClick={handleCancelEdit} disabled={isLoading}>
            Cancelar Edición
          </button>
          <button className="btn-save-edit" onClick={handleSaveEdit} disabled={isLoading}>
            Guardar Cambios
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="agreement-preview">
      <div className="preview-header">
        <h3 className="preview-title">Acuerdo Estructurado</h3>
        <div className="preview-badge">Listo para revisar</div>
      </div>

      <div className="preview-content">
        <div className="preview-section">
          <div className="section-header">
            <FaCalendarAlt className="section-icon" />
            <span className="section-label">Fecha</span>
          </div>
          <p className="section-value">{agreement.fecha || 'No especificada'}</p>
        </div>

        <div className="preview-section">
          <div className="section-header">
            <span className="section-label">Título</span>
          </div>
          <h4 className="section-title">{agreement.titulo || 'Sin título'}</h4>
        </div>

        <div className="preview-section">
          <div className="section-header">
            <span className="section-label">Descripción</span>
          </div>
          <p className="section-description">{agreement.descripcion || 'Sin descripción'}</p>
        </div>

        <div className="preview-section">
          <div className="section-header">
            <FaBuilding className="section-icon" />
            <span className="section-label">Origen</span>
          </div>
          <p className="section-value">{agreement.origen || 'No especificado'}</p>
        </div>

        {agreement.etiquetas && agreement.etiquetas.length > 0 && (
          <div className="preview-section">
            <div className="section-header">
              <FaTag className="section-icon" />
              <span className="section-label">Etiquetas</span>
            </div>
            <div className="tags-container">
              {agreement.etiquetas.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="preview-actions">
        <button 
          className="btn-action btn-edit" 
          onClick={() => setIsEditing(true)}
          disabled={isLoading}
        >
          <FaEdit />
          Editar
        </button>
        <button 
          className="btn-action btn-upload" 
          onClick={onUpload}
          disabled={isLoading}
        >
          <FaUpload />
          {isLoading ? 'Subiendo...' : 'Subir'}
        </button>
        <button 
          className="btn-action btn-cancel" 
          onClick={onCancel}
          disabled={isLoading}
        >
          <FaTimes />
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default AgreementPreview;
