<template>
  <div class="datetime-picker-wrapper" :style="wrapperStyle">
    <!-- Input Field (Hidden when inline) -->
    <div v-if="!content?.inline" class="datetime-input" :style="inputStyle" @click="togglePicker">
      <div class="input-content">
        <span v-if="formattedValue" class="value-text">{{ formattedValue }}</span>
        <span v-else class="placeholder-text">{{ content?.placeholder || 'Select date and time' }}</span>
      </div>
      <div class="input-actions">
        <button
          v-if="content?.showClearButton && (content?.rangeMode ? (startValue || endValue) : selectedValue)"
          class="clear-button"
          @click.stop="clearValue"
          :disabled="content?.disabled"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <div class="calendar-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Picker Dropdown/Inline -->
    <div v-if="isPickerOpen || content?.inline" class="picker-container" :class="{ 'inline': content?.inline, 'mobile-fullscreen': content?.mobileFullscreen !== false }" :style="pickerStyle">
      <!-- Date Picker -->
      <div v-if="content?.mode !== 'time'" class="date-picker">
        <!-- Month Navigation -->
        <div class="month-header">
          <button class="nav-button" @click="previousMonth" type="button" :disabled="content?.disabled">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class="month-display">
            {{ currentMonthDisplay }}
          </div>
          <button class="nav-button" @click="nextMonth" type="button" :disabled="content?.disabled">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- Weekday Headers -->
        <div class="weekday-headers">
          <div v-for="day in weekdayLabels" :key="day" class="weekday-label">
            {{ day }}
          </div>
        </div>

        <!-- Calendar Grid -->
        <div class="calendar-grid">
          <button
            v-for="(day, index) in calendarDays"
            :key="index"
            class="calendar-day"
            :class="{
              'other-month': day.isOtherMonth,
              'today': day.isToday,
              'selected': day.isSelected,
              'range-start': day.isRangeStart,
              'range-end': day.isRangeEnd,
              'in-range': day.isInRange,
              'disabled': day.isDisabled
            }"
            @click="selectDate(day)"
            @mouseenter="hoveredDate = day.fullDate"
            @mouseleave="hoveredDate = null"
            :disabled="day.isDisabled || content?.disabled"
            type="button"
          >
            {{ day.date }}
          </button>
        </div>

        <!-- Today Button -->
        <div v-if="content?.showTodayButton" class="picker-actions">
          <button class="action-button" @click="selectToday" type="button" :disabled="content?.disabled">
            {{ getTranslation('today') }}
          </button>
        </div>
      </div>

      <!-- Time Picker -->
      <div v-if="content?.mode !== 'date'" class="time-picker">
        <!-- Range Mode: Accordion for Start and End Times -->
        <div v-if="content?.rangeMode" class="time-accordion">
          <!-- Start Time Section -->
          <div class="accordion-section" :class="{ 'active': accordionOpen === 'start' }">
            <button 
              class="accordion-header"
              @click="toggleAccordion('start')"
              type="button"
              :disabled="content?.disabled"
            >
              <div class="accordion-title">
                <span class="accordion-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </span>
                <span>{{ getTranslation('startTime') }}</span>
              </div>
              <div class="accordion-value">
                {{ getFormattedStartTime() || getTranslation('notSelected') }}
              </div>
              <div class="accordion-arrow" :class="{ 'open': accordionOpen === 'start' }">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </button>
            <div class="accordion-content" v-show="accordionOpen === 'start'">
              <div class="time-scroll-container">
                <button
                  v-for="time in getStartTimeOptions()"
                  :key="time.value"
                  class="time-option"
                  :class="{ 'selected': time.isSelected }"
                  @click="selectTime(time, 'start')"
                  :disabled="content?.disabled"
                  type="button"
                >
                  {{ time.label }}
                </button>
              </div>
            </div>
          </div>

          <!-- End Time Section -->
          <div class="accordion-section" :class="{ 'active': accordionOpen === 'end', 'disabled': !tempStartDate && !startValue }">
            <button 
              class="accordion-header"
              @click="toggleAccordion('end')"
              type="button"
              :disabled="content?.disabled || (!tempStartDate && !startValue)"
            >
              <div class="accordion-title">
                <span class="accordion-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </span>
                <span>{{ getTranslation('endTime') }}</span>
              </div>
              <div class="accordion-value">
                {{ getFormattedEndTime() || getTranslation('notSelected') }}
              </div>
              <div class="accordion-arrow" :class="{ 'open': accordionOpen === 'end' }">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </button>
            <div class="accordion-content" v-show="accordionOpen === 'end'">
              <div class="time-scroll-container">
                <button
                  v-for="time in getEndTimeOptions()"
                  :key="time.value"
                  class="time-option"
                  :class="{ 'selected': time.isSelected }"
                  @click="selectTime(time, 'end')"
                  :disabled="content?.disabled"
                  type="button"
                >
                  {{ time.label }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Single Mode: Regular Time Picker -->
        <div v-else>
          <div class="time-label">{{ getTranslation('selectTime') }}</div>
          <div class="time-scroll-container">
            <button
              v-for="time in timeOptions"
              :key="time.value"
              class="time-option"
              :class="{ 'selected': time.isSelected }"
              @click="selectTime(time)"
              :disabled="content?.disabled"
              type="button"
            >
              {{ time.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Confirm/Cancel Buttons -->
      <div v-if="content?.showConfirmButtons" class="confirm-actions">
        <button class="cancel-action-button" @click="cancelSelection" type="button" :disabled="content?.disabled">
          {{ getTranslation('cancel') }}
        </button>
        <button class="confirm-action-button" @click="confirmSelection" type="button" :disabled="content?.disabled">
          {{ getTranslation('confirm') }}
        </button>
      </div>

      <!-- Custom Dropzone -->
      <div v-if="content?.showDropzone" class="custom-dropzone">
        <wwLayout path="customDropzone" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { format, parse, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore, isAfter, startOfWeek, endOfWeek } from 'date-fns'
import { enUS, enGB, ptBR, pt, es, fr, de, it, nl, ru, ja, zhCN, ko, arSA } from 'date-fns/locale'

export default {
  props: {
    uid: { type: String, required: true },
    content: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['trigger-event', 'update:content'],
  setup(props, { emit }) {
    // ========== INTERNAL VARIABLES ==========
    const { value: selectedValue, setValue: setSelectedValue } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'value',
      type: 'string',
      defaultValue: '',
    })

    const { value: formattedValueVar, setValue: setFormattedValue } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'formattedValue',
      type: 'string',
      defaultValue: '',
    })

    const { value: timestampVar, setValue: setTimestamp } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'timestamp',
      type: 'number',
      defaultValue: 0,
    })

    const { value: isOpenVar, setValue: setIsOpen } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'isOpen',
      type: 'boolean',
      defaultValue: false,
    })

    // Range mode variables
    const { value: startValue, setValue: setStartValue } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'startValue',
      type: 'string',
      defaultValue: '',
    })

    const { value: endValue, setValue: setEndValue } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'endValue',
      type: 'string',
      defaultValue: '',
    })

    const { value: startTimestamp, setValue: setStartTimestamp } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'startTimestamp',
      type: 'number',
      defaultValue: 0,
    })

    const { value: endTimestamp, setValue: setEndTimestamp } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'endTimestamp',
      type: 'number',
      defaultValue: 0,
    })

    // ========== REACTIVE STATE ==========
    const isPickerOpen = ref(false)
    const currentMonth = ref(new Date())
    const pickerRef = ref(null)
    const rangeSelectionStep = ref('start') // 'start' or 'end'
    const tempStartDate = ref(null)
    const tempEndDate = ref(null)
    const hoveredDate = ref(null)
    const accordionOpen = ref('start') // 'start' or 'end' - controls which accordion is open
    
    // Store original values for cancel action
    const originalSelectedValue = ref('')
    const originalStartValue = ref('')
    const originalEndValue = ref('')

    // ========== COMPUTED PROPERTIES ==========
    const getLocale = computed(() => {
      const localeCode = props.content?.locale || 'en-US'
      
      const localeMap = {
        'en-US': enUS,
        'en-GB': enGB,
        'pt-BR': ptBR,
        'pt-PT': pt,
        'es-ES': es,
        'es-MX': es,
        'fr-FR': fr,
        'de-DE': de,
        'it-IT': it,
        'nl-NL': nl,
        'ru-RU': ru,
        'ja-JP': ja,
        'zh-CN': zhCN,
        'ko-KR': ko,
        'ar-SA': arSA,
      }
      
      return localeMap[localeCode] || enUS
    })

    const translations = computed(() => {
      const localeCode = props.content?.locale || 'en-US'
      
      const translationMap = {
        'en-US': {
          today: 'Today',
          startTime: 'Start Time',
          endTime: 'End Time',
          selectTime: 'Select Time',
          selectStartTime: 'Select Start Time',
          selectEndTime: 'Select End Time',
          notSelected: 'Not selected',
          confirm: 'Confirm',
          cancel: 'Cancel',
        },
        'en-GB': {
          today: 'Today',
          startTime: 'Start Time',
          endTime: 'End Time',
          selectTime: 'Select Time',
          selectStartTime: 'Select Start Time',
          selectEndTime: 'Select End Time',
          notSelected: 'Not selected',
          confirm: 'Confirm',
          cancel: 'Cancel',
        },
        'pt-BR': {
          today: 'Hoje',
          startTime: 'Horário Inicial',
          endTime: 'Horário Final',
          selectTime: 'Selecionar Horário',
          selectStartTime: 'Selecionar Horário Inicial',
          selectEndTime: 'Selecionar Horário Final',
          notSelected: 'Não selecionado',
          confirm: 'Confirmar',
          cancel: 'Cancelar',
        },
        'pt-PT': {
          today: 'Hoje',
          startTime: 'Hora Inicial',
          endTime: 'Hora Final',
          selectTime: 'Selecionar Hora',
          selectStartTime: 'Selecionar Hora Inicial',
          selectEndTime: 'Selecionar Hora Final',
          notSelected: 'Não selecionado',
          confirm: 'Confirmar',
          cancel: 'Cancelar',
        },
        'es-ES': {
          today: 'Hoy',
          startTime: 'Hora Inicial',
          endTime: 'Hora Final',
          selectTime: 'Seleccionar Hora',
          selectStartTime: 'Seleccionar Hora Inicial',
          selectEndTime: 'Seleccionar Hora Final',
          notSelected: 'No seleccionado',
          confirm: 'Confirmar',
          cancel: 'Cancelar',
        },
        'es-MX': {
          today: 'Hoy',
          startTime: 'Hora Inicial',
          endTime: 'Hora Final',
          selectTime: 'Seleccionar Hora',
          selectStartTime: 'Seleccionar Hora Inicial',
          selectEndTime: 'Seleccionar Hora Final',
          notSelected: 'No seleccionado',
          confirm: 'Confirmar',
          cancel: 'Cancelar',
        },
        'fr-FR': {
          today: "Aujourd'hui",
          startTime: 'Heure de Début',
          endTime: 'Heure de Fin',
          selectTime: "Sélectionner l'Heure",
          selectStartTime: 'Sélectionner Heure de Début',
          selectEndTime: 'Sélectionner Heure de Fin',
          notSelected: 'Non sélectionné',
          confirm: 'Confirmer',
          cancel: 'Annuler',
        },
        'de-DE': {
          today: 'Heute',
          startTime: 'Startzeit',
          endTime: 'Endzeit',
          selectTime: 'Zeit Auswählen',
          selectStartTime: 'Startzeit Auswählen',
          selectEndTime: 'Endzeit Auswählen',
          notSelected: 'Nicht ausgewählt',
          confirm: 'Bestätigen',
          cancel: 'Abbrechen',
        },
        'it-IT': {
          today: 'Oggi',
          startTime: 'Ora Inizio',
          endTime: 'Ora Fine',
          selectTime: "Seleziona l'Ora",
          selectStartTime: "Seleziona Ora Inizio",
          selectEndTime: "Seleziona Ora Fine",
          notSelected: 'Non selezionato',
          confirm: 'Conferma',
          cancel: 'Annulla',
        },
        'nl-NL': {
          today: 'Vandaag',
          startTime: 'Starttijd',
          endTime: 'Eindtijd',
          selectTime: 'Selecteer Tijd',
          selectStartTime: 'Selecteer Starttijd',
          selectEndTime: 'Selecteer Eindtijd',
          notSelected: 'Niet geselecteerd',
          confirm: 'Bevestigen',
          cancel: 'Annuleren',
        },
        'ru-RU': {
          today: 'Сегодня',
          startTime: 'Начало',
          endTime: 'Конец',
          selectTime: 'Выбрать Время',
          selectStartTime: 'Выбрать Время Начала',
          selectEndTime: 'Выбрать Время Окончания',
          notSelected: 'Не выбрано',
          confirm: 'Подтвердить',
          cancel: 'Отмена',
        },
        'ja-JP': {
          today: '今日',
          startTime: '開始時刻',
          endTime: '終了時刻',
          selectTime: '時刻を選択',
          selectStartTime: '開始時刻を選択',
          selectEndTime: '終了時刻を選択',
          notSelected: '未選択',
          confirm: '確認',
          cancel: 'キャンセル',
        },
        'zh-CN': {
          today: '今天',
          startTime: '开始时间',
          endTime: '结束时间',
          selectTime: '选择时间',
          selectStartTime: '选择开始时间',
          selectEndTime: '选择结束时间',
          notSelected: '未选择',
          confirm: '确认',
          cancel: '取消',
        },
        'ko-KR': {
          today: '오늘',
          startTime: '시작 시간',
          endTime: '종료 시간',
          selectTime: '시간 선택',
          selectStartTime: '시작 시간 선택',
          selectEndTime: '종료 시간 선택',
          notSelected: '선택 안 됨',
          confirm: '확인',
          cancel: '취소',
        },
        'ar-SA': {
          today: 'اليوم',
          startTime: 'وقت البدء',
          endTime: 'وقت الانتهاء',
          selectTime: 'اختر الوقت',
          selectStartTime: 'اختر وقت البدء',
          selectEndTime: 'اختر وقت الانتهاء',
          notSelected: 'غير محدد',
          confirm: 'تأكيد',
          cancel: 'إلغاء',
        },
      }
      
      return translationMap[localeCode] || translationMap['en-US']
    })

    const getTranslation = (key) => {
      // Check for custom label first
      const customLabels = {
        today: props.content?.labelToday,
        startTime: props.content?.labelStartTime,
        endTime: props.content?.labelEndTime,
        selectTime: props.content?.labelSelectTime,
        notSelected: props.content?.labelNotSelected,
        confirm: props.content?.labelConfirm,
        cancel: props.content?.labelCancel,
      }
      
      if (customLabels[key]) {
        return customLabels[key]
      }
      
      // Fall back to automatic translation
      return translations.value[key] || key
    }

    const wrapperStyle = computed(() => ({
      '--width': props.content?.width || '100%',
      '--input-width': props.content?.inputWidth || '100%',
      '--dropdown-width': props.content?.dropdownWidth || '320px',
      '--padding': props.content?.padding || '12px',
      '--margin': props.content?.margin || '0px',
      '--bg-color': props.content?.backgroundColor || '#ffffff',
      '--text-color': props.content?.textColor || '#333333',
      '--primary-color': props.content?.primaryColor || '#007aff',
      '--hover-color': props.content?.hoverColor || '#f0f0f0',
      '--range-color': props.content?.rangeColor || 'rgba(0, 122, 255, 0.2)',
      '--disabled-color': props.content?.disabledColor || '#cccccc',
      '--border-width': props.content?.borderWidth || '1px',
      '--border-color': props.content?.borderColor || '#e0e0e0',
      '--border-radius': props.content?.borderRadius || '8px',
      '--border-style': props.content?.borderStyle || 'solid',
      '--focus-border-color': props.content?.focusBorderColor || '#007aff',
      '--focus-border-width': props.content?.focusBorderWidth || '2px',
      '--focus-shadow': props.content?.focusShadow || '0 0 0 3px rgba(0, 122, 255, 0.2)',
      '--box-shadow': props.content?.boxShadow || '0 2px 8px rgba(0, 0, 0, 0.1)',
      '--input-shadow': props.content?.inputShadow || 'none',
      '--font-size': props.content?.fontSize || '14px',
      '--font-weight': props.content?.fontWeight || '400',
      '--font-family': props.content?.fontFamily || 'inherit',
      '--input-height': props.content?.inputHeight || '44px',
      '--input-bg-color': props.content?.inputBackgroundColor || '#ffffff',
    }))

    const inputStyle = computed(() => ({
      cursor: props.content?.disabled ? 'not-allowed' : 'pointer',
      opacity: props.content?.disabled ? 0.6 : 1,
    }))

    const pickerStyle = computed(() => ({
      display: (isPickerOpen.value || props.content?.inline) ? 'block' : 'none',
    }))

    const formattedValue = computed(() => {
      const mode = props.content?.mode || 'datetime'
      const dateFormat = props.content?.dateFormat || 'dd/MM/yyyy'
      const timeFormat = props.content?.timeFormat || '24h'
      const timePattern = timeFormat === '12h' ? 'h:mm a' : 'HH:mm'
      const isRangeMode = props.content?.rangeMode || false
      const separator = props.content?.rangeSeparator || ' - '
      const locale = getLocale.value

      if (isRangeMode) {
        if (!startValue.value || !endValue.value) return ''
        
        try {
          const startDate = new Date(startValue.value)
          const endDate = new Date(endValue.value)
          
          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return ''

          let startFormatted, endFormatted
          
          if (mode === 'date') {
            startFormatted = format(startDate, dateFormat, { locale })
            endFormatted = format(endDate, dateFormat, { locale })
          } else if (mode === 'time') {
            startFormatted = format(startDate, timePattern, { locale })
            endFormatted = format(endDate, timePattern, { locale })
          } else {
            startFormatted = `${format(startDate, dateFormat, { locale })} ${format(startDate, timePattern, { locale })}`
            endFormatted = `${format(endDate, dateFormat, { locale })} ${format(endDate, timePattern, { locale })}`
          }
          
          return `${startFormatted}${separator}${endFormatted}`
        } catch (error) {
          return ''
        }
      } else {
        if (!selectedValue.value) return ''
        
        try {
          const date = new Date(selectedValue.value)
          if (isNaN(date.getTime())) return ''

          if (mode === 'date') {
            return format(date, dateFormat, { locale })
          } else if (mode === 'time') {
            return format(date, timePattern, { locale })
          } else {
            return `${format(date, dateFormat, { locale })} ${format(date, timePattern, { locale })}`
          }
        } catch (error) {
          return ''
        }
      }
    })

    const currentMonthDisplay = computed(() => {
      try {
        return format(currentMonth.value, 'MMMM yyyy', { locale: getLocale.value })
      } catch (error) {
        return ''
      }
    })

    const weekdayLabels = computed(() => {
      const firstDay = parseInt(props.content?.firstDayOfWeek || '0', 10)
      const locale = getLocale.value
      
      // Get localized day names (short format)
      const baseDate = new Date(2024, 0, 7) // Sunday, January 7, 2024
      const days = []
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(baseDate)
        date.setDate(baseDate.getDate() + i)
        // Use 'EEEEEE' for shortest day name (2 letters) or 'EEE' for 3 letters
        const dayName = format(date, 'EEEEEE', { locale })
        days.push(dayName)
      }
      
      return [...days.slice(firstDay), ...days.slice(0, firstDay)]
    })

    const calendarDays = computed(() => {
      const monthStart = startOfMonth(currentMonth.value)
      const monthEnd = endOfMonth(currentMonth.value)
      const firstDay = parseInt(props.content?.firstDayOfWeek || '0', 10)
      
      const calendarStart = startOfWeek(monthStart, { weekStartsOn: firstDay })
      const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: firstDay })
      
      const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
      
      const minDate = props.content?.minDate ? new Date(props.content.minDate) : null
      const maxDate = props.content?.maxDate ? new Date(props.content.maxDate) : null
      const isRangeMode = props.content?.rangeMode || false
      
      let selected = null
      let rangeStart = null
      let rangeEnd = null
      
      if (isRangeMode) {
        rangeStart = tempStartDate.value || (startValue.value ? new Date(startValue.value) : null)
        rangeEnd = tempEndDate.value || (endValue.value ? new Date(endValue.value) : null)
      } else {
        selected = selectedValue.value ? new Date(selectedValue.value) : null
      }

      return days.map(day => {
        let isDisabled = 
          (minDate && isBefore(day, minDate)) || 
          (maxDate && isAfter(day, maxDate))
        
        // In range mode, when selecting end date, disable dates before start date
        if (isRangeMode && rangeSelectionStep.value === 'end' && rangeStart) {
          const dayOnly = new Date(day)
          dayOnly.setHours(0, 0, 0, 0)
          const rangeStartOnly = new Date(rangeStart)
          rangeStartOnly.setHours(0, 0, 0, 0)
          
          if (dayOnly < rangeStartOnly) {
            isDisabled = true
          }
        }
        
        let isInRange = false
        let isRangeStart = false
        let isRangeEnd = false
        
        if (isRangeMode && rangeStart) {
          isRangeStart = isSameDay(day, rangeStart)
          
          if (rangeEnd) {
            isRangeEnd = isSameDay(day, rangeEnd)
            isInRange = !isDisabled && day > rangeStart && day < rangeEnd
          } else if (hoveredDate.value && day > rangeStart) {
            isInRange = !isDisabled && day > rangeStart && day <= hoveredDate.value
          }
        }
        
        return {
          date: day.getDate(),
          fullDate: day,
          isOtherMonth: day.getMonth() !== currentMonth.value.getMonth(),
          isToday: isToday(day),
          isSelected: selected && isSameDay(day, selected),
          isRangeStart,
          isRangeEnd,
          isInRange,
          isDisabled,
        }
      })
    })

    const timeOptions = computed(() => {
      const interval = props.content?.timeInterval || 15
      const timeFormat = props.content?.timeFormat || '24h'
      const is12h = timeFormat === '12h'
      const isRangeMode = props.content?.rangeMode || false
      
      // Parse start and end times
      const startTimeStr = props.content?.startTime || '00:00'
      const endTimeStr = props.content?.endTime || '23:59'
      
      const [startHour, startMinute] = startTimeStr.split(':').map(Number)
      const [endHour, endMinute] = endTimeStr.split(':').map(Number)
      
      let startTotalMinutes = startHour * 60 + startMinute
      const endTotalMinutes = endHour * 60 + endMinute
      
      // In range mode, if selecting end time and on same day as start, filter times before start
      if (isRangeMode && rangeSelectionStep.value === 'end' && tempStartDate.value) {
        const tempEndDateToCheck = tempEndDate.value || tempStartDate.value
        
        // Check if we're on the same day
        if (isSameDay(tempEndDateToCheck, tempStartDate.value)) {
          // Calculate minimum allowed time (start time + interval)
          const startTotalMinutesFromDate = tempStartDate.value.getHours() * 60 + tempStartDate.value.getMinutes()
          startTotalMinutes = Math.max(startTotalMinutes, startTotalMinutesFromDate + interval)
        }
      }
      
      const options = []
      
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += interval) {
          const totalMinutes = hour * 60 + minute
          
          // Skip times outside the allowed range
          if (totalMinutes < startTotalMinutes || totalMinutes > endTotalMinutes) {
            continue
          }
          
          const date = new Date(2000, 0, 1, hour, minute)
          const value = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
          
          let label
          if (is12h) {
            label = format(date, 'h:mm a')
          } else {
            label = format(date, 'HH:mm')
          }
          
          let isSelected = false
          
          if (isRangeMode) {
            if (rangeSelectionStep.value === 'start') {
              const startDate = tempStartDate.value || (startValue.value ? new Date(startValue.value) : null)
              isSelected = startDate && startDate.getHours() === hour && startDate.getMinutes() === minute
            } else {
              const endDate = tempEndDate.value || (endValue.value ? new Date(endValue.value) : null)
              isSelected = endDate && endDate.getHours() === hour && endDate.getMinutes() === minute
            }
          } else {
            const selected = selectedValue.value ? new Date(selectedValue.value) : null
            isSelected = selected && selected.getHours() === hour && selected.getMinutes() === minute
          }
          
          options.push({ value, label, hour, minute, isSelected })
        }
      }
      
      return options
    })

    // ========== METHODS ==========
    const togglePicker = () => {
      if (props.content?.disabled) return
      
      isPickerOpen.value = !isPickerOpen.value
      setIsOpen(isPickerOpen.value)
      
      if (isPickerOpen.value) {
        // Store original values for cancel
        const isRangeMode = props.content?.rangeMode || false
        if (isRangeMode) {
          originalStartValue.value = startValue.value || ''
          originalEndValue.value = endValue.value || ''
        } else {
          originalSelectedValue.value = selectedValue.value || ''
        }
        
        emit('trigger-event', { name: 'open', event: {} })
        
        // Set current month to selected date or today
        if (selectedValue.value) {
          currentMonth.value = new Date(selectedValue.value)
        } else if (startValue.value) {
          currentMonth.value = new Date(startValue.value)
        } else {
          currentMonth.value = new Date()
        }
      } else {
        emit('trigger-event', { name: 'close', event: {} })
      }
    }

    const openPicker = () => {
      if (props.content?.disabled || props.content?.inline) return
      
      if (!isPickerOpen.value) {
        togglePicker()
      }
    }

    const closePicker = () => {
      if (props.content?.inline) return
      
      isPickerOpen.value = false
      setIsOpen(false)
      emit('trigger-event', { name: 'close', event: {} })
    }

    const selectDate = (day) => {
      if (day.isDisabled || props.content?.disabled) return
      
      const isRangeMode = props.content?.rangeMode || false
      const showConfirmButtons = props.content?.showConfirmButtons || false
      
      if (isRangeMode) {
        if (rangeSelectionStep.value === 'start') {
          // Selecting start date
          let newDate = new Date(day.fullDate)
          if (startValue.value) {
            const existingTime = new Date(startValue.value)
            newDate.setHours(existingTime.getHours())
            newDate.setMinutes(existingTime.getMinutes())
          } else {
            newDate.setHours(0, 0, 0, 0)
          }
          
          tempStartDate.value = newDate
          tempEndDate.value = null
          rangeSelectionStep.value = 'end'
          
          // If mode is date only, proceed to end selection
          if (props.content?.mode !== 'date') {
            // Keep picker open for time selection
          }
        } else {
          // Selecting end date
          let newDate = new Date(day.fullDate)
          
          // VALIDATION: End date cannot be before start date
          const startDateOnly = new Date(tempStartDate.value)
          startDateOnly.setHours(0, 0, 0, 0)
          const endDateOnly = new Date(day.fullDate)
          endDateOnly.setHours(0, 0, 0, 0)
          
          if (endDateOnly < startDateOnly) {
            // Date is before start date, reject selection
            return
          }
          
          // Set time for end date
          if (endValue.value) {
            const existingTime = new Date(endValue.value)
            newDate.setHours(existingTime.getHours())
            newDate.setMinutes(existingTime.getMinutes())
          } else {
            // Check if same day as start
            if (isSameDay(newDate, tempStartDate.value)) {
              // Same day: set end time to start time + 1 hour (or 23:59 if not enough time)
              const startHours = tempStartDate.value.getHours()
              const startMinutes = tempStartDate.value.getMinutes()
              
              if (startHours < 23) {
                newDate.setHours(startHours + 1, startMinutes, 0, 0)
              } else {
                newDate.setHours(23, 59, 0, 0)
              }
            } else {
              // Different day: set to end of day
              newDate.setHours(23, 59, 0, 0)
            }
          }
          
          tempEndDate.value = newDate
          
          // Validate that end datetime is after start datetime
          if (tempStartDate.value && tempEndDate.value <= tempStartDate.value) {
            // Adjust end time to be at least 1 minute after start
            tempEndDate.value = new Date(tempStartDate.value.getTime() + 60000)
          }
          
          // Update range values only if not using confirm buttons
          if (!showConfirmButtons) {
            updateRangeValue(tempStartDate.value, tempEndDate.value)
          }
          
          // Close picker if date only mode and not using confirm buttons
          if (props.content?.mode === 'date' && !showConfirmButtons) {
            rangeSelectionStep.value = 'start'
            tempStartDate.value = null
            tempEndDate.value = null
            closePicker()
          }
        }
      } else {
        // Single date selection
        let newDate
        if (selectedValue.value) {
          newDate = new Date(selectedValue.value)
          newDate.setFullYear(day.fullDate.getFullYear())
          newDate.setMonth(day.fullDate.getMonth())
          newDate.setDate(day.fullDate.getDate())
        } else {
          newDate = new Date(day.fullDate)
          newDate.setHours(0, 0, 0, 0)
        }
        
        // Update value only if not using confirm buttons
        if (!showConfirmButtons) {
          updateValue(newDate)
        } else {
          // Just store temporarily
          if (selectedValue.value) {
            const temp = new Date(selectedValue.value)
            temp.setFullYear(newDate.getFullYear())
            temp.setMonth(newDate.getMonth())
            temp.setDate(newDate.getDate())
            // Don't actually update, just keep in memory
          }
        }
        
        // Close picker if time is not required and not using confirm buttons
        if (props.content?.mode === 'date' && !showConfirmButtons) {
          closePicker()
        }
      }
    }

    const selectTime = (time, explicitStep = null) => {
      if (props.content?.disabled) return
      
      const isRangeMode = props.content?.rangeMode || false
      const step = explicitStep || rangeSelectionStep.value
      
      if (isRangeMode) {
        if (step === 'start' || !tempStartDate.value) {
          // Selecting start time
          let newDate
          if (tempStartDate.value) {
            newDate = new Date(tempStartDate.value)
          } else if (startValue.value) {
            newDate = new Date(startValue.value)
          } else {
            newDate = new Date()
          }
          
          newDate.setHours(time.hour)
          newDate.setMinutes(time.minute)
          newDate.setSeconds(0)
          newDate.setMilliseconds(0)
          
          tempStartDate.value = newDate
          rangeSelectionStep.value = 'end'
          
          // Open end time accordion automatically
          accordionOpen.value = 'end'
        } else {
          // Selecting end time
          let newDate
          if (tempEndDate.value) {
            newDate = new Date(tempEndDate.value)
          } else if (endValue.value) {
            newDate = new Date(endValue.value)
          } else {
            newDate = new Date(tempStartDate.value)
          }
          
          newDate.setHours(time.hour)
          newDate.setMinutes(time.minute)
          newDate.setSeconds(0)
          newDate.setMilliseconds(0)
          
          // VALIDATION: End datetime must be after start datetime
          if (newDate <= tempStartDate.value) {
            // Check if same day
            if (isSameDay(newDate, tempStartDate.value)) {
              // Same day: end time must be after start time
              // Find next available time slot
              const interval = props.content?.timeInterval || 15
              const minEndTime = new Date(tempStartDate.value.getTime() + interval * 60000)
              
              // If selected time is invalid, use the minimum valid time
              if (newDate <= tempStartDate.value) {
                newDate = minEndTime
                
                // Make sure it doesn't exceed the day
                if (newDate.getDate() !== tempStartDate.value.getDate()) {
                  newDate = new Date(tempStartDate.value)
                  newDate.setHours(23, 59, 0, 0)
                }
              }
            } else {
              // Different day but somehow end is before start (shouldn't happen with date validation)
              // Add 1 interval to make it valid
              newDate = new Date(tempStartDate.value.getTime() + (props.content?.timeInterval || 15) * 60000)
            }
          }
          
          tempEndDate.value = newDate
          
          // Update range values only if not using confirm buttons
          const showConfirmButtons = props.content?.showConfirmButtons || false
          if (!showConfirmButtons) {
            updateRangeValue(tempStartDate.value, tempEndDate.value)
            
            // Reset for next selection
            rangeSelectionStep.value = 'start'
            tempStartDate.value = null
            tempEndDate.value = null
          }
          
          // Close picker if time only mode and not using confirm buttons
          if (props.content?.mode === 'time' && !showConfirmButtons) {
            closePicker()
          }
        }
      } else {
        // Single time selection
        let newDate
        if (selectedValue.value) {
          newDate = new Date(selectedValue.value)
        } else {
          newDate = new Date()
        }
        
        newDate.setHours(time.hour)
        newDate.setMinutes(time.minute)
        newDate.setSeconds(0)
        newDate.setMilliseconds(0)
        
        // Update value only if not using confirm buttons
        const showConfirmButtons = props.content?.showConfirmButtons || false
        if (!showConfirmButtons) {
          updateValue(newDate)
        }
        
        // Close picker if date is not required and not using confirm buttons
        if (props.content?.mode === 'time' && !showConfirmButtons) {
          closePicker()
        }
      }
    }

    const updateValue = (date) => {
      const isoString = date.toISOString()
      setSelectedValue(isoString)
      setFormattedValue(formattedValue.value)
      setTimestamp(date.getTime())
      
      const mode = props.content?.mode || 'datetime'
      const dateFormat = props.content?.dateFormat || 'dd/MM/yyyy'
      const timeFormat = props.content?.timeFormat || '24h'
      const timePattern = timeFormat === '12h' ? 'h:mm a' : 'HH:mm'
      const locale = getLocale.value
      
      emit('trigger-event', {
        name: 'change',
        event: {
          value: isoString,
          formattedDate: mode !== 'time' ? format(date, dateFormat, { locale }) : '',
          formattedTime: mode !== 'date' ? format(date, timePattern, { locale }) : '',
          timestamp: date.getTime(),
        },
      })
    }

    const updateRangeValue = (startDate, endDate) => {
      const startIso = startDate.toISOString()
      const endIso = endDate.toISOString()
      
      setStartValue(startIso)
      setEndValue(endIso)
      setStartTimestamp(startDate.getTime())
      setEndTimestamp(endDate.getTime())
      setFormattedValue(formattedValue.value)
      
      const mode = props.content?.mode || 'datetime'
      const dateFormat = props.content?.dateFormat || 'dd/MM/yyyy'
      const timeFormat = props.content?.timeFormat || '24h'
      const timePattern = timeFormat === '12h' ? 'h:mm a' : 'HH:mm'
      const locale = getLocale.value
      
      emit('trigger-event', {
        name: 'change',
        event: {
          startValue: startIso,
          endValue: endIso,
          startDate: mode !== 'time' ? format(startDate, dateFormat, { locale }) : '',
          endDate: mode !== 'time' ? format(endDate, dateFormat, { locale }) : '',
          startTime: mode !== 'date' ? format(startDate, timePattern, { locale }) : '',
          endTime: mode !== 'date' ? format(endDate, timePattern, { locale }) : '',
          startTimestamp: startDate.getTime(),
          endTimestamp: endDate.getTime(),
          durationMs: endDate.getTime() - startDate.getTime(),
        },
      })
    }

    const clearValue = () => {
      if (props.content?.disabled) return
      
      const isRangeMode = props.content?.rangeMode || false
      
      if (isRangeMode) {
        setStartValue('')
        setEndValue('')
        setStartTimestamp(0)
        setEndTimestamp(0)
        setFormattedValue('')
        tempStartDate.value = null
        tempEndDate.value = null
        rangeSelectionStep.value = 'start'
      } else {
        setSelectedValue('')
        setFormattedValue('')
        setTimestamp(0)
      }
      
      emit('trigger-event', { name: 'clear', event: {} })
    }

    const selectToday = () => {
      if (props.content?.disabled) return
      
      const today = new Date()
      
      if (selectedValue.value) {
        const currentTime = new Date(selectedValue.value)
        today.setHours(currentTime.getHours())
        today.setMinutes(currentTime.getMinutes())
      } else {
        today.setHours(0, 0, 0, 0)
      }
      
      currentMonth.value = today
      updateValue(today)
    }

    const previousMonth = () => {
      if (props.content?.disabled) return
      currentMonth.value = subMonths(currentMonth.value, 1)
    }

    const nextMonth = () => {
      if (props.content?.disabled) return
      currentMonth.value = addMonths(currentMonth.value, 1)
    }

    const toggleAccordion = (section) => {
      if (props.content?.disabled) return
      
      // If trying to open end time but no start time selected, do nothing
      if (section === 'end' && !tempStartDate.value && !startValue.value) {
        return
      }
      
      accordionOpen.value = accordionOpen.value === section ? null : section
    }

    const getFormattedStartTime = () => {
      const date = tempStartDate.value || (startValue.value ? new Date(startValue.value) : null)
      if (!date) return ''
      
      const timeFormat = props.content?.timeFormat || '24h'
      const timePattern = timeFormat === '12h' ? 'h:mm a' : 'HH:mm'
      const locale = getLocale.value
      
      try {
        return format(date, timePattern, { locale })
      } catch (error) {
        return ''
      }
    }

    const getFormattedEndTime = () => {
      const date = tempEndDate.value || (endValue.value ? new Date(endValue.value) : null)
      if (!date) return ''
      
      const timeFormat = props.content?.timeFormat || '24h'
      const timePattern = timeFormat === '12h' ? 'h:mm a' : 'HH:mm'
      const locale = getLocale.value
      
      try {
        return format(date, timePattern, { locale })
      } catch (error) {
        return ''
      }
    }

    const getStartTimeOptions = () => {
      const interval = props.content?.timeInterval || 15
      const timeFormat = props.content?.timeFormat || '24h'
      const is12h = timeFormat === '12h'
      const locale = getLocale.value
      
      const startTimeStr = props.content?.startTime || '00:00'
      const endTimeStr = props.content?.endTime || '23:59'
      
      const [startHour, startMinute] = startTimeStr.split(':').map(Number)
      const [endHour, endMinute] = endTimeStr.split(':').map(Number)
      
      const startTotalMinutes = startHour * 60 + startMinute
      const endTotalMinutes = endHour * 60 + endMinute
      
      const options = []
      
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += interval) {
          const totalMinutes = hour * 60 + minute
          
          if (totalMinutes < startTotalMinutes || totalMinutes > endTotalMinutes) {
            continue
          }
          
          const date = new Date(2000, 0, 1, hour, minute)
          const value = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
          
          let label
          if (is12h) {
            label = format(date, 'h:mm a', { locale })
          } else {
            label = format(date, 'HH:mm', { locale })
          }
          
          const startDate = tempStartDate.value || (startValue.value ? new Date(startValue.value) : null)
          const isSelected = startDate && startDate.getHours() === hour && startDate.getMinutes() === minute
          
          options.push({ value, label, hour, minute, isSelected })
        }
      }
      
      return options
    }

    const getEndTimeOptions = () => {
      const interval = props.content?.timeInterval || 15
      const timeFormat = props.content?.timeFormat || '24h'
      const is12h = timeFormat === '12h'
      const locale = getLocale.value
      
      const startTimeStr = props.content?.startTime || '00:00'
      const endTimeStr = props.content?.endTime || '23:59'
      
      const [startHour, startMinute] = startTimeStr.split(':').map(Number)
      const [endHour, endMinute] = endTimeStr.split(':').map(Number)
      
      let startTotalMinutes = startHour * 60 + startMinute
      const endTotalMinutes = endHour * 60 + endMinute
      
      // If on same day as start, filter times before start
      const startDateRef = tempStartDate.value || (startValue.value ? new Date(startValue.value) : null)
      const endDateRef = tempEndDate.value || (endValue.value ? new Date(endValue.value) : null) || startDateRef
      
      if (startDateRef && endDateRef && isSameDay(endDateRef, startDateRef)) {
        const startTotalMinutesFromDate = startDateRef.getHours() * 60 + startDateRef.getMinutes()
        startTotalMinutes = Math.max(startTotalMinutes, startTotalMinutesFromDate + interval)
      }
      
      const options = []
      
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += interval) {
          const totalMinutes = hour * 60 + minute
          
          if (totalMinutes < startTotalMinutes || totalMinutes > endTotalMinutes) {
            continue
          }
          
          const date = new Date(2000, 0, 1, hour, minute)
          const value = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
          
          let label
          if (is12h) {
            label = format(date, 'h:mm a', { locale })
          } else {
            label = format(date, 'HH:mm', { locale })
          }
          
          const endDate = tempEndDate.value || (endValue.value ? new Date(endValue.value) : null)
          const isSelected = endDate && endDate.getHours() === hour && endDate.getMinutes() === minute
          
          options.push({ value, label, hour, minute, isSelected })
        }
      }
      
      return options
    }

    // ========== ACTION METHODS ==========
    const confirmSelection = () => {
      if (props.content?.disabled) return
      
      const isRangeMode = props.content?.rangeMode || false
      
      if (isRangeMode) {
        // Apply range selection
        if (tempStartDate.value && tempEndDate.value) {
          updateRangeValue(tempStartDate.value, tempEndDate.value)
          
          // Reset temporary values
          tempStartDate.value = null
          tempEndDate.value = null
          rangeSelectionStep.value = 'start'
        }
      } else {
        // Apply single selection
        const date = selectedValue.value ? new Date(selectedValue.value) : new Date()
        updateValue(date)
      }
      
      // Emit confirm event
      emit('trigger-event', { name: 'confirm', event: {} })
      
      // Close picker
      closePicker()
    }

    const cancelSelection = () => {
      if (props.content?.disabled) return
      
      const isRangeMode = props.content?.rangeMode || false
      
      if (isRangeMode) {
        // Restore original range values
        if (originalStartValue.value) {
          setStartValue(originalStartValue.value)
          const startDate = new Date(originalStartValue.value)
          setStartTimestamp(startDate.getTime())
        }
        if (originalEndValue.value) {
          setEndValue(originalEndValue.value)
          const endDate = new Date(originalEndValue.value)
          setEndTimestamp(endDate.getTime())
        }
        
        // Reset temporary values
        tempStartDate.value = null
        tempEndDate.value = null
        rangeSelectionStep.value = 'start'
      } else {
        // Restore original single value
        if (originalSelectedValue.value) {
          setSelectedValue(originalSelectedValue.value)
          const date = new Date(originalSelectedValue.value)
          setTimestamp(date.getTime())
        }
      }
      
      // Update formatted value
      setFormattedValue(formattedValue.value)
      
      // Emit cancel event
      emit('trigger-event', { name: 'cancel', event: {} })
      
      // Close picker
      closePicker()
    }

    const clearAll = () => {
      clearValue()
    }

    const handleClickOutside = (event) => {
      const target = event.target
      const wrapper = target.closest('.datetime-picker-wrapper')
      
      if (!wrapper && isPickerOpen.value && !props.content?.inline) {
        closePicker()
      }
    }

    // ========== WATCHERS ==========
    // Watch for initialValue changes
    watch(
      () => props.content?.initialValue,
      (newValue) => {
        if (newValue && newValue !== selectedValue.value) {
          try {
            const date = new Date(newValue)
            if (!isNaN(date.getTime())) {
              setSelectedValue(newValue)
              setFormattedValue(formattedValue.value)
              setTimestamp(date.getTime())
              currentMonth.value = date
            }
          } catch (error) {
            // Invalid date, ignore
          }
        } else if (!newValue) {
          setSelectedValue('')
          setFormattedValue('')
          setTimestamp(0)
        }
      },
      { immediate: true }
    )

    // Watch for property changes that affect display
    watch(
      () => [
        props.content?.mode,
        props.content?.dateFormat,
        props.content?.timeFormat,
        props.content?.timeInterval,
        props.content?.firstDayOfWeek,
        props.content?.startTime,
        props.content?.endTime,
        props.content?.locale,
      ],
      () => {
        // Update formatted value when format changes
        if (selectedValue.value) {
          setFormattedValue(formattedValue.value)
        }
      },
      { deep: true }
    )

    // ========== LIFECYCLE ==========
    onMounted(() => {
      const doc = wwLib.getFrontDocument()
      doc.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      const doc = wwLib.getFrontDocument()
      doc.removeEventListener('click', handleClickOutside)
    })

    // ========== RETURN ==========
    return {
      isPickerOpen,
      currentMonth,
      pickerRef,
      wrapperStyle,
      inputStyle,
      pickerStyle,
      formattedValue,
      currentMonthDisplay,
      weekdayLabels,
      calendarDays,
      timeOptions,
      selectedValue,
      togglePicker,
      closePicker,
      selectDate,
      selectTime,
      clearValue,
      selectToday,
      previousMonth,
      nextMonth,
      rangeSelectionStep,
      startValue,
      endValue,
      hoveredDate,
      accordionOpen,
      toggleAccordion,
      getFormattedStartTime,
      getFormattedEndTime,
      getStartTimeOptions,
      getEndTimeOptions,
      getTranslation,
      confirmSelection,
      cancelSelection,
      openPicker,
      clearAll,
      confirmSelection,
      cancelSelection,
    }
  },
  methods: {
    // ========== ACTIONS (Called from WeWeb workflows) ==========
    clearValue() {
      // Call the clearAll function from setup
      this.clearAll()
    },
    confirm() {
      // Call the confirmSelection function from setup
      this.confirmSelection()
    },
    cancel() {
      // Call the cancelSelection function from setup
      this.cancelSelection()
    },
    open() {
      // Call the openPicker function from setup
      this.openPicker()
    },
    close() {
      // Call the closePicker function from setup
      this.closePicker()
    },
  },
}
</script>

