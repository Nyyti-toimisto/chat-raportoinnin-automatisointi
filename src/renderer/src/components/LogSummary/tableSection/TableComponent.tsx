import styles from './tableSection.module.css';
import moment from 'moment';

type props = {
  date: string;
}

function TableComponent({ date }: props) {
  return (
    <table className={styles.customTable}>
      <tbody>
        <tr>
          <th>Palautteen pvm</th>
          <td>{moment(date).format('DD.MM.YYYY')}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default TableComponent;
