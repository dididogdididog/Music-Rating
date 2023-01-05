import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import * as faker from 'faker';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);



export function Bard(scores) {
  const options = {
    layout: {
      padding: 25
    },
    indexAxis: 'x',
    scales: {
      y: {
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          color: '#fff',
        },
        title: {
          display: true,
          text: '星數',
          color: '#fff',
          font: {
            size: '20px',
          }
        }
      }
    },
    elements: {
      bar: {
        borderWidth: 0,
        borderColor: '#9BD0F5'
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      datalabels: {
        formatter: (value, ctx) => {
          let sum = 0;
          let dataArr = ctx.chart.data.datasets[0].data;
          dataArr.map(data => {
            sum += data;
          });
          let percentage = (value * 100 / sum).toFixed(1) + "%";
          return percentage;
        },
        color: '#fff',
        align: 'end',
        anchor: 'end'
      },
    },
  };

  const labels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];



  const data = {
    labels,
    datasets: [
      {
        //data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
        data: scores,
        borderColor: '#ffd700',
        backgroundColor: '#ffd700',

      },
    ],
  };
  return <Bar options={options} data={data} />;
}