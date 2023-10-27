import { forwardRef, useState } from 'react';
import styles from './modalNewLog.module.css';
import './steps/stepStyles.css';
import { Steps } from 'antd';
import Login from './steps/Login';
import Prefill, { PrefillProps } from './steps/Prefill';
import Check from './steps/Check';
import { CloseCircleOutlined } from '@ant-design/icons';
import { pingNinChatCredentials } from '../../service/api/NinChat';
import { useCustomForm } from '@renderer/service/hooks/useForm';
import { Credentials, NinServerMeta } from 'src/types';

const stepItems = [
  {
    title: 'Kirjaudu sisään',
    description: 'Omilla Ninchat tunnuksilla'
  },
  {
    title: 'Esitiedot',
    description: 'Täytä chatin esitiedot'
  },
  {
    title: 'Tarkista',
    description: 'Tarkista että tiedot on oikein'
  },
  {
    title: 'Valmis'
  }
];

type ModalNewLogProps = {
  onClose: () => void;
};

const ModalNewLog = forwardRef(function ModalNewLog(
  props: ModalNewLogProps,
  ref: React.Ref<HTMLDivElement>
) {
  const [activeStep, setActiveStep] = useState(0);
  const [credentials, setCredentials] = useState<Credentials>({ username: '', password: '' });
  const [serverValues, setServerValues] = useState<NinServerMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ status: number; statusText: string } | null>(null);

  const prefillInitialState: PrefillProps['values'] = {
    date: '',
    supervisors: '',
    topic: '',
    comments: '',
    details: ''
  };
  const { values, handleChange } = useCustomForm(prefillInitialState);

  const stepComponents = {
    0: <Login onChange={setCredentials} />,
    1: <Prefill values={values} handleChange={handleChange} />,
    2: <Check userValues={values} serverValues={serverValues} loading={loading} />,
    3: loading ? <p>Ladataan...</p> : <p>Valmista! Voit sulkea ikkunan</p>
  };

  const handleStateChange = (state: 1 | -1) => {
    setError(null);
    if (activeStep === 0 && state === 1) {
      setError(null);
      setLoading(true);
      pingNinChatCredentials(credentials)
        .then(() => {
          setLoading(false);
        })
        .catch((err) => {
          setTimeout(() => {
            setLoading(false);
            setActiveStep(0);
            setError(err);
          }, 1000);
        });
    }
    if (activeStep === 1 && state === 1) {
      setLoading(true);
      setError(null);
      window.logAPI
        .loadState(credentials, values)
        .then((d) => {
          setServerValues(d);
          setLoading(false);
        })
        .catch((err) => {
          setError({ status: 500, statusText: err.message })
          setLoading(false)
        })
    }

    if (activeStep === 2 && state === 1) {
      setLoading(true);
      setError(null);
      window.logAPI.processState().then(() => {
        setLoading(false);
      })
        .catch((err) => {
          setError({ status: 500, statusText: err.message })
          setLoading(false)
          setActiveStep(2)
        })
    }

    if (activeStep >= 0 && state === 1) {
      setActiveStep((prev) => prev + 1);
      return;
    } else if (activeStep <= 3 && state === -1) {
      setActiveStep((prev) => prev - 1);
      return;
    }
  };

  return (
    <div className={styles.container} ref={ref}>
      <div className={styles.left}>
        {!loading && <div className={styles.leftBody}>{stepComponents[activeStep]}</div>}
        {error && (
          <div className={styles.error}>
            <p>Tapahtui virhe</p>
            <p>
              {error.status} {error.statusText}
            </p>
          </div>
        )}
      </div>

      <div className={styles.right}>
        <Steps direction="vertical" current={activeStep} items={stepItems} />
        <div className={styles.leftFooterActions}>
          <button
            disabled={activeStep <= 0 || activeStep === 3 || loading}
            onClick={() => handleStateChange(-1)}
          >
            Edellinen
          </button>

          <button onClick={() => handleStateChange(1)} disabled={activeStep >= 3 || loading}>
            {loading ? 'Ladataan...' : 'Seuraava'}
          </button>
        </div>
      </div>
      <CloseCircleOutlined className={styles.exitButton} onClick={() => props.onClose()} />
    </div>
  );
});

export default ModalNewLog;
