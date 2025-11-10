# Date Time Picker - WeWeb Custom Element

A professional and fully customizable date and time picker component for WeWeb applications.

## 🎯 Features

### Core Functionality
- ✅ **Multiple Modes**: Date only, Time only, or Date + Time combined
- ✅ **Flexible Display**: Dropdown picker or always-visible inline mode
- ✅ **Date Formats**: Multiple date format options (DD/MM/YYYY, MM/DD/YYYY, ISO, etc.)
- ✅ **Time Formats**: 24-hour or 12-hour (AM/PM) time display
- ✅ **Time Intervals**: Configurable time interval (1-60 minutes)
- ✅ **Date Constraints**: Min/max date validation
- ✅ **First Day of Week**: Customizable (Sunday, Monday, Saturday)
- ✅ **Quick Actions**: "Today" and "Clear" buttons
- ✅ **Fully Reactive**: Real-time updates when properties change
- ✅ **NoCode Friendly**: Complete with internal variables and triggers

### Styling & UX
- 🎨 Fully customizable colors (background, border, text, primary)
- 🎨 Adjustable sizing (width, height, border radius, font size)
- 🎨 Modern, clean UI with smooth animations
- 🎨 Responsive design for mobile devices
- 🎨 Disabled state support
- 🎨 Required field marking

### Internal Variables (NoCode Integration)
- `value` - ISO date string of selected date/time
- `formattedValue` - Human-readable formatted date/time
- `timestamp` - Unix timestamp (milliseconds)
- `isOpen` - Boolean indicating if picker is open

### Trigger Events
- **On Change** - Fired when date/time selection changes
  - `value` - ISO date string
  - `formattedDate` - Formatted date string
  - `formattedTime` - Formatted time string
  - `timestamp` - Unix timestamp
- **On Clear** - Fired when clear button is clicked
- **On Open** - Fired when picker opens
- **On Close** - Fired when picker closes

## 🚀 Installation & Development

### Initialize Component (First Time Setup)

If you haven't created the component yet, you can use the WeWeb CLI:

```powershell
# Navigate to your components directory
cd "d:\TRABALHOS\Componentes Weweb"

# Initialize new component
npm init @weweb/component date-time-picker -- --type element
```

### Install Dependencies

```powershell
# Navigate to component directory
cd date-time-picker

# Install dependencies
npm install
```

### Start Development Server

```powershell
# Start with default port (8080)
npm run serve

# Or specify a custom port
npm run serve -- --port=4040
```

### Browser Setup

1. Open your browser to `https://localhost:8080` (or your custom port)
2. Click **Advanced Settings** → **Continue to localhost** to accept the SSL certificate
   - **Chrome**: If you don't see "Advanced Settings", type `chrome://flags` in the address bar
   - Search for "Allow invalid certificates for resources loaded from localhost"
   - Click **Enable**

### Add to WeWeb Editor

1. Open your WeWeb project in the Editor
2. Open the **Developer Panel** (usually in the bottom or side menu)
3. Add custom element with URL: `https://localhost:8080` (or your port)
4. The Date Time Picker should now appear in your elements list

## 📋 Component Properties

### Settings

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **Initial Value** | Text | `''` | Initial date/time in ISO format |
| **Mode** | Select | `datetime` | Display mode: `datetime`, `date`, or `time` |
| **Date Format** | Select | `dd/MM/yyyy` | Format for displaying dates |
| **Time Format** | Select | `24h` | Time format: `24h` or `12h` |
| **Time Interval** | Number | `15` | Minutes between time options (1-60) |
| **Minimum Date** | Text | `''` | Earliest selectable date (ISO format) |
| **Maximum Date** | Text | `''` | Latest selectable date (ISO format) |
| **First Day of Week** | Select | `0` | Week start: `0` (Sun), `1` (Mon), `6` (Sat) |
| **Placeholder** | Text | `'Select date and time'` | Placeholder text |
| **Disabled** | Toggle | `false` | Disable the picker |
| **Required** | Toggle | `false` | Mark as required field |
| **Show Clear Button** | Toggle | `true` | Show button to clear value |
| **Show Today Button** | Toggle | `true` | Show button to select today |
| **Always Visible (Inline)** | Toggle | `false` | Always show picker (no dropdown) |

### Style

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **Width** | Length | `100%` | Component width |
| **Background Color** | Color | `#ffffff` | Background color |
| **Border Color** | Color | `#e0e0e0` | Border color |
| **Border Radius** | Length | `8px` | Border radius |
| **Text Color** | Color | `#333333` | Text color |
| **Primary Color** | Color | `#007aff` | Color for selections and highlights |
| **Font Size** | Length | `14px` | Font size |
| **Input Height** | Length | `44px` | Height of input field (dropdown mode) |

