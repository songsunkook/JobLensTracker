// Statistics display management
class StatisticsManager {
  constructor() {
    this.elements = {
      statisticsCard: document.getElementById('statisticsCard'),
      resultCount: document.getElementById('resultCount'),
      avgSalary: document.getElementById('avgSalary'),
      totalJobs: document.getElementById('totalJobs'),
      newJobs: document.getElementById('newJobs'),
      companies: document.getElementById('companies')
    };
  }

  async updateStatistics(filters) {
    try {
      const statistics = await API.getStatistics(filters);
      this.displayStatistics(statistics);
    } catch (error) {
      console.error('Failed to update statistics:', error);
      Toast.show('통계 데이터를 불러오는데 실패했습니다.', 'error');
    }
  }

  displayStatistics(statistics) {
    const {
      totalJobs,
      avgSalary,
      newJobs,
      companies
    } = statistics;

    // Update result count
    this.elements.resultCount.innerHTML = `조건에 맞는 <strong>${totalJobs}개</strong> 기업`;

    // Update statistics values
    this.elements.avgSalary.textContent = avgSalary ? avgSalary.toLocaleString() : '0';
    this.elements.totalJobs.textContent = totalJobs.toLocaleString();
    this.elements.newJobs.textContent = newJobs.toLocaleString();
    this.elements.companies.textContent = companies.toLocaleString();

    // Show the statistics card with animation
    this.elements.statisticsCard.style.display = 'block';
    this.elements.statisticsCard.classList.add('fade-in');

    // Remove animation class after animation completes
    setTimeout(() => {
      this.elements.statisticsCard.classList.remove('fade-in');
    }, 300);
  }

  hide() {
    this.elements.statisticsCard.style.display = 'none';
  }
}

window.StatisticsManager = StatisticsManager;