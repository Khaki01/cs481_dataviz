import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const HealthActivityPlot = () => {
  const [data, setData] = useState<any>(null);
  const dataI: any = [];
  useEffect(() => {
    fetch('api/health-activity')
      .then((response) => response.json())
      .then((jsonData) => setData(jsonData));
  }, []);

  console.log(data);
  return <div>here</div>;
};

export default HealthActivityPlot;
