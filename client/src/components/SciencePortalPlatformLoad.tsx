// Libs
import React from 'react';

// Constants
import { APP_LOADING, SESSION_STATS } from '../context/app/constants';

// Components
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Placeholder from 'react-bootstrap/Placeholder';

// Hooks
import { useData } from '../context/data/useData';
import { useApp } from '../context/app/useApp';

// Styles
import '../index.css';
import '../styles/sessions.css';
import { DATA_USAGE } from '../context/data/constants';
import { ChartOptions } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export const barThickness = 12;

const SciencePortalPlatformLoad = () => {
  const { state: appState } = useApp();
  const { state } = useData();
  if (!state[DATA_USAGE]) {
    return <PlatformLoadPlaceholder />;
  }
  // 99% sure that user feedback will be the horizontal stacked
  // charts are ok. Hanging on to this in case that changes in the
  // first pass of the Platform Usage panel addition
  // var xAxissessionData = {
  //   labels: state.usage?.instances.labels,
  //   datasets: [
  //     {
  //       data: state.usage?.instances.data,
  //       backgroundColor: state.usage?.instances.backgroundColor,
  //       hoverBackgroundColor: state.usage?.instances.hoverBackgroundColor
  //     }
  //   ]
  // }

  const yAxisSessionData = {
    labels: ['instances'],
    datasets: [
      {
        label: state.usage?.instances.labels[0],
        data: [state.usage?.instances.data[0]],
        backgroundColor: state.usage?.instances.backgroundColor[0],
        hoverBackgroundColor: state.usage?.instances.hoverBackgroundColor[0],
      },
      {
        label: state.usage?.instances.labels[1],
        data: [state.usage?.instances.data[1]],
        backgroundColor: state.usage?.instances.backgroundColor[1],
        hoverBackgroundColor: state.usage?.instances.hoverBackgroundColor[1],
      },
      {
        label: state.usage?.instances.labels[2],
        data: [state.usage?.instances.data[2]],
        backgroundColor: state.usage?.instances.backgroundColor[2],
        hoverBackgroundColor: state.usage?.instances.hoverBackgroundColor[2],
      },
    ],
  };

  const yAxisCPUData = {
    labels: ['CPU usage'],
    datasets: [
      {
        label: 'used',
        data: [state.usage?.cpu.used],
        backgroundColor: '#008081',
        hoverBackgroundColor: '#4F97A3',
      },
      {
        label: 'free',
        data: [state.usage?.cpu.free],
        backgroundColor: '#dedede',
        hoverBackgroundColor: '#efefef',
      },
    ],
  };

  const yAxisRAMData = {
    labels: ['Memory usage'],
    datasets: [
      {
        label: 'used',
        data: [state.usage?.ram.used],
        backgroundColor: '#F19F18',
        hoverBackgroundColor: '#D28B15',
      },
      {
        label: 'free',
        data: [state.usage?.ram.free],
        backgroundColor: '#dedede',
        hoverBackgroundColor: '#efefef',
      },
    ],
  };

  // Hanging on to this code in case user feedback in the first pass is to
  // use a doughnut or pie chart rather than the stacked bar
  // var CPUusagePieOptions = {
  //   plugins: {
  //     title: {
  //       display: false,
  //     },
  //     legend: {
  //       position: "right"
  //     }
  //   }
  // }

  // var CPUusagePieData = {
  //   labels: ["used", "free"],
  //   datasets: [
  //     {
  //       data: [
  //         state.usage?.cpu.used,
  //         state.usage?.cpu.free
  //       ],
  //       backgroundColor: [
  //         "#008081",
  //         "#dedede"
  //       ],
  //       hoverBackgroundColor: [
  //         "#4F97A3",
  //         "#efefef"
  //       ]
  //     }
  //   ]
  // };

  // CPU usage has its own max value, so this object is needed
  const horizontalStackedCPUOptions: ChartOptions = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        max: state.usage?.cpu.total,
      },
      y: {
        beginAtZero: true,
        stacked: true,
        grid: {
          display: false,
        },
        max: 50,
      },
    },
    borderRadius: 4,
    barThickness: barThickness,
  };

  const horizontalStackedRAMOptions: ChartOptions = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        max: state.usage?.ram.total,
      },
      y: {
        beginAtZero: true,
        stacked: true,
        grid: {
          display: false,
        },
        max: 50,
      },
    },
    borderRadius: 4,
    barThickness: barThickness,
  };

  const horizontalStackedBarOptions: ChartOptions = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        max: Math.max(state.usage?.instances.total, 10),
      },
      y: {
        beginAtZero: true,
        stacked: true,
        grid: {
          display: false,
        },
        max: 50,
      },
    },
    borderRadius: 4,
    barThickness: barThickness,
  };

  return (
    <>
      {state.usage?.listType === 'data' && (
        <>
          <Row className="sp-usage-bar-row">
            <Col sm={12}>
              <div className="sp-usage-cpu-title">
                Available CPUs: {state.usage?.cpu.display.free} /{' '}
                {state.usage?.cpu.display.total}
              </div>
              <div className="sp-usage-bar">
                <Bar
                  options={horizontalStackedCPUOptions}
                  data={yAxisCPUData}
                />
              </div>
            </Col>
          </Row>
          <Row className="sp-usage-bar-row">
            <Col sm={12}>
              <div className="sp-usage-ram-title">
                Available RAM: {state.usage?.ram.display.free}
                {state.usage?.ram.unit} / {state.usage?.ram.display.total}
                {state.usage?.ram.unit}
              </div>
              <div className="sp-usage-bar">
                <Bar
                  options={horizontalStackedRAMOptions}
                  data={yAxisRAMData}
                />
              </div>
            </Col>
          </Row>
          <Row className="sp-usage-bar-row">
            <Col>
              <div className="sp-usage-session-title">
                Running Instances: {state.usage?.instances.total}
              </div>
              <div className="sp-usage-bar">
                <Bar
                  options={horizontalStackedBarOptions}
                  data={yAxisSessionData}
                />
              </div>
            </Col>
          </Row>
          <Row className="sp-usage-pie-row">
            <Col>
              <div className="sp-usage-text-date">
                last update:{' '}
                <span className="sp-usage-text">{state.usage?.updated}</span>{' '}
                UTC
              </div>
            </Col>
          </Row>
        </>
      )}

      {appState?.[APP_LOADING]?.[SESSION_STATS] && <PlatformLoadPlaceholder />}
    </>
  );
};