<style scoped lang="scss">
.datetime-picker-wrapper {
  width: var(--width);
  margin: var(--margin);
  position: relative;
  font-family: var(--font-family);
  font-size: var(--font-size);
  font-weight: var(--font-weight);
  color: var(--text-color);
}

// ========== INPUT FIELD ==========
.datetime-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: var(--input-width);
  height: var(--input-height);
  padding: 0 var(--padding);
  background-color: var(--input-bg-color);
  border: var(--border-width) var(--border-style) var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--input-shadow);
  transition: all 0.2s ease;
  font-family: var(--font-family);
  font-size: var(--font-size);
  font-weight: var(--font-weight);

  &:hover:not(:disabled) {
    border-color: var(--primary-color);
    background-color: var(--hover-color);
  }

  &:focus-within {
    border: var(--focus-border-width) var(--border-style) var(--focus-border-color);
    box-shadow: var(--focus-shadow);
    outline: none;
  }

  &:disabled {
    background-color: var(--disabled-color);
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.input-content {
  flex: 1;
  overflow: hidden;
}

.value-text {
  color: var(--text-color);
  font-weight: 500;
}

.placeholder-text {
  color: var(--disabled-color);
}

.input-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.clear-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  background: none;
  border: var(--border-width) var(--border-style) transparent;
  border-radius: var(--border-radius);
  color: var(--disabled-color);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    color: var(--text-color);
    background-color: var(--hover-color);
    border-color: var(--border-color);
  }

  &:focus {
    outline: none;
    border-color: var(--focus-border-color);
    box-shadow: var(--focus-shadow);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    color: var(--disabled-color);
  }
}

