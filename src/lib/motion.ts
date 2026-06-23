export const spring = {
  /** Heavy card cascade — columns sliding onto the table */
  cascade: { type: "spring" as const, stiffness: 220, damping: 24, mass: 1.2 },
  /** Structural panels — sandbox morph, layout shifts */
  structural: { type: "spring" as const, stiffness: 200, damping: 25, mass: 1.1 },
  /** Mechanical switch — tab underline, toggles */
  switch: { type: "spring" as const, stiffness: 380, damping: 32 },
  /** Default card hover / micro interactions */
  card: { type: "spring" as const, stiffness: 180, damping: 20, mass: 1.2 },
};

export const cascadeDelay = (index: number, total: number) => ({
  ...spring.cascade,
  delay: (total - 1 - index) * 0.08,
});
