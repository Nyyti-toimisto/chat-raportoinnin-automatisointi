import { PostFeedBackQuestionSummary } from 'src/types';
import styles from './card.module.css';
import { Card } from 'antd';

function CardWrapper(props: { data: PostFeedBackQuestionSummary }) {
  const { question, answers } = props.data;
  if (!question || !answers) return <p>no data</p>;

  const ordered = Object.keys(answers).sort().reverse().reduce(
    (obj, key) => { 
      obj[key] = answers[key]; 
      return obj;
    }, 
    {}
  );


  return (
    <div className={styles.container}>
      <Card title={question} size="small" className={styles.card}>
        {Object.keys(ordered).map((key) => (
          <div className={styles.row} key={key}>
            <p key={key}>{ordered[key].answer}:</p>
            <p>{ordered[key].count}</p>
          </div>
        ))}
        <div className={styles.footer}>
          <div className={styles.row}>
            <p>Vastauksia yhteensä</p>
            <p>{Object.keys(answers).reduce((prev, key) => prev + answers[key].count, 0)}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CardWrapper;
