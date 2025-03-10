import { useState, FormEvent } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import Notification from '../ui/Notification';

interface SessionFormData {
  menteeId: number;
  mentorId: number;
  date: Date | null;
  time: Date | null;
  skill: string;
  price: number;
  duration: number;
  message: string;
  timezone: string;
}

interface FormErrors {
  [key: string]: string;
}

interface SessionBookingFormProps {
  menteeId: number;
  mentorId: number;
  onSubmit: (data: SessionFormData) => Promise<void>;
}

const TIMEZONE_OPTIONS = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
  { value: 'America/Phoenix', label: 'Arizona Time (MST)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Shanghai', label: 'China Time (CST)' },
  { value: 'Asia/Tokyo', label: 'Japan Time (JST)' },
  { value: 'Australia/Sydney', label: 'Sydney Time (AEST)' },
  { value: 'Pacific/Auckland', label: 'New Zealand Time (NZST)' }
];

const SessionBookingForm: React.FC<SessionBookingFormProps> = ({ menteeId, mentorId, onSubmit }) => {
  // Get user's timezone or default to Eastern Time
  const getUserTimezone = () => {
    try {
      const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      // Check if user's timezone is in our options
      return TIMEZONE_OPTIONS.find(tz => tz.value === userTz)?.value || 'America/New_York';
    } catch {
      return 'America/New_York'; // Default fallback
    }
  };
  
  const initialFormData: SessionFormData = {
    menteeId,
    mentorId,
    date: null,
    time: null,
    skill: '',
    price: 0,
    duration: 60,
    message: '',
    timezone: getUserTimezone()
  };

  const [formData, setFormData] = useState<SessionFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Filter available times based on weekday/weekend
  const filterPassedTime = (time: Date) => {
    const currentDate = new Date();
    const selectedDate = formData.date || new Date(); // Get the selected date from form
    
    // Create a new date object combining selected date with time being checked
    const dateToCheck = new Date(selectedDate);
    dateToCheck.setHours(time.getHours(), time.getMinutes(), 0, 0);
    
    const hours = time.getHours();
    const isWeekend = dateToCheck.getDay() === 0 || dateToCheck.getDay() === 6;
    
    // Only check for past times if the selected date is today
    const isToday = currentDate.toDateString() === dateToCheck.toDateString();
    const isFutureTime = isToday ? dateToCheck.getTime() > currentDate.getTime() : true;

    if (isWeekend) {
      // Allow all hours on weekends, but still check if it's in the past if it's today
      return isFutureTime;
    } else {
      // Weekday restrictions (7 AM to 11 PM)
      const isAvailableHours = hours >= 7 && hours < 23;
      return isAvailableHours && isFutureTime;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }

    if (!formData.time) {
      newErrors.time = 'Please select a time';
    }

    if (!formData.skill.trim()) {
      newErrors.skill = 'Please specify the skill';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    } else if (formData.price < 10) {
      newErrors.price = 'Minimum price is $10';
    } else if (formData.price > 500) {
      newErrors.price = 'Maximum price is $500';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please provide a message for the mentor';
    } else if (formData.message.length < 20) {
      newErrors.message = 'Message should be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setShowPreview(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setNotification({
        type: 'error',
        message: 'Please fill in all required fields correctly'
      });
      return;
    }

    if (!showPreview) {
      setShowPreview(true);
      setNotification({
        type: 'info',
        message: 'Please review your booking details before confirming'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setNotification({
        type: 'success',
        message: 'Session booked successfully!'
      });
      resetForm();
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to book session. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date and time for preview with timezone
  const formattedDateTime = (): string => {
    if (!formData.date || !formData.time) return '';
    const date = new Date(formData.date);
    const time = new Date(formData.time);
    date.setHours(time.getHours(), time.getMinutes());
    
    try {
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: formData.timezone,
        timeZoneName: 'short'
      }).format(date);
    } catch {
      // Fallback formatting without timezone if there's an error
      return date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Book a Session</h2>

      {notification && (
        <div className="mb-6">
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        </div>
      )}

      {showPreview ? (
        <div className="space-y-6 bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-900">Booking Preview</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Date and Time</dt>
              <dd className="text-sm text-gray-900">{formattedDateTime()}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Timezone</dt>
              <dd className="text-sm text-gray-900">{formData.timezone}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Skill</dt>
              <dd className="text-sm text-gray-900">{formData.skill}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Duration</dt>
              <dd className="text-sm text-gray-900">{formData.duration} minutes</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Rate</dt>
              <dd className="text-sm text-gray-900">USD ${formData.price}/hour</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Total Cost</dt>
              <dd className="text-lg font-medium text-gray-900">USD ${(formData.price * formData.duration / 60).toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Message</dt>
              <dd className="text-sm text-gray-900">{formData.message}</dd>
            </div>
          </dl>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="btn btn-secondary"
            >
              Edit
            </button>
            <button
              type="submit"
              className={`btn btn-primary px-6 ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Confirming...
                </span>
              ) : (
                'Confirm Booking'
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Timezone Selection */}
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
              Timezone
            </label>
            <Select
              id="timezone"
              options={TIMEZONE_OPTIONS}
              value={TIMEZONE_OPTIONS.find(tz => tz.value === formData.timezone)}
              onChange={(option) => {
                if (option) {
                  setFormData({ ...formData, timezone: option.value });
                }
              }}
              className="mt-1"
              classNamePrefix="select"
            />
            <p className="mt-1 text-sm text-gray-500">Times will be shown in your selected timezone</p>
          </div>

          {/* Date Selection */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <DatePicker
              selected={formData.date}
              onChange={(date: Date | null) => {
                setFormData({ ...formData, date });
                setErrors({ ...errors, date: '' });
              }}
              minDate={new Date()}
              className={`mt-1 block w-full rounded-md shadow-sm p-2 ${
                errors.date 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              placeholderText="Select date"
              required
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>

          {/* Time Selection */}
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <DatePicker
              selected={formData.time}
              onChange={(time: Date | null) => {
                setFormData({ ...formData, time });
                setErrors({ ...errors, time: '' });
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeCaption="Time"
              dateFormat="h:mm aa"
              filterTime={filterPassedTime}
              className={`mt-1 block w-full rounded-md shadow-sm p-2 ${
                errors.time 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              placeholderText="Select time"
              required
            />
            {errors.time && (
              <p className="mt-1 text-sm text-red-600">{errors.time}</p>
            )}
          </div>

          {/* Skill Input */}
          <div>
            <label htmlFor="skill" className="block text-sm font-medium text-gray-700">
              Skill
            </label>
            <input
              type="text"
              id="skill"
              value={formData.skill}
              onChange={(e) => {
                setFormData({ ...formData, skill: e.target.value });
                setErrors({ ...errors, skill: '' });
              }}
              className={`mt-1 block w-full rounded-md shadow-sm p-2 ${
                errors.skill
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              placeholder="Enter the skill you want to learn"
              required
            />
            {errors.skill && (
              <p className="mt-1 text-sm text-red-600">{errors.skill}</p>
            )}
          </div>

          {/* Price Input */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price (USD per hour)
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                $
              </span>
              <input
                type="number"
                id="price"
                value={formData.price || ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : Number(e.target.value);
                  setFormData({ ...formData, price: value });
                  setErrors({ ...errors, price: '' });
                }}
                min="10"
                max="500"
                className={`pl-7 block w-full rounded-md shadow-sm p-2 ${
                  errors.price
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="Enter price per hour"
                required
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">All prices are in US Dollars (USD)</p>
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          {/* Duration Selection */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Duration (minutes)
            </label>
            <select
              id="duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </div>

          {/* Message Input */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => {
                setFormData({ ...formData, message: e.target.value });
                setErrors({ ...errors, message: '' });
              }}
              rows={4}
              className={`mt-1 block w-full rounded-md shadow-sm p-2 ${
                errors.message
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              placeholder="Describe what you'd like to learn or discuss"
              required
            />
            <div className="mt-1 flex justify-between items-center">
              <p className={`text-sm ${
                formData.message.length < 20 
                  ? 'text-red-500' 
                  : 'text-green-600'
              }`}>
                {formData.message.length} / 20 characters minimum
              </p>
              <p className="text-sm text-gray-500">
                {formData.message.length === 0 
                  ? 'Start typing...' 
                  : formData.message.length < 20 
                    ? `${20 - formData.message.length} more characters needed` 
                    : '✓ Minimum length met'}
              </p>
            </div>
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary px-6"
              disabled={isSubmitting}
            >
              Preview Booking
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default SessionBookingForm;