.calendar-icon {
  display: flex;
  align-items: center;
  color: var(--primary-color);
}

// ========== PICKER CONTAINER ==========
.picker-container {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 1000;
  width: var(--dropdown-width);
  background-color: var(--bg-color);
  border: var(--border-width) var(--border-style) var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: var(--padding);
  font-family: var(--font-family);
  font-size: var(--font-size);
  font-weight: var(--font-weight);

  &.inline {
    position: static;
    box-shadow: none;
    border: var(--border-width) var(--border-style) var(--border-color);
    width: 100%;
  }
}

// ========== DATE PICKER ==========
.date-picker {
  margin-bottom: 16px;

  .picker-container:not(:has(.time-picker)) & {
    margin-bottom: 0;
  }
}

.month-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.month-display {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
}

.nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: var(--border-width) var(--border-style) transparent;
  border-radius: var(--border-radius);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-family);

  &:hover:not(:disabled) {
    background-color: var(--hover-color);
    border-color: var(--border-color);
  }

  &:focus {
    outline: none;
    border-color: var(--focus-border-color);
    box-shadow: var(--focus-shadow);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
    color: var(--disabled-color);
  }
}

.weekday-headers {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.weekday-label {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-color);
  opacity: 0.7;
  padding: 8px 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: var(--border-width) var(--border-style) transparent;
  border-radius: var(--border-radius);
  color: var(--text-color);
  font-size: var(--font-size);
  font-family: var(--font-family);
  font-weight: var(--font-weight);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled):not(.selected) {
    background-color: var(--hover-color);
    border-color: var(--border-color);
  }

  &:focus {
    outline: none;
    border-color: var(--focus-border-color);
    box-shadow: var(--focus-shadow);
  }

  &.other-month {
    color: var(--disabled-color);
    opacity: 0.5;
  }

  &.today {
    font-weight: 600;
    border-color: var(--primary-color);
    border-width: var(--border-width);
  }

  &.selected {
    background-color: var(--primary-color);
    color: white;
    font-weight: 600;
    border-color: var(--primary-color);
    border-radius: var(--border-radius);
  }

  &.in-range {
    background-color: var(--range-color);
    border-radius: 0;
  }

  &.range-start,
  &.range-end {
    background-color: var(--primary-color) !important;
    color: white !important;
    font-weight: 600;
    border-color: var(--primary-color) !important;
    border-radius: var(--border-radius) !important;
  }

  &.disabled {
    color: var(--disabled-color);
    cursor: not-allowed;
    text-decoration: line-through;
    opacity: 0.5;

    &:hover {
      background: none;
      border-color: transparent;
    }
  }
}

