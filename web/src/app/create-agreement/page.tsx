'use client';

import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import ChatMessage, { ChatMsg } from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import AgreementPreview from '@/components/AgreementPreview';
import { api, Agreement } from '@/lib/api-client';

type AgreementMsg = ChatMsg & { agreementData?: Agreement | null };

export default function CreateAgreementPage() {
  const [messages, setMessages] = useState<AgreementMsg[]>([
    { id: 1, type: 'system', content: 'Hola, soy tu asistente para crear acuerdos. Escribe el texto del acuerdo tal como apareció en la reunión y yo lo estructuraré automáticamente.' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAgreement, setPendingAgreement] = useState<Agreement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function handleSendMessage(message: string) {
    const userMessage: AgreementMsg = { id: Date.now(), type: 'user', content: message };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    try {
      const agreementData = await api.previewRegistro(message);
      const systemMessage: AgreementMsg = {
        id: Date.now() + 1, type: 'system',
        content: 'He procesado tu texto y he estructurado el acuerdo. Revisa la información y usa los botones para editar, subir o cancelar.',
        agreementData,
      };
      setMessages((prev) => [...prev, systemMessage]);
      setPendingAgreement(agreementData);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Lo siento, hubo un error al procesar el acuerdo.';
      setMessages((prev) => [...prev, { id: Date.now() + 1, type: 'system', content: msg }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleEdit(updated: Agreement) {
    setPendingAgreement(updated);
    setMessages((prev) => prev.map((m) => (m.agreementData ? { ...m, agreementData: updated } : m)));
  }

  async function handleUpload() {
    if (!pendingAgreement) return;
    setIsLoading(true);
    try {
      await api.confirmRegistro(pendingAgreement);
      setMessages((prev) => [...prev, { id: Date.now(), type: 'system', content: `¡Acuerdo "${pendingAgreement.titulo}" guardado exitosamente en la base de datos! Puedes continuar creando más acuerdos.` }]);
      setPendingAgreement(null);
      setMessages((prev) => prev.map((m) => (m.agreementData ? { ...m, agreementData: null } : m)));
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error al guardar el acuerdo.';
      setMessages((prev) => [...prev, { id: Date.now(), type: 'system', content: msg }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleCancel() {
    setPendingAgreement(null);
    setMessages((prev) => [...prev, { id: Date.now(), type: 'system', content: 'Creación de acuerdo cancelada. Puedes escribir un nuevo texto para crear otro acuerdo.' }]);
    setMessages((prev) => prev.map((m) => (m.agreementData ? { ...m, agreementData: null } : m)));
  }

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
                <div className="loading-dots"><span /><span /><span /></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading || pendingAgreement !== null}
            placeholder={pendingAgreement ? 'Completa la acción del acuerdo anterior antes de crear uno nuevo...' : 'Escribe el texto del acuerdo tal como apareció en la reunión...'}
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
}
