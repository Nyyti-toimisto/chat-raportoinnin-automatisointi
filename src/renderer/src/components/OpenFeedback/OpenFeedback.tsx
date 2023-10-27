import { useEffect, useState } from 'react';
import styles from './openFeedback.module.css';
import { DateProps, PostFeedBackQuestionSummary } from 'src/types';
import Table, { ColumnsType } from 'antd/es/table';

const columns: ColumnsType<PostFeedBackQuestionSummary> = [
  { title: 'Kysymys', dataIndex: 'question', key: 'question_hash' }
];

function OpenFeedback(props: DateProps) {
  const { dates } = props;

  const [postOpenFeedBack, setPostOpenFeedBack] = useState<PostFeedBackQuestionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchRecords = (): void => {
    setLoading(true);
    window.summaryAPI
      .postFeedBack({ start: dates?.[0]?.toISOString(), end: dates?.[1]?.toISOString() }, false)
      .then((d) => {
        const d2 = d.map(d=> ({...d, key: d.question_hash}))
        setPostOpenFeedBack(d2)
      }
      )
      .catch((err) => {
        console.log(err);
        setError(true);
      });

    setTimeout(() => {
      setLoading(false);
    }, 200);
  };

  useEffect(() => {
    setLoading(true);
    fetchRecords();

    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, []);

  if (error) {
    return <div>Virhe</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Avoin loppupalaute</h3>

        <div className={styles.search}>
          <input type="text" placeholder="Hae avoimesta palautteesta" />
          <button>Hae</button>
        </div>
      </div>
      <div className={styles.content}>
        <Table
          columns={columns}
          expandable={{
            expandedRowRender: (record) => <div key={record.question_hash} style={{ margin: 0 }}>
              {Object.keys(record.answers).map((key) => (
                <p key={key} className={styles.openFeedBackRow}>
                  {record.answers[key].answer}
                </p>
              ))}

            </div>
          }}
          dataSource={loading && !postOpenFeedBack ? [] : postOpenFeedBack}
        />
      </div>
    </div>
  );
}

export default OpenFeedback;
