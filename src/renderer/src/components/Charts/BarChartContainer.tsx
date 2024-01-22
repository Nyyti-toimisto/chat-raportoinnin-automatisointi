import { BarDatum, ResponsiveBar } from '@nivo/bar';
import { useEffect, useState } from 'react';
import { AgeStats } from 'src/types';

function BarChartContainer({ props }: { props: AgeStats }) {
    const [data, setData] = useState<BarDatum[]>([]);
    useEffect(() => {
        if (props) {
            setData([
                {
                    label: '18-24',
                    '18-24': props['18-24']
                },
                {
                    label: '25-29',
                    '25-29': props['25-29']
                },
                {
                    label: '30-35',
                    '30-35': props['30-35']
                },
                {
                    label: '36-46',
                    '36-46': props['36-46']
                },
                {
                    label: 'Yli 46',
                    'Yli 46': props['yli 46']
                },
                {
                    label: 'Ei sano',
                    'Ei sano': props['Ei sano']
                }
            ]);
        }
    }, []);

    return (
        <ResponsiveBar
            data={data}
            keys={['18-24', '25-29', '30-35', '36-46', 'Yli 46', 'Ei sano']}
            indexBy="label"
            margin={{ top: 50, right: 20, bottom: 40, left: 20 }}
            padding={0.2}
            tooltipLabel={(e) => 'Ikäryhmä ' + e.indexValue}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'nivo' }}
            isInteractive={true}
            borderColor={{
                from: 'color',
                modifiers: [['darker', 1.6]]
            }}
            axisTop={null}
            axisRight={null}
            axisLeft={null}
            enableGridX={false}
            enableGridY={false}
            axisBottom={{
                tickSize: 10,
                tickPadding: 5,
                tickRotation: 0,
                legendPosition: 'middle',
                legendOffset: 35
            }}
            labelSkipHeight={0}
            labelTextColor={{
                from: 'color',
                modifiers: [['darker', 1.6]]
            }}
            role="application"
            ariaLabel="Bar chart of age groups"
            barAriaLabel={(e) => 'Ikäryhmä ' + e.indexValue}
        />
    );
}

export default BarChartContainer;
