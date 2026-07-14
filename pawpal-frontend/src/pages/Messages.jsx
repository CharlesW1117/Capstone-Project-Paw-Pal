import { useMemo, useState } from "react";
import ChatWindow from "../components/ChatWindow";
import MessageList from "../components/MessageList";
import { getCurrentSession } from "../services/authServices";
import "./Messages.css";

function Messages() {
  const session = useMemo(() => getCurrentSession(), []);

  const [conversations] = useState([]);
  const [messagesByConversation] = useState({});
  const [selectedConversationId, setSelectedConversationId] =
    useState(null);

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedConversationId,
  );

  const selectedMessages = selectedConversationId
    ? messagesByConversation[selectedConversationId] || []
    : [];

  return (
    <main className="messages-page main-content">
      <header className="messages-page__header">
        <p className="messages-page__eyebrow">Messages</p>
        <h1>Inbox</h1>
      </header>

      <section
        className="messages-page__workspace"
        aria-label="Messaging"
      >
        <aside className="messages-page__sidebar">
          <header className="messages-page__sidebar-header">
            <h2>Conversations</h2>
          </header>

          <MessageList
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onSelectConversation={setSelectedConversationId}
            isLoading={false}
            error=""
          />
        </aside>

        <div className="messages-page__chat">
          <ChatWindow
            conversation={selectedConversation}
            messages={selectedMessages}
            currentUserId={session?.id}
            onSendMessage={null}
            isLoading={false}
            isSending={false}
            error=""
          />
        </div>
      </section>
    </main>
  );
}

export default Messages;