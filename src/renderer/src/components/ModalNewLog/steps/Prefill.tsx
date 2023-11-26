import { Input } from 'antd';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

// TODO: Add type

const { TextArea } = Input;

export type PrefillProps = {
  values: {
    date: string;
    supervisors: string;
    topic: string;
    comments: string;
    details: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChange: (event: any) => void;
};

function Prefill(props: PrefillProps) {

  const { values, handleChange } = props;


  return (
    <div className="step__container">
      <h1>Täytä esitiedot</h1>

      <div className="step__body" style={{ width: '25rem' }}>
        <DatePicker
          placeholder="Chatin päivämäärä"
          format={'DD.MM.YYYY'}
          value={values.date ? dayjs(values.date, 'YYYY-MM-DD') : null}
          onChange={(date) => {
            handleChange({ target: { name: 'date', value: date?.format('YYYY-MM-DD') } });
          }}
        />

        <Input
          placeholder="Valvojat"
          value={values.supervisors}
          name="supervisors"
          onChange={handleChange}
        />

        <TextArea
          autoSize={{ minRows: 1, maxRows: 3 }}
          placeholder="Chatin aihe"
          maxLength={200}
          showCount
          defaultValue="opiskelut"
          value={values.topic}
          name="topic"
          onChange={handleChange}
          required
        />

        <TextArea
          autoSize={{ minRows: 3, maxRows: 5 }}
          placeholder="Miten chat sujui?"
          maxLength={400}
          showCount
          value={values.comments}
          name="comments"
          onChange={handleChange}
        />

        <TextArea
          autoSize={{ minRows: 3, maxRows: 5 }}
          placeholder="Muut kommentit"
          maxLength={400}
          showCount
          value={values.details}
          name="details"
          onChange={handleChange}
        />
      </div>

      <div className="step__footer"></div>
    </div>
  );
}

export default Prefill;
