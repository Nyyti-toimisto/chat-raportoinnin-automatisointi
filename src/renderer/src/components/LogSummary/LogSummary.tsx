import styles from './logSummary.module.css';
import { useEffect, useState } from 'react';
import { AnimatedHorizLine } from '../AnimatedSvg/AnimatedHorizLine';
import { InfoBoxS } from '../InfoBoxSmall/InfoBoxS';
import TableDivider from './tableDivider/TableDivider';
import TableComponent from './tableSection/TableComponent';
import { LogSummaryRecord } from 'src/types';
import { Spin } from 'antd';

function LogSummary() {
  const [records, setRecords] = useState<LogSummaryRecord>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);

    const summaryRecords = () => {
      window.logAPI
        .logSummary()
        .then((d) => {
          if(d.pre_feedback_count === 0) {
            return;
          }
          setRecords(d);
        })
        .catch((err) => {
          setError(err.message);
        });
        setLoading(false);
    };

    summaryRecords();
  }, []);

  const states = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error! {error} </p>;
    if (!records) return <p>No data!</p>;
    return (
      <>
        <div className={styles.headerBar}>
          <InfoBoxS title="Osallistujia" value={records.total_participants} />
          <InfoBoxS title="Etupalautteita" value={records.pre_feedback_count} />
          <InfoBoxS
            title="Jälkipalautteita"
            value={records.post_feedback_count}
          />
        </div>
        <AnimatedHorizLine />
        <div className={styles.footer}>
          <TableComponent date={records.latest_post_feedback > records.latest_pre_feedback? records.latest_post_feedback : records.latest_pre_feedback} />
          <TableDivider />
          <TableComponent date={records.oldest_post_feedback < records.oldest_pre_feedback? records.oldest_post_feedback : records.oldest_pre_feedback} />
        </div>
      </>
    );
  };

  return (
    <div className={styles.logSummary__container}>
      <h1 className={styles.title}>Yhteenveto {loading ? <Spin /> : null}</h1>

      <div className={styles.content}>{states()}</div>
    </div>
  );
}

export default LogSummary;
