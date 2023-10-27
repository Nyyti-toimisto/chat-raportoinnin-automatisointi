import styles from './summary.module.css';
import { useState } from 'react';
import DateBar, { RangeValue } from '@renderer/components/DateBar/DateBar';
import PreFeedBack from '@renderer/components/PreFeedBack/PreFeedBack';
import OpenFeedback from '@renderer/components/OpenFeedback/OpenFeedback';
import PostFeedBack from '@renderer/components/PostFeedBack/PostFeedBack';

function Summary() {
  const [range, setRange] = useState<RangeValue>(null);

  return (
    <div className={styles.body}>
      <DateBar setDates={setRange} />
      <h1>Alkupalaute</h1>

      <PreFeedBack dates={range} />
      <h1>Loppupalaute</h1>
      <PostFeedBack dates={range} />
      <OpenFeedback dates={range} />
      <div className="footerElement"></div>
    </div>
  );
}

export default Summary;
