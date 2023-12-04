import styles from './infoBoxS.module.css';

type InfoBoxSProps = {
    title: string;
    value?: number;
};

export const InfoBoxS = (props: InfoBoxSProps) => {
    return (
        <div className={styles.box}>
            <span>{props.value}</span>
            <h4>{props.title}</h4>
        </div>
    );
};