export const PlatformLoadPlaceholder = () => (
  <>
    <Row className="sp-usage-title-placeholder">
      <Col>
        <Placeholder
          className="sp-form-p sp-usage-title-placeholder"
          animation="glow"
        >
          <Placeholder
            className="sp-form-placeholder sp-usage-title-placeholder"
            xs={12}
          />
        </Placeholder>
      </Col>
    </Row>
    <Row className="sp-usage-placeholder">
      <Col>
        <Placeholder
          className="sp-form-p sp-usage-placeholder"
          animation="glow"
        >
          <Placeholder
            className="sp-form-placeholder sp-usage-placeholder"
            xs={12}
          />
        </Placeholder>
      </Col>
    </Row>
    <Row className="sp-usage-title-placeholder">
      <Col>
        <Placeholder
          className="sp-form-p sp-usage-title-placeholder"
          animation="glow"
        >
          <Placeholder
            className="sp-form-placeholder sp-usage-title-placeholder"
            xs={12}
          />
        </Placeholder>
      </Col>
    </Row>
    <Row className="sp-usage-placeholder">
      <Col>
        <Placeholder
          className="sp-form-p sp-usage-placeholder"
          animation="glow"
        >
          <Placeholder
            className="sp-form-placeholder sp-usage-placeholder"
            xs={12}
          />
        </Placeholder>
      </Col>
    </Row>
    <Row className="sp-usage-title-placeholder">
      <Col>
        <Placeholder
          className="sp-form-p sp-usage-title-placeholder"
          animation="glow"
        >
          <Placeholder
            className="sp-form-placeholder sp-usage-title-placeholder"
            xs={12}
          />
        </Placeholder>
      </Col>
    </Row>
    <Row className="sp-usage-placeholder">
      <Col>
        <Placeholder
          className="sp-form-p sp-usage-placeholder"
          animation="glow"
        >
          <Placeholder
            className="sp-form-placeholder sp-usage-placeholder"
            xs={12}
          />
        </Placeholder>
      </Col>
    </Row>
  </>
);

export default SciencePortalPlatformLoad;
