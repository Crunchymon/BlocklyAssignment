"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    GoogleMap,
    Marker,
    Polyline,
    InfoWindow,
    useLoadScript,
} from "@react-google-maps/api";

const Map = () => {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    const availableDates = [yesterday, today];

    const [selectedDate, setSelectedDate] = useState('');

    const getRouteForDate = (date) => {
        const routes = {
            [today]: [
                { lat: 28.6139, lng: 77.2090 },
                { lat: 25.5941, lng: 85.1376 },
                { lat: 22.5726, lng: 88.3639 },
            ],
            [yesterday]: [
                { lat: 19.0760, lng: 72.8777 },
                { lat: 17.3850, lng: 78.4867 },
                { lat: 13.0827, lng: 80.2707 },
            ],
        };
        return routes[date] || [];
    };

    const [route, setRoute] = useState([]);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    });

    const [position, setPosition] = useState(null);
    const [showInfo, setShowInfo] = useState(false);
    const [vehicleData, setVehicleData] = useState({
        battery: "100%",
        speed: "0 km/h",
        ignition: "OFF",
        location: "Delhi",
    });

    const [speedKmh, setSpeedKmh] = useState(60);
    const [isRunning, setIsRunning] = useState(false);

    const indexRef = useRef(0);
    const intervalRef = useRef(null);

    const getDelayFromSpeed = (kmh) => {
        const metersPerSecond = (kmh * 1000) / 3600;
        const distanceBetweenPoints = 100000; // Simulated 100 km
        return distanceBetweenPoints / metersPerSecond;
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
        setVehicleData((prev) => ({
            ...prev,
            ignition: "OFF",
            speed: "0 km/h",
        }));
    };

    const resetJourney = (newRoute) => {
        stopJourney();
        indexRef.current = 0;

        if (!newRoute || newRoute.length === 0) {
            console.warn("🚫 No valid route found for this date.");
            return;
        }

        const startPos = newRoute[0];
        setPosition(startPos);
        setRoute(newRoute);
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
            resetJourney(newRoute);
        }
    }, [selectedDate]);

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div>
            {/* Control Panel */}
            <div className="p-4 bg-gray-100 border rounded-md mb-4 flex flex-wrap items-center gap-4 text-black">
                <label>
                    <span className="font-medium">Speed (km/h):</span>{" "}
                    <input
                        type="number"
                        value={speedKmh}
                        onChange={(e) => setSpeedKmh(Number(e.target.value))}
                        className="border px-2 py-1 rounded-md w-24"
                        disabled={isRunning}
                    />
                </label>

                <button
                    onClick={startJourney}
                    disabled={isRunning || indexRef.current >= route.length - 1}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                    ▶️ Start
                </button>
                <button
                    onClick={stopJourney}
                    disabled={!isRunning}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                    ⏹ Stop
                </button>
                <button
                    onClick={() => resetJourney(route)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                    🔁 Reset
                </button>

                <label>
                    <span className="font-medium">Select Date:</span>{" "}
                    <select
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="border px-2 py-1 rounded-md"
                    >
                        <option value="">-- Choose Date --</option>
                        {availableDates.map((date) => (
                            <option key={date} value={date}>
                                {date}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {/* Map */}
            <div className="w-full h-[500px]">
                <GoogleMap
                    center={position || { lat: 0, lng: 0 }}
                    zoom={6}
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                >
                    <Polyline
                        path={route}
                        options={{
                            strokeColor: "#007bff",
                            strokeOpacity: 0.8,
                            strokeWeight: 4,
                        }}
                    />
                    {position && (
                        <Marker
                            position={position}
                            icon={{
                                url: "https://maps.google.com/mapfiles/kml/shapes/cabs.png",
                                scaledSize: new window.google.maps.Size(40, 40),
                            }}
                            onClick={() => setShowInfo(true)}
                        />
                    )}

                    {route.map((point, idx) => (
                        <Marker
                            key={idx}
                            position={point}
                            label={{
                                text: `${idx + 1}`,
                                color: "white",
                                fontSize: "14px",
                                fontWeight: "bold",
                            }}
                            icon={{
                                path: window.google.maps.SymbolPath.CIRCLE,
                                scale: 10,
                                fillColor: "#007bff",
                                fillOpacity: 1,
                                strokeWeight: 1,
                                strokeColor: "white",
                            }}
                        />
                    ))}

                    {showInfo && position && (
                        <InfoWindow
                            position={position}
                            onCloseClick={() => setShowInfo(false)}
                        >
                            <div className="text-sm font-mono text-black">
                                <p><strong>📍 Location:</strong> {vehicleData.location}</p>
                                <p><strong>🔋 Battery:</strong> {vehicleData.battery}</p>
                                <p><strong>🔥 Ignition:</strong> {vehicleData.ignition}</p>
                                <p><strong>🚀 Speed:</strong> {vehicleData.speed}</p>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </div>
        </div>
    );
};

export default Map;
