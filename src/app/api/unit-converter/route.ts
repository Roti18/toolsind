import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const value = parseFloat(searchParams.get("value") || "0");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (isNaN(value) || !from || !to) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  try {
    const result = convert(value, from, to);
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}

const unitCategories = {
  length: ["m", "cm", "km", "in", "ft", "yd", "mi"],
  temperature: ["C", "F", "K"],
  mass: ["g", "kg", "lb", "oz", "ton"],
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

function convert(value: number, from: string, to: string): number {
  const category = Object.entries(unitCategories).find(
    ([_, units]) => units.includes(from) && units.includes(to)
  );

  if (!category) throw new Error("Incompatible units");

  const [name] = category;

  if (name === "temperature") {
    return convertTemperature(value, from, to);
  }

  const factor = unitFactors[name as keyof typeof unitFactors];
  return (value * factor[from]) / factor[to];
}

const unitFactors = {
  length: {
    m: 1,
    cm: 100,
    km: 0.001,
    in: 39.3701,
    ft: 3.28084,
    yd: 1.09361,
    mi: 0.000621371,
  },
  mass: {
    g: 1,
    kg: 0.001,
    lb: 0.00220462,
    oz: 0.035274,
    ton: 0.000001,
  },
  time: {
    s: 1,
    min: 1 / 60,
    h: 1 / 3600,
    day: 1 / 86400,
    week: 1 / 604800,
  },
  area: {
    m2: 1,
    cm2: 10000,
    km2: 0.000001,
    ft2: 10.7639,
    in2: 1550,
    acre: 0.000247105,
    ha: 0.0001,
  },
  volume: {
    ml: 1000,
    l: 1,
    m3: 0.001,
    gal: 0.264172,
    pt: 2.11338,
  },
  speed: {
    "m/s": 1,
    "km/h": 3.6,
    mph: 2.23694,
    knot: 1.94384,
  },
  energy: {
    j: 1,
    kj: 0.001,
    cal: 0.239006,
    kcal: 0.000239006,
    wh: 0.000277778,
  },
  pressure: {
    pa: 1,
    bar: 1e-5,
    atm: 9.8692e-6,
    psi: 0.000145038,
    mmhg: 0.00750062,
  },
  data: {
    bit: 1,
    b: 1 / 8,
    kb: 1 / 8000,
    mb: 1 / 8e6,
    gb: 1 / 8e9,
    tb: 1 / 8e12,
  },
  power: {
    w: 1,
    kw: 0.001,
    hp: 0.00134102,
  },
  frequency: {
    hz: 1,
    khz: 0.001,
    mhz: 1e-6,
    ghz: 1e-9,
  },
};

function convertTemperature(value: number, from: string, to: string): number {
  if (from === to) return value;

  // Convert to Celsius first
  let celsius: number;
  switch (from) {
    case "C":
      celsius = value;
      break;
    case "F":
      celsius = (value - 32) * (5 / 9);
      break;
    case "K":
      celsius = value - 273.15;
      break;
    default:
      throw new Error("Unsupported temperature unit");
  }

  // Convert from Celsius to target
  switch (to) {
    case "C":
      return celsius;
    case "F":
      return celsius * (9 / 5) + 32;
    case "K":
      return celsius + 273.15;
    default:
      throw new Error("Unsupported temperature unit");
  }
}
