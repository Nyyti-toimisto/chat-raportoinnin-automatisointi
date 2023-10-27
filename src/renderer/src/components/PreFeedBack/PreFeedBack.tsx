import { DateProps, PreFeedBackStatsSummary } from 'src/types';
import BarChartContainer from '../Charts/BarChartContainer';
import LineChartContainer from '../Charts/LineChartContainer';
import PieChartContainer from '../Charts/PieChartContainer';
import FeelingsStats from '../FeelingsStats/FeelingsStats';
import styles from './preFeedBack.module.css';
import { useState, useEffect } from 'react';
import { PeriodStamp } from '../PeriodStamp/PeriodStamp';

function PreFeedBack(props: DateProps) {
  const { dates } = props;

  const [preRecords, setpreRecords] = useState<PreFeedBackStatsSummary>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRecords = async (): Promise<void> => {
    await window.summaryAPI
      .summaryPreFeedback({ start: dates?.[0]?.toISOString(), end: dates?.[1]?.toISOString() })
      .then((d) => {
        if (!d) {
          setError('No data');
          return
        }
        console.log(d);
        setpreRecords(d);
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
      });
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchRecords();
  }, [props]);

  if (!preRecords) {
    return <p>No data</p>;
  }

  return (
    <div className={styles.container}>
      <PeriodStamp {...preRecords.range} />
      <div className={styles.body}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div>
              <h3>Fiilikseni tänään</h3>
              {preRecords?.feels ? <FeelingsStats props={preRecords.feels} /> : <p>No data</p>}
            </div>
            <div>
              <h3>Ikä</h3>
              <BarChartContainer props={preRecords.age} />
            </div>
            <div>
              <h3>Sukupuoli</h3>
              <PieChartContainer props={preRecords.gender} />
            </div>
          </>
        )}
        {error && <p>{error}</p>}
      </div>

      <div className={styles.footer}>
        {loading ? <p>Loading...</p> : <LineChartContainer props={preRecords.chart} />}
      </div>
    </div>
  );
}

export default PreFeedBack;
