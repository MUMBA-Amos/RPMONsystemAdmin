import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useDashboardState } from '../context';
import moment from 'moment';

const data = [
  {
    name: 'January',
    uv: 4,
    pv: 2.4,
    amt: 2.4
  },
  {
    name: 'June',
    uv: 3,
    pv: 1.8,
    amt: 2.2
  },
  {
    name: 'December',
    uv: 2,
    pv: 3.8,
    amt: 2.9
  }
];

export default function ApplicationTrends() {
  const { dashboardReport } = useDashboardState();

  const chartData = useMemo(() => {
    return dashboardReport?.applicationTrends?.map((trend, i) => ({
      name: moment(trend.date).format('D MMMM, YYYY'),
      pv: trend?.count,
    })) || [];
  }, [dashboardReport?.applicationTrends]);


  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={400}
        height={300}
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <XAxis dataKey="name" />
        <YAxis domain={[1, 5]} />
        <Line type="monotone" dataKey="pv" stroke="#000000" />
      </LineChart>
    </ResponsiveContainer>
  );
}
