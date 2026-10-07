import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

const COLORS = [
  '#2196F3', // Blue
  '#FF9800', // Orange
  '#4CAF50', // Green
  '#F44336', // Red
  '#9C27B0', // Purple
  '#00BCD4', // Cyan
  '#FFC107', // Amber
  '#795548', // Brown
  '#607D8B'  // Blue Grey
];

const ResourceUsageChart = ({ data, fieldName, fieldLabel }) => {
  const processedData = useMemo(() => {
    // Get unique values for the specified field
    const uniqueValues = [...new Set(data.map(item => item[fieldName]))];
    
    // Group data by week
    const groupedByWeek = data.reduce((acc, item) => {
      const week = item.tbResCalcWeek;
      if (!acc[week]) {
        acc[week] = {
          week,
          ...Object.fromEntries(uniqueValues.map(value => [value, 0]))
        };
      }
      
      const value = item[fieldName];
      const hours = Number(item.tbResCalcHours);
      acc[week][value] = (acc[week][value] || 0) + hours;
      
      return acc;
    }, {});

    // Convert to array and sort by date
    return Object.values(groupedByWeek)
      .sort((a, b) => new Date(a.week) - new Date(b.week));
  }, [data, fieldName]);

  const uniqueKeys = useMemo(() => {
    const allKeys = Object.keys(processedData[0] || {});
    return allKeys.filter(key => key !== 'week');
  }, [processedData]);

  // Determine if we should stack the bars based on the number of unique values
  const shouldStack = uniqueKeys.length > 3;

    // Format the date nicely
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
  // Get report date from first row of data
  const reportDate = data[0]?.apStatusDate ? formatDate(data[0].apStatusDate) : 'Not available';


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Resource Demand by: {fieldLabel}</CardTitle>
        <CardDescription>Report date: {reportDate}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <BarChart
            width={1000}
            height={450}
            data={processedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
            />
            <YAxis />
            <Tooltip />
            <Legend 
              verticalAlign="top" 
              align="center"
            />
            {uniqueKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                name={key}
                fill={COLORS[index % COLORS.length]}
                stackId={shouldStack ? 'stack' : undefined}
              />
            ))}
          </BarChart>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceUsageChart;