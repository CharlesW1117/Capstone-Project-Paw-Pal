import { useState } from "react";
import "./ChatWindow.css";

function getInitials(name) {
  if (!name) {
    return "PP";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function formatMessageTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function ChatWindow({
  conversation,
  messages,
  currentUserId,
  onSendMessage,
  isLoading,
  isSending,
  error,
}) {
  const [draft, setDraft] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const normalizedMessage = draft.trim();

    if (!normalizedMessage || !onSendMessage || isSending) {
      return;
    }

    const wasSent = await onSendMessage(normalizedMessage);

    if (wasSent !== false) {
      setDraft("");
    }
  }

  if (!conversation) {
    return (
      <div className="chat-window__empty">
        <i className="fi fi-rr-comments" aria-hidden="true" />
        <h2>Select a conversation</h2>
        <p>Choose a conversation to view its messages.</p>
      </div>
    );
  }

  return (
    <section
      className="chat-window"
      aria-labelledby="chat-window-heading"
    >
      <header className="chat-window__header">
        <div className="chat-window__avatar" aria-hidden="true">
          {getInitials(conversation.participantName)}
        </div>

        <div>
          <h2 id="chat-window-heading">
            {conversation.participantName || "PawPal user"}
          </h2>

          {conversation.bookingLabel && (
            <p>{conversation.bookingLabel}</p>
          )}
        </div>
      </header>

      <div
        className="chat-window__messages"
        aria-live="polite"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <div className="chat-window__loading" role="status">
            <span
              className="chat-window__spinner"
              aria-hidden="true"
            />
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="chat-window__no-messages">
            <i className="fi fi-rr-comment-alt" aria-hidden="true" />
            <p>No messages yet</p>
          </div>
        ) : (
          <ol>
            {messages.map((message) => {
              const isCurrentUser =
                String(message.senderId) === String(currentUserId);

              return (
                <li
                  key={message.id}
                  className={
                    isCurrentUser
                      ? "chat-window__message chat-window__message--sent"
                      : "chat-window__message chat-window__message--received"
                  }
                >
                  <div>
                    <p>{message.body}</p>
                    <time dateTime={message.createdAt}>
                      {formatMessageTime(message.createdAt)}
                    </time>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {error && (
        <div className="chat-window__error" role="alert">
          <i
            className="fi fi-rr-triangle-warning"
            aria-hidden="true"
          />
          <span>{error}</span>
        </div>
      )}

      <form className="chat-window__composer" onSubmit={handleSubmit}>
        <label className="chat-window__visually-hidden" htmlFor="message-draft">
          Message
        </label>

        <textarea
          id="message-draft"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          disabled={isSending}
          maxLength="2000"
          rows="1"
          placeholder="Write a message"
        />

        <button
          type="submit"
          disabled={!draft.trim() || isSending || !onSendMessage}
          aria-label="Send message"
          title="Send message"
        >
          {isSending ? (
            <span className="chat-window__spinner" aria-hidden="true" />
          ) : (
            <i className="fi fi-rr-paper-plane" aria-hidden="true" />
          )}
        </button>
      </form>
    </section>
  );
}

export default ChatWindow;