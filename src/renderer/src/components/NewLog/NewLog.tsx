import styles from './newlog.module.css';
import checkImage from '@renderer/assets/check.svg';
import { CustomButton } from '../Button/customButton';

function NewLog({ clickHandler }: { clickHandler: () => void }) {
  return (
    <div className={styles.newlog__container}>
      <h1>Luo uusi loki</h1>

      <div className={styles.box__container}>
        <div className={styles.instructionBox}>
          <div className={styles.instructionHeader}>
            <span className={styles.stepNumber}>1</span>
            <h3>Tarkista</h3>
          </div>
          <img src={checkImage} alt="Second step image" />
        </div>
        <div className={styles.instructionBox}>
          <div className={styles.instructionHeader}>
            <span className={styles.stepNumber}>2</span>
            <h3>Valmista!</h3>
          </div>
          <CustomButton text="Aloita" onClick={clickHandler} role="invoke" />
        </div>
      </div>
    </div>
  );
}

export default NewLog;
