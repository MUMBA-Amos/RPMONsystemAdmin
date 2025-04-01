import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';
import { CHART_DURATION, CHART_DURATIONS, IChartDuration } from './service';
import { ApChartDurationBtn } from './components/duration-btn';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  aspectRatio: 5,
  // scales: {
  //   x: { grid: { display: false } },
  //   y: { grid: { display: false } },
  // },
  plugins: {
    legend: {
      display: false
    }
  }
};

interface IProps {
  aggregatedData: any[];
  datasets?: any[];
  durationChange: (d: IChartDuration) => void;
  activeDuration: CHART_DURATION;
  title: React.ReactElement;
}

export const ApLineChart: React.FC<IProps> = ({ aggregatedData, title, datasets }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-5 cus-xs:items-center">
        <p className="text-sm font-bold text-gray-500 cus-xs:text-xs">{title}</p>
        {/* <div className="flex justify-center gap-3 cus-xs:gap-2">
          {CHART_DURATIONS?.map((d, i) => (
            <ApChartDurationBtn
              duration={d}
              key={i}
              onPress={durationChange}
              activeDuration={activeDuration}
            />
          ))}
        </div> */}
      </div>

      <Line
        options={options}
        data={{
          labels: aggregatedData.map((data: any) => data.label),
          datasets: datasets || [
            {
              // data: aggregatedData.map((data: any) => +data.value) ,
              data: aggregatedData.map((data: any) => Math.round(+data.value)),
              borderColor: '#FF7D01',
              backgroundColor: '#FF7D01'
            }
          ]
        }}
        className="w-full"
      />
    </div>
  );
};
