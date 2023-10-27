import { useEffect, useState } from 'react';
import CardWrapper from './PostFeedBackCard/Card';
import styles from './postFeedBack.module.css';
import { DateProps, PostFeedBackQuestionSummary } from 'src/types';
import { separateBooleanAnswers } from '@renderer/service/util';

function PostFeedBack(props: DateProps) {
  const { dates } = props;

  const [postFeedback, setPostFeedback] = useState<PostFeedBackQuestionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchRecords = async (): Promise<void> => {
    setLoading(true);
    await window.summaryAPI
      .postFeedBack({ start: dates?.[0]?.toISOString(), end: dates?.[1]?.toISOString() }, true)
      .then((d) => {
        const modified = separateBooleanAnswers(d);
        setPostFeedback(modified);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      });
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchRecords();
  }, [props]);

  if (error) return <p>Error!</p>;

  return (
    <div className={styles.container}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        postFeedback.map((record) => <CardWrapper key={record.question_hash} data={record} />)
      )}
    </div>
  );
}

export default PostFeedBack;
