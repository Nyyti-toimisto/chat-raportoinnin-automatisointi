import { ResponsiveLine } from '@nivo/line';
import dayjs from 'dayjs';
import { useState } from 'react';
import { ChartingData, DateProps } from 'src/types';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(weekOfYear);

const filterByYear = function (arr: Pick<ChartingData, 'feel'>['feel'], year: number) {
    return arr.filter((item) => item.year === year && item.id !== null);
};

function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
}

const uniqueFeelings = function (arr: Pick<ChartingData, 'feel'>['feel']) {
    return arr.map((item) => item.feeling).filter(onlyUnique);
};

const uniqueWeeks = function (arr: Pick<ChartingData, 'feel'>['feel']) {
    return arr.map((item) => item.week).filter(onlyUnique);
};

type DataSubset = {
    x: Date;
    y: number;
};

function LineChartContainer({ feelData, date }: { feelData: ChartingData; date: DateProps }) {
    const [filterYear] = useState(new Date().getFullYear());

    let feelingData = feelData.feel;
    // check if date range is NOT selected and filter data to current year
    if (!date.dates) {
        feelingData = filterByYear(feelData.feel, filterYear);
    }

    const feelings = uniqueFeelings(feelingData);
    const weeks = uniqueWeeks(feelingData);

    let data: { id: string; data: DataSubset[] }[] = [];

    for (const feeling of feelings) {
        const feelingsPerWeek: DataSubset[] = [];

        for (const week of weeks) {
            const year = feelingData.find((item) => item.week === week)?.year;
            feelingsPerWeek.push({
                x: dayjs(`${year}`).week(week).toDate(),
                y: feelingData.filter((item) => item.feeling === feeling && item.week === week)
                    .length
            });
        }
        data.push({
            id: feeling,
            data: feelingsPerWeek
        });
    }

    const sentimentWbW: DataSubset[] = [];

    for (const week of weeks) {
        const year = feelingData.find((item) => item.week === week)?.year;
        const negatives = feelingData.filter(
            (item) => item.feeling === 'Negatiivinen' && item.week === week
        );
        const positives = feelingData.filter(
            (item) => item.feeling === 'Positiivinen' && item.week === week
        );
        if (positives.length > 0 || negatives.length > 0) {
            sentimentWbW.push({
                x: dayjs(`${year}`).week(week).toDate(),
                y: positives.length - negatives.length
            });
        }
    }
    data.push({
        id: 'Sentimentti',
        data: sentimentWbW
    });

    data = data.sort((a, b) => a.id.localeCompare(b.id));

    if (data[0].data.length === 0) {
        return <p>Ei dataa tälle vuodelle</p>;
    }

    return (
        <>
            <ResponsiveLine
                data={data}
                animate={false}
                markers={[
                    {
                        axis: 'y',
                        value: 0,
                        lineStyle: {
                            stroke: 'var(--fontPrimary)',
                            strokeWidth: 0.4
                        }
                    }
                ]}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{
                    type: 'time',
                    format: '%d-%m-%Y',
                    precision: 'day'
                }}
                yScale={{
                    type: 'linear',
                    min: 'auto',
                    max: 'auto',
                    stacked: false,
                    reverse: false
                }}
                curve="catmullRom"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    tickValues: 7,
                    format: '%d %b %Y',
                    legend: 'päivämäärä',
                    legendOffset: 36,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'määrä',
                    legendOffset: -40,
                    legendPosition: 'middle'
                }}
                pointSize={4}
                pointColor={{ theme: 'background' }}
                colors={{ scheme: 'set1' }}
                pointBorderWidth={1}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                enableSlices="x"
                legends={[
                    {
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 0,
                        itemDirection: 'left-to-right',
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: 'circle',
                        symbolBorderColor: 'rgba(0, 0, 0, .5)',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemBackground: 'rgba(0, 0, 0, .03)',
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
            />
            <p style={{ position: 'relative', right: '1.8rem' }}>
                {date.dates?.[0]?.format('DD/MM/YYYY')} - {date.dates?.[1]?.format('DD/MM/YYYY')}
            </p>
        </>
    );
}

export default LineChartContainer;
