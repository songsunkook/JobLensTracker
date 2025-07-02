// API utility functions
class API {
  static async request(endpoint, options = {}) {
    try {
      const response = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  static buildQueryParams(filters) {
    const params = new URLSearchParams();
    
    if (filters.industries && filters.industries.length > 0) {
      filters.industries.forEach(industry => params.append('industries', industry));
    }
    if (filters.locations && filters.locations.length > 0) {
      filters.locations.forEach(location => params.append('locations', location));
    }
    if (filters.salaryMin) {
      params.append('salaryMin', filters.salaryMin.toString());
    }
    if (filters.salaryMax) {
      params.append('salaryMax', filters.salaryMax.toString());
    }
    if (filters.experienceLevel && filters.experienceLevel !== 'all') {
      params.append('experienceLevel', filters.experienceLevel);
    }
    if (filters.employmentType) {
      params.append('employmentType', filters.employmentType);
    }
    if (filters.isRemote !== undefined) {
      params.append('isRemote', filters.isRemote.toString());
    }
    
    // New filter parameters
    if (filters.techStack && filters.techStack.length > 0) {
      filters.techStack.forEach(tech => params.append('techStack', tech));
    }
    if (filters.techStackOperation) {
      params.append('techStackOperation', filters.techStackOperation);
    }
    if (filters.jobCategory) {
      params.append('jobCategory', filters.jobCategory);
    }
    if (filters.nonTechRequirements && filters.nonTechRequirements.length > 0) {
      filters.nonTechRequirements.forEach(req => params.append('nonTechRequirements', req));
    }
    
    return params.toString();
  }

  static async getJobs(filters) {
    const params = this.buildQueryParams(filters);
    const endpoint = params ? `/api/jobs?${params}` : '/api/jobs';
    return this.request(endpoint);
  }

  static async getStatistics(filters) {
    const params = this.buildQueryParams(filters);
    const endpoint = params ? `/api/statistics?${params}` : '/api/statistics';
    return this.request(endpoint);
  }

  static async getCompanies() {
    return this.request('/api/companies');
  }

  static async createBookmark(jobId, userId = 'demo-user') {
    return this.request('/api/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ jobId, userId })
    });
  }

  static async deleteBookmark(jobId, userId = 'demo-user') {
    return this.request('/api/bookmarks', {
      method: 'DELETE',
      body: JSON.stringify({ jobId, userId })
    });
  }

  static async getBookmarks(userId = 'demo-user') {
    return this.request(`/api/bookmarks?userId=${userId}`);
  }
}

window.API = API;