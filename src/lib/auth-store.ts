const USERS_KEY = "echosaas-users";

export const DEMO_GUEST = {
  username: "guest_dev",
  password: "echo2026",
  email: "guest@echo.saas",
} as const;

export interface StoredOperator {
  username: string;
  email: string;
  password: string;
}

export function getOperators(): StoredOperator[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredOperator[]) : [];
  } catch {
    return [];
  }
}

function saveOperators(operators: StoredOperator[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(operators));
}

export function registerOperator(operator: StoredOperator): { ok: true } | { ok: false; reason: string } {
  const operators = getOperators();
  if (operators.some((o) => o.username.toLowerCase() === operator.username.toLowerCase())) {
    return { ok: false, reason: "Username already allocated to another node." };
  }
  operators.push(operator);
  saveOperators(operators);
  return { ok: true };
}

export function ensureDemoGuest(): void {
  if (typeof window === "undefined") return;
  const operators = getOperators();
  if (!operators.some((o) => o.username.toLowerCase() === DEMO_GUEST.username)) {
    operators.push({ ...DEMO_GUEST });
    saveOperators(operators);
  }
}

export function validateOperatorLogin(username: string, password: string): boolean {
  if (
    username.toLowerCase() === DEMO_GUEST.username &&
    password === DEMO_GUEST.password
  ) {
    return true;
  }
  const operators = getOperators();
  const match = operators.find((o) => o.username.toLowerCase() === username.toLowerCase());
  return !!match && match.password === password;
}

export function validateUsername(username: string): string | null {
  if (username.trim().length < 3) return "Username must be at least 3 characters.";
  if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) return "Username may only contain letters, numbers, and underscores.";
  return null;
}

export function validatePassword(password: string): string | null {
  if (password.length < 6) return "Security cipher must be at least 6 characters.";
  return null;
}

export function validateEmail(email: string): string | null {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Invalid companion email format.";
  return null;
}