.picker-actions {
  margin-top: 12px;
  padding-top: 12px;
  border-top: var(--border-width) var(--border-style) var(--border-color);
  display: flex;
  justify-content: center;
}

.action-button {
  padding: var(--padding);
  background-color: transparent;
  border: var(--border-width) var(--border-style) var(--border-color);
  border-radius: var(--border-radius);
  font-family: var(--font-family);
  font-size: var(--font-size);
  font-weight: var(--font-weight);
  color: var(--text-color);
  font-size: 14px;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }

  &:focus {
    outline: none;
    border-color: var(--focus-border-color);
    box-shadow: var(--focus-shadow);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    background-color: var(--disabled-color);
  }
}

// ========== TIME PICKER ==========
.time-picker {
  border-top: 1px solid var(--border-color);
  padding-top: 16px;

  .picker-container:not(:has(.date-picker)) & {
    border-top: none;
    padding-top: 0;
  }
}

.time-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 12px;
}

// ========== TIME ACCORDION ==========
.time-accordion {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.accordion-section {
  border: var(--border-width) var(--border-style) var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: all 0.2s ease;

  &.active {
    border-color: var(--primary-color);
    box-shadow: var(--box-shadow);
  }

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

.accordion-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--input-height);
  padding: 0 var(--padding);
  background-color: var(--input-bg-color);
  border: none;
  border-radius: 0;
  box-shadow: none;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 12px;
  font-family: var(--font-family);
  font-size: var(--font-size);
  font-weight: var(--font-weight);

  &:hover:not(:disabled) {
    background-color: var(--hover-color);
  }

  &:focus {
    outline: none;
    background-color: var(--hover-color);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    background-color: var(--disabled-color);
  }
}

