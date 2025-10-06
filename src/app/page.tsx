export const dynamic = "force-dynamic";
export const revalidate = 0;

import AgeHistogram from '@/components/visualization/AgeHistogram';
import AgeBoxPlot from '@/components/visualization/AgeBoxPlot';
import GenderPie from '@/components/visualization/GenderPie';
import RegionBars from '@/components/visualization/RegionBars';
import EducationBars from '@/components/visualization/EducationBars';
import IncomeHistogramViolin from '@/components/visualization/IncomeHistogramViolin';
import DeviceStackedBars from '@/components/visualization/DeviceStackedBars';
import SocialScatter from '@/components/visualization/SocialScatter';
import EcommerceBar from '@/components/visualization/EcommerceBar';
import DeviceRegionHeatmap from '@/components/visualization/DeviceRegionHeatmap';
import EngagementDensity from '@/components/visualization/EngagementDensity';
import ShoppingTreemap from '@/components/visualization/ShoppingTreemap';
import EcomBoxPlot from '@/components/visualization/EcomBoxPlot';
import PriceCorrHeatmap from '@/components/visualization/PriceCorrHeatmap';
import ShoppingSunburst from '@/components/visualization/ShoppingSunburst';
import FitnessBar from '@/components/visualization/FitnessBar';
import FitnessPie from '@/components/visualization/FitnessPie';
import SleepStressHeatmap from '@/components/visualization/SleepStressHeatmap';
import WellnessTrend from '@/components/visualization/WellnessTrend';
import HealthScoreGauge from '@/components/visualization/HealthScoreGauge';
import SustainabilityStackedBars from '@/components/visualization/SustainabilityStackedBars';
import CausesHorizontalBar from '@/components/visualization/CausesHorizontalBar';
import EnvAwarenessGauge from '@/components/visualization/EnvAwarenessGauge';
import IncomeSpendingScatter from '@/components/visualization/IncomeSpendingScatter';
import InvestmentPrefsPie from '@/components/visualization/InvestmentPrefsPie';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient Orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-br from-[var(--color-primary)]/25 to-[var(--color-info)]/20 blur-2xl animate-float" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-[var(--color-secondary)]/25 to-[var(--color-accent)]/20 blur-2xl animate-float" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[680px] w-[680px] rounded-full border border-black/5 animate-slow-spin" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50">
        <div className="glass mx-4 mt-3 rounded-2xl px-4 py-3 border">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center animate-pulse-glow">
                <span className="text-white font-bold text-xs">DV</span>
              </div>
              <span className="text-lg font-semibold gradient-text">DataViz Proto</span>
            </div>
            {/* Actions */}
            <div className="hidden md:flex items-center gap-3">
              <a href="/dataview" className="btn-gradient text-white px-4 py-2 rounded-lg font-medium">Data View</a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
              <span className="gradient-text">Visual Analytics</span> that feel alive
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-xl">
              A professional dashboard starter with premium motion, glass surfaces, and vibrant gradients.
            </p>
            <div className="mt-8 flex gap-4">
              <a className="btn-gradient text-white px-6 py-3 rounded-xl font-semibold" href="#">Start Exploring</a>
              <a className="px-6 py-3 rounded-xl font-semibold border border-black/10 text-gray-700 hover:text-gray-900 transition" href="#">Live Demo</a>
            </div>
            {/* Stat badges */}
            <div className="mt-8 overflow-hidden">
              <div className="marquee">
                <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 shadow-sm"><span className="h-2 w-2 rounded-full bg-[var(--color-secondary)]" />Real-time Filters</div>
                <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 shadow-sm"><span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />Cross-Chart Sync</div>
                <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 shadow-sm"><span className="h-2 w-2 rounded-full bg-[var(--color-info)]" />WebGL Rendering</div>
                <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 shadow-sm"><span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />Anomaly Alerts</div>
                {/* loop duplicate for seamless scroll */}
                <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 shadow-sm"><span className="h-2 w-2 rounded-full bg-[var(--color-secondary)]" />Real-time Filters</div>
                <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 shadow-sm"><span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />Cross-Chart Sync</div>
                <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 shadow-sm"><span className="h-2 w-2 rounded-full bg-[var(--color-info)]" />WebGL Rendering</div>
                <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 shadow-sm"><span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />Anomaly Alerts</div>
              </div>
            </div>
          </div>
          {/* Showcase Card */}
          <div className="relative">
            <div className="glass-strong rounded-2xl p-6 border bg-grid">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Live KPIs</div>
                <div className="h-2 w-2 rounded-full bg-[var(--color-secondary)] animate-pulse" />
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="rounded-xl p-4 bg-white border border-black/10">
                  <div className="text-xs text-gray-500">Active Users</div>
                  <div className="mt-2 text-2xl font-bold text-gray-900">1,248</div>
                </div>
                <div className="rounded-xl p-4 bg-white border border-black/10">
                  <div className="text-xs text-gray-500">Conversion</div>
                  <div className="mt-2 text-2xl font-bold text-gray-900">4.7%</div>
                </div>
                <div className="rounded-xl p-4 bg-white border border-black/10">
                  <div className="text-xs text-gray-500">Latency</div>
                  <div className="mt-2 text-2xl font-bold text-gray-900">132ms</div>
                </div>
              </div>
              <div className="mt-6 h-40 rounded-xl overflow-hidden border border-black/10">
                <div className="h-full w-full bg-gradient-to-r from-[var(--color-primary)]/20 via-[var(--color-secondary)]/20 to-[var(--color-info)]/20 animate-[pulse_6s_ease-in-out_infinite]" />
              </div>
              {/* Mini widgets */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl p-4 bg-white border border-black/10 hover:shadow-lg transition">
                  <div className="text-xs text-gray-500">Satisfaction</div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                    <div className="text-lg font-semibold text-gray-900">92%</div>
                  </div>
                </div>
                <div className="rounded-xl p-4 bg-white border border-black/10 hover:shadow-lg transition">
                  <div className="text-xs text-gray-500">Errors</div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                    <div className="text-lg font-semibold text-gray-900">0.3%</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 glass rounded-xl px-4 py-3 border">
              <div className="text-xs text-gray-600">Realtime</div>
              <div className="text-sm font-semibold text-gray-900">Streaming On</div>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental & Social Values */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Environmental & Social Values</h2>
            <p className="mt-2 text-gray-600">Sustainability, social causes, and awareness.</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button className="px-3 py-2 rounded-lg border border-black/10 text-gray-700 hover:text-gray-900">Filters</button>
            <button className="btn-gradient text-white px-3 py-2 rounded-lg">Refresh</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sustainability Practices: Stacked bar */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Sustainability · Stacked Bars</h3>
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <div className="mt-2">
              <SustainabilityStackedBars height={220} />
            </div>
          </div>

          {/* Social Causes Support: Horizontal bar */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Social Causes · Horizontal Bars</h3>
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <div className="mt-2">
              <CausesHorizontalBar height={220} />
            </div>
          </div>

          {/* Environmental Awareness: Gauge */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Environmental Awareness · Gauge</h3>
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <div className="mt-2 grid place-items-center">
              <EnvAwarenessGauge height={220} />
            </div>
          </div>
        </div>
      </section>

      {/* Financial & Investment Profiles */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Financial & Investment Profiles</h2>
            <p className="mt-2 text-gray-600">Income & spending, preferences and goals.</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button className="px-3 py-2 rounded-lg border border-black/10 text-gray-700 hover:text-gray-900">Filters</button>
            <button className="btn-gradient text-white px-3 py-2 rounded-lg">Refresh</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Income vs Spending: Scatter/Bubble */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Income vs Spending · Scatter</h3>
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <div className="mt-2">
              <IncomeSpendingScatter height={240} />
            </div>
          </div>

          {/* Investment Preferences: Pie & Donut */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Investment Preferences · Pie & Donut</h3>
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div className="grid place-items-center"><InvestmentPrefsPie height={200} /></div>
              <div className="grid place-items-center"><InvestmentPrefsPie donut height={200} /></div>
            </div>
          </div>
        </div>
      </section>
      {/* Health & Wellness Patterns */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Health & Wellness Patterns</h2>
            <p className="mt-2 text-gray-600">Fitness levels, sleep vs stress, wellness trends, and health scores.</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button className="px-3 py-2 rounded-lg border border-black/10 text-gray-700 hover:text-gray-900">Filters</button>
            <button className="btn-gradient text-white px-3 py-2 rounded-lg">Refresh</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Fitness Level: Bar */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Fitness Level · Bar</h3>
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <div className="mt-2">
              <FitnessBar height={220} />
            </div>
          </div>

          {/* Fitness Level: Pie */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Fitness Level · Pie</h3>
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <div className="mt-2 grid place-items-center">
              <FitnessPie height={220} />
            </div>
          </div>

          {/* Sleep × Stress: Heatmap */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Sleep Quality × Stress Level · Heatmap</h3>
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <div className="mt-2">
              <SleepStressHeatmap height={240} />
            </div>
          </div>

          {/* Wellness Trend: Area + Line */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Wellness Trend · Area & Line</h3>
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <div className="mt-2">
              <WellnessTrend height={240} />
            </div>
          </div>

          {/* Lifestyle Health Score: Gauge */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Lifestyle Health Score · Gauge</h3>
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <div className="mt-2 grid place-items-center">
              <HealthScoreGauge height={220} />
            </div>
          </div>
        </div>
      </section>

      {/* Consumer Behavior & Shopping */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Consumer Behavior & Shopping</h2>
            <p className="mt-2 text-gray-600">Channels, frequency, brand affinity and price sensitivity.</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button className="px-3 py-2 rounded-lg border border-black/10 text-gray-700 hover:text-gray-900">Filters</button>
            <button className="btn-gradient text-white px-3 py-2 rounded-lg">Refresh</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Purchase Categories: Treemap (Shopping channels by region) */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Shopping Channels · Treemap</h3>
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <div className="mt-2">
              <ShoppingTreemap height={260} />
            </div>
          </div>

          {/* Purchase Categories: Sunburst */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Shopping Channels · Sunburst</h3>
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <div className="mt-2">
              <ShoppingSunburst height={280} />
            </div>
          </div>

          {/* Shopping Frequency: Engagement Box Plot */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Engagement by Shopping Frequency · Box Plot</h3>
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <div className="mt-2">
              <EcomBoxPlot height={260} />
            </div>
          </div>

          {/* Price Sensitivity: Correlation Heatmap */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Price Sensitivity × Brand Loyalty · Heatmap</h3>
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <div className="mt-2">
              <PriceCorrHeatmap height={260} />
            </div>
          </div>
        </div>
      </section>

      {/* Digital Behavior & Technology */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Digital Behavior & Technology</h2>
            <p className="mt-2 text-gray-600">Device usage patterns, social engagement, and ecommerce behavior.</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button className="px-3 py-2 rounded-lg border border-black/10 text-gray-700 hover:text-gray-900">Filters</button>
            <button className="btn-gradient text-white px-3 py-2 rounded-lg">Refresh</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Device Usage Patterns: Stacked Bar */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Device Usage · Stacked Bars</h3>
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <div className="mt-2">
              <DeviceStackedBars height={220} />
            </div>
          </div>

          {/* Social Media Engagement: Scatter */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Social Engagement · Scatter</h3>
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <div className="mt-2">
              <SocialScatter height={220} />
            </div>
          </div>

          {/* Online Shopping Frequency: Bar */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Ecommerce Frequency · Bar</h3>
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <div className="mt-2">
              <EcommerceBar height={220} />
            </div>
          </div>

          {/* Device vs Region: Heatmap */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Device × Region · Heatmap</h3>
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <div className="mt-2">
              <DeviceRegionHeatmap height={240} />
            </div>
          </div>

          {/* Engagement Score Density: Line */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Engagement Score · Density</h3>
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <div className="mt-2">
              <EngagementDensity height={240} />
            </div>
          </div>
        </div>
      </section>

      {/* Demographics & Lifestyle */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Demographics & Lifestyle</h2>
            <p className="mt-2 text-gray-600">Explore population structure, distribution, and key lifestyle attributes.</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button className="px-3 py-2 rounded-lg border border-black/10 text-gray-700 hover:text-gray-900">Filters</button>
            <button className="btn-gradient text-white px-3 py-2 rounded-lg">Refresh</button>
        </div>
      </div>

        {/* Chart grid (placeholders, wired for later) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Age Distribution: Histogram (D3) */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition group">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Age Distribution · Histogram</h3>
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <div className="mt-4">
              <AgeHistogram height={180} />
            </div>
          </div>
          
          {/* Age Distribution: Box plot (D3) */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Age Distribution · Box Plot</h3>
              <span className="text-xs text-gray-500">Live</span>
                  </div>
            <div className="mt-2">
              <AgeBoxPlot height={200} />
            </div>
                  </div>

          {/* Gender Distribution: Pie chart (D3) */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Gender Distribution · Pie</h3>
              <span className="text-xs text-gray-500">Live</span>
              </div>
            <div className="mt-2">
              <GenderPie height={180} />
            </div>
                </div>

          {/* Gender Distribution: Donut chart (D3) */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Gender Distribution · Donut</h3>
              <span className="text-xs text-gray-500">Live</span>
                </div>
            <div className="mt-2">
              <GenderPie donut height={180} />
            </div>
                </div>

          {/* Geographic Distribution: Map (stylized) */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Geographic Distribution · Map</h3>
              <span className="text-xs text-gray-500">Live</span>
                </div>
            <div className="mt-4 h-40 rounded-lg bg-gradient-to-br from-[var(--color-primary)]/8 to-[var(--color-secondary)]/8 grid place-items-center text-gray-500 text-sm">
              Interactive Map Placeholder
                </div>
              </div>

          {/* Geographic Distribution: Bar by region (D3) */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Geographic Distribution · Bars</h3>
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <div className="mt-2">
              <RegionBars height={200} />
            </div>
          </div>

          {/* Education Levels: Horizontal bar (D3) */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Education Levels · Horizontal Bars</h3>
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <div className="mt-2">
              <EducationBars height={200} />
            </div>
          </div>

          {/* Education Levels: Stacked bar */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Education Levels · Stacked</h3>
              <span className="text-xs text-gray-500">Live</span>
        </div>
            <div className="mt-4 space-y-3">
              {[['18-25', [35,45,20]], ['26-40', [25,50,25]], ['41+', [30,40,30]]].map(([label, parts], idx) => (
                <div key={idx}>
                  <div className="text-xs text-gray-600">{label as string}</div>
                  <div className="mt-1 h-3 w-full overflow-hidden rounded bg-gray-100 flex">
                    {(parts as number[]).map((p, i) => (
                      <div key={i} style={{ width: `${p}%` }} className={i===0?"bg-[var(--color-primary)]/80":i===1?"bg-[var(--color-secondary)]/80":"bg-[var(--color-info)]/80"} />
                    ))}
        </div>
                </div>
              ))}
            </div>
          </div>

          {/* Income Distribution: Histogram + Violin (D3) */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition group">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Income Distribution · Histogram</h3>
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <div className="mt-2">
              <IncomeHistogramViolin height={200} />
            </div>
          </div>

          {/* Income Distribution: Box plot & Violin */}
          <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Income · Box & Violin</h3>
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {/* Box */}
              <div className="h-36 grid place-items-center">
                <div className="w-9/12 h-1 bg-gray-200 relative">
                  <div className="absolute left-1/5 top-1/2 -translate-y-1/2 h-7 w-1 bg-gray-400" />
                  <div className="absolute right-1/5 top-1/2 -translate-y-1/2 h-7 w-1 bg-gray-400" />
                  <div className="absolute left-1/3 right-1/3 top-1/2 -translate-y-1/2 h-7 rounded-md border border-black/10 bg-gradient-to-r from-[var(--color-secondary)]/15 to-[var(--color-info)]/15" />
                </div>
              </div>
              {/* Violin */}
              <div className="h-36 grid place-items-center">
                <div className="relative h-28 w-16">
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-gray-300" />
                  <div className="absolute inset-0 mx-auto w-full bg-[radial-gradient(closest-side,rgba(34,197,94,.35),transparent_70%)] rounded-[40%_40%_40%_40%/60%_60%_40%_40%]" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="mx-4 mb-6">
        <div className="glass rounded-2xl px-5 py-4 border max-w-7xl mx-auto mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">© 2024 DataViz Proto</span>
          <div className="flex gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-900 transition">Privacy</a>
            <a href="#" className="hover:text-gray-900 transition">Terms</a>
            <a href="#" className="hover:text-gray-900 transition">Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
