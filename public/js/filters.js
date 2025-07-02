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
      isRemote: false,
      techStack: [],
      techStackOperation: 'OR',
      jobCategory: '',
      nonTechRequirements: []
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

    // Tech stack tags
    const techStackContainer = document.getElementById('techStackTags');
    techStackContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('tech-tag')) {
        this.toggleTechStack(e.target.dataset.tech);
        e.target.classList.toggle('selected');
      }
    });

    // Tech stack operation toggle
    const techOperationInputs = document.querySelectorAll('input[name="techOperation"]');
    techOperationInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        this.updateTechStackOperation(e.target.value);
      });
    });

    // Non-tech requirements checkboxes
    const nonTechContainer = document.getElementById('nonTechFilters');
    nonTechContainer.addEventListener('change', (e) => {
      if (e.target.type === 'checkbox') {
        this.updateNonTechRequirements(e.target.value, e.target.checked);
      }
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

  toggleTechStack(tech) {
    const index = this.filters.techStack.indexOf(tech);
    if (index === -1) {
      this.filters.techStack.push(tech);
    } else {
      this.filters.techStack.splice(index, 1);
    }
  }

  updateTechStackOperation(operation) {
    this.filters.techStackOperation = operation;
  }

  updateNonTechRequirements(requirement, checked) {
    if (checked) {
      if (!this.filters.nonTechRequirements.includes(requirement)) {
        this.filters.nonTechRequirements.push(requirement);
      }
    } else {
      this.filters.nonTechRequirements = this.filters.nonTechRequirements.filter(r => r !== requirement);
    }
  }

  updateJobCategory(category) {
    this.filters.jobCategory = category;
    this.notifyCallbacks();
  }

  loadFilters(savedFilters) {
    // Load saved filter state
    this.filters = { ...this.filters, ...savedFilters };
    
    // Update UI to reflect loaded filters
    this.updateUIFromFilters();
    this.notifyCallbacks();
  }

  updateUIFromFilters() {
    // Update industry checkboxes
    const industryCheckboxes = document.querySelectorAll('#industryFilters input[type="checkbox"]');
    industryCheckboxes.forEach(checkbox => {
      checkbox.checked = this.filters.industries.includes(checkbox.value);
    });

    // Update location checkboxes
    const locationCheckboxes = document.querySelectorAll('#locationFilters input[type="checkbox"]');
    locationCheckboxes.forEach(checkbox => {
      checkbox.checked = this.filters.locations.includes(checkbox.value);
    });

    // Update experience radio buttons
    const experienceRadios = document.querySelectorAll('#experienceFilters input[type="radio"]');
    experienceRadios.forEach(radio => {
      radio.checked = radio.value === this.filters.experienceLevel;
    });

    // Update tech stack tags
    const techTags = document.querySelectorAll('#techStackTags .tech-tag');
    techTags.forEach(tag => {
      tag.classList.toggle('selected', this.filters.techStack.includes(tag.dataset.tech));
    });

    // Update tech operation
    const techOperationRadios = document.querySelectorAll('input[name="techOperation"]');
    techOperationRadios.forEach(radio => {
      radio.checked = radio.value === this.filters.techStackOperation;
    });

    // Update non-tech requirements
    const nonTechCheckboxes = document.querySelectorAll('#nonTechFilters input[type="checkbox"]');
    nonTechCheckboxes.forEach(checkbox => {
      checkbox.checked = this.filters.nonTechRequirements.includes(checkbox.value);
    });

    // Update salary sliders
    const salaryMinSlider = document.getElementById('salaryMin');
    const salaryMaxSlider = document.getElementById('salaryMax');
    const salaryMinValue = document.getElementById('salaryMinValue');
    const salaryMaxValue = document.getElementById('salaryMaxValue');

    if (salaryMinSlider) {
      salaryMinSlider.value = this.filters.salaryMin;
      salaryMinValue.textContent = this.filters.salaryMin.toLocaleString();
    }

    if (salaryMaxSlider) {
      salaryMaxSlider.value = this.filters.salaryMax;
      salaryMaxValue.textContent = this.filters.salaryMax.toLocaleString();
    }

    // Update job category search
    if (window.jobSearchManager) {
      window.jobSearchManager.setSearchTerm(this.filters.jobCategory || '');
    }
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