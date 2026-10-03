const API_URL = import.meta.env.VITE_API_URL;

export const checkBackendHealth = async () => {
  const response = await fetch(`${API_URL}/api/health`);

  if (!response.ok) {
    throw new Error("Backend health check failed");
  }

  return response.json();
};

export const createEmail = async (emailData) => {
  const response = await fetch(
    `${API_URL}/api/emails/create-emails`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(emailData),
    }
  );

  const raw = await response.text();

  let data;

  try {
    data = JSON.parse(raw);
  } catch {
    data = {
      message: raw || "Invalid response from server",
    };
  }

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to send email"
    );
  }

  return data;
};

export const getEmails = async () => {
  const response = await fetch(
    `${API_URL}/api/emails`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch emails"
    );
  }

  return data;
};