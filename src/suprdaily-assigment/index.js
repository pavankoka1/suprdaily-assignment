import React from 'react';
import List from './components/lists';
import styles from './index.module.scss';

function Index() {
  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>Trello Board</p>
      <List />
    </div>
  );
}

export default Index;
