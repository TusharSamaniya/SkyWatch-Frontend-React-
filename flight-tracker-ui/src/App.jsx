import { useEffect, useState } from 'react'
import { fetchLiveFlights } from './api/flightApi'

function App() {
  // useState is React's "Memory". We are creating a variable called 'flights'
  const [flights, setFlights] = useState([]);

  // useEffect tells React: "Run this block of code exactly ONCE when the page first loads"
  useEffect(() => {
    
    // Create an async function to call our API
    const getFlights = async () => {
      const liveData = await fetchLiveFlights();
      setFlights(liveData); // Save the data into React's memory
      console.log("SUCCESS! Here is the data from Spring Boot:", liveData);
    };

    // Execute the function
    getFlights();

  }, []); // The empty brackets [] mean "only run once"

  return (
    <div style={{ padding: '20px' }}>
      <h1>🌍 Live Flight Tracker</h1>
      <p>Number of flights currently tracked: {flights.length}</p>
      <p style={{ color: 'gray' }}>
        (Open your browser's Developer Tools Console to see the actual JSON data!)
      </p>
    </div>
  )
}

export default App