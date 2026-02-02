import { FaCheck, FaChevronRight } from 'react-icons/fa';
import './AgreementCard.css';

const AgreementCard = ({ agreement }) => {
  return (
    <div className="agreement-card">
      <div className="agreement-icon"><FaCheck /></div>
      <div className="agreement-content">
        <h3 className="agreement-title">{agreement.titulo || agreement.title}</h3>
        <p className="agreement-subtitle">{agreement.origen || agreement.origin || 'Academic Affairs Committee'}</p>
      </div>
      <div className="agreement-arrow"><FaChevronRight /></div>
    </div>
  );
};

export default AgreementCard;
