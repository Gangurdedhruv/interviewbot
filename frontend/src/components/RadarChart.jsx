import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RadarChart = ({ interviewData, selectedInterviewId }) => {
  // Find the selected interview from the data
  const selectedInterview = interviewData.find(interview => interview._id === selectedInterviewId) || interviewData[0];

  // Prepare chart data from the selected interview
  const chartData = {
    labels: selectedInterview.skills,
    datasets: [
      {
        label: 'Performance Score',
        data: selectedInterview.scores,
        backgroundColor: 'rgba(114, 9, 183, 0.2)', // Purple with transparency
        borderColor: '#7209b7', // Solid purple
        borderWidth: 2,
        pointBackgroundColor: '#7209b7',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#7209b7'
      }
    ]
  };

  // Chart options
  const chartOptions = {
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          showLabelBackdrop: false,
          font: {
            size: 12
          }
        },
        pointLabels: {
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 14
        },
        callbacks: {
          label: function(context) {
            return `Score: ${context.raw}/100`;
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  // Include interview details
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getAverageScore = (scores) => {
    if (!scores || scores.length === 0) return 0;
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <h5 className="m-0">Interview Performance Details</h5>
        <div className="text-muted small">
          Date: {formatDate(selectedInterview.createdAt)} | 
          Average Score: {getAverageScore(selectedInterview.scores)}/100
        </div>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-12">
            <div style={{ height: '350px', width: '100%' }}>
              <Radar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-12">
            <h6>Key Concepts:</h6>
            <div className="d-flex flex-wrap gap-1">
              {selectedInterview.keyConcepts.flat().map((concept, idx) => (
                <span key={idx} className="badge bg-info text-dark rounded-pill m-1">
                  {concept}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadarChart;