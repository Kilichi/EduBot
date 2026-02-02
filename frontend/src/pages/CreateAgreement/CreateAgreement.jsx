import { useState, useEffect, useRef } from 'react';
import { FaBell, FaDownload } from 'react-icons/fa';
import Layout from '../../components/Layout/Layout';
import ChatMessage from '../../components/Chat/ChatMessage';
import ChatInput from '../../components/Chat/ChatInput';
import AgreementPreview from '../../components/AgreementPreview/AgreementPreview';
import './CreateAgreement.css';
import { previewRegistroAPI, confirmRegistroAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const CreateAgreement = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'system',
      content: "Hola, soy tu asistente para crear acuerdos. Escribe el texto del acuerdo tal como apareció en la reunión y yo lo estructuraré automáticamente.",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAgreement, setPendingAgreement] = useState(null);
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
    };
    setMessages((prev) => [...prev, userMessage]);

    // Enviar al backend para procesar
    setIsLoading(true);
    try {
      const agreementData = await previewRegistroAPI(message);
      
      // Agregar respuesta del sistema con el acuerdo estructurado
      const systemMessage = {
        id: Date.now() + 1,
        type: 'system',
        content: "He procesado tu texto y he estructurado el acuerdo. Revisa la información y usa los botones para editar, subir o cancelar.",
        timestamp: new Date(),
        agreementData: agreementData,
      };
      setMessages((prev) => [...prev, systemMessage]);
      setPendingAgreement(agreementData);
    } catch (error) {
      console.error('Error al procesar acuerdo:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'system',
        content: error.message || 'Lo siento, hubo un error al procesar el acuerdo. Por favor, intenta de nuevo.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (updatedAgreement) => {
    setPendingAgreement(updatedAgreement);
    // Actualizar el mensaje del sistema con el acuerdo editado
    setMessages((prev) => prev.map(msg => 
      msg.agreementData 
        ? { ...msg, agreementData: updatedAgreement }
        : msg
    ));
  };

  const handleUpload = async () => {
    if (!pendingAgreement) return;

    setIsLoading(true);
    try {
      await confirmRegistroAPI(pendingAgreement);
      
      const successMessage = {
        id: Date.now(),
        type: 'system',
        content: `¡Acuerdo "${pendingAgreement.titulo}" guardado exitosamente en la base de datos! Puedes continuar creando más acuerdos.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, successMessage]);
      
      // Limpiar el acuerdo pendiente y remover el acuerdo del mensaje anterior
      setPendingAgreement(null);
      setMessages((prev) => prev.map(msg => 
        msg.agreementData 
          ? { ...msg, agreementData: null }
          : msg
      ));
    } catch (error) {
      console.error('Error al guardar acuerdo:', error);
      const errorMessage = {
        id: Date.now(),
        type: 'system',
        content: error.message || 'Error al guardar el acuerdo. Por favor, intenta de nuevo.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setPendingAgreement(null);
    const cancelMessage = {
      id: Date.now(),
      type: 'system',
      content: "Creación de acuerdo cancelada. Puedes escribir un nuevo texto para crear otro acuerdo.",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, cancelMessage]);
    
    // Remover el acuerdo del último mensaje del sistema
    setMessages((prev) => prev.map(msg => 
      msg.agreementData 
        ? { ...msg, agreementData: null }
        : msg
    ));
  };

  return (
    <Layout>
      <div className="create-agreement">
        <div className="dashboard-header">
          <div className="header-left">
            <h1 className="dashboard-title">Crear Nuevo Acuerdo</h1>
          </div>
        </div>

        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id}>
                <ChatMessage message={message} />
                {message.agreementData && (
                  <div className="agreement-preview-container">
                    <AgreementPreview
                      agreement={message.agreementData}
                      onEdit={handleEdit}
                      onUpload={handleUpload}
                      onCancel={handleCancel}
                      isLoading={isLoading}
                    />
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

          <ChatInput 
            onSendMessage={handleSendMessage} 
            disabled={isLoading || pendingAgreement !== null}
            placeholder={pendingAgreement ? "Completa la acción del acuerdo anterior antes de crear uno nuevo..." : "Escribe el texto del acuerdo tal como apareció en la reunión..."}
          />
        </div>

        <div className="dashboard-footer">
          <span className="footer-text">Jose Poveda</span>
          <span className="footer-dot">•</span>
          <span className="footer-text">IES Hermanos Amoros</span>
        </div>
      </div>
    </Layout>
  );
};

export default CreateAgreement;
