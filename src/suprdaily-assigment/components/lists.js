import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import List from './list';
import styles from './lists.module.scss';

function generateUniqueId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function AddListModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState('');

  function handleChange(e) {
    setTitle(e.target.value);
  }

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
        onChange={handleChange}
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
          <p className={styles.addButton} onClick={() => onSubmit(title)}>
            submit
          </p>
        )}
      </div>
    </Modal>
  );
}

const testListIds = ['123', '234', '345', '456'];

const testListByids = {
  123: 'list 1',
  234: 'list 2',
  345: 'list 3',
  456: 'list 4',
};

const testlistOfCardIds = {
  123: ['1', '2', '3'],
  234: ['4', '5', '6'],
  345: ['7', '8', '9'],
  456: ['10', '11', '12'],
};

const testCardIds = {
  1: {
    title: 'title 1',
    text: 'meaningful text 1',
  },
  2: {
    title: 'title 2',
    text: 'meaningful text 2',
  },
  3: {
    title: 'title 3',
    text: 'meaningful text 3',
  },
  4: {
    title: 'title 4',
    text: 'meaningful text 4',
  },
  5: {
    title: 'title',
    text: 'meaningful text',
  },
  6: {
    title: 'title',
    text: 'meaningful text',
  },
  7: {
    title: 'title',
    text: 'meaningful text',
  },
  8: {
    title: 'title',
    text: 'meaningful text',
  },
  9: {
    title: 'title',
    text: 'meaningful text',
  },
  10: {
    title: 'title',
    text: 'meaningful text',
  },
  11: {
    title: 'title',
    text: 'meaningful text',
  },
  12: {
    title: 'title',
    text: 'meaningful text',
  },
};

function Lists() {
  useEffect(() => {
    if (!localStorage.getItem('isMounted')) {
      localStorage.setItem('isMounted', true);
      localStorage.setItem('listIds', JSON.stringify(testListIds));
      localStorage.setItem('listByIds', JSON.stringify(testListByids));
      localStorage.setItem('listOfCardIds', JSON.stringify(testlistOfCardIds));
      localStorage.setItem('cards', JSON.stringify(testCardIds));
    }
  }, []);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [listIds, setListIds] = useState(
    JSON.parse(localStorage.getItem('listIds')) || testListIds
  );
  const [listByIds, setListByIds] = useState(
    JSON.parse(localStorage.getItem('listByIds')) || testListByids
  );
  const [listOfCardIds, setListOfCardIds] = useState(
    JSON.parse(localStorage.getItem('listOfCardIds')) || testlistOfCardIds
  );
  const [cards, setCards] = useState(
    JSON.parse(localStorage.getItem('cards')) || testCardIds
  );
  const [showAddListModal, setShowAddListModal] = useState(false);

  function handleCloseAddListModal() {
    setShowAddListModal(false);
  }

  function handleAddNewList(title) {
    const id = generateUniqueId();

    const updatedListIds = listIds;
    updatedListIds.push(id);
    setListIds(updatedListIds);
    localStorage.setItem('listIds', JSON.stringify(updatedListIds));

    const updatedListByIds = listByIds;
    updatedListByIds[id] = title;
    setListByIds(updatedListByIds);
    localStorage.setItem('listByIds', JSON.stringify(updatedListByIds));

    const updatedListOfCardIds = listOfCardIds;
    updatedListOfCardIds[id] = [];
    setListOfCardIds(updatedListOfCardIds);
    localStorage.setItem('listOfCardIds', JSON.stringify(updatedListOfCardIds));

    setShowAddListModal(false);
  }

  function handleClearList(listId) {
    const updatedListIds = listIds.filter((id) => id !== listId);
    setListIds(updatedListIds);
    localStorage.setItem('listIds', JSON.stringify(updatedListIds));

    setForceUpdate(!forceUpdate);
  }

  function handleAddNewCard({ title, text, listId }) {
    const id = generateUniqueId();

    const updatedCards = cards;
    updatedCards[id] = { title, text };
    setCards(updatedCards);
    localStorage.setItem('cards', JSON.stringify(updatedCards));

    const updatedListOfCardIds = listOfCardIds;
    updatedListOfCardIds[listId].push(id);
    setListOfCardIds(updatedListOfCardIds);
    localStorage.setItem('listOfCardIds', JSON.stringify(updatedListOfCardIds));

    setForceUpdate(!forceUpdate);
  }

  function handleUpdateList({ cardId, prevListId, updatedListId }) {
    if (prevListId === updatedListId) {
      return;
    }

    const updatedListOfCardIds = listOfCardIds;
    updatedListOfCardIds[prevListId] = updatedListOfCardIds[prevListId].filter(
      (id) => id !== cardId
    );

    updatedListOfCardIds[updatedListId].push(cardId);
    setListOfCardIds(updatedListOfCardIds);
    localStorage.setItem('listOfCardIds', JSON.stringify(updatedListOfCardIds));

    setForceUpdate(!forceUpdate);
  }

  return (
    <div className={styles.wrapper}>
      {listIds.length < 5 && (
        <p
          className={styles.addButton}
          onClick={() => setShowAddListModal(true)}
        >
          add list
        </p>
      )}
      <div className={styles.lists}>
        {listIds.map((id) => (
          <List
            listId={id}
            title={listByIds[id]}
            list={listOfCardIds[id]}
            cards={cards}
            updateList={handleUpdateList}
            onClearList={handleClearList}
            handleAddNewCard={handleAddNewCard}
          />
        ))}
      </div>
      {showAddListModal && (
        <AddListModal
          onClose={handleCloseAddListModal}
          onSubmit={handleAddNewList}
        />
      )}
    </div>
  );
}

export default Lists;
