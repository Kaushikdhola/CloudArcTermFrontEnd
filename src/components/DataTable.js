import React, { useState, useEffect } from 'react';
import './DataTable.css'; // Import CSS file for styling

const API_ENDPOINT = 'https://wv86oo3dxk.execute-api.us-east-1.amazonaws.com/Dev/data';

const DataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_ENDPOINT, {
          headers: {
            'x-api-key': 'xvYL9XmfwV1KBGl9Nx5iv4zFCkdrPD5W8bX4V5Rj',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        const { body } = responseData;
        const parsedData = JSON.parse(body);
        if (Array.isArray(parsedData)) {
          setData(parsedData);
        } else {
          throw new Error('Fetched data is not an array');
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="data-table-container">
      <h2>Data Table</h2>
      {Array.isArray(data) && data.length > 0 ? (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Number of Comments</th>
                <th>Number of Downvotes</th>
                <th>Number of Upvotes</th>
                <th>Text Content</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.title}</td>
                  <td>{item.num_comments}</td>
                  <td>{item.number_of_downvotes}</td>
                  <td>{item.number_of_upvotes}</td>
                  <td className="text-content">{item.text_content}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default DataTable;
