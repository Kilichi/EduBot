'use client';

import { useState } from 'react';
import { FaEdit, FaUpload, FaTimes, FaCalendarAlt, FaTag, FaBuilding } from 'react-icons/fa';
import type { Agreement } from '@/lib/api-client';

interface Props {
  agreement: Agreement;
  onEdit: (updated: Agreement) => void;
  onUpload: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function AgreementPreview({ agreement, onEdit, onUpload, onCancel, isLoading }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState<Agreement>(agreement);

  function handleSaveEdit() {
    onEdit(edited);
    setIsEditing(false);
  }

  function handleCancelEdit() {
    setEdited(agreement);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="agreement-preview editing">
        <div className="preview-header">
          <h3 className="preview-title">Editar Acuerdo</h3>
        </div>
        <div className="preview-form">
          <div className="form-field">
            <label><FaCalendarAlt className="field-icon" /> Fecha</label>
            <input type="text" value={edited.fecha} onChange={(e) => setEdited({ ...edited, fecha: e.target.value })} className="form-input" placeholder="DD/MM/AAAA" />
          </div>
          <div className="form-field">
            <label>Título</label>
            <input type="text" value={edited.titulo} onChange={(e) => setEdited({ ...edited, titulo: e.target.value })} className="form-input" placeholder="Título del acuerdo" />
          </div>
          <div className="form-field">
            <label>Descripción</label>
            <textarea value={edited.descripcion} onChange={(e) => setEdited({ ...edited, descripcion: e.target.value })} className="form-textarea" rows={4} placeholder="Descripción detallada" />
          </div>
          <div className="form-field">
            <label><FaBuilding className="field-icon" /> Origen</label>
            <input type="text" value={edited.origen} onChange={(e) => setEdited({ ...edited, origen: e.target.value })} className="form-input" placeholder="Ej: Claustro, CCP, Departamento" />
          </div>
          <div className="form-field">
            <label><FaTag className="field-icon" /> Etiquetas</label>
            <input type="text" value={edited.etiquetas.join(', ')} onChange={(e) => setEdited({ ...edited, etiquetas: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} className="form-input" placeholder="Separadas por comas" />
          </div>
        </div>
        <div className="preview-actions">
          <button className="btn-cancel-edit" onClick={handleCancelEdit} disabled={isLoading}>Cancelar Edición</button>
          <button className="btn-save-edit" onClick={handleSaveEdit} disabled={isLoading}>Guardar Cambios</button>
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
          <div className="section-header"><FaCalendarAlt className="section-icon" /><span className="section-label">Fecha</span></div>
          <p className="section-value">{agreement.fecha || 'No especificada'}</p>
        </div>
        <div className="preview-section">
          <div className="section-header"><span className="section-label">Título</span></div>
          <h4 className="section-title">{agreement.titulo || 'Sin título'}</h4>
        </div>
        <div className="preview-section">
          <div className="section-header"><span className="section-label">Descripción</span></div>
          <p className="section-description">{agreement.descripcion || 'Sin descripción'}</p>
        </div>
        <div className="preview-section">
          <div className="section-header"><FaBuilding className="section-icon" /><span className="section-label">Origen</span></div>
          <p className="section-value">{agreement.origen || 'No especificado'}</p>
        </div>
        {agreement.etiquetas && agreement.etiquetas.length > 0 && (
          <div className="preview-section">
            <div className="section-header"><FaTag className="section-icon" /><span className="section-label">Etiquetas</span></div>
            <div className="tags-container">{agreement.etiquetas.map((tag, i) => <span key={i} className="tag">{tag}</span>)}</div>
          </div>
        )}
      </div>
      <div className="preview-actions">
        <button className="btn-action btn-edit" onClick={() => setIsEditing(true)} disabled={isLoading}><FaEdit /> Editar</button>
        <button className="btn-action btn-upload" onClick={onUpload} disabled={isLoading}><FaUpload /> {isLoading ? 'Subiendo...' : 'Subir'}</button>
        <button className="btn-action btn-cancel" onClick={onCancel} disabled={isLoading}><FaTimes /> Cancelar</button>
      </div>
    </div>
  );
}
