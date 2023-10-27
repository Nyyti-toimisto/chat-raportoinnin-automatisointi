import { OldestOrNewestRecord } from 'src/types';
import styles from './tableSection.module.css';
import moment from 'moment';

function TableComponent({ props }: { props: OldestOrNewestRecord }) {
  return (
    <table className={styles.customTable}>
      <tbody>
        <tr>
          <th>Pvm</th>
          <td>{moment(props.chat_date).format('DD.MM.YYYY')}</td>
        </tr>
        <tr>
          <th>Koko</th>
          <td>{props.post_feedback_count + props.pre_feedback_count} palautetta</td>
        </tr>
        <tr>
          <th>Valvojat</th>
          <td>{props.hosts}</td>
        </tr>
        <tr>
          <th>Osallistujia</th>
          <td>{props.total_participants}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default TableComponent;
