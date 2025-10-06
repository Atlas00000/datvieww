'use client';

import { useState, useMemo } from 'react';
import { generateMockUsers } from '../../data/mockData';
import { UserData, SortConfig } from '../../types/user.types';

export default function DataView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const initialColumns: Array<keyof UserData> = [
    'id',
    'age',
    'gender',
    'incomeLevel',
    'education',
    'region',
    'industry',
    'digitalEngagementScore',
    'primaryDevice',
    'fitnessLevel',
    'healthStatus',
    'brandLoyalty',
    'investmentExperience',
  ];
  const [selectedColumns, setSelectedColumns] = useState<Set<keyof UserData>>(
    () => new Set<keyof UserData>(initialColumns)
  );

  // Get all available columns
  const allColumns: Array<{ key: keyof UserData; label: string; type: 'string' | 'number' | 'array' }> = [
    { key: 'id', label: 'ID', type: 'string' },
    { key: 'age', label: 'Age', type: 'number' },
    { key: 'gender', label: 'Gender', type: 'string' },
    { key: 'incomeLevel', label: 'Income Level', type: 'string' },
    { key: 'education', label: 'Education', type: 'string' },
    { key: 'region', label: 'Region', type: 'string' },
    { key: 'industry', label: 'Industry', type: 'string' },
    { key: 'digitalEngagementScore', label: 'Digital Engagement', type: 'number' },
    { key: 'primaryDevice', label: 'Primary Device', type: 'string' },
    { key: 'secondaryDevice', label: 'Secondary Device', type: 'string' },
    { key: 'internetSpeed', label: 'Internet Speed', type: 'string' },
    { key: 'socialMediaUsage', label: 'Social Media Usage', type: 'string' },
    { key: 'ecommerceFrequency', label: 'Ecommerce Frequency', type: 'string' },
    { key: 'workStyle', label: 'Work Style', type: 'string' },
    { key: 'commuteTime', label: 'Commute Time (min)', type: 'number' },
    { key: 'fitnessLevel', label: 'Fitness Level', type: 'string' },
    { key: 'dietaryPreference', label: 'Dietary Preference', type: 'string' },
    { key: 'travelFrequency', label: 'Travel Frequency', type: 'string' },
    { key: 'brandLoyalty', label: 'Brand Loyalty', type: 'string' },
    { key: 'priceSensitivity', label: 'Price Sensitivity', type: 'string' },
    { key: 'shoppingChannel', label: 'Shopping Channel', type: 'string' },
    { key: 'productResearch', label: 'Product Research', type: 'string' },
    { key: 'reviewInfluence', label: 'Review Influence', type: 'string' },
    { key: 'healthStatus', label: 'Health Status', type: 'string' },
    { key: 'stressLevel', label: 'Stress Level', type: 'string' },
    { key: 'sleepQuality', label: 'Sleep Quality', type: 'string' },
    { key: 'mentalHealthAwareness', label: 'Mental Health Awareness', type: 'string' },
    { key: 'preventiveCare', label: 'Preventive Care', type: 'string' },
    { key: 'environmentalConsciousness', label: 'Environmental Consciousness', type: 'string' },
    { key: 'communityInvolvement', label: 'Community Involvement', type: 'string' },
    { key: 'politicalEngagement', label: 'Political Engagement', type: 'string' },
    { key: 'volunteerFrequency', label: 'Volunteer Frequency', type: 'string' },
    { key: 'investmentExperience', label: 'Investment Experience', type: 'string' },
    { key: 'riskTolerance', label: 'Risk Tolerance', type: 'string' },
    { key: 'savingsRate', label: 'Savings Rate', type: 'string' },
    { key: 'debtLevel', label: 'Debt Level', type: 'string' },
    { key: 'financialGoals', label: 'Financial Goals', type: 'string' },
    { key: 'communicationStyle', label: 'Communication Style', type: 'string' },
    { key: 'relationshipStatus', label: 'Relationship Status', type: 'string' },
    { key: 'familySize', label: 'Family Size', type: 'number' },
    { key: 'petOwnership', label: 'Pet Ownership', type: 'string' },
    { key: 'socialCircle', label: 'Social Circle', type: 'string' },
    { key: 'learningStyle', label: 'Learning Style', type: 'string' },
    { key: 'skillDevelopment', label: 'Skill Development', type: 'string' },
    { key: 'languageSkills', label: 'Language Skills', type: 'number' },
    { key: 'certificationCount', label: 'Certification Count', type: 'number' },
    { key: 'mentorshipRole', label: 'Mentorship Role', type: 'string' },
    { key: 'techAdoption', label: 'Tech Adoption', type: 'string' },
    { key: 'aiComfort', label: 'AI Comfort', type: 'string' },
    { key: 'automationPreference', label: 'Automation Preference', type: 'string' },
    { key: 'dataPrivacy', label: 'Data Privacy', type: 'string' },
    { key: 'timeZone', label: 'Time Zone', type: 'string' },
    { key: 'workHours', label: 'Work Hours', type: 'string' },
    { key: 'peakProductivity', label: 'Peak Productivity', type: 'string' },
    { key: 'decisionMaking', label: 'Decision Making', type: 'string' },
    { key: 'changeAdaptability', label: 'Change Adaptability', type: 'string' },
  ];

  // Generate base dataset once
  const mockDataset: UserData[] = useMemo(() => {
    const users = generateMockUsers(600);
    // Map to the DataView schema labels
    return users.map((u: any) => ({
      id: u.id,
      age: u.age,
      gender: u.gender,
      incomeLevel: u.income < 1500 ? 'Low' : u.income < 4000 ? 'Medium' : 'High',
      education: u.education,
      region: u.region,
      industry: 'General',
      digitalEngagementScore: u.socialEngagement,
      primaryDevice: u.device,
      secondaryDevice: undefined,
      internetSpeed: undefined,
      socialMediaUsage: undefined,
      ecommerceFrequency: u.ecommerceFrequency,
      workStyle: undefined,
      commuteTime: undefined,
      fitnessLevel: u.fitnessLevel,
      dietaryPreference: undefined,
      travelFrequency: undefined,
      brandLoyalty: typeof u.brandLoyalty === 'number' ? Math.round(u.brandLoyalty * 100) : u.brandLoyalty,
      priceSensitivity: typeof u.priceSensitivity === 'number' ? Math.round(u.priceSensitivity * 100) : u.priceSensitivity,
      shoppingChannel: u.shoppingChannel,
      productResearch: undefined,
      reviewInfluence: undefined,
      healthStatus: u.wellnessScore > 66 ? 'Good' : u.wellnessScore > 33 ? 'Average' : 'Poor',
      stressLevel: u.stressLevel,
      sleepQuality: u.sleepQuality,
      mentalHealthAwareness: undefined,
      preventiveCare: undefined,
      environmentalConsciousness: undefined,
      communityInvolvement: undefined,
      politicalEngagement: undefined,
      volunteerFrequency: undefined,
      investmentExperience: 'Moderate',
      riskTolerance: undefined,
      savingsRate: undefined,
      debtLevel: undefined,
      financialGoals: undefined,
      communicationStyle: undefined,
      relationshipStatus: undefined,
      familySize: undefined,
      petOwnership: undefined,
      socialCircle: undefined,
      learningStyle: undefined,
      skillDevelopment: undefined,
      languageSkills: undefined,
      certificationCount: undefined,
      mentorshipRole: undefined,
      techAdoption: undefined,
      aiComfort: undefined,
      automationPreference: undefined,
      dataPrivacy: undefined,
      timeZone: undefined,
      workHours: undefined,
      peakProductivity: undefined,
      decisionMaking: undefined,
      changeAdaptability: undefined,
    }));
  }, []);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = mockDataset;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((user) =>
        Object.values(user).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        const aCoerced = (aValue ?? '') as any;
        const bCoerced = (bValue ?? '') as any;
        if (aCoerced < bCoerced) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aCoerced > bCoerced) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [searchTerm, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, endIndex);

  // Handle sorting
  const handleSort = (key: keyof UserData) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return prev.direction === 'asc' ? { key, direction: 'desc' } : null;
      }
      return { key, direction: 'asc' };
    });
  };

  // Handle column selection
  const toggleColumn = (column: keyof UserData) => {
    setSelectedColumns((prev: Set<keyof UserData>) => {
      const newSet = new Set(prev);
      if (newSet.has(column)) {
        newSet.delete(column);
      } else {
        newSet.add(column);
      }
      return newSet;
    });
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = Array.from(selectedColumns).map(
      (col) => allColumns.find((c) => c.key === col)?.label || col
    );
    const csvContent = [
      headers.join(','),
      ...paginatedData.map((row) =>
        Array.from(selectedColumns)
          .map((col) => {
            const value = row[col];
            if (Array.isArray(value)) {
              return `"${value.join('; ')}"`;
            }
            return `"${value}"`;
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Format cell value
  const formatCellValue = (value: any, type: string) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (type === 'number') {
      return value.toLocaleString();
    }
    return String(value);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient Orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-br from-[var(--color-primary)]/25 to-[var(--color-info)]/20 blur-2xl animate-float" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-[var(--color-secondary)]/25 to-[var(--color-accent)]/20 blur-2xl animate-float" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50">
        <div className="glass mx-4 mt-4 rounded-2xl px-4 py-3 border">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-white border border-black/10 flex items-center justify-center">
                <span className="text-gray-900 font-bold text-xs">DV</span>
              </div>
              <span className="text-lg font-semibold gradient-text">DataView</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="btn btn-secondary" onClick={exportToCSV}>Export CSV</button>
              <a href="/" className="btn btn-secondary">Back to Dashboard</a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Controls */}
        <div className="glass rounded-2xl p-6 border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search all fields..."
                className="w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
              />
            </div>

            {/* Items per page */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Items per page
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                aria-label="Items per page"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Results count */}
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
              </div>
            </div>
          </div>

          {/* Column selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visible Columns
            </label>
            <div className="flex flex-wrap gap-2">
              {allColumns.map((column) => (
                <button
                  key={column.key}
                  onClick={() => toggleColumn(column.key)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                    selectedColumns.has(column.key)
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {column.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="glass rounded-2xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-black/10">
                <tr>
                  {Array.from(selectedColumns).map((column: keyof UserData) => {
                    const columnInfo = allColumns.find((c) => c.key === column);
                    return (
                      <th
                        key={String(column)}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                        onClick={() => handleSort(column)}
                      >
                        <div className="flex items-center gap-2">
                          {columnInfo?.label}
                          {sortConfig?.key === column && (
                            <span className="text-[var(--color-primary)]">
                              {sortConfig.direction === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-black/10">
                {paginatedData.map((user: UserData) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    {Array.from(selectedColumns).map((column: keyof UserData) => {
                      const columnInfo = allColumns.find((c) => c.key === column);
                      const value = user[column];
                      return (
                        <td
                          key={String(column)}
                          className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate"
                          title={formatCellValue(value, columnInfo?.type || 'string')}
                        >
                          {formatCellValue(value, columnInfo?.type || 'string')}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-4 py-3 border-t border-black/10">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-lg border border-black/10 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    First
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-lg border border-black/10 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-lg border border-black/10 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-lg border border-black/10 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Last
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
