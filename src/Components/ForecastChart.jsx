import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

const RevenueChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch("/forecast_chart.json")
      .then((response) => response.json())
      .then((data) => {
        console.log("Chart Data:", data);
        setChartData(data);
      })
      .catch((error) => console.error("Error loading chart data:", error));
  }, []);
  

  return (
    <div>
      {chartData ? (
        <Plot
          data={chartData.data}
          layout={chartData.layout}
        />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default RevenueChart;