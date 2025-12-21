const FilterSidebar = () => {
  return (
    <div className="border-l p-4 space-y-6">
      {/* Departure */}
      <div>
        <h3 className="font-semibold mb-2">Departure from Nanded</h3>
        <input type="range" className="w-full" />
        <div className="flex justify-between text-xs">
          <span>Morning</span>
          <span>Evening</span>
        </div>
      </div>

      {/* Arrival */}
      <div>
        <h3 className="font-semibold mb-2">Arrival to Pune</h3>
        <input type="range" className="w-full" />
        <div className="flex justify-between text-xs">
          <span>Morning</span>
          <span>Evening</span>
        </div>
      </div>

      {/* Train Types */}
      <div>
        <h3 className="font-semibold mb-2">Train Types</h3>
        {["Super Fast", "Express", "Vande Bharat", "Passenger"].map((t) => (
          <label key={t} className="flex gap-2 text-sm">
            <input type="checkbox" /> {t}
          </label>
        ))}
      </div>

      {/* Classes */}
      <div>
        <h3 className="font-semibold mb-2">Classes</h3>
        {[
          "AC 1st Tier",
          "AC 2nd Tier",
          "AC 3rd Tier",
          "Sleeper",
          "AC Chair Car",
          "Chair Car",
        ].map((c) => (
          <label key={c} className="flex gap-2 text-sm">
            <input type="checkbox" /> {c}
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;
