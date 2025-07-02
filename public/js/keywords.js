// Keywords and tags management
class KeywordsManager {
  constructor() {
    this.elements = {
      keywordsCard: document.getElementById('keywordsCard'),
      requirementTags: document.getElementById('requirementTags'),
      preferredTags: document.getElementById('preferredTags'),
      techStackTags: document.getElementById('techStackTags'),
      nonTechTags: document.getElementById('nonTechTags'),
      trendingTechTags: document.getElementById('trendingTechTags'),
      marketTrends: document.getElementById('marketTrends')
    };
  }

  async updateKeywords(filters) {
    try {
      const statistics = await API.getStatistics(filters);
      this.displayKeywords(statistics);
    } catch (error) {
      console.error('Failed to update keywords:', error);
    }
  }

  displayKeywords(statistics) {
    const { topRequirements, topPreferredSkills } = statistics;

    // Clear existing tags
    this.elements.requirementTags.innerHTML = '';
    this.elements.preferredTags.innerHTML = '';

    // Display requirement tags
    topRequirements.slice(0, 8).forEach(requirement => {
      const tag = this.createTag(requirement.skill, requirement.percentage, 'requirement');
      this.elements.requirementTags.appendChild(tag);
    });

    // Display preferred skill tags
    topPreferredSkills.slice(0, 8).forEach(skill => {
      const tag = this.createTag(skill.skill, skill.percentage, 'preferred');
      this.elements.preferredTags.appendChild(tag);
    });

    // Show the keywords card with animation
    this.elements.keywordsCard.style.display = 'block';
    this.elements.keywordsCard.classList.add('slide-up');

    // Remove animation class after animation completes
    setTimeout(() => {
      this.elements.keywordsCard.classList.remove('slide-up');
    }, 400);
  }

  createTag(text, percentage, type) {
    const tag = document.createElement('span');
    tag.className = `tag ${type}`;
    tag.innerHTML = `${text} <span style="opacity: 0.8;">${percentage}%</span>`;
    
    // Add hover effect
    tag.addEventListener('mouseenter', () => {
      tag.style.transform = 'translateY(-1px)';
    });
    
    tag.addEventListener('mouseleave', () => {
      tag.style.transform = 'translateY(0)';
    });

    return tag;
  }

  hide() {
    this.elements.keywordsCard.style.display = 'none';
  }
}

window.KeywordsManager = KeywordsManager;