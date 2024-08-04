// src/App.js
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import WordCountChart from './components/WordCountChart';
import DataTable from './components/DataTable';
import './App.css';

const CSV_URL = 'https://reddit-extracted-raw-data.s3.amazonaws.com/reddit-trend-output/top_trending_keywords.csv';
const API_GATEWAY_URL = 'https://lrpc7hpb5c.execute-api.us-east-1.amazonaws.com/development/reddit-to-kafka';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [isFetchButtonEnabled, setIsFetchButtonEnabled] = useState(true);
  const [updateButtonVisible, setUpdateButtonVisible] = useState(true);

  const fetchData = () => {
    setLoading(true); // Set loading to true when starting to fetch data
    const urlWithTimestamp = `${CSV_URL}?t=${new Date().getTime()}`; 
    fetch(urlWithTimestamp)
      .then(response => response.text())
      .then(csvData => {
        Papa.parse(csvData, {
          header: false,
          complete: (result) => {
            const parsedData = result.data.map(row => ({
              word: row[0],
              count: parseInt(row[1], 10),
            }));
            const top10Data = parsedData.slice(0, 10); // Keep only the top 10 words
            setData(top10Data);
            setLoading(false);
          },
        });
      })
      .catch(error => {
        console.error('Failed to fetch data:', error); // Handle the error
        setLoading(false);
      });
  };

  const triggerAPI = () => {
    setProcessing(true);
    fetch(API_GATEWAY_URL, { method: 'POST' })
      .then(response => {
        console.log('API response:', response); // Debugging: log the response
        setMessage('Data update in progress. Please come back and click "Fetch Latest Data" in 5-10 minutes.');
        setIsFetchButtonEnabled(true);
        setProcessing(false);

        setUpdateButtonVisible(false);
        setTimeout(() => {
          setUpdateButtonVisible(true);
        }, 5 * 60 * 1000);
      })
      .catch(error => {
        console.error('API request failed:', error); // Debugging: log the error
        setMessage('An error occurred while updating data.');
        setProcessing(false);
      });
  };

  const fetchDataFromS3 = () => {
    fetchData(); 
    setMessage(''); 
    setIsFetchButtonEnabled(true);
  };

  return (
    <div className="App">
      <h1>Spotlight on Trends: Discover Hot Words of the Moment</h1>
      <button
        className="fetch-button"
        onClick={triggerAPI}
        disabled={processing || !updateButtonVisible}
      >
        {processing ? 'Processing...' : 'Update Data'}
      </button>
      <button
        className="fetch-button"
        onClick={fetchDataFromS3}
        disabled={!isFetchButtonEnabled}
      >
        Fetch Latest Data
      </button>
      {message && <p>{message}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        data.length > 0 && (
          <>
            <div className="chart-container">
              <WordCountChart data={data} />
            </div>
            <DataTable />
          </>
        )
      )}
    </div>
  );
}

export default App;
