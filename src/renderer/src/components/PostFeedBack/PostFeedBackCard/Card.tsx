import { PostFeedBackQuestionSummary } from 'src/types';
import styles from './card.module.css';
import { Card } from 'antd';

const sortAnswers = function (a, b) {
    const sortValues = {
        'Täysin samaa mieltä': 0,
        'Jokseenkin samaa mieltä': 1,
        'Ei samaa eikä eri mieltä': 2,
        'Jokseenkin eri mieltä': 3,
        'Täysin eri mieltä': 4
    };

    if (sortValues[a.answer] > sortValues[b.answer]) {
        return 1;
    }
    if (sortValues[a.answer] < sortValues[b.answer]) {
        return -1;
    }
    return 0;
};

function CardWrapper(props: { data: PostFeedBackQuestionSummary }) {
    const { question, answers } = props.data;
    if (!question || !answers) return <p>no data</p>;

    let ordered = Object.keys(answers)
        .sort()
        .reverse()
        .reduce((obj, key) => {
            obj[key] = answers[key];
            return obj;
        }, {});

    ordered = Object.entries(ordered)
        .map((e) => e[1])
        .sort(sortAnswers);

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
                        <p>
                            {Object.keys(answers).reduce(
                                (prev, key) => prev + answers[key].count,
                                0
                            )}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default CardWrapper;