.accordion-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--font-size);
  font-weight: 600;
  color: var(--text-color);
  flex-shrink: 0;
}

.accordion-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  
  svg {
    width: 18px;
    height: 18px;
  }
}

.accordion-value {
  flex: 1;
  text-align: right;
  font-size: var(--font-size);
  font-family: var(--font-family);
  color: var(--primary-color);
  font-weight: 500;
  padding: 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:empty::before {
    content: 'Not selected';
    color: var(--disabled-color);
    font-style: italic;
  }
}

.accordion-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.2s ease;
  color: #666;

  &.open {
    transform: rotate(180deg);
  }
}

.accordion-content {
  padding: 12px;
  background-color: var(--bg-color);
  border-top: none;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// ========== CONFIRM/CANCEL ACTIONS ==========
.confirm-actions {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--border-color);
  background-color: var(--hover-color);
}

.cancel-action-button,
.confirm-action-button {
  flex: 1;
  padding: var(--padding);
  border: var(--border-width) var(--border-style) var(--border-color);
  border-radius: var(--border-radius);
  font-size: var(--font-size);
  font-family: var(--font-family);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    box-shadow: var(--focus-shadow);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    background-color: var(--disabled-color);
  }
}

.cancel-action-button {
  background-color: transparent;
  border-color: var(--border-color);
  color: var(--text-color);

  &:hover:not(:disabled) {
    background-color: var(--hover-color);
    border-color: var(--primary-color);
  }

  &:focus {
    border-color: var(--focus-border-color);
  }
}

