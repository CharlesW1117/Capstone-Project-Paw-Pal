import { useEffect, useId } from "react";
import "./Modal.css";

function Modal({
  title,
  children,
  onClose,
  isCloseDisabled = false,
}) {
  const titleId = useId();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape" && !isCloseDisabled) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCloseDisabled, onClose]);

  function handleBackdropMouseDown(event) {
    if (event.target === event.currentTarget && !isCloseDisabled) {
      onClose();
    }
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={handleBackdropMouseDown}
      role="presentation"
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="modal__header">
          <h2 id={titleId}>{title}</h2>

          <button
            className="modal__close"
            type="button"
            onClick={onClose}
            disabled={isCloseDisabled}
            aria-label="Close dialog"
            title="Close"
          >
            <i className="fi fi-rr-cross-small" aria-hidden="true" />
          </button>
        </header>

        <div className="modal__body">{children}</div>
      </section>
    </div>
  );
}

export default Modal;