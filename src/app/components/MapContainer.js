"use client";

import React, { useState } from "react";
import { GoogleMap, Marker, Polyline, useLoadScript } from "@react-google-maps/api";
import ControlPanel from "./ControlPanel";
import VehicleInfoWindow from "./VehicleInfoWindow";
import { useVehicleJourney } from "../hooks/useVehicleJourney";
import {getAvailableDates } from "../utils/routes";

const MapContainer = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const availableDates = getAvailableDates();
  const [selectedDate, setSelectedDate] = useState("");

  const {
    position,
    route,
    vehicleData,
    showInfo,
    setShowInfo,
    startJourney,
    stopJourney,
    resetJourney,
    setSpeedKmh,
    speedKmh,
    isRunning,
  } = useVehicleJourney(selectedDate);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <ControlPanel
        speedKmh={speedKmh}
        setSpeedKmh={setSpeedKmh}
        startJourney={startJourney}
        stopJourney={stopJourney}
        resetJourney={resetJourney}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        isRunning={isRunning}
        availableDates={availableDates}
      />

      <div className="w-full h-[650px]">
        <GoogleMap
          center={position || { lat: 28.6139, lng: 77.2090 }}
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
              onClick={() => setShowInfo(false)}
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
            <VehicleInfoWindow
              position={position}
              onClose={() => setShowInfo(false)}
              vehicleData={vehicleData}
            />
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default MapContainer;
