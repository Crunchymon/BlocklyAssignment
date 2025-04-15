import { InfoWindow } from "@react-google-maps/api";

const VehicleInfoWindow = ({ position, onClose, vehicleData }) => (
  <InfoWindow position={position} onCloseClick={onClose}>
    <div className="text-sm font-mono text-black">
      <p><strong>📍 Location:</strong> {vehicleData.location}</p>
      <p><strong>🔋 Battery:</strong> {vehicleData.battery}</p>
      <p><strong>🔥 Ignition:</strong> {vehicleData.ignition}</p>
      <p><strong>🚀 Speed:</strong> {vehicleData.speed}</p>
    </div>
  </InfoWindow>
);

export default VehicleInfoWindow;
