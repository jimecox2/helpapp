'use client'
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import moment from 'moment';

const BurndownChart = ({ chartData }) => {

  const reportDate = chartData.reportDate 

/*   console.log("log: ", {
    chartData,
    reportDate
    }) */

  // Ensure reportDate is properly processed
  const tsReportDate = moment(new Date(reportDate)).format('MM/DD');
  const formattedReportDate = moment(new Date(reportDate)).format('DDMMMYY');

  const weeks = chartData.tbChartLabels;

  const processedData = weeks.map((date, index) => ({
   // date: moment(new Date(date)).format('MM/DD'),
    date: moment(new Date(date)).format('DDMMMYY'),
    fullDate: date,
    planned: chartData.tbChartDataset1[index],
    forecast: chartData.tbChartDataset2[index]
  }));



  return (
<div className="w-full h-[400px] p-4 mb-12 bg-white rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">{chartData.tbChartProjName}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={processedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            domain={[0, 'auto']}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            formatter={(value) => [`${value} points`, '']}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="planned"
            stroke="#ff0080"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Planned"
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#0099ff"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Forecast"
          />
          <ReferenceLine
            x={formattedReportDate}
            stroke="#333"
            strokeWidth={2}
            label={{
              value: 'Report Date:'+formattedReportDate,
              position: 'center',
              fill: '#333',
              fontSize: 12,
              backgroundColor: '#fff',
              offset: 10
            }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="text-sm text-gray-600 mt-4">
        <p>Note: This chart is for use with the Agilebars Sprint Scheduler Product.</p>
        <p>Use the Cloud icon to log into Agilebars and Publish current data. </p>
      </div>
    </div>
  );
};

export default BurndownChart;