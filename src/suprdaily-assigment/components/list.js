import React, { useState } from 'react';
import Modal from 'react-modal';
import styles from './list.module.scss';

function AddCardModal({ onClose, onSubmit, listId }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  return (
    <Modal
      isOpen={true}
      className={styles.modal}
      overlayClassName={styles.overlay}
      onRequestClose={onClose}
    >
      <p className={styles.title}>Title</p>
      <textarea
        className={styles.input}
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <p className={styles.title}>Text</p>
      <textarea
        className={styles.input}
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div style={{ display: 'flex' }}>
        <p
          style={{ marginLeft: 'auto' }}
          className={styles.addButton}
          onClick={onClose}
        >
          close
        </p>
        {title.length > 2 && (
          <p
            className={styles.addButton}
            onClick={() => {
              onSubmit({ title, text, listId });
              onClose();
            }}
          >
            submit
          </p>
        )}
      </div>
    </Modal>
  );
}

function Card({ title, description, cardId, listId }) {
  function handleDragStart(e) {
    e.dataTransfer.setData('cardId', cardId);
    e.dataTransfer.setData('listId', listId);
  }
  return (
    <div className={styles.card} draggable onDragStart={handleDragStart}>
      <p className={styles.title}>{title}</p>
      <p className={styles.description}>{description}</p>
    </div>
  );
}

function List({
  listId,
  title,
  list,
  cards,
  updateList,
  handleAddNewCard,
  onClearList,
}) {
  const [showModal, setShowModal] = useState(false);
  function handleDragover(e) {
    e.preventDefault();
  }

  function handleDrop(e) {
    const cardId = e.dataTransfer.getData('cardId');
    const prevListId = e.dataTransfer.getData('listId');

    updateList({ cardId, prevListId, updatedListId: listId });
  }

  return (
    <div
      className={styles.wrapper}
      onDragOver={handleDragover}
      onDrop={handleDrop}
    >
      <p className={styles.title}>{title}</p>
      <div className={styles.content}>
        {list.map((id) => (
          <Card
            title={cards[id].title}
            description={cards[id].text}
            cardId={id}
            listId={listId}
          />
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        <p
          style={{ marginRight: '20px' }}
          className={styles.addButton}
          onClick={() => onClearList(listId)}
        >
          clear list
        </p>
        <p className={styles.addButton} onClick={() => setShowModal(true)}>
          add card
        </p>
      </div>
      {showModal && (
        <AddCardModal
          listId={listId}
          onClose={() => setShowModal(false)}
          onSubmit={handleAddNewCard}
        />
      )}
    </div>
  );
}

export default List;
