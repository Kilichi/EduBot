import { FaCalendarAlt, FaTag, FaBuilding } from 'react-icons/fa';
import './AgreementDisplay.css';

const AgreementDisplay = ({ agreement }) => {
  return (
    <div className="agreement-display">
      <div className="display-header">
        <h3 className="display-title">{agreement.titulo || 'Sin título'}</h3>
        <div className="display-badge">Acuerdo</div>
      </div>

      <div className="display-content">
        <div className="display-section">
          <div className="section-header">
            <FaCalendarAlt className="section-icon" />
            <span className="section-label">Fecha</span>
          </div>
          <p className="section-value">{agreement.fecha || 'No especificada'}</p>
        </div>

        <div className="display-section">
          <div className="section-header">
            <span className="section-label">Descripción</span>
          </div>
          <p className="section-description">{agreement.descripcion || 'Sin descripción'}</p>
        </div>

        <div className="display-section">
          <div className="section-header">
            <FaBuilding className="section-icon" />
            <span className="section-label">Origen</span>
          </div>
          <p className="section-value">{agreement.origen || 'No especificado'}</p>
        </div>

        {agreement.etiquetas && agreement.etiquetas.length > 0 && (
          <div className="display-section">
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
    </div>
  );
};

export default AgreementDisplay;
