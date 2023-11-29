import NewLog from '@renderer/components/NewLog/NewLog';
import styles from './log.module.css';
import LogSummary from '@renderer/components/LogSummary/LogSummary';
import ReactModal from 'react-modal';
import ModalNewLog from '@renderer/components/ModalNewLog/ModalNewLog';
import { useRef, useState } from 'react';
import { useModalWatcher } from '@renderer/service/hooks/useModalWatcher';

function Log() {
  const modalRef = useRef(null);

  const [modalIsOpen, setIsOpen] = useState(false);

  const { stateCloser } = useModalWatcher(modalRef, setIsOpen);

  const modalClickHandler = () => {
    setIsOpen(!modalIsOpen);
  };

  return (
    <div className={styles.log__view} id="modalParent">
      <NewLog clickHandler={modalClickHandler} />
      <LogSummary />
      <div className="footerElement"></div>

      <ReactModal
        isOpen={modalIsOpen}
        className={styles.modal}
        appElement={document.getElementById('modalParent') as HTMLElement}
        style={{
          overlay: {
            backgroundColor: 'var(--background)'
          },
          content: {
            backgroundColor: 'var(--background)'
          }
        }}
      >
        <ModalNewLog ref={modalRef} onClose={stateCloser} />
      </ReactModal>
    </div>
  );
}

export default Log;
