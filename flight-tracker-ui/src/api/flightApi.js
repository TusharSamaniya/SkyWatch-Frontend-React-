export const fetchLiveFlights = async () => {
    try {
        console.log("Fetching data from Spring Boot...");
        const response = await fetch('https://skywatch-backend-springboot.onrender.com/api/flights/live');
        
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        
        const data = await response.json();
        return data; // This returns your list of clean Java DTOs!

    } catch (error) {
        console.error("Failed to fetch flights. Is Spring Boot running?", error);
        return []; 
    }
};

// NEW: Fetches the combined Radar, Schedule, and Photo details for a specific clicked plane
export const fetchFlightRoute = async (callsign) => {
    try {
        console.log(`Asking Spring Boot for deep-dive details for: ${callsign}`);
        
        // FIX: Removed "/route/" from the URL to match the new Spring Boot endpoint!
        const response = await fetch(`https://skywatch-backend-springboot.onrender.com/api/flights/${callsign}`);
        
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