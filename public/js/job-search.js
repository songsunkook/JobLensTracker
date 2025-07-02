/**
 * Job Search Manager
 * Handles job category search with autocomplete functionality
 */
class JobSearchManager {
  constructor() {
    this.searchInput = document.getElementById('jobCategorySearch');
    this.dropdown = document.getElementById('jobSearchDropdown');
    this.searchTimeout = null;
    this.isDropdownVisible = false;
    
    this.attachEventListeners();
  }

  attachEventListeners() {
    // Search input handling with debounce
    this.searchInput.addEventListener('input', (e) => {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.handleSearch(e.target.value);
      }, 300);
    });

    // Handle search input focus and blur
    this.searchInput.addEventListener('focus', () => {
      if (this.searchInput.value.trim()) {
        this.handleSearch(this.searchInput.value);
      }
    });

    this.searchInput.addEventListener('blur', () => {
      // Delay hiding dropdown to allow for clicks
      setTimeout(() => {
        this.hideDropdown();
      }, 200);
    });

    // Handle Enter key
    this.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.applySearch();
      } else if (e.key === 'Escape') {
        this.hideDropdown();
        this.searchInput.blur();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.selectNextSuggestion();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.selectPreviousSuggestion();
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.searchInput.contains(e.target) && !this.dropdown.contains(e.target)) {
        this.hideDropdown();
      }
    });
  }

  async handleSearch(query) {
    const trimmedQuery = query.trim();
    
    if (trimmedQuery.length < 2) {
      this.hideDropdown();
      return;
    }

    try {
      const suggestions = await API.request(`/api/job-categories/search?q=${encodeURIComponent(trimmedQuery)}`);
      this.displaySuggestions(suggestions, trimmedQuery);
    } catch (error) {
      console.error('Search error:', error);
      this.hideDropdown();
    }
  }

  displaySuggestions(suggestions, query) {
    if (suggestions.length === 0) {
      this.hideDropdown();
      return;
    }

    const highlightedSuggestions = suggestions.map((suggestion, index) => {
      const highlighted = this.highlightMatch(suggestion, query);
      return `
        <div class="search-suggestion ${index === 0 ? 'selected' : ''}" 
             data-value="${suggestion}" 
             data-index="${index}">
          ${highlighted}
        </div>
      `;
    }).join('');

    this.dropdown.innerHTML = highlightedSuggestions;
    this.showDropdown();

    // Add click listeners to suggestions
    this.dropdown.querySelectorAll('.search-suggestion').forEach((item) => {
      item.addEventListener('click', () => {
        this.selectSuggestion(item.dataset.value);
      });
    });
  }

  highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  showDropdown() {
    this.dropdown.classList.add('visible');
    this.isDropdownVisible = true;
  }

  hideDropdown() {
    this.dropdown.classList.remove('visible');
    this.isDropdownVisible = false;
  }

  selectSuggestion(value) {
    this.searchInput.value = value;
    this.hideDropdown();
    this.applySearch();
  }

  selectNextSuggestion() {
    if (!this.isDropdownVisible) return;
    
    const suggestions = this.dropdown.querySelectorAll('.search-suggestion');
    const currentSelected = this.dropdown.querySelector('.search-suggestion.selected');
    
    if (currentSelected) {
      currentSelected.classList.remove('selected');
      const nextIndex = parseInt(currentSelected.dataset.index) + 1;
      if (nextIndex < suggestions.length) {
        suggestions[nextIndex].classList.add('selected');
      } else {
        suggestions[0].classList.add('selected');
      }
    }
  }

  selectPreviousSuggestion() {
    if (!this.isDropdownVisible) return;
    
    const suggestions = this.dropdown.querySelectorAll('.search-suggestion');
    const currentSelected = this.dropdown.querySelector('.search-suggestion.selected');
    
    if (currentSelected) {
      currentSelected.classList.remove('selected');
      const prevIndex = parseInt(currentSelected.dataset.index) - 1;
      if (prevIndex >= 0) {
        suggestions[prevIndex].classList.add('selected');
      } else {
        suggestions[suggestions.length - 1].classList.add('selected');
      }
    }
  }

  applySearch() {
    const query = this.searchInput.value.trim();
    if (!query) return;

    // Update filter manager with job category search
    if (window.filterManager) {
      window.filterManager.updateJobCategory(query);
    }

    this.hideDropdown();
    Toast.success(`"${query}" 검색이 적용되었습니다.`);
  }

  clearSearch() {
    this.searchInput.value = '';
    this.hideDropdown();
    
    // Clear job category filter
    if (window.filterManager) {
      window.filterManager.updateJobCategory('');
    }
  }

  setSearchTerm(term) {
    this.searchInput.value = term;
  }

  getSearchTerm() {
    return this.searchInput.value.trim();
  }
}

// Initialize job search manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.jobSearchManager = new JobSearchManager();
});