import styles from './logPreview.module.css';

function LogPreview() {
  return (
    <div className={styles.container}>
      <h1>Esikatselu</h1>
      <div className={styles.previewContent}>jottai tääl</div>
    </div>
  );
}

export default LogPreview;
