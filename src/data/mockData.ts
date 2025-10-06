export type MockUser = {
  id: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  region: 'North' | 'South' | 'East' | 'West' | 'Central';
  education: 'High School' | 'Bachelor' | 'Master' | 'PhD' | 'Other';
  income: number;
  incomeLevel: 'Low' | 'Medium' | 'High';
  ecommerceFrequency: 'Rare' | 'Occasional' | 'Frequent' | 'Daily';
  priceSensitivity: 'Low' | 'Medium' | 'High' | 'Very High';
  brandLoyalty: 'Low' | 'Medium' | 'High' | 'Very High';
  shoppingChannel: 'Online' | 'In-Store' | 'Hybrid';
  device: 'Mobile' | 'Desktop' | 'Tablet';
  digitalEngagementScore: number; // 0-100
  fitnessLevel: 'Low' | 'Medium' | 'High';
  sleepQuality: 'Poor' | 'Average' | 'Good';
  stressLevel: 'Low' | 'Medium' | 'High';
  wellnessScore: number; // 0-100
  healthScore: number; // 0-100
  environmentalConsciousness: 'Low' | 'Medium' | 'High' | 'Very High';
  investmentExperience: 'None' | 'Beginner' | 'Intermediate' | 'Advanced';
};

const pick = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export function generateMockUsers(count = 800): MockUser[] {
  const genders = ['Male', 'Female', 'Other'] as const;
  const regions = ['North', 'South', 'East', 'West', 'Central'] as const;
  const educations = ['High School', 'Bachelor', 'Master', 'PhD', 'Other'] as const;
  const ecommerceFreq = ['Rare', 'Occasional', 'Frequent', 'Daily'] as const;
  const channels = ['Online', 'In-Store', 'Hybrid'] as const;
  const devices = ['Mobile', 'Desktop', 'Tablet'] as const;
  const sleepQ = ['Poor', 'Average', 'Good'] as const;
  const stress = ['Low', 'Medium', 'High'] as const;
  const fitness = ['Low', 'Medium', 'High'] as const;

  const users: MockUser[] = Array.from({ length: count }).map((_, i) => {
    // Age skew 18-70
    const age = clamp(Math.round(d3randNormal(35, 12)()), 18, 70);
    // Income loosely correlated with education and age
    const education = pick(educations);
    const educationBoost = { 'High School': 0.8, Bachelor: 1, Master: 1.2, PhD: 1.35, Other: 0.9 }[education];
    const baseIncome = 1200 + age * 80;
    const incomeNoise = d3randNormal(0, 600)();
    const income = Math.max(300, Math.round((baseIncome + incomeNoise) * educationBoost));

    const brandLoyaltyNum = clamp(0.4 + (educationBoost - 1) * 0.3 + d3randNormal(0, 0.2)(), 0, 1);
    const priceSensitivityNum = clamp(0.6 - (brandLoyaltyNum - 0.5) * 0.6 + d3randNormal(0, 0.15)(), 0, 1);
    const brandLoyalty: MockUser['brandLoyalty'] = brandLoyaltyNum < 0.25 ? 'Low' : brandLoyaltyNum < 0.5 ? 'Medium' : brandLoyaltyNum < 0.75 ? 'High' : 'Very High';
    const priceSensitivity: MockUser['priceSensitivity'] = priceSensitivityNum < 0.25 ? 'Low' : priceSensitivityNum < 0.5 ? 'Medium' : priceSensitivityNum < 0.75 ? 'High' : 'Very High';

    const ecommerce = pick(ecommerceFreq);
    const channel = pick(channels);
    const device = pick(devices);
    const region = pick(regions);
    const gender = pick(genders);

    const digitalEngagementScore = clamp(Math.round(50 + (ecommerce === 'Daily' ? 20 : 0) + d3randNormal(0, 18)()), 0, 100);
    const fitnessLevel = pick(fitness);
    const sleepQuality = pick(sleepQ);
    const stressLevel = pick(stress);

    // Wellness and health scores influenced by fitness/sleep/stress
    const wellnessBase = 50 + (fitnessLevel === 'High' ? 15 : fitnessLevel === 'Medium' ? 5 : -8) + (sleepQuality === 'Good' ? 10 : sleepQuality === 'Average' ? 0 : -12) + (stressLevel === 'Low' ? 8 : stressLevel === 'Medium' ? 0 : -10);
    const wellnessScore = clamp(Math.round(wellnessBase + d3randNormal(0, 10)()), 0, 100);
    const healthScore = clamp(Math.round(wellnessScore + d3randNormal(0, 8)()), 0, 100);

    const environmentalConsciousness: MockUser['environmentalConsciousness'] = ((): any => {
      const base = 0.5 + (regions.indexOf(region) % 2 === 0 ? 0.1 : -0.05) + d3randNormal(0, 0.15)();
      return base < 0.25 ? 'Low' : base < 0.5 ? 'Medium' : base < 0.75 ? 'High' : 'Very High';
    })();

    const investmentExperience: MockUser['investmentExperience'] = ((): any => {
      const r = Math.random();
      if (r < 0.15) return 'None';
      if (r < 0.5) return 'Beginner';
      if (r < 0.85) return 'Intermediate';
      return 'Advanced';
    })();

    const incomeLevel: MockUser['incomeLevel'] = income < 2000 ? 'Low' : income < 5000 ? 'Medium' : 'High';

    return {
      id: `u_${i}`,
      age,
      gender,
      region,
      education,
      income,
      incomeLevel,
      ecommerceFrequency: ecommerce,
      priceSensitivity,
      brandLoyalty,
      shoppingChannel: channel,
      device,
      digitalEngagementScore,
      fitnessLevel,
      sleepQuality,
      stressLevel,
      wellnessScore,
      healthScore,
      environmentalConsciousness,
      investmentExperience,
    };
  });

  return users;
}

// Minimal normal RNG to avoid extra deps; Box–Muller transform
function d3randNormal(mean = 0, deviation = 1) {
  return () => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mean + z * deviation;
  };
}


