// src/WordCountChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const WordCountChart = ({ data }) => {
  const labels = data.map(item => item.word);
  const values = data.map(item => item.count);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Word Count',
        data: values,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Trending Words and Counts',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default WordCountChart;
