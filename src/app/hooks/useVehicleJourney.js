import { useEffect, useRef, useState } from "react";
import { getRouteForDate } from "../utils/routes";

export const useVehicleJourney = (selectedDate) => {
  const [route, setRoute] = useState([]);
  const [position, setPosition] = useState({ lat: 28.6139, lng: 77.2090 });
  const [vehicleData, setVehicleData] = useState({
    battery: "100%",
    speed: "0 km/h",
    ignition: "OFF",
    location: "",
  });
  const [showInfo, setShowInfo] = useState(true);
  const [speedKmh, setSpeedKmh] = useState(100);
  const [isRunning, setIsRunning] = useState(false);

  const indexRef = useRef(0);
  const intervalRef = useRef(null);

  const getDelayFromSpeed = (kmh) => {
    const metersPerSecond = (kmh * 1000) / 3600;
    const distance = 100000;
    return distance / metersPerSecond;
  };

  const updateVehicleData = (newPos) => {
    setVehicleData({
      location: `Lat: ${newPos.lat.toFixed(4)}, Lng: ${newPos.lng.toFixed(4)}`,
      battery: `${100 - indexRef.current * 10}%`,
      ignition: "ON",
      speed: `${speedKmh} km/h`,
    });
  };

  const startJourney = () => {
    // condtion to check if the car is already running or if the car has reached its destination
    if (isRunning || indexRef.current >= route.length - 1) return;

    setIsRunning(true);
    const delay = getDelayFromSpeed(speedKmh);

    intervalRef.current = setInterval(() => {
      indexRef.current += 1;

      if (indexRef.current >= route.length) {
        stopJourney();
        setVehicleData((prev) => ({ ...prev, ignition: "OFF", speed: "0 km/h" }));
        return;
      }

      const newPos = route[indexRef.current];
      setPosition(newPos);
      updateVehicleData(newPos);
    }, delay);
  };

  const stopJourney = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setVehicleData((prev) => ({ ...prev, ignition: "OFF", speed: "0 km/h" }));
  };

  const resetJourney = () => {
    stopJourney();
    indexRef.current = 0;
    const newRoute = getRouteForDate(selectedDate);
    setRoute(newRoute);

    const startPos = newRoute[0];
    if (!startPos) return;

    setPosition(startPos);
    setVehicleData({
      battery: "100%",
      speed: "0 km/h",
      ignition: "OFF",
      location: `Lat: ${startPos.lat.toFixed(4)}, Lng: ${startPos.lng.toFixed(4)}`,
    });
  };

  useEffect(() => {
    if (selectedDate) {
      const newRoute = getRouteForDate(selectedDate);
      setRoute(newRoute);
      indexRef.current = 0;
      resetJourney();
    }
  }, [selectedDate]);

  return {
    position,
    route,
    vehicleData,
    showInfo,
    setShowInfo,
    startJourney,
    stopJourney,
    resetJourney,
    speedKmh,
    setSpeedKmh,
    isRunning,
  };
};
