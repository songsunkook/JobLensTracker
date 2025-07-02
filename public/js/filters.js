// Filter management
class FilterManager {
  constructor() {
    this.filters = {
      industries: ['IT/소프트웨어', '핀테크'],
      salaryMin: 3000,
      salaryMax: 6000,
      locations: ['서울', '판교'],
      experienceLevel: 'all',
      employmentType: 'full-time',
      isRemote: false
    };
    
    this.callbacks = [];
    this.initializeFilters();
  }

  initializeFilters() {
    // Industry checkboxes
    const industryContainer = document.getElementById('industryFilters');
    industryContainer.addEventListener('change', (e) => {
      if (e.target.type === 'checkbox') {
        this.updateIndustryFilter(e.target.value, e.target.checked);
      }
    });

    // Location checkboxes
    const locationContainer = document.getElementById('locationFilters');
    locationContainer.addEventListener('change', (e) => {
      if (e.target.type === 'checkbox') {
        this.updateLocationFilter(e.target.value, e.target.checked);
      }
    });

    // Experience radio buttons
    const experienceContainer = document.getElementById('experienceFilters');
    experienceContainer.addEventListener('change', (e) => {
      if (e.target.type === 'radio') {
        this.updateExperienceFilter(e.target.value);
      }
    });

    // Salary range sliders
    const salaryMinSlider = document.getElementById('salaryMin');
    const salaryMaxSlider = document.getElementById('salaryMax');
    const salaryMinValue = document.getElementById('salaryMinValue');
    const salaryMaxValue = document.getElementById('salaryMaxValue');

    salaryMinSlider.addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      this.filters.salaryMin = value;
      salaryMinValue.textContent = value.toLocaleString();
    });

    salaryMaxSlider.addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      this.filters.salaryMax = value;
      salaryMaxValue.textContent = value.toLocaleString();
    });

    // Apply filters button
    const applyBtn = document.getElementById('applyFiltersBtn');
    applyBtn.addEventListener('click', () => {
      this.notifyCallbacks();
    });

    // Set initial values
    salaryMinValue.textContent = this.filters.salaryMin.toLocaleString();
    salaryMaxValue.textContent = this.filters.salaryMax.toLocaleString();
  }

  updateIndustryFilter(industry, checked) {
    if (checked) {
      if (!this.filters.industries.includes(industry)) {
        this.filters.industries.push(industry);
      }
    } else {
      this.filters.industries = this.filters.industries.filter(i => i !== industry);
    }
  }

  updateLocationFilter(location, checked) {
    if (checked) {
      if (!this.filters.locations.includes(location)) {
        this.filters.locations.push(location);
      }
    } else {
      this.filters.locations = this.filters.locations.filter(l => l !== location);
    }
  }

  updateExperienceFilter(experience) {
    this.filters.experienceLevel = experience;
  }

  getFilters() {
    return { ...this.filters };
  }

  onFilterChange(callback) {
    this.callbacks.push(callback);
  }

  notifyCallbacks() {
    this.callbacks.forEach(callback => callback(this.getFilters()));
  }
}

window.FilterManager = FilterManager;