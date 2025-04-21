// Client-side Firebase utilities

// Function to fetch user data from the API
export async function getUserData(userId: string) {
  try {
    const response = await fetch(`/api/user/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

// Function to fetch report data from the API
export async function getReportData(userId: string) {
  try {
    const response = await fetch(`/api/report/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch report data');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching report data:', error);
    return null;
  }
} 