import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
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

const ResourceCostUsagePie = ({ data, fieldName, fieldLabel }) => {
  const processedData = useMemo(() => {
    // Group and sum costs by the specified field
    const groupedCosts = data.reduce((acc, item) => {
      const key = item[fieldName];
      const cost = Number(item.tbResCalcCost) || 0;
      
      if (!acc[key]) {
        acc[key] = { name: key, value: 0 };
      }
      acc[key].value += cost;
      
      return acc;
    }, {});

    // Convert to array and sort by value
    return Object.values(groupedCosts)
      .sort((a, b) => b.value - a.value)
      .map(item => ({
        ...item,
        value: Number(item.value.toFixed(2)) // Round to 2 decimal places
      }));
  }, [data, fieldName]);

  // Calculate total cost
  const totalCost = useMemo(() => {
    return processedData.reduce((sum, item) => sum + item.value, 0);
  }, [processedData]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalCost) * 100).toFixed(1);
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-medium">{data.name}</p>
          <p>{formatCurrency(data.value)}</p>
          <p>{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  // Get report date from first row of data
  const reportDate = data[0]?.apStatusDate ? 
    new Date(data[0].apStatusDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Not available';

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Cost Distribution by {fieldLabel}</CardTitle>
        <CardDescription>
          Total Cost: {formatCurrency(totalCost)}
          <br />
          Report date: {reportDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full flex justify-center">
          <PieChart width={600} height={400}>
            <Pie
              data={processedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={160}
              fill="#8884d8"
              dataKey="value"
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                percent,
                name
              }) => {
                const RADIAN = Math.PI / 180;
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                return percent > 0.05 ? (
                  <text
                    x={x}
                    y={y}
                    fill="white"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                ) : null;
              }}
            >
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              align="center"
              layout="horizontal"
              wrapperStyle={{
                paddingTop: "20px",
                bottom: -20
              }}
            />
          </PieChart>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCostUsagePie;