"use client";

import { useState } from "react";

// Perbaikan: Unit diubah menjadi singkatan agar sesuai dengan kode back-end
export const unitGroups: Record<string, string[]> = {
  length: ["mm", "cm", "m", "km", "in", "ft", "yd", "mi"],
  mass: ["g", "kg", "lb", "oz", "ton"],
  temperature: ["C", "F", "K"],
  time: ["s", "min", "h", "day", "week"],
  area: ["m2", "cm2", "km2", "ft2", "in2", "acre", "ha"],
  volume: ["ml", "l", "m3", "gal", "pt"],
  speed: ["m/s", "km/h", "mph", "knot"],
  energy: ["j", "kj", "cal", "kcal", "wh"],
  pressure: ["pa", "bar", "atm", "psi", "mmhg"],
  data: ["bit", "b", "kb", "mb", "gb", "tb"],
  power: ["w", "kw", "hp"],
  frequency: ["hz", "khz", "mhz", "ghz"],
};

export default function UnitConverter() {
  const categories = Object.keys(unitGroups);
  const [category, setCategory] = useState("length");
  const [value, setValue] = useState("0");
  const [from, setFrom] = useState(unitGroups["length"][0]);
  const [to, setTo] = useState(unitGroups["length"][1]);
  const [result, setResult] = useState<number | null>(null);

  const handleConvert = async () => {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) return;

    const params = new URLSearchParams({
      value: String(parsedValue),
      from,
      to,
    });

    try {
      const res = await fetch(`/api/unit-converter?${params}`);
      const data = await res.json();
      if (res.ok) {
        setResult(data.result);
      } else {
        console.error("Conversion error:", data.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  type UnitCategory = keyof typeof unitGroups;

  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    setFrom(unitGroups[cat][0]);
    setTo(unitGroups[cat][1]);
    setResult(null);
  };

  // Display names for categories in English
  const categoryDisplayNames: Record<string, string> = {
    length: "Length",
    mass: "Mass",
    temperature: "Temperature",
    time: "Time",
    area: "Area",
    volume: "Volume",
    speed: "Speed",
    energy: "Energy",
    pressure: "Pressure",
    data: "Data",
    power: "Power",
    frequency: "Frequency",
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="relative w-full max-w-xl p-6 mt-6 mb-10 rounded-2xl border border-zinc-800 bg-black/80 backdrop-blur-xl shadow-2xl overflow-hidden group">
        <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out">
          <div className="absolute -inset-20 bg-gradient-to-tr from-red-500 via-white to-black opacity-10 blur-2xl animate-pulse" />
        </div>

        {/* Select Category */}
        <label className="block mb-4 text-white">
          <span className="block mb-1">Category</span>
          <select
            value={category}
            onChange={(e) =>
              handleCategoryChange(e.target.value as UnitCategory)
            }
            className="cursor-pointer w-full p-2 bg-black border border-red-500 text-white rounded-lg"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {categoryDisplayNames[cat] || cat}
              </option>
            ))}
          </select>
        </label>

        {/* Input Value */}
        <label className="block mb-4 text-white">
          <span className="block mb-1">Value</span>
          <input
            type="number"
            value={value}
            onChange={(e) => {
              let val = e.target.value;

              // Clean leading zeros when user starts typing
              if (value === "0") {
                val = val.replace(/^0+/, "");
              }

              // Don't leave empty
              if (val === "") val = "0";

              setValue(val);
              setResult(null);
            }}
            className="w-full p-2 border border-red-500 bg-black text-white rounded-lg 
            [appearance:textfield] 
            [&::-webkit-inner-spin-button]:appearance-none 
            [&::-webkit-outer-spin-button]:appearance-none"
          />
        </label>

        {/* Unit Selection */}
        <div className="flex gap-4 mb-4 text-white">
          <label className="flex-1">
            <span className="block mb-1">From</span>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="cursor-pointer w-full p-2 bg-black border border-red-500 text-white rounded-lg"
            >
              {unitGroups[category].map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </label>

          <label className="flex-1">
            <span className="block mb-1">To</span>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="cursor-pointer w-full p-2 bg-black border border-red-500 text-white rounded-lg"
            >
              {unitGroups[category].map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Convert Button */}
        <div className="flex justify-end">
          <button
            onClick={handleConvert}
            className="px-4 py-2 font-bold cursor-pointer bg-red-500 text-white rounded-lg border border-red-500 hover:bg-black transition duration-300"
          >
            Convert
          </button>
        </div>

        {/* Output */}
        {result !== null && (
          <div className="mt-6 p-3 border border-red-500 rounded-md bg-black text-white">
            <p className="text-sm">
              Result: {result} {to}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
