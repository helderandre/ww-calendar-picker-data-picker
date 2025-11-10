export default {
  editor: {
    label: {
      en: 'Date Time Picker',
    },
    icon: 'lucide/calendar',
  },
  properties: {
    // ========== INITIAL VALUE ==========
    initialValue: {
      label: { en: 'Initial Value' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'ISO date string (e.g., "2024-03-15T14:30:00")',
      },
      propertyHelp: {
        en: 'Initial date and time value in ISO format. Leave empty for current date/time.',
      },
      /* wwEditor:end */
    },

    // ========== INITIAL START VALUE (Range Mode) ==========
    initialStartValue: {
      label: { en: 'Initial Start Value' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'ISO date string for start date/time (e.g., "2024-03-15T09:00:00")',
      },
      propertyHelp: {
        en: 'Initial start date and time value in ISO format for range mode.',
      },
      /* wwEditor:end */
    },

    // ========== INITIAL END VALUE (Range Mode) ==========
    initialEndValue: {
      label: { en: 'Initial End Value' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'ISO date string for end date/time (e.g., "2024-03-15T17:00:00")',
      },
      propertyHelp: {
        en: 'Initial end date and time value in ISO format for range mode.',
      },
      /* wwEditor:end */
    },

    // ========== DISPLAY MODE ==========
    mode: {
      label: { en: 'Mode' },
      type: 'TextSelect',
      section: 'settings',
      options: {
        options: [
          { value: 'datetime', label: 'Date + Time' },
          { value: 'date', label: 'Date Only' },
          { value: 'time', label: 'Time Only' },
        ],
      },
      defaultValue: 'datetime',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Valid values: datetime | date | time',
      },
      propertyHelp: {
        en: 'Choose whether to show date picker, time picker, or both.',
      },
      /* wwEditor:end */
    },

    // ========== RANGE MODE ==========
    rangeMode: {
      label: { en: 'Range Selection' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: false,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Enable date/time range selection',
      },
      propertyHelp: {
        en: 'Enable to allow selection of a start and end date/time range.',
      },
      /* wwEditor:end */
    },

    // ========== DATE FORMAT ==========
    dateFormat: {
      label: { en: 'Date Format' },
      type: 'TextSelect',
      section: 'settings',
      options: {
        options: [
          { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY (15/03/2024)' },
          { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY (03/15/2024)' },
          { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD (2024-03-15)' },
          { value: 'dd MMM yyyy', label: 'DD MMM YYYY (15 Mar 2024)' },
          { value: 'MMMM dd, yyyy', label: 'MMMM DD, YYYY (March 15, 2024)' },
        ],
      },
      defaultValue: 'dd/MM/yyyy',
      bindable: true,
      hidden: content => content?.mode === 'time',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'date-fns format string',
      },
      propertyHelp: {
        en: 'Format for displaying the selected date.',
      },
      /* wwEditor:end */
    },

    // ========== TIME FORMAT ==========
    timeFormat: {
      label: { en: 'Time Format' },
      type: 'TextSelect',
      section: 'settings',
      options: {
        options: [
          { value: '24h', label: '24 Hour (14:30)' },
          { value: '12h', label: '12 Hour (2:30 PM)' },
        ],
      },
      defaultValue: '24h',
      bindable: true,
      hidden: content => content?.mode === 'date',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Valid values: 24h | 12h',
      },
      propertyHelp: {
        en: 'Choose between 24-hour or 12-hour time format.',
      },
      /* wwEditor:end */
    },

    // ========== TIME INTERVAL ==========
    timeInterval: {
      label: { en: 'Time Interval (minutes)' },
      type: 'Number',
      section: 'settings',
      min: 1,
      max: 60,
      step: 1,
      defaultValue: 15,
      bindable: true,
      hidden: content => content?.mode === 'date',
      /* wwEditor:start */
      bindingValidation: {
        type: 'number',
        tooltip: 'Minutes between time options (1-60)',
      },
      propertyHelp: {
        en: 'Interval in minutes between time options (e.g., 15 = 00:00, 00:15, 00:30...).',
      },
      /* wwEditor:end */
    },

    // ========== START TIME ==========
    startTime: {
      label: { en: 'Start Time' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '00:00',
      hidden: content => content?.mode === 'date',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Time in HH:mm format (e.g., "09:00")',
      },
      propertyHelp: {
        en: 'Earliest time available in the time picker (format: HH:mm, e.g., "09:00").',
      },
      /* wwEditor:end */
    },

    // ========== END TIME ==========
    endTime: {
      label: { en: 'End Time' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '23:59',
      hidden: content => content?.mode === 'date',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Time in HH:mm format (e.g., "18:00")',
      },
      propertyHelp: {
        en: 'Latest time available in the time picker (format: HH:mm, e.g., "18:00").',
      },
      /* wwEditor:end */
    },

    // ========== MIN DATE ==========
    minDate: {
      label: { en: 'Minimum Date' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '',
      hidden: content => content?.mode === 'time',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'ISO date string or empty for no minimum',
      },
      propertyHelp: {
        en: 'Minimum selectable date. Dates before this will be disabled.',
      },
      /* wwEditor:end */
    },

    // ========== MAX DATE ==========
    maxDate: {
      label: { en: 'Maximum Date' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '',
      hidden: content => content?.mode === 'time',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'ISO date string or empty for no maximum',
      },
      propertyHelp: {
        en: 'Maximum selectable date. Dates after this will be disabled.',
      },
      /* wwEditor:end */
    },

    // ========== FIRST DAY OF WEEK ==========
    firstDayOfWeek: {
      label: { en: 'First Day of Week' },
      type: 'TextSelect',
      section: 'settings',
      options: {
        options: [
          { value: '0', label: 'Sunday' },
          { value: '1', label: 'Monday' },
          { value: '6', label: 'Saturday' },
        ],
      },
      defaultValue: '0',
      bindable: true,
      hidden: content => content?.mode === 'time',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Valid values: 0 (Sunday) | 1 (Monday) | 6 (Saturday)',
      },
      propertyHelp: {
        en: 'Choose which day the calendar week starts on.',
      },
      /* wwEditor:end */
    },

    // ========== LOCALE ==========
    locale: {
      label: { en: 'Language / Locale' },
      type: 'TextSelect',
      section: 'settings',
      options: {
        options: [
          { value: 'en-US', label: 'English (US)' },
          { value: 'en-GB', label: 'English (UK)' },
          { value: 'pt-BR', label: 'Português (Brasil)' },
          { value: 'pt-PT', label: 'Português (Portugal)' },
          { value: 'es-ES', label: 'Español (España)' },
          { value: 'es-MX', label: 'Español (México)' },
          { value: 'fr-FR', label: 'Français' },
          { value: 'de-DE', label: 'Deutsch' },
          { value: 'it-IT', label: 'Italiano' },
          { value: 'nl-NL', label: 'Nederlands' },
          { value: 'ru-RU', label: 'Русский' },
          { value: 'ja-JP', label: '日本語' },
          { value: 'zh-CN', label: '简体中文' },
          { value: 'ko-KR', label: '한국어' },
          { value: 'ar-SA', label: 'العربية' },
        ],
      },
      defaultValue: 'en-US',
      bindable: true,
      hidden: content => content?.mode === 'time',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Language code for date/month names',
      },
      propertyHelp: {
        en: 'Choose the language for displaying month and day names.',
      },
      /* wwEditor:end */
    },

    // ========== CUSTOM LABELS ==========
    labelToday: {
      label: { en: 'Label: Today Button' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Custom text for Today button (auto-translates if empty)',
      },
      propertyHelp: {
        en: 'Custom label for the Today button. Leave empty for automatic translation based on locale.',
      },
      /* wwEditor:end */
    },

    labelStartTime: {
      label: { en: 'Label: Start Time' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '',
      hidden: content => !content?.rangeMode || content?.mode === 'date',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Custom text for Start Time (auto-translates if empty)',
      },
      propertyHelp: {
        en: 'Custom label for the Start Time section. Leave empty for automatic translation.',
      },
      /* wwEditor:end */
    },

    labelEndTime: {
      label: { en: 'Label: End Time' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '',
      hidden: content => !content?.rangeMode || content?.mode === 'date',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Custom text for End Time (auto-translates if empty)',
      },
      propertyHelp: {
        en: 'Custom label for the End Time section. Leave empty for automatic translation.',
      },
      /* wwEditor:end */
    },

    labelSelectTime: {
      label: { en: 'Label: Select Time' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '',
      hidden: content => content?.mode === 'date',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Custom text for Select Time (auto-translates if empty)',
      },
      propertyHelp: {
        en: 'Custom label for the Select Time section. Leave empty for automatic translation.',
      },
      /* wwEditor:end */
    },

    labelNotSelected: {
      label: { en: 'Label: Not Selected' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '',
      hidden: content => !content?.rangeMode || content?.mode === 'date',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Custom text for Not Selected state (auto-translates if empty)',
      },
      propertyHelp: {
        en: 'Custom label shown when no time is selected. Leave empty for automatic translation.',
      },
      /* wwEditor:end */
    },

    labelConfirm: {
      label: { en: 'Label: Confirm Button' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '',
      hidden: content => !content?.showConfirmButtons,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Custom text for Confirm button (auto-translates if empty)',
      },
      propertyHelp: {
        en: 'Custom label for the Confirm button. Leave empty for automatic translation.',
      },
      /* wwEditor:end */
    },

    labelCancel: {
      label: { en: 'Label: Cancel Button' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '',
      hidden: content => !content?.showConfirmButtons,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Custom text for Cancel button (auto-translates if empty)',
      },
      propertyHelp: {
        en: 'Custom label for the Cancel button. Leave empty for automatic translation.',
      },
      /* wwEditor:end */
    },

    // ========== SHOW CONFIRM BUTTONS ==========
    showConfirmButtons: {
      label: { en: 'Show Confirm/Cancel Buttons' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: false,
      bindable: true,
      hidden: content => content?.inline,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Show Confirm and Cancel buttons at the bottom',
      },
      propertyHelp: {
        en: 'When enabled, shows Confirm and Cancel buttons at the bottom of the picker. Selection is only applied when Confirm is clicked.',
      },
      /* wwEditor:end */
    },

    // ========== PLACEHOLDER ==========
    placeholder: {
      label: { en: 'Placeholder' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: 'Select date and time',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Placeholder text when no value is selected',
      },
      /* wwEditor:end */
    },

    // ========== RANGE SEPARATOR ==========
    rangeSeparator: {
      label: { en: 'Range Separator' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: ' - ',
      hidden: content => !content?.rangeMode,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Text to separate start and end dates',
      },
      propertyHelp: {
        en: 'Text used to separate the start and end dates in range mode (e.g., " - " or " to ").',
      },
      /* wwEditor:end */
    },

    // ========== DISABLED ==========
    disabled: {
      label: { en: 'Disabled' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: false,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Disable the picker',
      },
      /* wwEditor:end */
    },

    // ========== REQUIRED ==========
    required: {
      label: { en: 'Required' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: false,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Mark field as required',
      },
      /* wwEditor:end */
    },

    // ========== SHOW CLEAR BUTTON ==========
    showClearButton: {
      label: { en: 'Show Clear Button' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: true,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Show button to clear selected value',
      },
      /* wwEditor:end */
    },

    // ========== SHOW TODAY BUTTON ==========
    showTodayButton: {
      label: { en: 'Show Today Button' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: true,
      bindable: true,
      hidden: content => content?.mode === 'time',
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Show button to quickly select today',
      },
      /* wwEditor:end */
    },

    // ========== INLINE ==========
    inline: {
      label: { en: 'Always Visible (Inline)' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: false,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Always show picker instead of dropdown',
      },
      propertyHelp: {
        en: 'When enabled, the picker is always visible instead of opening in a dropdown.',
      },
      /* wwEditor:end */
    },

    // ========== SHOW DROPZONE ==========
    showDropzone: {
      label: { en: 'Show Custom Dropzone' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: false,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Show custom dropzone area at the bottom of the picker',
      },
      propertyHelp: {
        en: 'When enabled, shows a custom dropzone area at the bottom of the picker where you can add custom content.',
      },
      /* wwEditor:end */
    },

    // ========== MOBILE FULLSCREEN ==========
    mobileFullscreen: {
      label: { en: 'Mobile Fullscreen Mode' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: true,
      bindable: true,
      hidden: content => content?.inline,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Open dropdown in fullscreen mode on mobile devices',
      },
      propertyHelp: {
        en: 'When enabled, the picker opens in fullscreen mode on mobile devices (tablets and phones) for better usability.',
      },
      /* wwEditor:end */
    },

    // ========== STYLING - LAYOUT ==========
    width: {
      label: { en: 'Component Width' },
      type: 'Length',
      section: 'style',
      defaultValue: '100%',
      bindable: true,
      /* wwEditor:start */
      propertyHelp: {
        en: 'Width of the entire component wrapper.',
      },
      /* wwEditor:end */
    },

    inputWidth: {
      label: { en: 'Input Width' },
      type: 'Length',
      section: 'style',
      defaultValue: '100%',
      bindable: true,
      hidden: content => content?.inline,
      /* wwEditor:start */
      propertyHelp: {
        en: 'Width of the input field relative to the component width.',
      },
      /* wwEditor:end */
    },

    dropdownWidth: {
      label: { en: 'Dropdown Width' },
      type: 'Length',
      section: 'style',
      defaultValue: '320px',
      bindable: true,
      hidden: content => content?.inline,
      /* wwEditor:start */
      propertyHelp: {
        en: 'Width of the dropdown/picker container.',
      },
      /* wwEditor:end */
    },

    padding: {
      label: { en: 'Padding' },
      type: 'Length',
      section: 'style',
      defaultValue: '12px',
      bindable: true,
    },

    margin: {
      label: { en: 'Margin' },
      type: 'Length',
      section: 'style',
      defaultValue: '0px',
      bindable: true,
    },

    // ========== STYLING - COLORS ==========
    backgroundColor: {
      label: { en: 'Background Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#ffffff',
      bindable: true,
    },

    textColor: {
      label: { en: 'Text Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#333333',
      bindable: true,
    },

    primaryColor: {
      label: { en: 'Primary Color (Selected)' },
      type: 'Color',
      section: 'style',
      defaultValue: '#007aff',
      bindable: true,
      /* wwEditor:start */
      propertyHelp: {
        en: 'Color used for selected dates and active states.',
      },
      /* wwEditor:end */
    },

    hoverColor: {
      label: { en: 'Hover Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#f0f0f0',
      bindable: true,
    },

    rangeColor: {
      label: { en: 'Range Background Color' },
      type: 'Color',
      section: 'style',
      defaultValue: 'rgba(0, 122, 255, 0.2)',
      bindable: true,
      /* wwEditor:start */
      propertyHelp: {
        en: 'Background color for dates between start and end in range mode.',
      },
      /* wwEditor:end */
    },

    disabledColor: {
      label: { en: 'Disabled Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#cccccc',
      bindable: true,
    },

    // ========== STYLING - BORDERS ==========
    borderWidth: {
      label: { en: 'Border Width' },
      type: 'Length',
      section: 'style',
      defaultValue: '1px',
      bindable: true,
    },

    borderColor: {
      label: { en: 'Border Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#e0e0e0',
      bindable: true,
    },

    borderRadius: {
      label: { en: 'Border Radius' },
      type: 'Length',
      section: 'style',
      defaultValue: '8px',
      bindable: true,
    },

    // ========== STYLING - FOCUS STATE ==========
    focusBorderColor: {
      label: { en: 'Focus Border Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#007aff',
      bindable: true,
    },

    focusBorderWidth: {
      label: { en: 'Focus Border Width' },
      type: 'Length',
      section: 'style',
      defaultValue: '2px',
      bindable: true,
    },

    focusShadow: {
      label: { en: 'Focus Shadow' },
      type: 'Text',
      section: 'style',
      defaultValue: '0 0 0 3px rgba(0, 122, 255, 0.2)',
      bindable: true,
      /* wwEditor:start */
      propertyHelp: {
        en: 'CSS box-shadow for focus state (e.g., "0 0 0 3px rgba(0, 122, 255, 0.2)")',
      },
      /* wwEditor:end */
    },

    // ========== STYLING - SHADOWS ==========
    boxShadow: {
      label: { en: 'Box Shadow' },
      type: 'Text',
      section: 'style',
      defaultValue: '0 2px 8px rgba(0, 0, 0, 0.1)',
      bindable: true,
      /* wwEditor:start */
      propertyHelp: {
        en: 'CSS box-shadow for the picker dropdown (e.g., "0 2px 8px rgba(0, 0, 0, 0.1)")',
      },
      /* wwEditor:end */
    },

    inputShadow: {
      label: { en: 'Input Shadow' },
      type: 'Text',
      section: 'style',
      defaultValue: 'none',
      bindable: true,
      /* wwEditor:start */
      propertyHelp: {
        en: 'CSS box-shadow for the input field',
      },
      /* wwEditor:end */
    },

    // ========== STYLING - TYPOGRAPHY ==========
    fontSize: {
      label: { en: 'Font Size' },
      type: 'Length',
      section: 'style',
      defaultValue: '14px',
      bindable: true,
    },

    fontFamily: {
      label: { en: 'Font Family' },
      type: 'Text',
      section: 'style',
      defaultValue: 'inherit',
      bindable: true,
    },

    // ========== STYLING - INPUT SPECIFIC ==========
    inputHeight: {
      label: { en: 'Input Height' },
      type: 'Length',
      section: 'style',
      defaultValue: '44px',
      bindable: true,
      hidden: content => content?.inline,
    },

    inputBackgroundColor: {
      label: { en: 'Input Background Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#ffffff',
      bindable: true,
      hidden: content => content?.inline,
    },

    customDropzone: {
      hidden: true,
      defaultValue: [],
      navigator: {
        group: 'Custom Dropzone',
      },
    },
  },

  // ========== TRIGGERS ==========
  triggerEvents: [
    {
      name: 'change',
      label: { en: 'On Change' },
      event: {
        value: '',
        formattedDate: '',
        formattedTime: '',
        timestamp: 0,
      },
      /* wwEditor:start */
      propertyHelp: {
        en: 'Triggered when the date/time value changes.',
      },
      /* wwEditor:end */
    },
    {
      name: 'clear',
      label: { en: 'On Clear' },
      event: {},
      /* wwEditor:start */
      propertyHelp: {
        en: 'Triggered when the clear button is clicked.',
      },
      /* wwEditor:end */
    },
    {
      name: 'open',
      label: { en: 'On Open' },
      event: {},
      /* wwEditor:start */
      propertyHelp: {
        en: 'Triggered when the picker dropdown is opened.',
      },
      /* wwEditor:end */
    },
    {
      name: 'close',
      label: { en: 'On Close' },
      event: {},
      /* wwEditor:start */
      propertyHelp: {
        en: 'Triggered when the picker dropdown is closed.',
      },
      /* wwEditor:end */
    },
    {
      name: 'confirm',
      label: { en: 'On Confirm' },
      event: {},
      /* wwEditor:start */
      propertyHelp: {
        en: 'Triggered when the confirm button is clicked.',
      },
      /* wwEditor:end */
    },
    {
      name: 'cancel',
      label: { en: 'On Cancel' },
      event: {},
      /* wwEditor:start */
      propertyHelp: {
        en: 'Triggered when the cancel button is clicked.',
      },
      /* wwEditor:end */
    },
  ],

  // ========== ACTIONS ==========
  actions: [
    {
      label: { en: 'Clear Selection' },
      action: 'clearValue',
      /* wwEditor:start */
      propertyHelp: {
        en: 'Clears all selected dates and times.',
      },
      /* wwEditor:end */
    },
    {
      label: { en: 'Confirm Selection' },
      action: 'confirm',
      /* wwEditor:start */
      propertyHelp: {
        en: 'Confirms the current selection and closes the picker.',
      },
      /* wwEditor:end */
    },
    {
      label: { en: 'Cancel Selection' },
      action: 'cancel',
      /* wwEditor:start */
      propertyHelp: {
        en: 'Cancels pending changes and closes the picker.',
      },
      /* wwEditor:end */
    },
    {
      label: { en: 'Open Picker' },
      action: 'open',
      /* wwEditor:start */
      propertyHelp: {
        en: 'Opens the date/time picker dropdown.',
      },
      /* wwEditor:end */
    },
    {
      label: { en: 'Close Picker' },
      action: 'close',
      /* wwEditor:start */
      propertyHelp: {
        en: 'Closes the date/time picker dropdown.',
      },
      /* wwEditor:end */
    },
  ],
}
