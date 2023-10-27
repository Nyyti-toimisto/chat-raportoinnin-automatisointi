import { ResponsiveLine } from '@nivo/line';
import { useState } from 'react';
import { ChartingData } from 'src/types';

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
  x: number;
  y: number;
};

function LineChartContainer({ props }: { props: ChartingData }) {

  const [filterYear] = useState(new Date().getFullYear());

  const filteredData = filterByYear(props.feel, filterYear);

  const feelings = uniqueFeelings(filteredData);
  const weeks = uniqueWeeks(filteredData);

  let data: { id: string; data: DataSubset[] }[] = [];

  for (const feeling of feelings) {
    let feelingsPerWeek: DataSubset[] = [];

    for (const week of weeks) {
      feelingsPerWeek.push({
        x: week,
        y: filteredData.filter((item) => item.feeling === feeling && item.week === week).length
      });
    }
    feelingsPerWeek = feelingsPerWeek.sort((a, b) => a.x - b.x);
    data.push({
      id: feeling,
      data: feelingsPerWeek
    });
  }

  const sentimentWbW: DataSubset[] = [];
  for (const week of weeks) {
    const negatives = filteredData.filter(
      (item) => item.feeling === 'Negatiivinen' && item.week === week
    );
    const positives = filteredData.filter(
      (item) => item.feeling === 'Positiivinen' && item.week === week
    );

    sentimentWbW.push({
      x: week,
      y: positives.length - negatives.length
    });
  }
  data.push({
    id: 'Sentimentti',
    data: sentimentWbW.sort((a, b) => a.x - b.x)
  });

  data = data.sort((a, b) => a.id.localeCompare(b.id));

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
      xScale={{ type: 'point' }}
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
        legend: 'viikko',
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
      ]
    }
    />
    <p style={{position:'relative', right:'1.8rem'}}>{filterYear}</p>
    </>
  );
}

export default LineChartContainer;

