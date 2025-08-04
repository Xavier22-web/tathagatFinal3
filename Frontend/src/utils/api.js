// API utility functions with error handling

// Detect if we're running on localhost or in production
const isLocalhost = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
   window.location.hostname === '127.0.0.1' ||
   window.location.hostname === '0.0.0.0');

// Configure API base URL based on environment
const API_BASE_URL = process.env.REACT_APP_API_URL ||
  (isLocalhost ? 'http://localhost:5000' : '');

// Log the configuration for debugging
console.log('API Configuration:', {
  NODE_ENV: process.env.NODE_ENV,
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
  href: typeof window !== 'undefined' ? window.location.href : 'server',
  isLocalhost,
  API_BASE_URL,
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  finalApiUrl: `${API_BASE_URL}/api/courses/student/published-courses`
});

// Development mock data
const MOCK_DATA = {
  courses: {
    success: true,
    courses: [
      {
        _id: '507f1f77bcf86cd799439011',
        name: 'CAT 2026',
        description: 'Complete preparation package for CAT 2026',
        published: true,
        price: 9999,
        duration: '12 months'
      },
      {
        _id: '507f1f77bcf86cd799439012',
        name: 'IPMAT 2027',
        description: 'Integrated Program in Management Aptitude Test preparation',
        published: true,
        price: 7999,
        duration: '10 months'
      }
    ]
  },
  mockTests: {
    success: true,
    series: [
      {
        _id: '507f1f77bcf86cd799439013',
        title: 'CAT Mock Test Series 2024',
        description: 'Complete mock test series for CAT preparation',
        category: 'CAT',
        totalTests: 10,
        difficulty: 'Mixed',
        published: true,
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      {
        _id: '507f1f77bcf86cd799439014',
        title: 'IPMAT Mock Test Series 2024',
        description: 'Comprehensive IPMAT preparation test series',
        category: 'IPMAT',
        totalTests: 8,
        difficulty: 'Intermediate',
        published: true,
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    ],
    data: [
      {
        _id: '507f1f77bcf86cd799439013',
        title: 'CAT Mock Test 1',
        description: 'Complete mock test for CAT preparation',
        duration: 180,
        totalQuestions: 100
      }
    ]
  },
  devLogin: {
    success: true,
    token: 'dev_token_12345',
    user: {
      id: '507f1f77bcf86cd799439011',
      email: 'dev@test.com',
      name: 'Development User',
      role: 'student'
    }
  }
};

// Generic fetch wrapper with error handling and development fallback
export const fetchWithErrorHandling = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for faster development

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Try to parse JSON first, then handle errors
    let responseData;
    try {
      responseData = await response.json();
    } catch (parseError) {
      // If JSON parsing fails, create a basic error response
      responseData = {
        success: false,
        message: `HTTP ${response.status}: ${response.statusText}`
      };
    }

    if (!response.ok) {
      // Now we can safely access the response data without re-reading the stream
      const errorMessage = responseData.message || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    clearTimeout(timeoutId);

    // In development, if backend is not available, return mock data
    if (process.env.NODE_ENV === 'development' &&
        (error.name === 'AbortError' ||
         error instanceof TypeError ||
         error.message.includes('fetch'))) {

      console.warn('🔄 Backend unavailable, using mock data for:', url);

      // Return appropriate mock data based on URL
      if (url.includes('/api/courses/student/published-courses')) {
        return MOCK_DATA.courses;
      } else if (url.includes('/api/mock-tests/series')) {
        console.log('🔄 Returning mock data for mock test series');
        return MOCK_DATA.mockTests;
      } else if (url.includes('/api/admin/mock-tests/series')) {
        console.log('🔄 Returning mock data for admin mock test series');
        return {
          success: true,
          series: [
            {
              _id: '1',
              title: 'CAT 2024 Mock Test Series',
              description: 'Complete CAT preparation with 10 mock tests',
              category: 'CAT',
              isPublished: true,
              actualTestCount: 10,
              enrolledCount: 245,
              validity: 365,
              price: 2999,
              tags: ['CAT', 'Mock Tests', '2024']
            }
          ]
        };
      } else if (url.includes('/api/admin/mock-tests/tests')) {
        console.log('🔄 Returning mock data for admin mock tests');
        return {
          success: true,
          tests: [
            {
              _id: '1',
              title: 'Mock Test 1',
              description: 'First practice test with mixed difficulty',
              seriesId: '1',
              duration: 180,
              totalQuestions: 100,
              difficulty: 'Medium',
              isActive: true,
              attemptCount: 156,
              positiveMarks: 3,
              negativeMarks: -1,
              sections: [
                { name: 'VARC', questions: 34, duration: 60 },
                { name: 'DILR', questions: 32, duration: 60 },
                { name: 'QA', questions: 34, duration: 60 }
              ]
            }
          ]
        };
      } else if (url.includes('/api/admin/mock-tests/questions')) {
        console.log('🔄 Returning mock data for admin mock test questions');
        return {
          success: true,
          questions: [
            {
              _id: '1',
              questionText: 'Read the following passage and answer the question that follows...',
              section: 'VARC',
              questionType: 'Multiple Choice',
              difficulty: 'Medium',
              topic: 'Reading Comprehension',
              marks: { positive: 3, negative: -1 },
              options: ['Option A', 'Option B', 'Option C', 'Option D']
            }
          ]
        };
      } else if (url.includes('/api/dev/login')) {
        return MOCK_DATA.devLogin;
      } else if (url.includes('/api/health')) {
        return { status: 'ok', message: 'Mock health check' };
      }

      // Default mock response
      return {
        success: true,
        message: 'Mock response - backend unavailable',
        data: []
      };
    }

    if (error.name === 'AbortError') {
      throw new Error('Request timeout - backend server may be unavailable');
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend server. Please check if the server is running.');
    }

    throw error;
  }
};

// Check if backend is available
export const checkBackendHealth = async () => {
  try {
    await fetchWithErrorHandling(`${API_BASE_URL}/api/health`);
    return true;
  } catch (error) {
    console.warn('Backend health check failed:', error.message);
    return false;
  }
};

// API endpoints
export const API_ENDPOINTS = {
  AUTO_LOGIN: `${API_BASE_URL}/api/v1/auto-login`,
  PUBLISHED_COURSES: `${API_BASE_URL}/api/courses/student/published-courses`,
  MY_COURSES: `${API_BASE_URL}/api/user/student/my-courses`,
  IIM_PREDICTOR: (userId) => `${API_BASE_URL}/api/v2/iim-predictor/${userId}`,
};

// Helper function to retry API calls
const retryApiCall = async (apiCall, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      console.log(`API call attempt ${attempt} failed:`, error.message);

      if (attempt === maxRetries) {
        throw error;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
};

// Course API functions
export const fetchPublishedCourses = async () => {
  const apiCall = async () => {
    console.log('Fetching courses from:', API_ENDPOINTS.PUBLISHED_COURSES);
    const data = await fetchWithErrorHandling(API_ENDPOINTS.PUBLISHED_COURSES);
    console.log('Courses fetched successfully:', data);
    return data;
  };

  try {
    // In production (non-localhost), retry API calls as backend might be starting up
    if (!isLocalhost) {
      return await retryApiCall(apiCall, 3, 2000);
    } else {
      return await apiCall();
    }
  } catch (error) {
    console.error('Error fetching published courses:', error);
    console.error('API_BASE_URL:', API_BASE_URL);
    console.error('NODE_ENV:', process.env.NODE_ENV);
    throw error;
  }
};

export const fetchMyCourses = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    const data = await fetchWithErrorHandling(API_ENDPOINTS.MY_COURSES, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    return data;
  } catch (error) {
    console.error('Error fetching my courses:', error);
    throw error;
  }
};

// Mock Test API functions
export const startMockTest = async (testId) => {
  try {
    const authToken = localStorage.getItem('authToken');
    console.log('🚀 Starting mock test with token:', authToken ? 'Present' : 'Missing');

    if (!authToken) {
      throw new Error('Authentication required. Please log in to start the test.');
    }

    console.log('Making API call to:', `${API_BASE_URL}/api/mock-tests/test/${testId}/start`);

    const data = await fetchWithErrorHandling(`${API_BASE_URL}/api/mock-tests/test/${testId}/start`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    console.log('✅ Mock test started successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Error starting mock test:', error);
    throw error;
  }
};

export const devLogin = async () => {
  try {
    const data = await fetchWithErrorHandling(`${API_BASE_URL}/api/dev/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (data.success && data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Development user logged in successfully');
    }

    return data;
  } catch (error) {
    console.error('Error with dev login:', error);
    throw error;
  }
};

// Safe fetch wrapper that prevents body stream errors
export const safeFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);

    let data;
    let parseSuccess = false;

    try {
      data = await response.json();
      parseSuccess = true;
    } catch (parseError) {
      console.warn('Failed to parse response as JSON:', parseError);
      data = {
        success: false,
        message: `Server returned ${response.status}: ${response.statusText}`
      };
    }

    return {
      response,
      data,
      parseSuccess,
      ok: response.ok,
      status: response.status,
      statusText: response.statusText
    };
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
