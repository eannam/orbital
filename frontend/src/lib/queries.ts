const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const checkHealth = async () => {
  const url = `${API_URL}/health`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getRawData = async (): Promise<object[]> => {
  const url = `${API_URL}/data/raw`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
};

export type ParsedDataItem = {
  id: string;
  registrationDateAndPlanReference: string;
  description: string;
  leaseDateAndTerm: string;
  lesseeTitle: string;
  notes: string[];
};

export const getParsedData = async (): Promise<ParsedDataItem[]> => {
  const url = `${API_URL}/data/parsed`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
};
