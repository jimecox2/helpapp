'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

const getColumnCount = () => {
  if (window.innerWidth >= 1024) return 4; // large screens
  if (window.innerWidth >= 768) return 3; // medium screens
  if (window.innerWidth >= 640) return 2; // small screens
  return 1; // very small screens
};

const IndicatorCards = ({ currentRows = [] }) => {
  const [columnCount, setColumnCount] = useState(getColumnCount());

  useEffect(() => {
    const handleResize = () => {
      setColumnCount(getColumnCount());
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const formatValue = (value, unit) => {
    if (unit === 'Cost') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    return value.toLocaleString();
  };

//console.log(currentRows);

if (!currentRows.length) {
  return <div>No cost data available</div>;
}
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentRows.map((row, index) => (
          <Card key={index} className="bg-white">
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-4xl font-bold">
                {formatValue(row.value, row.unit)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base mt-2">
                {row.unit === 'Hours' ? (
                  <>Total hours for {row.label}: {row.fieldValue}</>
                ) : (
                  <>Total cost for {row.label}: {row.fieldValue}</>
                )}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IndicatorCards;