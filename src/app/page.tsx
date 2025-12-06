'use client';

import { useMemo, useState, useEffect } from 'react';
import * as d3 from 'd3';
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
import { useVisualizationStore } from '@/stores/visualizationStore';

// Layout Components
import { Header, Footer, Section, Container, Grid, SectionIntro, SectionTransition } from '@/components/layout';

// Section Components
import { InteractiveChartCard, SectionHeader } from '@/components/sections/environmental';

// Visual Effects
import { BackgroundGradient, GradientOrb, GlassCard, HoverEffect, GridPattern } from '@/components/effects';

// UI Components
import { Button, Card } from '@/components/ui';

// Hero Components
import { 
  HeroBackground, 
  HeroContent, 
  HeroBadges,
  HeroChartCarousel,
  HeroInteractiveElements
} from '@/components/hero';

// Loading Component
import { LoadingScreen } from '@/components/loading';

export default function Home() {
  const { displayData } = useVisualizationStore();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Handle initial page load
  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Wait a bit before hiding
          setTimeout(() => {
            setIsInitialLoading(false);
          }, 500);
          return 100;
        }
        const increment = Math.random() * 8 + 2;
        return Math.min(prev + increment, 100);
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);
  
  // Calculate health score for stats
  const healthScore = useMemo(() => {
    return d3.mean(displayData, (r) => r.healthScore) || 0;
  }, [displayData]);
  
  // Show loading screen on initial load
  if (isInitialLoading) {
    return (
      <LoadingScreen
        progress={loadingProgress}
        minDisplayTime={2000}
        onComplete={() => setIsInitialLoading(false)}
      />
    );
  }
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <BackgroundGradient variant="mixed" intensity="medium" animated />
      
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none -z-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="homepage-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#homepage-grid)" className="text-primary" />
        </svg>
      </div>
      
      <div className="pointer-events-none absolute inset-0 -z-10">
        <GradientOrb variant="primary" size="lg" position={{ x: '-10%', y: '-10%' }} />
        <GradientOrb variant="secondary" size="xl" position={{ x: '110%', y: '110%' }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[680px] w-[680px] rounded-full border border-[var(--color-border)]/20 animate-slow-spin" />
      </div>

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden pt-32 pb-32">
        <HeroBackground />
        <HeroInteractiveElements />
        
        <Container size="wide" className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column - Content (5 columns) */}
            <div className="lg:col-span-5 relative z-20">
              <HeroContent />
              <HeroBadges />
            </div>

            {/* Right Column - Charts & Visuals (7 columns) */}
            <div className="lg:col-span-7 relative">
              {/* Main Chart Carousel */}
              <div className="relative z-10">
                <HeroChartCarousel autoRotate={true} rotationInterval={5000} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Transition Text */}
      <SectionTransition>
        Understanding what drives our community goes beyond demographics. The values we hold—our commitment to sustainability, 
        the causes we champion, and our awareness of environmental challenges—shape how we interact with the world around us.
      </SectionTransition>

      {/* Environmental & Social Values */}
      <Section
        spacing="lg"
        containerSize="wide"
        animate={false}
      >
        <SectionHeader
          title="Environmental & Social Values"
          description="Discover how sustainability practices, social causes, and environmental awareness shape community engagement patterns across different regions and demographics."
          stats={[
            { label: 'High Awareness', value: '68%', trend: 'up' },
            { label: 'Active Causes', value: '12', trend: 'neutral' },
            { label: 'Regions Tracked', value: '8', trend: 'neutral' },
            { label: 'Engagement Rate', value: '84%', trend: 'up' },
          ]}
          actions={
            <>
              <HoverEffect effect="scale">
                <Button variant="secondary" size="sm">Filters</Button>
              </HoverEffect>
              <HoverEffect effect="glow">
                <Button variant="primary" size="sm">Refresh</Button>
              </HoverEffect>
            </>
          }
        />

        <SectionIntro>
          Our data reveals fascinating patterns in how individuals engage with environmental and social initiatives. 
          The sustainability practices visualization shows adoption rates across different eco-friendly behaviors, from 
          recycling habits to energy conservation. Social causes support metrics highlight which movements resonate most 
          strongly with different demographic segments, while environmental awareness gauges track the evolution of 
          consciousness around climate issues over time.
        </SectionIntro>

        {/* Dynamic Chart Layout */}
        <div className="space-y-8">
          {/* Top Row - Full Width Sustainability Chart */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <InteractiveChartCard
              title="Sustainability Practices"
              subtitle="Regional adoption rates of eco-friendly behaviors"
              icon="🌱"
              color="primary"
              stats={[
                { label: 'Regions', value: '8' },
                { label: 'Avg Adoption', value: '72%' },
                { label: 'Trend', value: '+5%' },
              ]}
            >
              <SustainabilityStackedBars height={280} />
            </InteractiveChartCard>
          </div>

          {/* Bottom Row - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Social Causes */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <InteractiveChartCard
                title="Social Causes Support"
                subtitle="Support intensity across key movements"
                icon="🤝"
                color="secondary"
                stats={[
                  { label: 'Causes', value: '12' },
                  { label: 'Avg Support', value: '68%' },
                ]}
              >
                <CausesHorizontalBar height={280} />
              </InteractiveChartCard>
          </div>

            {/* Environmental Awareness */}
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <InteractiveChartCard
                title="Environmental Awareness"
                subtitle="Overall consciousness score"
                icon="🌍"
                color="accent"
                stats={[
                  { label: 'Score', value: '76%' },
                  { label: 'Level', value: 'High' },
                ]}
              >
                <div className="flex items-center justify-center h-[280px]">
                  <EnvAwarenessGauge height={280} />
            </div>
              </InteractiveChartCard>
            </div>
          </div>
        </div>
      </Section>

      {/* Transition Text */}
      <SectionTransition>
        Financial behavior patterns tell a compelling story about economic priorities and future planning. 
        How income translates into spending, what investment strategies people prefer, and the relationship 
        between financial goals and current actions—these insights reveal the economic pulse of our dataset.
      </SectionTransition>

      {/* Financial & Investment Profiles */}
      <Section
        spacing="lg"
        containerSize="wide"
        animate={false}
      >
        <SectionHeader
          title="Financial & Investment Profiles"
          description="Discover how income translates into spending patterns, investment preferences shape financial strategies, and economic behaviors reveal the financial pulse of our community."
          stats={[
            { label: 'Avg Income', value: 'Medium', trend: 'neutral' },
            { label: 'Investment Users', value: '68%', trend: 'up' },
            { label: 'Savings Rate', value: '42%', trend: 'up' },
            { label: 'Risk Tolerance', value: 'Moderate', trend: 'neutral' },
          ]}
          actions={
            <>
              <HoverEffect effect="scale">
                <Button variant="secondary" size="sm">Filters</Button>
              </HoverEffect>
              <HoverEffect effect="glow">
                <Button variant="primary" size="sm">Refresh</Button>
              </HoverEffect>
            </>
          }
        />

        <SectionIntro>
          The scatter plot mapping income against spending patterns uncovers distinct behavioral clusters—some 
          groups demonstrate high savings rates despite moderate incomes, while others show spending that scales 
          proportionally with earnings. Investment preference distributions reveal risk tolerance patterns, with 
          conservative strategies dominating certain age brackets while younger segments show higher appetite for 
          growth-oriented portfolios. These visualizations help identify financial wellness indicators and spending 
          behavior correlations.
        </SectionIntro>

        {/* Dynamic Chart Layout */}
        <div className="space-y-8">
          {/* Top Row - Full Width Income vs Spending Chart */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <InteractiveChartCard
              title="Income vs Spending Patterns"
              subtitle="Behavioral clusters revealing savings rates and spending correlations"
              icon="💰"
              color="primary"
              stats={[
                { label: 'Clusters', value: '4' },
                { label: 'Avg Spending', value: '68%' },
                { label: 'Savings Rate', value: '42%' },
              ]}
            >
              <IncomeSpendingScatter height={320} />
            </InteractiveChartCard>
        </div>

          {/* Bottom Row - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Investment Preferences: Pie */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <InteractiveChartCard
                title="Investment Experience · Pie"
                subtitle="Distribution of investment knowledge levels"
                icon="📈"
                color="secondary"
                stats={[
                  { label: 'Total Users', value: displayData.length },
                  { label: 'Investors', value: '68%' },
                ]}
              >
                <div className="flex items-center justify-center h-[320px]">
                  <InvestmentPrefsPie height={320} />
            </div>
              </InteractiveChartCard>
          </div>

            {/* Investment Preferences: Donut */}
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <InteractiveChartCard
                title="Investment Experience · Donut"
                subtitle="Alternative view of investment distribution"
                icon="📊"
                color="accent"
                stats={[
                  { label: 'Total Users', value: displayData.length },
                  { label: 'Investors', value: '68%' },
                ]}
              >
                <div className="flex items-center justify-center h-[320px]">
                  <InvestmentPrefsPie donut height={320} />
            </div>
              </InteractiveChartCard>
            </div>
          </div>
        </div>
      </Section>

      {/* Transition Text */}
      <SectionTransition>
        Health and wellness metrics provide a window into lifestyle quality and personal care priorities. 
        From fitness engagement levels to the delicate balance between sleep quality and stress management, 
        these patterns illuminate how people invest in their physical and mental well-being.
      </SectionTransition>

      {/* Health & Wellness Patterns */}
      <Section
        spacing="lg"
        containerSize="wide"
        animate={false}
      >
        <SectionHeader
          title="Health & Wellness Patterns"
          description="Discover how fitness engagement, sleep quality, stress management, and wellness trends shape lifestyle quality and personal well-being across different demographics."
          stats={[
            { label: 'Avg Health Score', value: `${Math.round(healthScore)}%`, trend: 'up' },
            { label: 'High Fitness', value: '42%', trend: 'up' },
            { label: 'Good Sleep', value: '68%', trend: 'neutral' },
            { label: 'Low Stress', value: '54%', trend: 'up' },
          ]}
          actions={
            <>
              <HoverEffect effect="scale">
                <Button variant="secondary" size="sm">Filters</Button>
              </HoverEffect>
              <HoverEffect effect="glow">
                <Button variant="primary" size="sm">Refresh</Button>
              </HoverEffect>
            </>
          }
        />

        <SectionIntro>
          Fitness level distributions show interesting demographic variations—certain regions and age groups 
          demonstrate higher engagement with regular exercise, while the pie chart reveals how fitness intensity 
          levels are distributed across the population. The sleep-stress heatmap uncovers critical correlations: 
          individuals with poor sleep quality often show elevated stress markers, creating a feedback loop that 
          impacts overall wellness. The trend analysis tracks how wellness metrics evolve over time, revealing 
          seasonal patterns and long-term health trajectory changes. The lifestyle health score gauge provides 
          a composite view, synthesizing multiple wellness indicators into a single comprehensive metric.
        </SectionIntro>

        {/* Dynamic Chart Layout */}
        <div className="space-y-8">
          {/* Top Row - Full Width Sleep vs Stress Heatmap */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <InteractiveChartCard
              title="Sleep Quality × Stress Level"
              subtitle="Critical correlations between sleep patterns and stress markers"
              icon="😴"
              color="primary"
              stats={[
                { label: 'Combinations', value: '16' },
                { label: 'Max Correlation', value: 'High' },
                { label: 'Avg Quality', value: 'Good' },
              ]}
            >
              <SleepStressHeatmap height={320} />
            </InteractiveChartCard>
        </div>

          {/* Middle Row - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fitness Level: Bar */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <InteractiveChartCard
                title="Fitness Level Distribution"
                subtitle="Engagement patterns across fitness intensity levels"
                icon="💪"
                color="secondary"
                stats={[
                  { label: 'Levels', value: '3' },
                  { label: 'High Fitness', value: '42%' },
                ]}
              >
                <FitnessBar height={300} />
              </InteractiveChartCard>
            </div>

            {/* Wellness Trend */}
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <InteractiveChartCard
                title="Wellness Trend Analysis"
                subtitle="Evolution of wellness metrics over time"
                icon="📈"
                color="accent"
                stats={[
                  { label: 'Trend', value: 'Up' },
                  { label: 'Growth', value: '+12%' },
                ]}
              >
                <WellnessTrend height={300} />
              </InteractiveChartCard>
            </div>
          </div>

          {/* Bottom Row - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fitness Level: Pie */}
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <InteractiveChartCard
                title="Fitness Level Distribution · Pie"
                subtitle="Alternative view of fitness intensity distribution"
                icon="🏃"
                color="primary"
                stats={[
                  { label: 'Total Users', value: displayData.length },
                  { label: 'Active', value: '68%' },
                ]}
              >
                <div className="flex items-center justify-center h-[300px]">
                  <FitnessPie height={300} />
            </div>
              </InteractiveChartCard>
          </div>

          {/* Lifestyle Health Score: Gauge */}
            <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <InteractiveChartCard
                title="Lifestyle Health Score"
                subtitle="Composite wellness indicator synthesizing multiple metrics"
                icon="❤️"
                color="secondary"
                stats={[
                  { label: 'Score', value: `${Math.round(healthScore)}%` },
                  { label: 'Status', value: healthScore >= 70 ? 'Excellent' : healthScore >= 50 ? 'Good' : 'Fair' },
                ]}
              >
                <div className="flex items-center justify-center h-[300px]">
                  <HealthScoreGauge height={300} />
            </div>
              </InteractiveChartCard>
            </div>
          </div>
        </div>
      </Section>

      {/* Transition Text */}
      <SectionTransition>
        Shopping behaviors reflect more than purchasing decisions—they reveal preferences, priorities, and 
        the channels through which people engage with commerce. Understanding these patterns helps decode 
        consumer psychology and market dynamics.
      </SectionTransition>

      {/* Consumer Behavior & Shopping */}
      <Section
        spacing="lg"
        containerSize="wide"
        animate={false}
      >
        <SectionHeader
          title="Consumer Behavior & Shopping"
          description="Discover how shopping channels, purchase frequencies, brand loyalty, and price sensitivity shape consumer behavior patterns across different regions and demographics."
          stats={[
            { label: 'Channels', value: '4', trend: 'neutral' },
            { label: 'Avg Frequency', value: 'Frequent', trend: 'neutral' },
            { label: 'Price Sensitive', value: '68%', trend: 'up' },
            { label: 'Brand Loyal', value: '54%', trend: 'neutral' },
          ]}
          actions={
            <>
              <HoverEffect effect="scale">
                <Button variant="secondary" size="sm">Filters</Button>
              </HoverEffect>
              <HoverEffect effect="glow">
                <Button variant="primary" size="sm">Refresh</Button>
              </HoverEffect>
            </>
          }
        />

        <SectionIntro>
          The treemap visualization breaks down shopping channels by region, showing how geographic location 
          influences purchasing platform preferences. The sunburst chart provides a hierarchical view of shopping 
          categories, revealing nested relationships between product types and purchase frequencies. Engagement 
          analysis by shopping frequency demonstrates how active shoppers differ in their interaction patterns 
          compared to occasional buyers. The price sensitivity and brand loyalty heatmap reveals fascinating 
          trade-offs—some segments prioritize price above all, while others show strong brand attachment 
          regardless of cost considerations.
        </SectionIntro>

        {/* Dynamic Chart Layout */}
        <div className="space-y-8">
          {/* Top Row - Full Width Shopping Treemap */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <InteractiveChartCard
              title="Shopping Channels by Region"
              subtitle="Geographic breakdown of purchasing platform preferences"
              icon="🛒"
              color="primary"
              stats={[
                { label: 'Channels', value: '4' },
                { label: 'Regions', value: '8' },
                { label: 'Total Users', value: displayData.length },
              ]}
            >
              <ShoppingTreemap height={320} />
            </InteractiveChartCard>
          </div>

          {/* Middle Row - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Shopping Sunburst */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <InteractiveChartCard
                title="Shopping Channels · Sunburst"
                subtitle="Hierarchical view of shopping category distribution"
                icon="📊"
                color="secondary"
                stats={[
                  { label: 'Channels', value: '4' },
                  { label: 'Regions', value: '8' },
                ]}
              >
                <ShoppingSunburst height={300} />
              </InteractiveChartCard>
          </div>

            {/* Price Sensitivity Heatmap */}
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <InteractiveChartCard
                title="Price Sensitivity × Brand Loyalty"
                subtitle="Trade-offs between price consciousness and brand attachment"
                icon="💰"
                color="accent"
                stats={[
                  { label: 'Combinations', value: '16' },
                  { label: 'Max Correlation', value: 'High' },
                ]}
              >
                <PriceCorrHeatmap height={300} />
              </InteractiveChartCard>
            </div>
          </div>

          {/* Bottom Row - Full Width Box Plot */}
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <InteractiveChartCard
              title="Engagement by Shopping Frequency"
              subtitle="Statistical analysis of digital engagement across purchase frequency levels"
              icon="📈"
              color="primary"
              stats={[
                { label: 'Frequency Levels', value: '4' },
                { label: 'Avg Engagement', value: '72' },
              ]}
            >
              <EcomBoxPlot height={300} />
            </InteractiveChartCard>
          </div>
        </div>
      </Section>

      {/* Transition Text */}
      <SectionTransition>
        In our increasingly connected world, digital behavior patterns shape how we work, socialize, and consume. 
        Device preferences, social media engagement levels, and online shopping habits create a comprehensive 
        picture of digital lifestyle integration.
      </SectionTransition>

      {/* Digital Behavior & Technology */}
      <Section
        spacing="lg"
        containerSize="wide"
        animate={false}
      >
        <SectionHeader
          title="Digital Behavior & Technology"
          description="Discover how device preferences, social media engagement, ecommerce behavior, and digital interaction patterns shape the modern digital lifestyle across different demographics and regions."
          stats={[
            { label: 'Device Types', value: '3', trend: 'neutral' },
            { label: 'Avg Engagement', value: '72', trend: 'up' },
            { label: 'Social Users', value: '84%', trend: 'up' },
            { label: 'Ecommerce Active', value: '68%', trend: 'neutral' },
          ]}
          actions={
            <>
              <HoverEffect effect="scale">
                <Button variant="secondary" size="sm">Filters</Button>
              </HoverEffect>
              <HoverEffect effect="glow">
                <Button variant="primary" size="sm">Refresh</Button>
              </HoverEffect>
            </>
          }
        />

        <SectionIntro>
          Stacked bar charts reveal device usage patterns across different contexts—mobile devices dominate 
          social media consumption, while desktop platforms maintain strong presence in professional and 
          research activities. The social engagement scatter plot shows how time spent on social platforms 
          correlates with interaction frequency, identifying highly engaged users versus passive consumers. 
          Ecommerce frequency distributions highlight shopping behavior variations, with some users making 
          frequent small purchases while others prefer less frequent but larger transactions. The device-region 
          heatmap uncovers geographic preferences for specific platforms, while engagement density visualizations 
          track how digital interaction intensity varies across user segments.
        </SectionIntro>

        {/* Dynamic Chart Layout */}
        <div className="space-y-8">
          {/* Top Row - Full Width Device Region Heatmap */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <InteractiveChartCard
              title="Device × Region Distribution"
              subtitle="Geographic preferences for specific device platforms"
              icon="💻"
              color="primary"
              stats={[
                { label: 'Devices', value: '3' },
                { label: 'Regions', value: '8' },
                { label: 'Combinations', value: '24' },
              ]}
            >
              <DeviceRegionHeatmap height={320} />
            </InteractiveChartCard>
          </div>

          {/* Middle Row - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Device Usage Stacked Bars */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <InteractiveChartCard
                title="Device Usage Patterns"
                subtitle="Stacked distribution across regions showing device preferences"
                icon="📱"
                color="secondary"
                stats={[
                  { label: 'Device Types', value: '3' },
                  { label: 'Regions', value: '8' },
                ]}
              >
                <DeviceStackedBars height={300} />
              </InteractiveChartCard>
          </div>

            {/* Social Engagement Scatter */}
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <InteractiveChartCard
                title="Social Media Engagement"
                subtitle="Correlation between time spent and interaction frequency"
                icon="📲"
                color="accent"
                stats={[
                  { label: 'Active Users', value: '84%' },
                  { label: 'Avg Score', value: '72' },
                ]}
              >
                <SocialScatter height={300} />
              </InteractiveChartCard>
            </div>
          </div>

          {/* Bottom Row - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ecommerce Frequency Bar */}
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <InteractiveChartCard
                title="Ecommerce Frequency Distribution"
                subtitle="Shopping behavior variations across frequency levels"
                icon="🛍️"
                color="primary"
                stats={[
                  { label: 'Frequency Levels', value: '4' },
                  { label: 'Active Shoppers', value: '68%' },
                ]}
              >
                <EcommerceBar height={300} />
              </InteractiveChartCard>
          </div>

            {/* Engagement Density */}
            <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <InteractiveChartCard
                title="Engagement Score Density"
                subtitle="Distribution of digital interaction intensity across user segments"
                icon="📊"
                color="secondary"
                stats={[
                  { label: 'Avg Score', value: '72' },
                  { label: 'High Engagement', value: '42%' },
                ]}
              >
                <EngagementDensity height={300} />
              </InteractiveChartCard>
            </div>
          </div>
        </div>
      </Section>

      {/* Transition Text */}
      <SectionTransition>
        Demographics form the foundation of our understanding—age distributions, gender representation, 
        geographic spread, and educational attainment create the structural framework through which all 
        other behavioral patterns must be interpreted.
      </SectionTransition>

      {/* Demographics & Lifestyle */}
      <Section
        spacing="lg"
        containerSize="wide"
        animate={false}
      >
        <SectionHeader
          title="Demographics & Lifestyle"
          description="Explore population structure, distribution, and key lifestyle attributes that reveal the composition and characteristics of our community."
          stats={[
            { label: 'Total Users', value: displayData.length.toString(), trend: 'neutral' },
            { label: 'Avg Age', value: Math.round(displayData.reduce((sum, u) => sum + u.age, 0) / displayData.length).toString(), trend: 'neutral' },
            { label: 'Regions', value: new Set(displayData.map(u => u.region)).size.toString(), trend: 'neutral' },
            { label: 'Education', value: 'Diverse', trend: 'neutral' },
          ]}
          actions={
            <>
              <HoverEffect effect="scale">
                <Button variant="secondary" size="sm">Filters</Button>
              </HoverEffect>
              <HoverEffect effect="glow">
                <Button variant="primary" size="sm">Refresh</Button>
              </HoverEffect>
            </>
          }
        />

        <SectionIntro>
          Age distribution histograms reveal population pyramids and generational composition, while box plots 
          provide statistical summaries showing median ages, quartiles, and outlier patterns. Gender distribution 
          visualizations—presented as both pie and donut charts—show population balance and help identify 
          representation patterns. Geographic distribution analyses break down the dataset by region, revealing 
          concentration patterns and regional variations in key metrics. Education level distributions, shown 
          through horizontal and stacked bar charts, illustrate educational attainment across different age 
          cohorts. Income distribution visualizations combine histogram and violin plot techniques to show 
          both frequency distributions and density patterns, revealing economic stratification and identifying 
          income clusters within the population.
        </SectionIntro>

        {/* Dynamic Chart Layout */}
        <div className="space-y-8">
          {/* Top Row - Full Width Age Distribution Chart */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <InteractiveChartCard
              title="Age Distribution · Histogram"
              subtitle="Population pyramids and generational composition analysis"
              icon="📊"
              color="primary"
              stats={[
                { label: 'Median Age', value: Math.round(displayData.reduce((sum, u) => sum + u.age, 0) / displayData.length).toString() },
                { label: 'Age Range', value: `${Math.min(...displayData.map(u => u.age))}-${Math.max(...displayData.map(u => u.age))}` },
                { label: 'Total Users', value: displayData.length.toString() },
              ]}
            >
              <AgeHistogram height={320} />
            </InteractiveChartCard>
          </div>
          
          {/* Second Row - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Age Distribution: Box Plot */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <InteractiveChartCard
                title="Age Distribution · Box Plot"
                subtitle="Statistical summaries showing median ages, quartiles, and outliers"
                icon="📈"
                color="secondary"
                stats={[
                  { label: 'Total Users', value: displayData.length.toString() },
                  { label: 'Outliers', value: '12' },
                ]}
              >
                <div className="flex items-center justify-center h-[320px]">
                  <AgeBoxPlot height={320} />
                </div>
              </InteractiveChartCard>
                </div>

            {/* Gender Distribution: Pie */}
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <InteractiveChartCard
                title="Gender Distribution · Pie"
                subtitle="Population balance and representation patterns"
                icon="👥"
                color="accent"
                stats={[
                  { label: 'Total Users', value: displayData.length.toString() },
                  { label: 'Balance', value: 'Even' },
                ]}
              >
                <div className="flex items-center justify-center h-[320px]">
                  <GenderPie height={320} />
                </div>
              </InteractiveChartCard>
            </div>
          </div>

          {/* Third Row - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gender Distribution: Donut */}
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <InteractiveChartCard
                title="Gender Distribution · Donut"
                subtitle="Alternative view of gender representation"
                icon="🎯"
                color="accent"
                stats={[
                  { label: 'Total Users', value: displayData.length.toString() },
                  { label: 'Distribution', value: 'Balanced' },
                ]}
              >
                <div className="flex items-center justify-center h-[320px]">
                  <GenderPie donut height={320} />
            </div>
              </InteractiveChartCard>
          </div>

            {/* Geographic Distribution: Bars */}
            <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <InteractiveChartCard
                title="Geographic Distribution · Bars"
                subtitle="Regional concentration patterns and variations"
                icon="🌍"
                color="primary"
                stats={[
                  { label: 'Regions', value: new Set(displayData.map(u => u.region)).size.toString() },
                  { label: 'Coverage', value: '100%' },
                ]}
              >
                <div className="flex items-center justify-center h-[320px]">
                  <RegionBars height={320} />
                </div>
              </InteractiveChartCard>
            </div>
          </div>

          {/* Fourth Row - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Education Levels: Horizontal Bars */}
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <InteractiveChartCard
                title="Education Levels · Horizontal Bars"
                subtitle="Educational attainment across different age cohorts"
                icon="🎓"
                color="secondary"
                stats={[
                  { label: 'Total Users', value: displayData.length.toString() },
                  { label: 'Levels', value: '4' },
                ]}
              >
                <div className="flex items-center justify-center h-[320px]">
                  <EducationBars height={320} />
                </div>
              </InteractiveChartCard>
              </div>

            {/* Income Distribution: Histogram + Violin */}
            <div className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <InteractiveChartCard
                title="Income Distribution · Histogram"
                subtitle="Economic stratification and income cluster identification"
                icon="💰"
                color="accent"
                stats={[
                  { label: 'Total Users', value: displayData.length.toString() },
                  { label: 'Avg Income', value: 'Medium' },
                ]}
              >
                <div className="flex items-center justify-center h-[320px]">
                  <IncomeHistogramViolin height={320} />
                </div>
              </InteractiveChartCard>
            </div>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
