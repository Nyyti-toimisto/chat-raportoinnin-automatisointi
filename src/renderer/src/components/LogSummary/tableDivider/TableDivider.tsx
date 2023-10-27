import verticalLine from '@renderer/assets/verticalLine.svg';
import styles from './tableDivider.module.css';

export default function TableDivider() {
  return (
    <div className={styles.divider__container}>
      <p>Tuorein</p>
      <img src={verticalLine} alt="Pystyviiva" />
      <p>Vanhin</p>
    </div>
  );
}
