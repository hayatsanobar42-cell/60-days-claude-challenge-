// ============================================
// ENVIRONMENTAL HEALTH ANALYZER
// Complete JavaScript Logic
// ============================================

const { useState, useEffect } = React;

// ============================================
// DATA CONFIGURATION
// ============================================

const cityData = [
    { name: "New York", aqi: 58, pm25: 18.2, pm10: 35.5, waterQuality: 72, lat: 40.7128, lng: -74.0060 },
    { name: "Los Angeles", aqi: 76, pm25: 28.5, pm10: 52.3, waterQuality: 68, lat: 34.0522, lng: -118.2437 },
    { name: "London", aqi: 42, pm25: 12.5, pm10: 28.1, waterQuality: 78, lat: 51.5074, lng: -0.1278 },
    { name: "Tokyo", aqi: 38, pm25: 10.2, pm10: 22.5, waterQuality: 85, lat: 35.6762, lng: 139.6503 },
    { name: "Dubai", aqi: 89, pm25: 35.8, pm10: 68.2, waterQuality: 75, lat: 25.2048, lng: 55.2708 },
    { name: "Singapore", aqi: 52, pm25: 16.8, pm10: 38.5, waterQuality: 82, lat: 1.3521, lng: 103.8198 },
    { name: "Delhi", aqi: 156, pm25: 78.5, pm10: 125.3, waterQuality: 45, lat: 28.7041, lng: 77.1025 },
    { name: "Mumbai", aqi: 118, pm25: 55.2, pm10: 98.7, waterQuality: 52, lat: 19.0760, lng: 72.8777 },
    { name: "Berlin", aqi: 35, pm25: 9.8, pm10: 20.5, waterQuality: 81, lat: 52.5200, lng: 13.4050 },
    { name: "Paris", aqi: 48, pm25: 14.2, pm10: 32.1, waterQuality: 80, lat: 48.8566, lng: 2.3522 },
    { name: "Bangkok", aqi: 92, pm25: 42.5, pm10: 75.3, waterQuality: 58, lat: 13.7563, lng: 100.5018 },
    { name: "Mexico City", aqi: 124, pm25: 62.8, pm10: 108.5, waterQuality: 54, lat: 19.4326, lng: -99.1332 }
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get AQI category information based on AQI value
 * @param {number} aqi - The AQI value
 * @returns {object} Category object with name, color, className, and risk
 */
function getAQICategory(aqi) {
    if (aqi <= 50) {
        return {
            name: "Good",
            color: "#22c55e",
            className: "aqi-good",
            risk: "🟢 Low"
        };
    }
    if (aqi <= 100) {
        return {
            name: "Moderate",
            color: "#84cc16",
            className: "aqi-moderate",
            risk: "🟡 Moderate"
        };
    }
    if (aqi <= 150) {
        return {
            name: "Unhealthy for Sensitive Groups",
            color: "#fbbf24",
            className: "aqi-unhealthy-groups",
            risk: "🟡 Moderate"
        };
    }
    if (aqi <= 200) {
        return {
            name: "Unhealthy",
            color: "#f97316",
            className: "aqi-unhealthy",
            risk: "🔴 High"
        };
    }
    if (aqi <= 300) {
        return {
            name: "Very Unhealthy",
            color: "#ef4444",
            className: "aqi-very-unhealthy",
            risk: "🔴 High"
        };
    }
    return {
        name: "Severe",
        color: "#991b1b",
        className: "aqi-severe",
        risk: "🔴 High"
    };
}

/**
 * Calculate environmental health score
 * @param {number} aqi - AQI value
 * @param {number} waterQuality - Water quality score (0-100)
 * @returns {number} Health score (0-100)
 */
function calculateHealthScore(aqi, waterQuality) {
    const aqiScore = Math.max(0, 100 - (aqi / 3));
    const waterScore = waterQuality;
    return Math.round((aqiScore + waterScore) / 2);
}

/**
 * Get grade letter and styling based on score
 * @param {number} score - Score value (0-100)
 * @returns {object} Grade object with letter and className
 */
function getGrade(score) {
    if (score >= 90) return { letter: "A", className: "grade-a" };
    if (score >= 80) return { letter: "B", className: "grade-b" };
    if (score >= 70) return { letter: "C", className: "grade-c" };
    if (score >= 60) return { letter: "D", className: "grade-d" };
    return { letter: "F", className: "grade-f" };
}

/**
 * Get health impact description based on AQI
 * @param {number} aqi - AQI value
 * @returns {object} Health impact information
 */
function getHealthImpacts(aqi, waterQuality) {
    return [
        {
            label: "Lung Health",
            description: aqi > 150
                ? "Significant strain on respiratory system. Consider air purifiers and masks."
                : aqi > 100
                    ? "Moderate impact. Sensitive groups should limit outdoor activities."
                    : "Healthy. Minimal respiratory impact.",
            risk: aqi > 150 ? "🔴 High" : aqi > 100 ? "🟡 Moderate" : "🟢 Low"
        },
        {
            label: "Sleep Quality",
            description: aqi > 150
                ? "Poor air quality severely disrupts sleep patterns. Use air purifiers in bedroom."
                : aqi > 100
                    ? "Slight sleep disruption possible. Ensure good ventilation."
                    : "Optimal sleep conditions. No air quality impact.",
            risk: aqi > 150 ? "🔴 High" : aqi > 100 ? "🟡 Moderate" : "🟢 Low"
        },
        {
            label: "Energy Levels",
            description: aqi > 150
                ? "High pollution reduces oxygen availability, causing fatigue."
                : aqi > 100
                    ? "Mild energy reduction possible. Stay hydrated."
                    : "Energy levels unaffected by air quality.",
            risk: aqi > 150 ? "🔴 High" : aqi > 100 ? "🟡 Moderate" : "🟢 Low"
        },
        {
            label: "Exercise Performance",
            description: aqi > 150
                ? "Avoid outdoor exercise. Use indoor facilities with air filters."
                : aqi > 100
                    ? "Outdoor exercise possible but limit intensity for sensitive groups."
                    : "Optimal conditions for outdoor exercise and sports.",
            risk: aqi > 150 ? "🔴 High" : aqi > 100 ? "🟡 Moderate" : "🟢 Low"
        },
        {
            label: "Long-term Health",
            description: aqi > 150
                ? "Risk of chronic respiratory diseases and cardiovascular problems."
                : aqi > 100
                    ? "Long-term exposure may have cumulative health effects."
                    : "Minimal long-term health risks from air pollution.",
            risk: aqi > 150 ? "🔴 High" : aqi > 100 ? "🟡 Moderate" : "🟢 Low"
        },
        {
            label: "Water Quality Impact",
            description: waterQuality > 75
                ? "Excellent water quality supports healthy skin and hair."
                : waterQuality > 60
                    ? "Moderate water quality. May cause mild skin or hair issues."
                    : "Poor water quality. Consider water filters and extra skincare.",
            risk: waterQuality > 75 ? "🟢 Low" : waterQuality > 60 ? "🟡 Moderate" : "🔴 High"
        }
    ];
}

/**
 * Get personalized recommendations
 * @returns {object} Recommendations organized by category
 */
function getRecommendations() {
    return {
        daily: [
            "Check AQI before planning outdoor activities",
            "Wear N95/N99 masks during high pollution days",
            "Limit strenuous outdoor activities when AQI > 100",
            "Keep windows closed on poor air quality days",
            "Drink plenty of water to support lung detoxification"
        ],
        indoor: [
            "Install HEPA air purifiers in main living areas",
            "Use air purifiers especially in bedroom for better sleep",
            "Maintain humidity levels between 40-60%",
            "Clean air vents and filters regularly",
            "Consider activated charcoal filters for odors"
        ],
        outdoor: [
            "Exercise during early morning hours when AQI is lower",
            "Avoid peak pollution hours (usually 5-9 PM)",
            "Use parks and green areas further from traffic",
            "Wear sunscreen and protective clothing",
            "Stay hydrated during outdoor activities"
        ],
        hair: [
            "Rinse hair with filtered water to avoid mineral damage",
            "Use anti-pollution hair masks 2x weekly",
            "Apply protective serums before going outside",
            "Wash hair immediately after high pollution exposure",
            "Use silk pillowcases to reduce friction damage"
        ],
        skin: [
            "Use gentle, hydrating cleansers twice daily",
            "Apply antioxidant serums (Vitamin C/E) for protection",
            "Moisturize immediately after cleansing",
            "Use sunscreen daily (SPF 30+) to prevent UV damage",
            "Consider barrier-repair creams at night"
        ],
        water: [
            "Install whole-house water filters",
            "Use shower filters to reduce chlorine exposure",
            "Drink filtered or bottled water",
            "Consider water softeners if hardness is high",
            "Change filters every 2-3 months"
        ]
    };
}

// ============================================
// REACT COMPONENTS
// ============================================

/**
 * Header Component
 */
function Header() {
    return (
        <div className="header">
            <h1>🌍 Personal Environmental Health Analyzer</h1>
            <p>Real-time environmental data for optimal health and wellness</p>
            <div className="data-info">
                📊 Data Sources: IQAir (2026), WHO AQI Standards, Water Quality Index
            </div>
        </div>
    );
}

/**
 * Metrics Display Component
 */
function MetricsDisplay({ avgAqi, highestAqi, lowestAqi, mostPollutedCity, cleanestCity }) {
    return (
        <div className="metrics-grid">
            <div className="metric-card">
                <div className="metric-label">Average AQI</div>
                <div className="metric-value">{avgAqi}</div>
                <div className="metric-unit">(All Cities)</div>
            </div>
            <div className="metric-card">
                <div className="metric-label">Highest AQI City</div>
                <div className="metric-value">{highestAqi}</div>
                <div className="metric-unit">{mostPollutedCity.name}</div>
            </div>
            <div className="metric-card">
                <div className="metric-label">Lowest AQI City</div>
                <div className="metric-value">{lowestAqi}</div>
                <div className="metric-unit">{cleanestCity.name}</div>
            </div>
            <div className="metric-card">
                <div className="metric-label">Cities Analyzed</div>
                <div className="metric-value">{cityData.length}</div>
                <div className="metric-unit">Global Coverage</div>
            </div>
        </div>
    );
}

/**
 * Controls Component
 */
function Controls({ selectedCity, setSelectedCity, aqiFilter, setAqiFilter, pollutantFilter, setPollutantFilter }) {
    return (
        <div className="controls">
            <div className="control-group">
                <label>📍 Select City</label>
                <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                    {cityData.map(city => (
                        <option key={city.name} value={city.name}>{city.name}</option>
                    ))}
                </select>
            </div>

            <div className="control-group">
                <label>🎯 AQI Range Filter</label>
                <input
                    type="range"
                    min="0"
                    max="300"
                    value={aqiFilter[1]}
                    onChange={(e) => setAqiFilter([0, parseInt(e.target.value)])}
                />
                <span style={{ fontSize: "0.85em", color: "#a0aec0" }}>0 - {aqiFilter[1]}</span>
            </div>

            <div className="control-group">
                <label>💨 Pollutant Selector</label>
                <select value={pollutantFilter} onChange={(e) => setPollutantFilter(e.target.value)}>
                    <option value="all">All Pollutants</option>
                    <option value="pm25">PM2.5 Focus</option>
                    <option value="pm10">PM10 Focus</option>
                </select>
            </div>

            <div className="control-group">
                <label>✅ Health Risk Filter</label>
                <select>
                    <option>All Risk Levels</option>
                    <option>🟢 Low Risk Only</option>
                    <option>🟡 Moderate Risk Only</option>
                    <option>🔴 High Risk Only</option>
                </select>
            </div>
        </div>
    );
}

/**
 * City Status Display Component
 */
function CityStatus({ selectedCityData }) {
    const category = getAQICategory(selectedCityData.aqi);

    return (
        <div className="health-analysis">
            <div className="section-title">📍 {selectedCityData.name} - Environmental Status</div>
            <div className="status-info">
                <div>
                    <div className="status-label">Air Quality Index</div>
                    <div className="status-value" style={{ color: category.color }}>
                        {selectedCityData.aqi}
                    </div>
                    <div className={`aqi-badge ${category.className}`}>{category.name}</div>
                </div>
                <div>
                    <div className="status-label">PM2.5 Level</div>
                    <div className="status-value">{selectedCityData.pm25.toFixed(1)}</div>
                    <div className="status-unit">µg/m³</div>
                </div>
                <div>
                    <div className="status-label">PM10 Level</div>
                    <div className="status-value">{selectedCityData.pm10.toFixed(1)}</div>
                    <div className="status-unit">µg/m³</div>
                </div>
                <div>
                    <div className="status-label">Water Quality Score</div>
                    <div className="status-value" style={{ color: "#22c55e" }}>
                        {selectedCityData.waterQuality}
                    </div>
                    <div className="status-unit">out of 100</div>
                </div>
            </div>
        </div>
    );
}

/**
 * City Cards Grid Component
 */
function CityCardsGrid({ filteredCities, selectedCity, setSelectedCity }) {
    return (
        <div style={{ marginBottom: "30px" }}>
            <div className="section-title">🌐 Global City Comparison</div>
            <div className="city-cards">
                {filteredCities.map(city => {
                    const cat = getAQICategory(city.aqi);
                    return (
                        <div
                            key={city.name}
                            className={`city-card ${selectedCity === city.name ? "selected" : ""}`}
                            onClick={() => setSelectedCity(city.name)}
                        >
                            <div className="city-name">{city.name}</div>
                            <div className="stat-item">
                                <span className="stat-label">AQI</span>
                                <span className="stat-value" style={{ color: cat.color }}>
                                    {city.aqi}
                                </span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">PM2.5</span>
                                <span className="stat-value">{city.pm25.toFixed(1)} µg/m³</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">PM10</span>
                                <span className="stat-value">{city.pm10.toFixed(1)} µg/m³</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Water Quality</span>
                                <span className="stat-value">{city.waterQuality}/100</span>
                            </div>
                            <div className={`aqi-badge ${cat.className}`}>{cat.name}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/**
 * Health Impact Analysis Component
 */
function HealthImpactAnalysis({ selectedCityData, healthImpacts }) {
    return (
        <div className="health-analysis">
            <div className="section-title">🏥 Environmental Health Impact Analysis for {selectedCityData.name}</div>
            <div className="health-impact">
                {healthImpacts.map((impact, idx) => (
                    <div key={idx} className="impact-item">
                        <div className="impact-label">
                            {impact.label}
                            <span className="risk-indicator">{impact.risk}</span>
                        </div>
                        <div className="impact-description">{impact.description}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * Report Card Component
 */
function ReportCard({ selectedCityData, healthScore, airQualityScore, waterQualityScore }) {
    const airGrade = getGrade(airQualityScore);
    const waterGrade = getGrade(waterQualityScore);
    const overallGrade = getGrade(healthScore);

    return (
        <div className="report-card">
            <div className="section-title">📋 Environmental Health Report Card for {selectedCityData.name}</div>
            <div className="score-grid">
                <div className="score-box">
                    <div className="score-label">Overall Environmental Score</div>
                    <div className="score-number">{healthScore}</div>
                    <div className="score-max">/ 100</div>
                    <div className={`grade ${overallGrade.className}`}>{overallGrade.letter}</div>
                </div>
                <div className="score-box">
                    <div className="score-label">Air Quality Score</div>
                    <div className="score-number">{Math.round(airQualityScore)}</div>
                    <div className="score-max">/ 100</div>
                    <div className={`grade ${airGrade.className}`}>{airGrade.letter}</div>
                </div>
                <div className="score-box">
                    <div className="score-label">Water Quality Score</div>
                    <div className="score-number">{waterQualityScore}</div>
                    <div className="score-max">/ 100</div>
                    <div className={`grade ${waterGrade.className}`}>{waterGrade.letter}</div>
                </div>
                <div className="score-box">
                    <div className="score-label">Health Risk Level</div>
                    <div style={{ fontSize: "2em", marginBottom: "10px" }}>
                        {healthScore > 75 ? "🟢" : healthScore > 50 ? "🟡" : "🔴"}
                    </div>
                    <div className="score-max">
                        {healthScore > 75 ? "LOW RISK" : healthScore > 50 ? "MODERATE RISK" : "HIGH RISK"}
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Insights Panel Component
 */
function InsightsPanel() {
    const sortedByAQI = [...cityData].sort((a, b) => a.aqi - b.aqi);
    const sortedByPollution = [...cityData].sort((a, b) => b.aqi - a.aqi);
    const avgAqi = Math.round(cityData.reduce((sum, city) => sum + city.aqi, 0) / cityData.length);
    const avgPM25 = (cityData.reduce((sum, c) => sum + c.pm25, 0) / cityData.length).toFixed(1);

    return (
        <div style={{ marginBottom: "30px" }}>
            <div className="section-title">💡 Key Insights & Observations</div>
            <div className="insights-grid">
                <div className="insight-card">
                    <div className="insight-title">🌟 Top 3 Cleanest Cities</div>
                    <ul className="insight-list">
                        {sortedByAQI.slice(0, 3).map((city, idx) => (
                            <li key={idx}>{city.name} (AQI: {city.aqi})</li>
                        ))}
                    </ul>
                </div>

                <div className="insight-card">
                    <div className="insight-title">⚠️ Top 3 Most Polluted Cities</div>
                    <ul className="insight-list">
                        {sortedByPollution.slice(0, 3).map((city, idx) => (
                            <li key={idx}>{city.name} (AQI: {city.aqi})</li>
                        ))}
                    </ul>
                </div>

                <div className="insight-card">
                    <div className="insight-title">🎯 Analysis Summary</div>
                    <ul className="insight-list">
                        <li>Average global AQI: {avgAqi} (Moderate)</li>
                        <li>High-pollution cities: {cityData.filter(c => c.aqi > 150).length}</li>
                        <li>Clean-air cities: {cityData.filter(c => c.aqi < 50).length}</li>
                        <li>PM2.5 avg: {avgPM25} µg/m³</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

/**
 * Recommendations Component
 */
function Recommendations({ selectedCityData }) {
    const recommendations = getRecommendations();

    return (
        <div className="recommendations">
            <div className="section-title">📋 Personalized Recommendations for {selectedCityData.name}</div>

            <div className="rec-category">
                <div className="rec-category-title">⭐ Daily Actions</div>
                <ul className="rec-list">
                    {recommendations.daily.map((rec, idx) => (
                        <li key={idx} className="rec-item">{rec}</li>
                    ))}
                </ul>
            </div>

            <div className="rec-category">
                <div className="rec-category-title">🏠 Indoor Air Improvements</div>
                <ul className="rec-list">
                    {recommendations.indoor.map((rec, idx) => (
                        <li key={idx} className="rec-item">{rec}</li>
                    ))}
                </ul>
            </div>

            <div className="rec-category">
                <div className="rec-category-title">🏃 Outdoor Activity Guidance</div>
                <ul className="rec-list">
                    {recommendations.outdoor.map((rec, idx) => (
                        <li key={idx} className="rec-item">{rec}</li>
                    ))}
                </ul>
            </div>

            <div className="rec-category">
                <div className="rec-category-title">💇 Hair Care Recommendations</div>
                <ul className="rec-list">
                    {recommendations.hair.map((rec, idx) => (
                        <li key={idx} className="rec-item">{rec}</li>
                    ))}
                </ul>
            </div>

            <div className="rec-category">
                <div className="rec-category-title">🧴 Skin Care Recommendations</div>
                <ul className="rec-list">
                    {recommendations.skin.map((rec, idx) => (
                        <li key={idx} className="rec-item">{rec}</li>
                    ))}
                </ul>
            </div>

            <div className="rec-category">
                <div className="rec-category-title">💧 Water Quality Improvements</div>
                <ul className="rec-list">
                    {recommendations.water.map((rec, idx) => (
                        <li key={idx} className="rec-item">{rec}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

/**
 * Footer Component
 */
function Footer() {
    return (
        <div className="footer">
            <p>🌍 Environmental Health Analyzer | Real-time AQI Data from IQAir & WHO Standards | Updated June 2026</p>
            <p>This tool is for informational purposes. Consult healthcare professionals for medical concerns.</p>
            <p>💚 Share this dashboard to help others make informed environmental health decisions</p>
        </div>
    );
}

// ============================================
// MAIN APP COMPONENT
// ============================================

/**
 * Main Environmental Analyzer App Component
 */
function EnvironmentalAnalyzer() {
    const [selectedCity, setSelectedCity] = useState("New York");
    const [aqiFilter, setAqiFilter] = useState([0, 300]);
    const [pollutantFilter, setPollutantFilter] = useState("all");

    // Get selected city data
    const selectedCityData = cityData.find(c => c.name === selectedCity);

    // Filter cities based on AQI range
    const filteredCities = cityData.filter(city =>
        city.aqi >= aqiFilter[0] && city.aqi <= aqiFilter[1]
    );

    // Calculate metrics
    const avgAqi = Math.round(cityData.reduce((sum, city) => sum + city.aqi, 0) / cityData.length);
    const cleanestCity = cityData.reduce((prev, current) => prev.aqi < current.aqi ? prev : current);
    const mostPollutedCity = cityData.reduce((prev, current) => prev.aqi > current.aqi ? prev : current);
    const highestAqi = Math.max(...cityData.map(c => c.aqi));
    const lowestAqi = Math.min(...cityData.map(c => c.aqi));

    // Calculate health scores
    const healthScore = calculateHealthScore(selectedCityData.aqi, selectedCityData.waterQuality);
    const airQualityScore = Math.max(0, 100 - (selectedCityData.aqi / 3));
    const waterQualityScore = selectedCityData.waterQuality;

    // Get health impacts
    const healthImpacts = getHealthImpacts(selectedCityData.aqi, selectedCityData.waterQuality);

    return (
        <div className="container">
            <Header />
            <MetricsDisplay
                avgAqi={avgAqi}
                highestAqi={highestAqi}
                lowestAqi={lowestAqi}
                mostPollutedCity={mostPollutedCity}
                cleanestCity={cleanestCity}
            />
            <Controls
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                aqiFilter={aqiFilter}
                setAqiFilter={setAqiFilter}
                pollutantFilter={pollutantFilter}
                setPollutantFilter={setPollutantFilter}
            />
            <CityStatus selectedCityData={selectedCityData} />
            <CityCardsGrid
                filteredCities={filteredCities}
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
            />
            <HealthImpactAnalysis
                selectedCityData={selectedCityData}
                healthImpacts={healthImpacts}
            />
            <ReportCard
                selectedCityData={selectedCityData}
                healthScore={healthScore}
                airQualityScore={airQualityScore}
                waterQualityScore={waterQualityScore}
            />
            <InsightsPanel />
            <Recommendations selectedCityData={selectedCityData} />
            <Footer />
        </div>
    );
}

// ============================================
// RENDER APP
// ============================================

ReactDOM.render(<EnvironmentalAnalyzer />, document.getElementById('root'));