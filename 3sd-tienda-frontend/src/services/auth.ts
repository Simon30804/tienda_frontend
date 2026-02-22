const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000';

export interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

interface LoginResponse {
  token: string;
  user: Customer;
}

interface MeResponse {
  user: Customer | null;
}

export async function loginCustomer(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${PAYLOAD_URL}/api/customers/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.errors?.[0]?.message || 'Credenciales inválidas');
  }

  return res.json();
}

// Quiero que el registro también haga login automático, así que no devuelvo el usuario directamente, sino que hago login después de registrar. Esto simplifica el flujo en el frontend.
export async function registerCustomer(
  email: string,
  password: string,
  name: string,
  phone?: string,
): Promise<Customer> {
  const res = await fetch(`${PAYLOAD_URL}/api/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password, name, phone }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const msg =
      data.errors?.[0]?.message ||
      data.errors?.[0]?.data?.[0]?.message ||
      'Error al registrar usuario';
    throw new Error(msg);
  }

  const data = await res.json();
  return data.doc;
}

export async function logoutCustomer(): Promise<void> {
  await fetch(`${PAYLOAD_URL}/api/customers/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function getMe(): Promise<Customer | null> {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/customers/me`, {
      credentials: 'include',
    });

    if (!res.ok) return null;

    const data: MeResponse = await res.json();
    return data.user || null;
  } catch {
    return null;
  }
}
