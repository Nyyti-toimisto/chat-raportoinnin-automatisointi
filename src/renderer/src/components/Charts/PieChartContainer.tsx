import { ResponsivePie } from '@nivo/pie';
import { useEffect, useState } from 'react';
import { GenderStats } from 'src/types';

type PieChartData = {
    id: string;
    label: string;
    value: number;
    color: string;
};

function PieChartContainer({ props }: { props: GenderStats }) {
    const [data, setData] = useState<PieChartData[]>([]);

    useEffect(() => {
        setData([
            {
                id: 'Mies',
                label: 'Mies',
                value: props.male,
                color: 'hsl(117, 70%, 50%)'
            },
            {
                id: 'Nainen',
                label: 'Nainen',
                value: props.female,
                color: 'hsl(160, 70%, 50%)'
            },
            {
                id: 'Muu',
                label: 'Muu',
                value: props.other,
                color: 'hsl(38, 70%, 50%)'
            },
            {
                id: 'En halua sanoa',
                label: 'En halua sanoa',
                value: props.unknow,
                color: 'hsl(115, 70%, 50%)'
            }
        ]);
    }, []);

    return (
        <ResponsivePie
            data={data}
            margin={{ top: 30, bottom: 10, right: 120, left: 20 }}
            innerRadius={0.2}
            isInteractive={true}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{
                from: 'color',
                modifiers: [['darker', 0.1]]
            }}
            enableArcLinkLabels={false}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
                from: 'color',
                modifiers: [['darker', 2]]
            }}
            legends={[
                {
                    anchor: 'right',
                    direction: 'column',
                    justify: false,
                    translateX: 30,
                    translateY: 0,
                    itemsSpacing: 5,
                    itemWidth: 20,
                    itemHeight: 18,
                    itemTextColor: '#999',
                    itemDirection: 'left-to-right',
                    itemOpacity: 1,
                    symbolSize: 12,
                    symbolShape: 'circle'
                }
            ]}
        />
    );
}

export default PieChartContainer;
