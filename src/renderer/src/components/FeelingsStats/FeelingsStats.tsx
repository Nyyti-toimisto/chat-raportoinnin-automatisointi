import { FeelsStats } from 'src/types';
import { InfoBoxS } from '../InfoBoxSmall/InfoBoxS';
import styles from './feelingsStats.module.css';

function FeelingsStats({ props }: { props: FeelsStats }) {
    return (
        <div className={styles.container}>
            <div className={styles.body}>
                <InfoBoxS title="Positiivinen" value={props.positive} />
                <InfoBoxS title="Neutraali" value={props.neutral} />
                <InfoBoxS title="Negatiivinen" value={props.negative} />
            </div>
        </div>
    );
}

export default FeelingsStats;
