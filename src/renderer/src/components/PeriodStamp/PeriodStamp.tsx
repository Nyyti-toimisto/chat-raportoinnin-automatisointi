import moment from 'moment';
import styles from './periodStamp.module.css';

type PeriodStampProps = {
  start?: string;
  end?: string;
};

export const PeriodStamp = (props: PeriodStampProps | undefined) => {
  const dateInformation = {
    start: props?.start ? moment(props.start).format('DD.MM.YYYY') : '',
    end: props?.start ? moment(props.end).format('DD.MM.YYYY') : ''
  };

  return (
    <div className={styles.container}>
      <h3>
        {dateInformation.start} - {dateInformation.end}
      </h3>
      <h3>{moment(props?.end).diff(props?.start, 'days')} Päivää</h3>
    </div>
  );
};
