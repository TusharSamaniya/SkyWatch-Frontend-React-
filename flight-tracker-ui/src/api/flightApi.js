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