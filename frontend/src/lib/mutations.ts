const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const parseData = async () => {
  const url = `${API_URL}/data/parsed`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to parse data");
  }
};

export const deleteParsedData = async () => {
  const url = `${API_URL}/data/parsed`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete data");
  }
};

export const reportIssue = async ({ id }: { id: string }) => {
  const url = `${API_URL}/data/parsed/${id}/report_issue`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to report issue");
  }
};