.confirm-action-button {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);

  &:hover:not(:disabled) {
    opacity: 0.9;
    box-shadow: var(--box-shadow);
  }

  &:focus {
    border-color: var(--focus-border-color);
  }
}

// ========== CUSTOM DROPZONE ==========
.custom-dropzone {
  background-color: var(--bg-color);
  margin-top: var(--padding);
  padding-top: var(--padding);
  border-top: var(--border-width) var(--border-style) var(--border-color);
}

.time-scroll-container {
  max-height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--hover-color);
    border-radius: var(--border-radius);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--disabled-color);
    border-radius: var(--border-radius);

    &:hover {
      background: #aaa;
    }
  }
}

.time-option {
  padding: 8px 12px;
  background: none;
  border: var(--border-width) var(--border-style) transparent;
  border-radius: var(--border-radius);
  color: var(--text-color);
  font-size: var(--font-size);
  font-family: var(--font-family);
  font-weight: var(--font-weight);
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 0 0 auto;
  min-width: 70px;

  &:hover:not(:disabled):not(.selected) {
    background-color: var(--hover-color);
    border-color: var(--border-color);
  }

  &:focus {
    outline: none;
    border-color: var(--focus-border-color);
    box-shadow: var(--focus-shadow);
  }

  &.selected {
    background-color: var(--primary-color);
    color: white;
    font-weight: 600;
    border-color: var(--primary-color);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    color: var(--disabled-color);
    background-color: var(--disabled-color);
  }
}

