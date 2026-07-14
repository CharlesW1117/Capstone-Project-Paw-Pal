import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ChatWindow from "../components/messaging/ChatWindow";
import MessageList from "../components/messaging/MessageList";
import { getCurrentSession } from "../services/authServices";
import {
  getBookingMessages,
  getConversations,
  sendMessage,
} from "../services/messageService";
import "./Messages.css";

function sortConversations(conversations) {
  return [...conversations].sort((first, second) => {
    const firstTime = new Date(first.updatedAt).getTime();
    const secondTime = new Date(second.updatedAt).getTime();

    return secondTime - firstTime;
  });
}

function Messages() {
  const session = useMemo(() => getCurrentSession(), []);
  const messageRequestId = useRef(0);

  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] =
    useState(null);
  const [messages, setMessages] = useState([]);

  const [isLoadingConversations, setIsLoadingConversations] =
    useState(true);
  const [conversationsError, setConversationsError] =
    useState("");

  const [isLoadingMessages, setIsLoadingMessages] =
    useState(false);
  const [messagesError, setMessagesError] = useState("");

  const [isSending, setIsSending] = useState(false);

  const selectedConversation = conversations.find(
    (conversation) =>
      String(conversation.id) ===
      String(selectedConversationId),
  );

  const loadConversations = useCallback(async () => {
    setIsLoadingConversations(true);
    setConversationsError("");

    try {
      const conversationResults = await getConversations();
      const sortedResults = sortConversations(conversationResults);

      setConversations(sortedResults);

      setSelectedConversationId((currentId) => {
        const currentConversationStillExists =
          sortedResults.some(
            (conversation) =>
              String(conversation.id) === String(currentId),
          );

        if (currentConversationStillExists) {
          return currentId;
        }

        return sortedResults[0]?.id || null;
      });
    } catch (requestError) {
      setConversationsError(
        requestError.message ||
          "Unable to load your conversations.",
      );
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  const loadMessages = useCallback(async (bookingId) => {
    if (!bookingId) {
      setMessages([]);
      setMessagesError("");
      return;
    }

    const requestId = messageRequestId.current + 1;
    messageRequestId.current = requestId;

    setIsLoadingMessages(true);
    setMessagesError("");

    try {
      const messageResults =
        await getBookingMessages(bookingId);

      if (messageRequestId.current !== requestId) {
        return;
      }

      setMessages(messageResults);

      setConversations((currentConversations) =>
        currentConversations.map((conversation) =>
          String(conversation.bookingId) === String(bookingId)
            ? {
                ...conversation,
                unreadCount: 0,
              }
            : conversation,
        ),
      );
    } catch (requestError) {
      if (messageRequestId.current !== requestId) {
        return;
      }

      setMessages([]);
      setMessagesError(
        requestError.message ||
          "Unable to load this conversation.",
      );
    } finally {
      if (messageRequestId.current === requestId) {
        setIsLoadingMessages(false);
      }
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    loadMessages(selectedConversation?.bookingId);
  }, [loadMessages, selectedConversation?.bookingId]);

  async function handleSendMessage(body) {
    if (!selectedConversation) {
      return false;
    }

    setIsSending(true);
    setMessagesError("");

    try {
      const createdMessage = await sendMessage(
        selectedConversation.bookingId,
        body,
      );

      setMessages((currentMessages) => [
        ...currentMessages,
        createdMessage,
      ]);

      setConversations((currentConversations) => {
        const updatedConversations = currentConversations.map(
          (conversation) =>
            conversation.id === selectedConversation.id
              ? {
                  ...conversation,
                  lastMessage: createdMessage.body,
                  updatedAt: createdMessage.createdAt,
                  unreadCount: 0,
                }
              : conversation,
        );

        return sortConversations(updatedConversations);
      });

      return true;
    } catch (requestError) {
      setMessagesError(
        requestError.message || "Unable to send this message.",
      );

      return false;
    } finally {
      setIsSending(false);
    }
  }

  async function refreshMessages() {
    await loadConversations();

    if (selectedConversation?.bookingId) {
      await loadMessages(selectedConversation.bookingId);
    }
  }

  const isRefreshing =
    isLoadingConversations || isLoadingMessages;

  return (
    <main className="messages-page main-content">
      <header className="messages-page__header">
        <div>
          <p className="messages-page__eyebrow">Messages</p>
          <h1>Inbox</h1>
        </div>

        <button
          className="messages-page__refresh"
          type="button"
          onClick={refreshMessages}
          disabled={isRefreshing}
        >
          <i className="fi fi-rr-refresh" aria-hidden="true" />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
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
            isLoading={isLoadingConversations}
            error={conversationsError}
            onRetry={loadConversations}
          />
        </aside>

        <div className="messages-page__chat">
          <ChatWindow
            conversation={selectedConversation}
            messages={messages}
            currentUserId={session?.id}
            onSendMessage={handleSendMessage}
            isLoading={isLoadingMessages}
            isSending={isSending}
            error={messagesError}
          />
        </div>
      </section>
    </main>
  );
}

export default Messages;