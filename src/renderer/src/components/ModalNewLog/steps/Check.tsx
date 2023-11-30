import { Descriptions, ConfigProvider } from 'antd';
import type { DescriptionsProps } from 'antd';
import { NinServerMeta } from 'src/types';
import moment from 'moment';

function Check(props: { serverValues: NinServerMeta | null , loading: boolean}) {
  
  const { serverValues, loading } = props;

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
          {loading ? <p>Loading...</p> : 
          <Descriptions title="Ninchat palautteet" items={ninchatItems} layout="vertical" />}
        </ConfigProvider>
      </div>

      <div className="step__footer"></div>
    </div>
  );
}

export default Check;
