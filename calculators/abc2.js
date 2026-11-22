import { registerCalculator, CALC_CONTEXT } from "./core.js";
import { calculateABC2Volume } from "./abc2_math.js";

registerCalculator({
  id: "abc2",
  icon: "◉",
  title: "ABC/2 Hematoma Volume",
  short: "ABC/2",
  description:
    "Estimates intracerebral hematoma volume from CT dimensions. It offers a rapid bedside volume estimate used in ICH severity assessment and the ICH Score.",
  workflows: ["ich-spontaneous"],
  fields: [
    {
      key: "a",
      label: "A · largest diameter",
      unit: "cm",
      type: "number",
      step: 0.1,
      placeholder: "0.0",
    },
    {
      key: "b",
      label: "B · perpendicular diameter",
      unit: "cm",
      type: "number",
      step: 0.1,
      placeholder: "0.0",
    },
    {
      key: "slices",
      label: "Slices containing hemorrhage",
      type: "number",
      step: 1,
      placeholder: "0",
    },
    {
      key: "thickness",
      label: "Slice thickness",
      unit: "cm",
      type: "number",
      step: 0.1,
      placeholder: "0.5",
    },
  ],
 
  calculate(v) {
    const a = Number(v.a);
    const b = Number(v.b);
    const slices = Number(v.slices);
    const thickness = Number(v.thickness);

    const { c, volume } = calculateABC2Volume(a, b, slices, thickness);

    CALC_CONTEXT.volume = volume;

    return {
      score: volume !==null ? volume.toFixed(1) : "—",
      unit: "mL",
      label: c !==null ? `C = ${c.toFixed(1)} cm` : "Enter all four measurements",
      interpretation: "Estimated intraparenchymal hematoma volume.",
      details: [
        "Calculated as A × B × C ÷ 2.",
        "Commonly used as the hematoma-volume variable in the ICH Score.",
      ],
      note: "ABC/2 is a rapid estimate, not planimetric measurement; irregular or multilobar hematomas can reduce accuracy.",
    };
  },
});


