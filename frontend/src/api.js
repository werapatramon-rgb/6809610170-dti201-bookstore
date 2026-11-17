export async function request(path = '', options = {}) {
  const response = await fetch(`/api/books${path}`, options);
  if (response.status === 204) return null;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body.title || `HTTP ${response.status}`;
    const error = new Error(`${message} (status ${response.status})`);
    error.status = response.status;
    error.body = body;
    throw error;
  }
  return body;
}
