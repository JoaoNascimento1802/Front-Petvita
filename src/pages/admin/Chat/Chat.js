import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import { IoSend } from 'react-icons/io5';
import { firestore } from '../../../services/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import '../Chat/Chat.css';
// Footer não é mais importado aqui

const AdminChat = () => {
    const { user, loading: authLoading } = useAuth();
    const messagesEndRef = useRef(null);

    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    
    useEffect(() => {
        if (authLoading || !user) return;

        const fetchConversations = async () => {
            setLoadingConversations(true);
            try {
                // Este endpoint agora é acessível por ADMIN e EMPLOYEE
                const response = await api.get('/admin/consultations');
                const chatEnabledConsultations = response.data.filter(c => 
                    ['PENDENTE', 'AGENDADA', 'FINALIZADA', 'CHECKED_IN', 'EM_ANDAMENTO'].includes(c.status)
                );
                setConversations(chatEnabledConsultations);
            } catch (error) {
                console.error("Erro ao buscar conversas", error);
            } finally {
                setLoadingConversations(false);
            }
        };
        fetchConversations();
    }, [user, authLoading]);

    useEffect(() => {
        if (!activeConversation) return;
        setLoadingMessages(true);
        const q = query(
            collection(firestore, `consultas/${activeConversation.id}/mensagens`),
            orderBy("timestamp", "asc")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(msgs);
            setLoadingMessages(false);
        });
        return () => unsubscribe();
    }, [activeConversation]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleConversationClick = (conv) => {
        setActiveConversation(conv);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !activeConversation) return;
        const originalMessage = newMessage;
        setNewMessage('');
        try {
            await api.post(`/chat/${activeConversation.id}`, originalMessage, {
                headers: { 'Content-Type': 'text/plain' }
            });
        } catch (err) {
            console.error("Erro ao enviar mensagem:", err);
            setNewMessage(originalMessage);
            alert("Não foi possível enviar a mensagem.");
        }
    };

    // A div 'chat-page' e 'Footer' foram removidas para tornar o componente reutilizável
    return (
        <div className="chat-container">
            <div className="chat-sidebar">
                <div className="sidebar-header"><h3>Conversas Ativas</h3></div>
                <div className="contact-list">
                    {loadingConversations ? <p style={{ padding: '20px', textAlign: 'center' }}>Carregando...</p> : conversations.map(conv => (
                        <div 
                            key={conv.id} 
                            className={`contact-item ${activeConversation?.id === conv.id ? 'active' : ''}`}
                            onClick={() => handleConversationClick(conv)}
                        >
                            <div className="card-avatar-placeholder">{conv.userName?.charAt(0)}</div>
                            <div className="contact-info">
                                <span className="contact-name">{conv.userName} &harr; {conv.veterinaryName}</span>
                                <span className="contact-last-message">Pet: {conv.petName} (ID: {conv.id})</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="chat-main">
                {activeConversation ? (
                    <>
                        <div className="chat-header">
                            <span className="contact-name">{activeConversation.userName} &harr; {activeConversation.veterinaryName}</span>
                        </div>
                        <div className="message-area">
                            {loadingMessages ? <p>Carregando mensagens...</p> : messages.map(msg => (
                                <div key={msg.id} className={`message ${msg.senderId === user.id ? 'sent' : 'received'}`}>
                                    <strong>{msg.senderName}: </strong>{msg.content}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form className="message-input-area" onSubmit={handleSendMessage}>
                            <input type="text" placeholder="Digite sua mensagem..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                            <button type="submit"><IoSend size={22} /></button>
                        </form>
                    </>
                ) : (
                    <div className="no-chat-selected">Selecione uma conversa para visualizar</div>
                )}
            </div>
        </div>
    );
};

export default AdminChat;