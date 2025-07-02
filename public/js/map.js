// Map visualization management
class MapManager {
  constructor() {
    this.elements = {
      mapContainer: document.getElementById('mapContainer'),
      locationStats: document.getElementById('locationStats')
    };
    
    this.map = null;
    this.markers = [];
    this.isMapLoaded = false;
    
    this.initializeMap();
  }

  async initializeMap() {
    try {
      // Wait for Leaflet to load
      if (typeof L === 'undefined') {
        setTimeout(() => this.initializeMap(), 100);
        return;
      }

      // Create map container
      const mapDiv = document.createElement('div');
      mapDiv.id = 'leafletMap';
      mapDiv.style.width = '100%';
      mapDiv.style.height = '100%';
      
      // Clear existing content and add map
      this.elements.mapContainer.innerHTML = '';
      this.elements.mapContainer.appendChild(mapDiv);

      // Initialize Leaflet map
      this.map = L.map('leafletMap').setView([37.5665, 126.9780], 11);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      this.isMapLoaded = true;
      console.log('Map initialized successfully');
    } catch (error) {
      console.error('Failed to initialize map:', error);
      this.showMapError();
    }
  }

  async updateMap(filters) {
    if (!this.isMapLoaded) {
      setTimeout(() => this.updateMap(filters), 500);
      return;
    }

    try {
      const jobs = await API.getJobs(filters);
      this.displayCompanyMarkers(jobs);
      this.updateLocationStats(jobs);
    } catch (error) {
      console.error('Failed to update map:', error);
    }
  }

  displayCompanyMarkers(jobs) {
    // Clear existing markers
    this.markers.forEach(marker => {
      this.map.removeLayer(marker);
    });
    this.markers = [];

    // Group jobs by company location
    const companyGroups = new Map();
    
    jobs.forEach(job => {
      if (job.company.latitude && job.company.longitude) {
        const key = `${job.company.latitude}-${job.company.longitude}`;
        if (!companyGroups.has(key)) {
          companyGroups.set(key, []);
        }
        companyGroups.get(key).push(job);
      }
    });

    // Add markers for each company location
    companyGroups.forEach((companyJobs, locationKey) => {
      const firstJob = companyJobs[0];
      const company = firstJob.company;
      
      const color = company.industry === '핀테크' ? '#FF6B35' : '#1976D2';
      
      const marker = L.circleMarker(
        [parseFloat(company.latitude), parseFloat(company.longitude)], 
        {
          radius: Math.max(8, Math.min(20, companyJobs.length * 2)),
          fillColor: color,
          color: 'white',
          weight: 2,
          fillOpacity: 0.8
        }
      ).addTo(this.map);
      
      const avgSalary = companyJobs.reduce((sum, job) => {
        return sum + ((job.salaryMin || 0) + (job.salaryMax || 0)) / 2;
      }, 0) / companyJobs.length;
      
      marker.bindPopup(`
        <div style="font-family: 'Noto Sans KR', sans-serif; font-size: 14px;">
          <h4 style="margin: 0 0 8px 0; font-weight: 600;">${company.name}</h4>
          <p style="margin: 4px 0; color: #666;">공고 수: ${companyJobs.length}개</p>
          <p style="margin: 4px 0; color: #666;">평균 연봉: ${Math.round(avgSalary).toLocaleString()}만원</p>
          <p style="margin: 4px 0; color: #666;">산업: ${company.industry}</p>
        </div>
      `);
      
      this.markers.push(marker);
    });
  }

  updateLocationStats(jobs) {
    // Calculate location statistics
    const locationStats = jobs.reduce((acc, job) => {
      const location = job.company.location;
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});

    const sortedLocations = Object.entries(locationStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 4);

    const maxCount = Math.max(...Object.values(locationStats));

    // Clear existing stats
    this.elements.locationStats.innerHTML = '';

    // Display location statistics
    sortedLocations.forEach(([location, count]) => {
      const statDiv = document.createElement('div');
      statDiv.className = 'location-stat';
      
      const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
      
      statDiv.innerHTML = `
        <span class="location-name">${location}</span>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span class="location-count">${count}개</span>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${percentage}%"></div>
          </div>
        </div>
      `;
      
      this.elements.locationStats.appendChild(statDiv);
    });
  }

  showMapError() {
    this.elements.mapContainer.innerHTML = `
      <div class="map-loading">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p>지도를 불러올 수 없습니다.</p>
      </div>
    `;
  }
}

window.MapManager = MapManager;