import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { FilterState, CompanyMarker } from "@/lib/types";
import { JobWithCompany } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { MapIcon } from "lucide-react";

// Declare Leaflet types
declare global {
  interface Window {
    L: any;
  }
}

interface MapVisualizationProps {
  filters: FilterState;
}

export default function MapVisualization({ filters }: MapVisualizationProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const buildQueryParams = (filters: FilterState) => {
    const params = new URLSearchParams();
    
    if (filters.industries.length > 0) {
      filters.industries.forEach(industry => params.append('industries', industry));
    }
    if (filters.locations.length > 0) {
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
    
    return params.toString();
  };

  const { data: jobs = [], isLoading } = useQuery<JobWithCompany[]>({
    queryKey: ['/api/jobs', buildQueryParams(filters)],
    queryFn: async () => {
      const params = buildQueryParams(filters);
      const response = await fetch(`/api/jobs?${params}`);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      return response.json();
    },
  });

  useEffect(() => {
    // Load Leaflet dynamically
    const loadLeaflet = async () => {
      if (window.L) {
        initializeMap();
        return;
      }

      try {
        // Load Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        // Load Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = initializeMap;
        document.head.appendChild(script);
      } catch (error) {
        console.error('Failed to load Leaflet:', error);
      }
    };

    loadLeaflet();
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && jobs.length > 0) {
      updateMapMarkers();
    }
  }, [jobs]);

  const initializeMap = () => {
    if (!mapRef.current || !window.L) return;

    try {
      // Initialize map centered on Seoul
      mapInstanceRef.current = window.L.map(mapRef.current).setView([37.5665, 126.9780], 11);
      
      // Add tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      updateMapMarkers();
    } catch (error) {
      console.error('Map initialization failed:', error);
    }
  };

  const updateMapMarkers = () => {
    if (!mapInstanceRef.current || !window.L) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Group jobs by company location
    const companyGroups = new Map<string, JobWithCompany[]>();
    
    jobs.forEach(job => {
      if (job.company.latitude && job.company.longitude) {
        const key = `${job.company.latitude}-${job.company.longitude}`;
        if (!companyGroups.has(key)) {
          companyGroups.set(key, []);
        }
        companyGroups.get(key)!.push(job);
      }
    });

    // Add markers for each company location
    companyGroups.forEach((companyJobs, locationKey) => {
      const firstJob = companyJobs[0];
      const company = firstJob.company;
      
      const color = company.industry === '핀테크' ? '#FF6B35' : '#1976D2';
      
      const marker = window.L.circleMarker(
        [parseFloat(company.latitude!), parseFloat(company.longitude!)], 
        {
          radius: Math.max(8, Math.min(20, companyJobs.length * 2)),
          fillColor: color,
          color: 'white',
          weight: 2,
          fillOpacity: 0.8
        }
      ).addTo(mapInstanceRef.current);
      
      const avgSalary = companyJobs.reduce((sum, job) => {
        return sum + ((job.salaryMin || 0) + (job.salaryMax || 0)) / 2;
      }, 0) / companyJobs.length;
      
      marker.bindPopup(`
        <div class="text-sm">
          <h4 class="font-semibold">${company.name}</h4>
          <p class="text-gray-600">공고 수: ${companyJobs.length}개</p>
          <p class="text-gray-600">평균 연봉: ${Math.round(avgSalary).toLocaleString()}만원</p>
          <p class="text-gray-600">산업: ${company.industry}</p>
        </div>
      `);
      
      markersRef.current.push(marker);
    });
  };

  // Calculate location statistics
  const locationStats = jobs.reduce((acc, job) => {
    const location = job.company.location;
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedLocations = Object.entries(locationStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 4);

  const maxCount = Math.max(...Object.values(locationStats));

  if (isLoading) {
    return (
      <Card className="sticky top-24">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">기업 분포 지도</h3>
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">지도 로딩 중...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-24">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">기업 분포 지도</h3>
        
        <div 
          ref={mapRef} 
          className="h-96 rounded-lg bg-gray-100 relative"
        >
          {!window.L && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">지도 로딩 중...</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Map Legend */}
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">범례</h4>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
              <span>IT/소프트웨어</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-accent rounded-full mr-2"></div>
              <span>핀테크</span>
            </div>
          </div>
        </div>

        {/* Regional Statistics */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">지역별 통계</h4>
          <div className="space-y-3">
            {sortedLocations.map(([location, count]) => (
              <div key={location} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{location}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {count}개
                  </span>
                  <div className="w-12">
                    <Progress 
                      value={(count / maxCount) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
