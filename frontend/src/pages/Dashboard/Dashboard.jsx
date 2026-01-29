import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaDownload } from 'react-icons/fa';
import Layout from '../../components/Layout/Layout';
import ChatMessage from '../../components/Chat/ChatMessage';
import AgreementDisplay from '../../components/AgreementDisplay/AgreementDisplay';
import ChatInput from '../../components/Chat/ChatInput';
import './Dashboard.css';
import { consultarAPI } from '../../services/api';
import { parseAgreementsFromText } from '../../utils/parseAgreements';

const Dashboard = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'system',
      content: "Bienvenido al chat de acuerdos aqui puedes consultar los acuerdos que quieras.",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message) => {
    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      agreements: [],
    };
    setMessages((prev) => [...prev, userMessage]);

    // Enviar al backend
    setIsLoading(true);
    try {
      const response = await consultarAPI(message);
      
      // Manejar respuesta: puede ser string directo o objeto con respuesta y acuerdos
      let respuesta;
      let acuerdos = [];
      
      if (typeof response === 'string') {
        respuesta = response;
        // Intentar parsear acuerdos del texto
        acuerdos = parseAgreementsFromText(response);
      } else if (response.respuesta) {
        respuesta = response.respuesta;
        acuerdos = response.acuerdos || [];
        // Si no hay acuerdos en el objeto, intentar parsearlos del texto
        if (acuerdos.length === 0) {
          acuerdos = parseAgreementsFromText(response.respuesta);
        }
      } else {
        respuesta = JSON.stringify(response);
        acuerdos = parseAgreementsFromText(respuesta);
      }
      
      // Si encontramos acuerdos, limpiar el texto de respuesta para evitar duplicación
      if (acuerdos.length > 0) {
        // Remover la parte de los acuerdos del texto, dejando solo el texto introductorio
        // Patrón para capturar desde el asterisco inicial hasta el final del acuerdo
        const agreementTextPattern = /\*\s*\*\*Fecha:\*\*[^\n]+(?:\s*\|\s*\*\*[^\n]+)*/g;
        respuesta = respuesta.replace(agreementTextPattern, '').trim();
        
        // Limpiar líneas vacías y espacios múltiples
        respuesta = respuesta.replace(/\n\s*\n/g, '\n').trim();
        
        // Si el texto queda vacío o solo con "Los dos últimos acuerdos son:", usar un mensaje genérico
        if (!respuesta || respuesta.length < 10 || respuesta.toLowerCase().includes('últimos acuerdos') || respuesta.toLowerCase().includes('hablado')) {
          respuesta = `He encontrado ${acuerdos.length} acuerdo${acuerdos.length > 1 ? 's' : ''}:`;
        }
      }
      
      // Agregar respuesta del sistema
      const systemMessage = {
        id: Date.now() + 1,
        type: 'system',
        content: respuesta,
        timestamp: new Date(),
        agreements: acuerdos,
      };
      setMessages((prev) => [...prev, systemMessage]);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'system',
        content: error.message || 'Lo siento, hubo un error al procesar tu consulta. Por favor, intenta de nuevo.',
        timestamp: new Date(),
        agreements: [],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-header">
          <div className="header-left">
            <h1 className="dashboard-title">Consultar Acuerdos</h1>
          </div>
        </div>

        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id}>
                <ChatMessage message={message} />
                {message.agreements && message.agreements.length > 0 && (
                  <div className="agreements-container">
                    {message.agreements.map((agreement, index) => (
                      <AgreementDisplay key={index} agreement={agreement} />
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="loading-message">
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>

        <div className="dashboard-footer">
          <span className="footer-text">Jose Poveda</span>
          <span className="footer-dot">•</span>
          <span className="footer-text">Ies Hermanos Amoros</span>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
