export async function request(path = '', options = {}) {
  const response = await fetch(/api/books, options);
  if (response.status === 204) return null;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body.title || HTTP ;
    const error = new Error(${message} (status ));
    error.status = response.status;
    error.body = body;
    throw error;
  }
  return body;
}
