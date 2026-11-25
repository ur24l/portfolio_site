export type Scenario = "valid" | "dark" | "photo" | "unknown";
export type CheckinStep = {
  state: "done" | "error" | "skipped";
  message: string;
};

/** What the sample panel shows for each scenario. */
export const sampleInputs: Record<
  Scenario,
  { source: string; light: string; face: string }
> = {
  valid: { source: "Entrance kiosk", light: "Good", face: "Live employee" },
  dark: { source: "Entrance kiosk", light: "Too dark", face: "Live employee" },
  photo: { source: "Entrance kiosk", light: "Good", face: "Printed photo" },
  unknown: { source: "Entrance kiosk", light: "Good", face: "Not enrolled" },
};

const found: CheckinStep = {
  state: "done",
  message: "One face found, with five landmarks (YuNet).",
};
const quality: CheckinStep = {
  state: "done",
  message: "Size, light, sharpness and head pose are all within limits.",
};
const live: CheckinStep = {
  state: "done",
  message: "Liveness passed: a real face, not a photo or a screen.",
};
const skipped = (message: string): CheckinStep => ({
  state: "skipped",
  message,
});

/**
 * A deterministic illustration of the attendance pipeline: detect -> quality -> liveness -> match.
 * No camera, network or storage is used.
 */
export function checkinSteps(scenario: Scenario): CheckinStep[] {
  if (scenario === "dark")
    return [
      found,
      {
        state: "error",
        message:
          "Too dark. The person is asked to find more light; nothing is matched or saved.",
      },
      skipped("Liveness not checked."),
      skipped("No attendance recorded."),
    ];
  if (scenario === "photo")
    return [
      found,
      quality,
      {
        state: "error",
        message:
          "Real face required. The liveness model (MiniFASNet) refuses a printed photo.",
      },
      skipped("No attendance recorded."),
    ];
  if (scenario === "unknown")
    return [
      found,
      quality,
      live,
      {
        state: "error",
        message:
          "Face not recognised. No enrolled employee is similar enough, so nothing is saved.",
      },
    ];
  return [
    found,
    quality,
    live,
    {
      state: "done",
      message:
        "Matched an enrolled employee (similarity 0.82, limit 0.45). Checked in at 09:28; the HR dashboard updates live.",
    },
  ];
}
