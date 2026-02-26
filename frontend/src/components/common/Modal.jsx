import ReactModal from 'react-modal';
import { FiX } from 'react-icons/fi';

ReactModal.setAppElement('#root');

export default function Modal({ isOpen, onClose, title, children }) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="modal-header">
        <h3>{title}</h3>
        <button className="modal-close-btn" onClick={onClose}><FiX size={20} /></button>
      </div>
      <div className="modal-body">
        {children}
      </div>
    </ReactModal>
  );
}
