// Main application initialization and coordination
class JobLensApp {
  constructor() {
    this.isLoading = false;
    this.managers = {};
    
    this.initializeApp();
  }

  async initializeApp() {
    try {
      // Show initial loading state
      this.showLoading();

      // Initialize all managers
      this.managers.filter = new FilterManager();
      this.managers.statistics = new StatisticsManager();
      this.managers.keywords = new KeywordsManager();
      this.managers.salaryChart = new SalaryChartManager();
      this.managers.jobListings = new JobListingsManager();
      this.managers.map = new MapManager();

      // Initialize toast system
      Toast.init();

      // Set up filter change listener
      this.managers.filter.onFilterChange((filters) => {
        this.updateAllData(filters);
      });

      // Load initial data
      const initialFilters = this.managers.filter.getFilters();
      await this.updateAllData(initialFilters);
      
      console.log('JobLens app initialized successfully');
    } catch (error) {
      console.error('Failed to initialize app:', error);
      this.hideLoading();
      Toast.error('애플리케이션 초기화에 실패했습니다.');
    }
  }

  async updateAllData(filters) {
    if (this.isLoading) return;
    
    try {
      this.isLoading = true;
      this.showLoading();

      // Update all components in parallel for better performance
      const updatePromises = [
        this.managers.statistics.updateStatistics(filters),
        this.managers.keywords.updateKeywords(filters),
        this.managers.salaryChart.updateChart(filters),
        this.managers.jobListings.updateJobListings(filters),
        this.managers.map.updateMap(filters)
      ];

      await Promise.all(updatePromises);
      
      this.hideLoading();
      this.isLoading = false;
      
    } catch (error) {
      console.error('Failed to update data:', error);
      this.hideLoading();
      this.isLoading = false;
      Toast.error('데이터를 불러오는데 실패했습니다.');
    }
  }

  showLoading() {
    const loadingElement = document.getElementById('loadingState');
    if (loadingElement) {
      loadingElement.style.display = 'flex';
    }
    
    // Hide all content cards
    this.hideAllCards();
  }

  hideLoading() {
    const loadingElement = document.getElementById('loadingState');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
  }

  hideAllCards() {
    const cards = [
      'statisticsCard',
      'keywordsCard', 
      'salaryChartCard',
      'jobListingsCard'
    ];
    
    cards.forEach(cardId => {
      const card = document.getElementById(cardId);
      if (card) {
        card.style.display = 'none';
      }
    });
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.jobLensApp = new JobLensApp();
});

// Make classes available globally for debugging
window.JobLensApp = JobLensApp;