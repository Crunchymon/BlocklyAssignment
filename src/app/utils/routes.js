export const getAvailableDates = () => {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0];
  
    return [twoDaysAgo, yesterday, today];
  };
  
export const getRouteForDate = (date) => {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0];
  
    const routes = {
      [twoDaysAgo]: [
        { lat: 13.0827, lng: 80.2707 }, // Chennai
        { lat: 12.2958, lng: 76.6394 }, // Mysuru
        { lat: 11.0168, lng: 76.9558 }, // Coimbatore
        { lat: 10.8505, lng: 76.2711 }, // Palakkad
        { lat: 9.9312, lng: 76.2673 },  // Kochi
      ],
      [yesterday]: [
        { lat: 19.0760, lng: 72.8777 }, // Mumbai
        { lat: 20.5937, lng: 78.9629 }, // Somewhere central Maharashtra
        { lat: 21.1458, lng: 79.0882 }, // Nagpur
        { lat: 22.7196, lng: 75.8577 }, // Indore
        { lat: 23.2599, lng: 77.4126 }, // Bhopal
        { lat: 24.5854, lng: 73.7125 }, // Udaipur
      ],
      [today]: [
        { lat: 28.6139, lng: 77.2090 }, // Delhi
        { lat: 27.1767, lng: 78.0081 }, // Agra
        { lat: 26.4499, lng: 80.3319 }, // Kanpur
        { lat: 25.3176, lng: 82.9739 }, // Varanasi
        { lat: 22.5726, lng: 88.3639 }, // Kolkata
      ]
    };
  
    return routes[date] || [];
  };
  