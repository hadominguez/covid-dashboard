import { useState, useEffect } from 'react'
import './App.css'

import Select from "react-select";
import Card from "./SummaryCard";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

function App() {
  // App component starts here
  const locationList = [
    { value: "AB", label: "Alberta" },
    { value: "BC", label: "British Columbia" },
    { value: "canada", label: "Canada" },
    { value: "MB", label: "Manitoba" },
    { value: "NB", label: "New Brunswick" },
    { value: "NL", label: "Newfoundland and Labrador" },
    { value: "NT", label: "Northwest Territories" },
    { value: "NS", label: "Nova Scotia" },
    { value: "NU", label: "Nunavut" },
    { value: "ON", label: "Ontario" },
    { value: "PE", label: "Prince Edward Island" },
    { value: "QC", label: "Quebec" },
    { value: "SK", label: "Saskatchewan" },
    { value: "YT", label: "Yukon" },
  ];
  const [activeLocation, setActiveLocation] = useState("canada");
  const [lastUpdated, setlastUpdated] = useState("");
  const [summaryData, setSummaryData] = useState({});
  const [timeseriesData, setTimeseriesData] = useState({
    datasets: [],
  });
  const timeseriesOptions = {
    responsive: true,
    normalized: true,
    plugins: {
      tooltip: {
        enabled: false,
      },
    },
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
      },
    },
  };


  const baseUrl = "https://api.opencovid.ca";



  function timeseriesDataMap(fetchedData) {
    let tsKeyMap = [
      {
        datasetLabel: "cases",
        dataKey: "value_daily",
        dateKey: "date",
        borderColor: "red",
      },
      {
        datasetLabel: "deaths",
        dataKey: "value_daily",
        dateKey: "date",
        borderColor: "grey",
      },
      {
        datasetLabel: "icu",
        dataKey: "value_daily",
        dateKey: "date",
        borderColor: "blue",
      },
    ];

    let datasets = [];
    tsKeyMap.forEach((dataSeries) => {
      let dataset = {
        label: dataSeries.datasetLabel,
        borderColor: dataSeries.borderColor,
        data: fetchedData[dataSeries.datasetLabel].map((dataPoint) => {
          return {
            y: dataPoint[dataSeries.dataKey],
            x: dataPoint[dataSeries.dateKey],
          };
        }),
      };
      datasets.push(dataset);
    });

    return datasets;

  }


  useEffect(() => {

    const getVersion = async () => {
      const res = await fetch(`${baseUrl}/version`);
      const data = await res.json();
      setlastUpdated(data.archive);
    };
  
    const getSummaryData = async () => {
      let res = await fetch(`${baseUrl}/summary?loc=${activeLocation}`);
      let resData = await res.json();
      let summaryData = resData.data[0];
      let formattedData = {};
  
      Object.keys(summaryData).map(
        (key) => (formattedData[key] = summaryData[key].toLocaleString())
      );
      setSummaryData(formattedData);
    };

    const getTimeseriesData = async () => {
      const res = await fetch(
        `${baseUrl}/timeseries?loc=${activeLocation}&ymd=true`
      );
      const data = await res.json();
  
      setTimeseriesData({ datasets: timeseriesDataMap(data.data) });
    };


    getVersion();
    getSummaryData();
    getTimeseriesData();
  }, [activeLocation]);


  //return statement goes below this
  return (
    <div className="App">
      <h1>COVID 19 Dashboard</h1>
      <div className="dashboard-container">
        <div className="dashboard-menu ">
          <Select
            options={locationList}
            onChange={(selectedOption) =>
              setActiveLocation(selectedOption.value)
            }
            defaultValue={locationList.filter(
              (options) => options.value === activeLocation
            )}
            className="dashboard-select"
          />
          <p className="update-date">
            Last Updated : {lastUpdated}
          </p>
        </div>
        <div className="dashboard-timeseries">
          <Line
            data={timeseriesData}
            options={timeseriesOptions}
            className="line-chart"
          />
        </div>
        <div className="dashboard-summary">
          <Card title="Total Cases" value={summaryData.cases} />
          <Card title="Total Deaths" value={summaryData.deaths} />
          <Card
            title="Total Test Completed"
            value={summaryData.tests_completed}
          />
          <Card
            title="Total ICU"
            value={summaryData.icu}
          />
        </div>
      </div>
    </div>
  );
}

export default App;