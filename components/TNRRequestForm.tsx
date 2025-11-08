'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

interface FormData {
  requester_name: string;
  requester_email: string;
  requester_phone: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  estimated_cat_count: number;
  colony_location_description: string;
  feeding_schedule: string;
  cats_friendly: boolean;
  cats_have_shelter: boolean;
  previous_tnr: boolean;
  special_circumstances: string;
  preferred_contact_method: string;
  preferred_appointment_time: string;
}

interface TNRRequestFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function TNRRequestForm({ onSuccess, onClose }: TNRRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<FormData>({
    requester_name: '',
    requester_email: '',
    requester_phone: '',
    street_address: '',
    city: 'Acadia Parish',
    state: 'LA',
    zip_code: '',
    estimated_cat_count: 1,
    colony_location_description: '',
    feeding_schedule: '',
    cats_friendly: false,
    cats_have_shelter: false,
    previous_tnr: false,
    special_circumstances: '',
    preferred_contact_method: 'email',
    preferred_appointment_time: '',
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.requester_name.trim()) {
      newErrors.requester_name = 'Name is required';
    }

    if (!formData.requester_email.trim()) {
      newErrors.requester_email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.requester_email)) {
      newErrors.requester_email = 'Invalid email format';
    }

    if (!formData.requester_phone.trim()) {
      newErrors.requester_phone = 'Phone is required';
    } else if (!/^[\d\s\-\(\)]+$/.test(formData.requester_phone.replace(/\s/g, ''))) {
      newErrors.requester_phone = 'Invalid phone format';
    }

    if (!formData.street_address.trim()) {
      newErrors.street_address = 'Street address is required';
    }

    if (!formData.zip_code.trim()) {
      newErrors.zip_code = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zip_code)) {
      newErrors.zip_code = 'Invalid ZIP code format';
    }

    if (formData.estimated_cat_count < 1) {
      newErrors.estimated_cat_count = 'Must be at least 1 cat';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Initialize Supabase client
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Insert into Supabase
      const { data: insertedData, error: dbError } = await supabase
        .from('tnr_requests')
        .insert([{
          ...formData,
          status: 'pending',
        }])
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      // Get analytics ID (created by trigger)
      const { data: analyticsData } = await supabase
        .from('submission_analytics')
        .select('id')
        .eq('request_id', insertedData.id)
        .single();

      // Send email notification with request ID for analytics
      // Note: API routes don't work with GitHub Pages static export
      // Email notifications will work when deployed to Vercel
      try {
        const response = await fetch('/api/send-tnr-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            _requestId: insertedData.id,
            _analyticsId: analyticsData?.id || null,
          }),
        });

        if (!response.ok) {
          console.warn('Email notification failed (API route not available on GitHub Pages)');
        }
      } catch (emailError) {
        // Silently fail - email will work on Vercel
        console.warn('Email notification skipped (static export mode)');
      }

      // Send submission analytics to InnerAnimalMedia dashboard (non-blocking)
      try {
        await fetch('/api/webhook/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: 'form_submission',
            form_type: 'tnr-request',
            request_id: insertedData.id,
            submission_status: 'success',
            estimated_cat_count: formData.estimated_cat_count,
            city: formData.city,
            zip_code: formData.zip_code,
          }),
        }).catch(() => {
          // Silently fail - analytics is secondary
        });
      } catch {
        // Ignore webhook errors
      }

      setSubmitStatus('success');
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 2000);

    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Request Submitted!
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          We've received your TNR request and will contact you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
          Contact Information
        </h3>

        <div>
          <label htmlFor="requester_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="requester_name"
            name="requester_name"
            value={formData.requester_name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
              errors.requester_name ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.requester_name && (
            <p className="mt-1 text-sm text-red-500">{errors.requester_name}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="requester_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="requester_email"
              name="requester_email"
              value={formData.requester_email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                errors.requester_email ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.requester_email && (
              <p className="mt-1 text-sm text-red-500">{errors.requester_email}</p>
            )}
          </div>

          <div>
            <label htmlFor="requester_phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="requester_phone"
              name="requester_phone"
              value={formData.requester_phone}
              onChange={handleChange}
              placeholder="337-555-0123"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                errors.requester_phone ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.requester_phone && (
              <p className="mt-1 text-sm text-red-500">{errors.requester_phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
          Address Information
        </h3>

        <div>
          <label htmlFor="street_address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="street_address"
            name="street_address"
            value={formData.street_address}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
              errors.street_address ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.street_address && (
            <p className="mt-1 text-sm text-red-500">{errors.street_address}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              State
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ZIP Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="zip_code"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleChange}
              placeholder="70501"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                errors.zip_code ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.zip_code && (
              <p className="mt-1 text-sm text-red-500">{errors.zip_code}</p>
            )}
          </div>
        </div>
      </div>

      {/* Colony Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
          Colony Information
        </h3>

        <div>
          <label htmlFor="estimated_cat_count" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Estimated Number of Cats <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="estimated_cat_count"
            name="estimated_cat_count"
            value={formData.estimated_cat_count}
            onChange={handleChange}
            min="1"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
              errors.estimated_cat_count ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.estimated_cat_count && (
            <p className="mt-1 text-sm text-red-500">{errors.estimated_cat_count}</p>
          )}
        </div>

        <div>
          <label htmlFor="colony_location_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Colony Location Description
          </label>
          <textarea
            id="colony_location_description"
            name="colony_location_description"
            value={formData.colony_location_description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="Describe where the colony is located..."
          />
        </div>

        <div>
          <label htmlFor="feeding_schedule" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Feeding Schedule
          </label>
          <input
            type="text"
            id="feeding_schedule"
            name="feeding_schedule"
            value={formData.feeding_schedule}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="e.g., Daily at 7am and 6pm"
          />
        </div>
      </div>

      {/* Additional Questions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
          Additional Information
        </h3>

        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="cats_friendly"
              checked={formData.cats_friendly}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Are the cats friendly/approachable?
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="cats_have_shelter"
              checked={formData.cats_have_shelter}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Do the cats have shelter?
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="previous_tnr"
              checked={formData.previous_tnr}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Have you done TNR with us before?
            </span>
          </label>
        </div>

        <div>
          <label htmlFor="special_circumstances" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Special Circumstances or Notes
          </label>
          <textarea
            id="special_circumstances"
            name="special_circumstances"
            value={formData.special_circumstances}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="Any additional information we should know..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="preferred_contact_method" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Preferred Contact Method
            </label>
            <select
              id="preferred_contact_method"
              name="preferred_contact_method"
              value={formData.preferred_contact_method}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="text">Text Message</option>
            </select>
          </div>

          <div>
            <label htmlFor="preferred_appointment_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Preferred Appointment Time
            </label>
            <input
              type="text"
              id="preferred_appointment_time"
              name="preferred_appointment_time"
              value={formData.preferred_appointment_time}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              placeholder="e.g., Weekday mornings"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">
            There was an error submitting your request. Please try again or contact us at 337-581-7562.
          </p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit TNR Request'}
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

