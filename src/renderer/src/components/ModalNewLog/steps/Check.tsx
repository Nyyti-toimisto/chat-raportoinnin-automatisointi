import { Descriptions, ConfigProvider } from 'antd';
import type { DescriptionsProps } from 'antd';
import { PrefillProps } from './Prefill';
import { NinServerMeta } from 'src/types';
import moment from 'moment';

function Check(props: { userValues: PrefillProps['values']; serverValues: NinServerMeta | null , loading: boolean}) {
  
  const { userValues, serverValues, loading } = props;
  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Päivämäärä',
      children: userValues.date,
      span: 1
    },
    {
      key: '2',
      label: 'Valvojat',
      children: userValues.supervisors,
      span: 1
    },
    {
      key: '3',
      label: 'Aihe',
      children: userValues.topic,
      span: 2
    },
    {
      key: '4',
      label: 'Miten chat sujui?',
      children: userValues.comments,
      span: 3
    },
    {
      key: '5',
      label: 'Muut kommentit',
      children: userValues.details,
      span: 4
    }
  ];

  const ninchatItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Palautteiden määrä',
      children: `${serverValues?.count} kpl`,
      span: 2
    },
    {
      key: '2',
      label: 'Käyttäjiä',
      children: `${serverValues?.userCount} kpl`,
      span: 2
    },
    {
      key: '3',
      label: 'Palautteiden aikaväli',
      children: `${moment(serverValues?.dates.min).format('DD.MM.YYYY HH:MM:SS')} - ${moment(
        serverValues?.dates.max
      ).format('DD.MM.YYYY HH:MM:SS')}`,
      span: 2
    }
  ];

  return (
    <div className="step__container" style={{ maxHeight: '45rem' }}>
      <h1>Tarkista tiedot</h1>

      <div className="step__body" style={{ width: '90%', overflow: 'auto' }}>
        <ConfigProvider
          theme={{
            components: {
              Descriptions: {
                contentColor: 'var(--color-text-primary)',
                titleColor: 'var(--color-text-primary)',
                titleMarginBottom: 4
              }
            }
          }}
        >
          <Descriptions title="Esitiedot" items={items} layout="vertical" />
          {loading ? <p>Loading...</p> : 
          <Descriptions title="Ninchat palautteet" items={ninchatItems} layout="vertical" />}
        </ConfigProvider>
      </div>

      <div className="step__footer"></div>
    </div>
  );
}

export default Check;
