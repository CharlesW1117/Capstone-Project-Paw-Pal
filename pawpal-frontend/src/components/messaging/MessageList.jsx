import "./MessageList.css";

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

function formatConversationTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  if (isToday) {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function MessageList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  isLoading,
  error,
  onRetry,
}) {
  if (isLoading) {
    return (
      <div className="message-list__status" role="status">
        <span className="message-list__spinner" aria-hidden="true" />
        <span>Loading conversations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="message-list__error" role="alert">
        <i
          className="fi fi-rr-triangle-warning"
          aria-hidden="true"
        />
        <p>{error}</p>

        {onRetry && (
          <button type="button" onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="message-list__empty">
        <i className="fi fi-rr-comment-alt" aria-hidden="true" />
        <h2>No conversations yet</h2>
      </div>
    );
  }

  return (
    <nav className="message-list" aria-label="Conversations">
      <ul>
        {conversations.map((conversation) => {
          const isSelected =
            conversation.id === selectedConversationId;

          return (
            <li key={conversation.id}>
              <button
                className={`message-list__conversation ${
                  isSelected
                    ? "message-list__conversation--selected"
                    : ""
                }`}
                type="button"
                onClick={() => onSelectConversation(conversation.id)}
                aria-current={isSelected ? "true" : undefined}
              >
                <span
                  className="message-list__avatar"
                  aria-hidden="true"
                >
                  {getInitials(conversation.participantName)}
                </span>

                <span className="message-list__content">
                  <span className="message-list__top-row">
                    <strong>
                      {conversation.participantName || "PawPal user"}
                    </strong>

                    <time dateTime={conversation.updatedAt}>
                      {formatConversationTime(
                        conversation.updatedAt,
                      )}
                    </time>
                  </span>

                  <span className="message-list__bottom-row">
                    <span>
                      {conversation.lastMessage ||
                        "No messages in this conversation."}
                    </span>

                    {conversation.unreadCount > 0 && (
                      <b aria-label={`${conversation.unreadCount} unread`}>
                        {conversation.unreadCount}
                      </b>
                    )}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default MessageList;