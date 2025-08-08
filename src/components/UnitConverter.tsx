"use client";

import { useState } from "react";

export const unitGroups: Record<string, string[]> = {
  length: [
    "millimeter",
    "centimeter",
    "meter",
    "kilometer",
    "inch",
    "foot",
    "yard",
    "mile",
  ],
  mass: ["milligram", "gram", "kilogram", "ton", "ounce", "pound", "stone"],
  temperature: ["celsius", "fahrenheit", "kelvin"],
  time: [
    "millisecond",
    "second",
    "minute",
    "hour",
    "day",
    "week",
    "month",
    "year",
  ],
  area: [
    "square meter",
    "square kilometer",
    "square mile",
    "square foot",
    "square yard",
    "hectare",
    "acre",
  ],
  volume: [
    "milliliter",
    "liter",
    "cubic centimeter",
    "cubic meter",
    "gallon",
    "quart",
    "pint",
    "cup",
    "fluid ounce",
  ],
  speed: ["meter/second", "kilometer/hour", "mile/hour", "knot"],
  energy: [
    "joule",
    "kilojoule",
    "calorie",
    "kilocalorie",
    "watt hour",
    "kilowatt hour",
  ],
  pressure: ["pascal", "kilopascal", "bar", "atmosphere", "psi", "mmHg"],
  data: ["bit", "byte", "kilobyte", "megabyte", "gigabyte", "terabyte"],
  power: ["watt", "kilowatt", "megawatt", "horsepower"],
  frequency: ["hertz", "kilohertz", "megahertz", "gigahertz"],
};

export default function UnitConverter() {
  const categories = Object.keys(unitGroups);
  const [category, setCategory] = useState("Panjang");
  const [value, setValue] = useState("0");
  const [from, setFrom] = useState(unitGroups["Panjang"][0]);
  const [to, setTo] = useState(unitGroups["Panjang"][1]);
  const [result, setResult] = useState<number | null>(null);

  const handleConvert = async () => {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) return;

    const params = new URLSearchParams({
      value: String(parsedValue),
      from,
      to,
    });

    const res = await fetch(`/api/unit-converter?${params}`);
    const data = await res.json();
    if (res.ok) setResult(data.result);
  };

  type UnitCategory = keyof typeof unitGroups;

  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    setFrom(unitGroups[cat][0]);
    setTo(unitGroups[cat][1]);
    setResult(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="relative w-full max-w-xl p-6 mt-6 mb-10 rounded-2xl border border-zinc-800 bg-black/80 backdrop-blur-xl shadow-2xl overflow-hidden group">
        <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition duration-700 ease-in-out">
          <div className="absolute -inset-20 bg-gradient-to-tr from-red-500 via-white to-black opacity-10 blur-2xl animate-pulse" />
        </div>

        {/* Select Category */}
        <label className="block mb-4 text-white">
          <span className="block mb-1">Kategori</span>
          <select
            value={category}
            onChange={(e) =>
              handleCategoryChange(e.target.value as UnitCategory)
            }
            className="cursor-pointer w-full p-2 bg-black border border-red-500 text-white rounded"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        {/* Input Value */}
        <label className="block mb-4 text-white">
          <span className="block mb-1">Nilai</span>
          <input
            type="number"
            value={value}
            onChange={(e) => {
              let val = e.target.value;

              // Bersihin nol depan saat user mulai ngetik
              if (value === "0") {
                val = val.replace(/^0+/, "");
              }

              // Jangan kosongin
              if (val === "") val = "0";

              setValue(val);
              setResult(null);
            }}
            className="w-full p-2 border border-red-500 bg-black text-white rounded 
             [appearance:textfield] 
             [&::-webkit-inner-spin-button]:appearance-none 
             [&::-webkit-outer-spin-button]:appearance-none"
          />
        </label>

        {/* Unit Selection */}
        <div className="flex gap-4 mb-4 text-white">
          <label className="flex-1">
            <span className="block mb-1">Dari</span>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="cursor-pointer w-full p-2 bg-black border border-red-500 text-white rounded"
            >
              {unitGroups[category].map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </label>

          <label className="flex-1">
            <span className="block mb-1">Ke</span>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="cursor-pointer w-full p-2 bg-black border border-red-500 text-white rounded"
            >
              {unitGroups[category].map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Tombol Convert */}
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
              Hasil: {result} {to}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
