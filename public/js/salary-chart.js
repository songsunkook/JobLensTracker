// Salary chart management using Chart.js
class SalaryChartManager {
  constructor() {
    this.elements = {
      salaryChartCard: document.getElementById('salaryChartCard'),
      chartCanvas: document.getElementById('salaryChart'),
      minSalary: document.getElementById('minSalary'),
      medianSalary: document.getElementById('medianSalary'),
      maxSalary: document.getElementById('maxSalary')
    };
    
    this.chart = null;
  }

  async updateChart(filters) {
    try {
      const statistics = await API.getStatistics(filters);
      this.displayChart(statistics);
    } catch (error) {
      console.error('Failed to update salary chart:', error);
    }
  }

  displayChart(statistics) {
    const { salaryDistribution, avgSalary } = statistics;

    // Calculate salary stats
    const salaryStats = {
      min: 3200,
      median: avgSalary || 0,
      max: 7500
    };

    // Update salary stats display
    this.elements.minSalary.textContent = `${salaryStats.min.toLocaleString()}만원`;
    this.elements.medianSalary.textContent = `${salaryStats.median.toLocaleString()}만원`;
    this.elements.maxSalary.textContent = `${salaryStats.max.toLocaleString()}만원`;

    // Prepare chart data
    const chartData = {
      labels: salaryDistribution.map(item => item.range),
      datasets: [{
        label: '공고 수',
        data: salaryDistribution.map(item => item.count),
        backgroundColor: 'hsl(207, 90%, 54%)',
        borderColor: 'hsl(207, 90%, 48%)',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      }]
    };

    // Chart configuration
    const config = {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'hsl(207, 90%, 54%)',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                return `${context.parsed.y}개 공고`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 12
              },
              color: 'hsl(25, 5.3%, 44.7%)'
            }
          },
          y: {
            grid: {
              color: 'hsl(60, 4.8%, 95.9%)',
              drawBorder: false
            },
            ticks: {
              font: {
                size: 12
              },
              color: 'hsl(25, 5.3%, 44.7%)',
              beginAtZero: true
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        }
      }
    };

    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    // Create new chart
    this.chart = new Chart(this.elements.chartCanvas, config);

    // Show the chart card
    this.elements.salaryChartCard.style.display = 'block';
    this.elements.salaryChartCard.classList.add('fade-in');

    // Remove animation class after animation completes
    setTimeout(() => {
      this.elements.salaryChartCard.classList.remove('fade-in');
    }, 300);
  }

  hide() {
    this.elements.salaryChartCard.style.display = 'none';
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}

window.SalaryChartManager = SalaryChartManager;