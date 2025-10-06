# DataViz Proto - UI Theme Specification

## **Theme: Professional Business with Vibrant Analytics**

### **Visual Style**
- **Clean, minimal design** with lots of white space
- **Card-based layout** with rounded corners and subtle shadows
- **Professional typography** with clear hierarchy
- **Structured grid layout** for organized data presentation
- **Professional iconography** with consistent stroke width

### **Color Palette: Vibrant Analytics**

#### **Primary Colors**
- **Primary Blue**: `#3b82f6` (Electric blue for main actions and headers)
- **Secondary Pink**: `#ec4899` (Pink for secondary actions and highlights)
- **Accent Yellow**: `#f59e0b` (Yellow for warnings, alerts, and data points)
- **Background**: `#ffffff` (Clean white background)

#### **Supporting Colors**
- **Text Primary**: `#1f2937` (Dark gray for main text)
- **Text Secondary**: `#6b7280` (Medium gray for secondary text)
- **Text Muted**: `#9ca3af` (Light gray for labels and captions)
- **Border**: `#e5e7eb` (Light gray for borders and dividers)
- **Success**: `#10b981` (Green for positive indicators)
- **Error**: `#ef4444` (Red for errors and negative indicators)
- **Warning**: `#f59e0b` (Yellow for warnings)

#### **Data Visualization Colors**
- **Chart 1**: `#3b82f6` (Primary blue)
- **Chart 2**: `#ec4899` (Secondary pink)
- **Chart 3**: `#f59e0b` (Accent yellow)
- **Chart 4**: `#10b981` (Success green)
- **Chart 5**: `#8b5cf6` (Purple)
- **Chart 6**: `#06b6d4` (Cyan)
- **Chart 7**: `#f97316` (Orange)
- **Chart 8**: `#84cc16` (Lime)

### **Layout: Dashboard Grid**

#### **Grid System**
- **12-column responsive grid** with consistent gutters
- **Breakpoints**:
  - Mobile: 320px - 768px
  - Tablet: 768px - 1024px
  - Desktop: 1024px - 1440px
  - Large Desktop: 1440px+

#### **Layout Structure**
```
┌─────────────────────────────────────────────────────────┐
│                    Header (100%)                        │
├─────────────────────────────────────────────────────────┤
│ Sidebar │              Main Content (Grid)             │
│  (25%)  │  ┌─────────┬─────────┬─────────┬─────────┐   │
│         │  │ Chart 1 │ Chart 2 │ Chart 3 │ Chart 4 │   │
│         │  │  (25%)  │  (25%)  │  (25%)  │  (25%)  │   │
│         │  ├─────────┼─────────┼─────────┼─────────┤   │
│         │  │ Chart 5 │ Chart 6 │ Chart 7 │ Chart 8 │   │
│         │  │  (25%)  │  (25%)  │  (25%)  │  (25%)  │   │
│         │  └─────────┴─────────┴─────────┴─────────┘   │
└─────────────────────────────────────────────────────────┘
```

### **Typography**

#### **Font Stack**
- **Headers**: Inter, -apple-system, BlinkMacSystemFont, sans-serif
- **Body**: Inter, -apple-system, BlinkMacSystemFont, sans-serif
- **Data/Monospace**: JetBrains Mono, 'Courier New', monospace

#### **Type Scale**
- **H1**: 2.5rem (40px) / 3rem (48px) - Page titles
- **H2**: 2rem (32px) / 2.25rem (36px) - Section headers
- **H3**: 1.5rem (24px) / 1.75rem (28px) - Card titles
- **H4**: 1.25rem (20px) / 1.5rem (24px) - Subsection headers
- **Body**: 1rem (16px) / 1.125rem (18px) - Main content
- **Small**: 0.875rem (14px) / 1rem (16px) - Secondary text
- **Caption**: 0.75rem (12px) / 0.875rem (14px) - Labels and captions

### **Components**

#### **Cards**
- **Background**: White with subtle shadow
- **Border**: 1px solid `#e5e7eb`
- **Border Radius**: 8px
- **Padding**: 24px
- **Shadow**: `0 1px 3px 0 rgba(0, 0, 0, 0.1)`

#### **Buttons**
- **Primary**: Blue background, white text, 8px border radius
- **Secondary**: White background, blue border, blue text
- **Size**: 40px height, 16px horizontal padding
- **Hover**: Slight darkening of background color

#### **Form Elements**
- **Input Fields**: White background, gray border, 6px border radius
- **Focus State**: Blue border, blue shadow
- **Labels**: Small text, dark gray color
- **Placeholders**: Light gray text

### **Navigation**

#### **Header**
- **Height**: 64px
- **Background**: White with bottom border
- **Logo**: Left side, 32px height
- **Navigation**: Center, horizontal menu
- **Actions**: Right side, buttons and user menu

#### **Sidebar**
- **Width**: 256px (desktop), collapsible on mobile
- **Background**: White with right border
- **Navigation Items**: 48px height, 16px padding
- **Active State**: Blue background, white text
- **Hover State**: Light gray background

### **Data Visualization**

#### **Chart Containers**
- **Background**: White
- **Border**: 1px solid `#e5e7eb`
- **Border Radius**: 8px
- **Padding**: 20px
- **Min Height**: 300px

#### **Chart Elements**
- **Grid Lines**: Light gray (`#f3f4f6`)
- **Axes**: Dark gray (`#374151`)
- **Data Points**: Vibrant colors from palette
- **Tooltips**: White background, dark text, shadow

### **Interactive States**

#### **Hover Effects**
- **Cards**: Subtle shadow increase
- **Buttons**: Background color darkening
- **Links**: Color change to primary blue
- **Data Points**: Slight scale increase

#### **Focus States**
- **Form Elements**: Blue border, blue shadow
- **Buttons**: Blue outline
- **Navigation**: Blue background

#### **Loading States**
- **Skeleton**: Light gray background with shimmer
- **Spinners**: Blue color matching primary
- **Progress Bars**: Blue background

### **Responsive Design**

#### **Mobile (320px - 768px)**
- **Grid**: Single column layout
- **Sidebar**: Collapsible overlay
- **Cards**: Full width with reduced padding
- **Typography**: Slightly smaller scale

#### **Tablet (768px - 1024px)**
- **Grid**: 2-column layout
- **Sidebar**: Collapsible
- **Cards**: Medium padding
- **Typography**: Standard scale

#### **Desktop (1024px+)**
- **Grid**: 4-column layout
- **Sidebar**: Always visible
- **Cards**: Full padding
- **Typography**: Full scale

### **Accessibility**

#### **Color Contrast**
- **Text on White**: 4.5:1 minimum ratio
- **Interactive Elements**: 3:1 minimum ratio
- **Focus Indicators**: High contrast outlines

#### **Keyboard Navigation**
- **Tab Order**: Logical flow through interface
- **Focus Indicators**: Clear visual feedback
- **Skip Links**: Available for screen readers

#### **Screen Reader Support**
- **Alt Text**: All images and charts
- **ARIA Labels**: Interactive elements
- **Semantic HTML**: Proper heading structure