// ========== RESPONSIVE ==========
@media (max-width: 768px) {
  .picker-container.mobile-fullscreen:not(.inline) {
    position: fixed;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%);
    width: calc(100vw - 32px);
    max-width: 400px;
    max-height: 90vh;
    overflow-y: auto;
    z-index: 9999;
  }

  .calendar-day {
    font-size: 13px;
    padding: 8px 4px;
  }

  .weekday-label {
    font-size: 11px;
    padding: 6px 0;
  }

  .month-display {
    font-size: 14px;
  }

  .nav-button {
    width: 28px;
    height: 28px;
  }

  .time-scroll-container {
    max-height: 150px;
  }

  .time-option {
    padding: 6px 10px;
    min-width: 60px;
    font-size: 13px;
  }

  .accordion-header {
    height: 40px;
    padding: 0 10px;
    font-size: 13px;
  }

  .accordion-icon svg {
    width: 16px;
    height: 16px;
  }

  .accordion-value {
    font-size: 12px;
  }

  .confirm-actions {
    padding: 10px 12px;
    gap: 6px;
  }

  .cancel-action-button,
  .confirm-action-button {
    padding: 8px 12px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .picker-container.mobile-fullscreen:not(.inline) {
    width: calc(100vw - 16px);
    max-width: none;
    padding: 12px;
  }

  .calendar-day {
    font-size: 12px;
    padding: 6px 2px;
  }

  .weekday-label {
    font-size: 10px;
  }

  .time-option {
    padding: 5px 8px;
    min-width: 55px;
    font-size: 12px;
  }

  .accordion-header {
    height: 36px;
    padding: 0 8px;
    font-size: 12px;
  }

  .month-display {
    font-size: 13px;
  }
}
</style>
