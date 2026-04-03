import React from "react";

const Modal = ({ message, type, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className={`modal-icon ${type}`}>
          {type === 'success' ? '✅' : '❌'}
        </div>
        <h3 className={`modal-title ${type}`}>
          {type === 'success' ? 'Success!' : 'Error!'}
        </h3>
        <p className="modal-message">{message}</p>
        <button className="submit-btn" onClick={onClose}>Okay</button>
      </div>
    </div>
  );
};

export default Modal;