// Job listings management
class JobListingsManager {
  constructor() {
    this.elements = {
      jobListingsCard: document.getElementById('jobListingsCard'),
      jobsContainer: document.getElementById('jobsContainer'),
      loadMoreContainer: document.getElementById('loadMoreContainer'),
      sortSelect: document.getElementById('sortSelect')
    };
    
    this.bookmarkedJobs = new Set();
    this.currentJobs = [];
    
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Sort selection
    this.elements.sortSelect.addEventListener('change', (e) => {
      this.sortJobs(e.target.value);
    });
  }

  async updateJobListings(filters) {
    try {
      const jobs = await API.getJobs(filters);
      this.currentJobs = jobs;
      this.displayJobs(jobs);
    } catch (error) {
      console.error('Failed to update job listings:', error);
      Toast.show('채용 공고를 불러오는데 실패했습니다.', 'error');
    }
  }

  displayJobs(jobs) {
    // Clear existing jobs
    this.elements.jobsContainer.innerHTML = '';

    if (jobs.length === 0) {
      this.showEmptyState();
      return;
    }

    // Create job cards
    jobs.forEach(job => {
      const jobCard = this.createJobCard(job);
      this.elements.jobsContainer.appendChild(jobCard);
    });

    // Show load more button if there are jobs
    if (jobs.length > 0) {
      this.elements.loadMoreContainer.style.display = 'block';
    } else {
      this.elements.loadMoreContainer.style.display = 'none';
    }

    // Show the job listings card
    this.elements.jobListingsCard.style.display = 'block';
    this.elements.jobListingsCard.classList.add('fade-in');

    // Remove animation class after animation completes
    setTimeout(() => {
      this.elements.jobListingsCard.classList.remove('fade-in');
    }, 300);
  }

  createJobCard(job) {
    const card = document.createElement('div');
    card.className = 'job-card';
    
    const isNew = job.postedAt && 
      new Date(job.postedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;
    
    const formattedSalary = this.formatSalary(job.salaryMin, job.salaryMax);
    const experienceLabel = this.getExperienceLabel(job.experienceLevel);
    
    card.innerHTML = `
      <div class="job-header">
        <div>
          <div class="job-title">
            ${job.title}
            ${isNew ? '<span class="new-badge">신규</span>' : ''}
          </div>
          <div class="job-company">${job.company.name}</div>
          <div class="job-meta">
            <span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              ${job.company.location}
            </span>
            <span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              ${formattedSalary}
            </span>
            <span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              ${experienceLabel}
            </span>
          </div>
          <div class="job-skills">
            ${job.requirements.slice(0, 4).map(skill => 
              `<span class="skill-tag">${skill}</span>`
            ).join('')}
            ${job.requirements.length > 4 ? 
              `<span class="skill-tag">+${job.requirements.length - 4}</span>` : ''}
          </div>
        </div>
        <button class="bookmark-btn ${this.bookmarkedJobs.has(job.id) ? 'bookmarked' : ''}" 
                data-job-id="${job.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>
    `;

    // Add click event for job details
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.bookmark-btn')) {
        this.showJobDetails(job);
      }
    });

    // Add bookmark functionality
    const bookmarkBtn = card.querySelector('.bookmark-btn');
    bookmarkBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleBookmark(job.id, bookmarkBtn);
    });

    return card;
  }

  formatSalary(min, max) {
    if (!min && !max) return '협의';
    if (!min) return `~${max?.toLocaleString()}만원`;
    if (!max) return `${min.toLocaleString()}만원~`;
    return `${min.toLocaleString()}~${max.toLocaleString()}만원`;
  }

  getExperienceLabel(level) {
    switch (level) {
      case 'entry': return '신입';
      case 'junior': return '경력 1-3년';
      case 'mid': return '경력 3-5년';
      case 'senior': return '시니어 5년+';
      default: return '경력무관';
    }
  }

  async toggleBookmark(jobId, buttonElement) {
    try {
      const isBookmarked = this.bookmarkedJobs.has(jobId);
      
      if (isBookmarked) {
        await API.deleteBookmark(jobId);
        this.bookmarkedJobs.delete(jobId);
        buttonElement.classList.remove('bookmarked');
        Toast.show('북마크에서 제거되었습니다.', 'success');
      } else {
        await API.createBookmark(jobId);
        this.bookmarkedJobs.add(jobId);
        buttonElement.classList.add('bookmarked');
        Toast.show('북마크에 추가되었습니다.', 'success');
      }
    } catch (error) {
      console.error('Bookmark operation failed:', error);
      Toast.show('북마크 처리 중 오류가 발생했습니다.', 'error');
    }
  }

  sortJobs(sortBy) {
    let sortedJobs = [...this.currentJobs];
    
    switch (sortBy) {
      case 'latest':
        sortedJobs.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
        break;
      case 'salary':
        sortedJobs.sort((a, b) => {
          const avgA = ((a.salaryMin || 0) + (a.salaryMax || 0)) / 2;
          const avgB = ((b.salaryMin || 0) + (b.salaryMax || 0)) / 2;
          return avgB - avgA;
        });
        break;
      case 'deadline':
        sortedJobs.sort((a, b) => {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline) - new Date(b.deadline);
        });
        break;
    }
    
    this.displayJobs(sortedJobs);
  }

  showJobDetails(job) {
    // Simple modal or alert for job details
    const details = `
회사: ${job.company.name}
직무: ${job.title}
위치: ${job.company.location}
연봉: ${this.formatSalary(job.salaryMin, job.salaryMax)}
경력: ${this.getExperienceLabel(job.experienceLevel)}

설명: ${job.description}

필수 조건: ${job.requirements.join(', ')}
우대 조건: ${job.preferredSkills.join(', ')}
    `;
    
    alert(details);
  }

  showEmptyState() {
    this.elements.jobsContainer.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--muted-foreground);">
        <p>조건에 맞는 채용 공고가 없습니다.</p>
      </div>
    `;
    this.elements.loadMoreContainer.style.display = 'none';
  }

  hide() {
    this.elements.jobListingsCard.style.display = 'none';
  }
}

window.JobListingsManager = JobListingsManager;