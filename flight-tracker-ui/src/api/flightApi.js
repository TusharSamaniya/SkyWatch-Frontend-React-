export const fetchLiveFlights = async () => {
    try {
        console.log("Fetching data from Spring Boot...");
        const response = await fetch('http://localhost:8080/api/flights/live');
        
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

// NEW: Fetches the route details for a specific clicked plane
export const fetchFlightRoute = async (callsign) => {
    try {
        console.log(`Asking Spring Boot for route details for: ${callsign}`);
        
        // This hits your second Spring Boot endpoint!
        const response = await fetch(`http://localhost:8080/api/flights/route/${callsign}`);
        
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        
        // Spring Boot returns nothing (null) if Aviationstack doesn't have the flight.
        // We handle that safely here so React doesn't crash.
        const text = await response.text();
        const data = text ? JSON.parse(text) : null;
        
        return data;

    } catch (error) {
        console.error(`Failed to fetch route for ${callsign}.`, error);
        return null; 
    }
};