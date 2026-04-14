
// // Add country and state parameters (defaulting to India)
// export const fetchLiveFlights = async (country = 'India', state = '') => {
//   try {
//     // Append the parameters to the URL
//     const response = await fetch(`https://skywatch-backend-springboot.onrender.com/api/flights/live?country=${country}&state=${state}`);
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching live flights:", error);
//     return null;
//   }
// };

// // NEW: Fetches the combined Radar, Schedule, and Photo details for a specific clicked plane
// export const fetchFlightRoute = async (callsign) => {
//     try {
//         console.log(`Asking Spring Boot for deep-dive details for: ${callsign}`);
        
//         // FIX: Removed "/route/" from the URL to match the new Spring Boot endpoint!
//         const response = await fetch(`https://skywatch-backend-springboot.onrender.com/api/flights/${callsign}`);
        
//         if (!response.ok) {
//             throw new Error("Network response was not ok");
//         }
        
//         const text = await response.text();
//         const data = text ? JSON.parse(text) : null;
        
//         return data;

//     } catch (error) {
//         console.error(`Failed to fetch details for ${callsign}.`, error);
//         return null; 
//     }
// };

// 1. Fetch live flights (Pointed to LOCALHOST)
export const fetchLiveFlights = async (country = 'India', state = '') => {
  try {
    const response = await fetch(`http://localhost:8080/api/flights/live?country=${country}&state=${state}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching live flights:", error);
    return null;
  }
};

// 2. Fetch specific flight details (Pointed to LOCALHOST)
export const fetchFlightRoute = async (callsign) => {
    try {
        console.log(`Asking local Spring Boot for deep-dive details for: ${callsign}`);
        
        const response = await fetch(`http://localhost:8080/api/flights/${callsign}`);
        
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        
        const text = await response.text();
        const data = text ? JSON.parse(text) : null;
        
        return data;

    } catch (error) {
        console.error(`Failed to fetch details for ${callsign}.`, error);
        return null; 
    }
};