import Image from "next/image";
const ControlPanel = ({
  speedKmh,
  setSpeedKmh,
  startJourney,
  stopJourney,
  resetJourney,
  selectedDate,
  setSelectedDate,
  isRunning,
  availableDates,
}) => {
  return (
    // main dashboard component
    <div className="p-4 bg-gray-100 border rounded-md mb-4 flex flex-wrap items-center gap-4 text-black">

      {/* to set the speed  */}
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


      {/* to start the journey */}
      <button
        onClick={startJourney}
        disabled={isRunning}
        className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white  py-2 px-5 rounded transition-all disabled:opacity-50"
      >

        <Image
          alt="play"
          width={25}
          height={25}
          src="./assets/bx-play.svg"
          className="mr-1"
        />

        Start
      </button>


      {/* to stop the jouney */}
      <button
        onClick={stopJourney}
        disabled={!isRunning}
        className="inline-flex items-center bg-red-500 hover:bg-red-600 text-white  py-2 px-5 rounded transition-all disabled:opacity-50"
      >

        <Image
          alt="stop"
          width={25}
          height={25}
          src="./assets/bx-stop.svg"
          className="mr-1"
        />
        Stop
      </button>

      {/* to reset the jouney  */}
      <button
        onClick={resetJourney}
        className="inline-flex items-center bg-yellow-500 hover:bg-yellow-600 text-white  py-2 px-5 rounded transition-all disabled:opacity-50">
        Reset
      </button>

      {/* to select the route for the pirticular day */}
      <label>
        <span className="font-medium">Select Date:</span>{" "}
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border px-2 py-1 rounded-md">
          <option value="">-- Choose Date --</option>
          {availableDates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default ControlPanel;