## 💡 Usage Examples

### Basic Date Picker

```javascript
// Properties
mode: 'date'
dateFormat: 'dd/MM/yyyy'
placeholder: 'Select a date'

// Workflow: On Change
// Save to variable
selectedDate = event.value
```

### Time Picker with 30-Min Intervals

```javascript
// Properties
mode: 'time'
timeFormat: '12h'
timeInterval: 30
placeholder: 'Select time'
```

### Date Range with Constraints

```javascript
// Properties
mode: 'date'
minDate: '2024-01-01T00:00:00Z'
maxDate: '2024-12-31T23:59:59Z'
showTodayButton: true
```

### Inline Calendar (Always Visible)

```javascript
// Properties
inline: true
mode: 'date'
width: '350px'
```

### Complete Date + Time Selection

```javascript
// Properties
mode: 'datetime'
dateFormat: 'dd MMM yyyy'
timeFormat: '24h'
timeInterval: 15
showClearButton: true
showTodayButton: true
```

## 🔧 Build for Production

```powershell
# Build the component
npm run build

# Check for any build errors before deploying
```

The built component will be in the `dist` folder and ready for deployment.

## 📝 Implementation Notes

### Date Format Options

- `dd/MM/yyyy` → 15/03/2024
- `MM/dd/yyyy` → 03/15/2024
- `yyyy-MM-dd` → 2024-03-15
- `dd MMM yyyy` → 15 Mar 2024
- `MMMM dd, yyyy` → March 15, 2024

### Time Intervals

Choose an interval that divides evenly into 60 minutes for best UX:
- `15` minutes → 00:00, 00:15, 00:30, 00:45
- `30` minutes → 00:00, 00:30
- `10` minutes → 00:00, 00:10, 00:20, 00:30...

### Internal Variables Access

In WeWeb workflows, you can access:

```javascript
// Get the ISO date string
dateTimePicker.value

// Get the formatted display value
dateTimePicker.formattedValue

// Get the timestamp for calculations
dateTimePicker.timestamp

// Check if picker is open
dateTimePicker.isOpen
```

### Event Data Structure

The `change` event provides comprehensive data:

```javascript
{
  value: "2024-03-15T14:30:00.000Z",     // ISO string
  formattedDate: "15/03/2024",           // Based on dateFormat
  formattedTime: "14:30",                // Based on timeFormat
  timestamp: 1710512400000               // Unix timestamp (ms)
}
```

## 🎨 Customization Tips

### Match Your Brand Colors

```javascript
primaryColor: '#your-brand-color'
backgroundColor: '#ffffff'
borderColor: '#e0e0e0'
textColor: '#333333'
```

### Responsive Sizing

```javascript
// Mobile-friendly
width: '100%'
inputHeight: '48px'
fontSize: '16px'  // Prevents zoom on iOS

// Desktop
width: '350px'
inputHeight: '44px'
fontSize: '14px'
```

### Dark Mode Support

```javascript
backgroundColor: '#1a1a1a'
borderColor: '#3a3a3a'
textColor: '#ffffff'
primaryColor: '#0a84ff'
```

## 🐛 Troubleshooting

### Picker Not Opening
- Check that `disabled` property is `false`
- Verify the component is not overlapped by other elements
- Ensure z-index is appropriate for your layout

### Date Not Updating
- Verify `initialValue` is a valid ISO date string
- Check browser console for date parsing errors
- Ensure date is within `minDate` and `maxDate` constraints

### Time Intervals Not Showing Correctly
- Use intervals that divide evenly into 60 (1, 5, 10, 15, 30)
- Check `timeInterval` is between 1 and 60

### Styling Issues
- Check CSS variable values are valid
- Verify color values are in hex format (#000000)
- Ensure length values include units (px, %, rem, etc.)

## 📦 Dependencies

- **@weweb/cli**: Latest (development)
- **date-fns**: ^3.0.0 (production)
- **Vue 3**: Provided by WeWeb

## 🔄 Version History

### v1.0.0 (Initial Release)
- Date picker with calendar view
- Time picker with configurable intervals
- Multiple display modes (date, time, datetime)
- Customizable formats and styling
- Min/max date constraints
- Internal variables and trigger events
- Inline and dropdown modes
- Quick action buttons (Today, Clear)
- Fully reactive with real-time updates

## 📄 License

MIT

## 🤝 Support

For issues, questions, or feature requests, please contact the development team.

---

**Made with ❤️ for WeWeb**
