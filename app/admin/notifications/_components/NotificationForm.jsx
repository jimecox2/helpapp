// app/admin/notifications/_components/NotificationForm.jsx

'use client'
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createNotification, updateNotification, getOrdersForDropdown } from '@/crud/coreCrud';
import { API_URL, API_URL_GQL, FRONTEND_URL, RUN_URL_AB, RUN_URL_TB, RUN_URL_CB } from '@/config/site';
import { formatTimeForStrapi } from '@/lib/helpers/customfunctions';

const schema = z.object({
  manager_name: z.string().min(2, 'Manager name must be at least 2 characters'),
  manager_phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  manager_email: z.string().email('Invalid email address'),
  timezone: z.string().min(1, 'Timezone is required'),
  is_active: z.boolean(),
  primary_channel: z.string().min(1, 'Primary channel is required'),
  secondary_channel: z.string(),
  business_hours_only: z.boolean(),
  quiet_hours_start: z.string(),
  quiet_hours_end: z.string(),
  weekend_notifications: z.boolean(),
  days_overdue_threshold: z.number().min(0, 'Must be 0 or greater'),
  budget_overrun_percent: z.number().min(0, 'Must be 0 or greater'),
  overall_health_threshold: z.string(),
  executive_commitment_threshold: z.string(),
  risk_size_complexity_threshold: z.string(),
  strategic_value_threshold: z.number().min(0, 'Must be 0 or greater'),
  likelyhood_of_success: z.number().min(0, 'Must be 0 or greater'),
  cooldown_hours: z.number().min(1, 'Must be at least 1 hour'),
  max_notifications_per_day: z.number().min(1, 'Must be at least 1'),
  enable_escalation: z.boolean(),
  escalation_delay_hours: z.number().min(1, 'Must be at least 1 hour'),
  max_escalation_attempts: z.number().min(1, 'Must be at least 1'),
  escalation_phone: z.string().optional(),
  notes: z.string().optional(),
  order_id: z.number().min(1, 'Order selection is required'),
});

const getProductType = (orderData) => {
  const code = (orderData?.product?.product_code || '').toUpperCase();
  if (code.startsWith('CB')) return 'costbars';
  if (code.startsWith('AB')) return 'agilebars';
  if (code.startsWith('TB')) return 'timebars';
  return 'unknown';
};

// Shared option lists used across multiple product threshold tabs
const healthOptions = [
  { value: 'Green',  label: 'Green' },
  { value: 'Yellow', label: 'Yellow' },
  { value: 'Red',    label: 'Red' },
];

const commitmentOptions = [
  { value: 'Full',         label: 'Full' },
  { value: 'Strong',       label: 'Strong' },
  { value: 'Moderate',     label: 'Moderate' },
  { value: 'Limited',      label: 'Limited' },
  { value: 'Not Clear',    label: 'Not Clear' },
  { value: 'Not Assessed', label: 'Not Assessed' },
];

const riskOptions = [
  { value: 'Not Assessed',              label: 'Not Assessed' },
  { value: 'Very Small and Simple',     label: '0-10 Very Small and Simple' },
  { value: 'Small and Straightforward', label: '11-20 Small and Straightforward' },
  { value: 'Medium with Some Complexity', label: '21-30 Medium with Some Complexity' },
  { value: 'Large with Moderate Complexity', label: '31-40 Large with Moderate Complexity' },
  { value: 'Complex but Manageable',    label: '41-50 Complex but Manageable' },
  { value: 'Significant Complexity',    label: '51-60 Significant Complexity' },
  { value: 'Large and Complex',         label: '61-70 Large and Complex' },
  { value: 'Very Large and Complex',    label: '71-80 Very Large and Complex' },
  { value: 'Highly Complex and Risky',  label: '81-90 Highly Complex and Risky' },
  { value: 'Extremely Complex and Risky', label: '91-100 Extremely Complex and Risky' },
];

const NotificationForm = ({ notificationData = null, orderData = null, onSuccess }) => {
  const productType = getProductType(orderData);
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    manager_name: '',
    manager_phone: '',
    manager_email: '',
    timezone: 'America/New_York',
    is_active: true,
    primary_channel: 'sms',
    secondary_channel: 'email',
    business_hours_only: true,
    quiet_hours_start: '06:00:00',
    quiet_hours_end: '18:00:00',
    weekend_notifications: false,
    days_overdue_threshold: 3,
    budget_overrun_percent: 20,
    overall_health_threshold: 'Red',
    executive_commitment_threshold: 'Moderate',
    risk_size_complexity_threshold: 'Significant Complexity',
    strategic_value_threshold: 50,
    likelyhood_of_success: 50,
    cooldown_hours: 24,
    max_notifications_per_day: 5,
    enable_escalation: false,
    escalation_delay_hours: 4,
    max_escalation_attempts: 3,
    escalation_phone: '',
    notes: '',
    order_id: notificationData?.order_id?.toString() || orderData?.id?.toString() || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Determine if we're in edit mode
  const isEditMode = !!notificationData?.id;

  // Load orders for dropdown (only in add mode)
  useEffect(() => {
    const loadOrders = async () => {
      if (session?.jwt && session?.user?.email) {
        try {
          const orderList = await getOrdersForDropdown(session.user.email, session.jwt);
          setOrders(orderList);
        } catch (error) {
          console.error('Error loading orders:', error);
          toast.error('Failed to load orders');
        }
      }
    };
    
    // Only load orders if not in edit mode
    if (!isEditMode) {
      loadOrders();
    }
  }, [session, isEditMode]);

  // Populate form if editing
  useEffect(() => {
    if (notificationData) {
      console.log('Edit mode - notificationData:', notificationData);
      console.log('Edit mode - orderData:', orderData);
      
      const orderIdValue = (notificationData.order_id || notificationData.order?.id || orderData?.id)?.toString() || '';
      console.log('Setting order_id to:', orderIdValue);
      
      setFormData({
        manager_name: notificationData.manager_name || '',
        manager_phone: notificationData.manager_phone || '',
        manager_email: notificationData.manager_email || '',
        timezone: notificationData.timezone || 'America/New_York',
        is_active: notificationData.is_active ?? true,
        primary_channel: notificationData.primary_channel || 'sms',
        secondary_channel: notificationData.secondary_channel || 'email',
        business_hours_only: notificationData.business_hours_only ?? true,
        quiet_hours_start: notificationData.quiet_hours_start || '06:00:00',
        quiet_hours_end: notificationData.quiet_hours_end || '18:00:00',
        weekend_notifications: notificationData.weekend_notifications ?? false,
        days_overdue_threshold: notificationData.days_overdue_threshold || 3,
        budget_overrun_percent: notificationData.budget_overrun_percent || 20,
        overall_health_threshold: notificationData.overall_health_threshold || 'Red',
        executive_commitment_threshold: notificationData.executive_commitment_threshold || 'Moderate',
        risk_size_complexity_threshold: notificationData.risk_size_complexity_threshold || 'Significant Complexity',
        strategic_value_threshold: notificationData.strategic_value_threshold || 50,
        likelyhood_of_success: notificationData.likelyhood_of_success || 50,
        cooldown_hours: notificationData.cooldown_hours || 24,
        max_notifications_per_day: notificationData.max_notifications_per_day || 5,
        enable_escalation: notificationData.enable_escalation ?? false,
        escalation_delay_hours: notificationData.escalation_delay_hours || 4,
        max_escalation_attempts: notificationData.max_escalation_attempts || 3,
        escalation_phone: notificationData.escalation_phone || '',
        notes: notificationData.notes || '',
        order_id: orderIdValue,
      });
    }
  }, [notificationData, orderData]);

  const handleChange = (name, value) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get the correct order_id for validation
      let validOrderId;
      if (isEditMode) {
        // In edit mode, get from notificationData or orderData
        validOrderId = notificationData.order_id || notificationData.order?.id || orderData?.id;
      } else {
        // In create mode, get from form
        validOrderId = parseInt(formData.order_id);
      }

      console.log('Order ID for validation:', validOrderId);

      // Convert string numbers to actual numbers for validation
      const processedData = {
        ...formData,
        days_overdue_threshold: parseInt(formData.days_overdue_threshold) || 0,
        budget_overrun_percent: parseInt(formData.budget_overrun_percent) || 0,
        strategic_value_threshold: parseInt(formData.strategic_value_threshold) || 0,
        likelyhood_of_success: parseInt(formData.likelyhood_of_success) || 0,
        cooldown_hours: parseInt(formData.cooldown_hours) || 1,
        max_notifications_per_day: parseInt(formData.max_notifications_per_day) || 1,
        escalation_delay_hours: parseInt(formData.escalation_delay_hours) || 1,
        max_escalation_attempts: parseInt(formData.max_escalation_attempts) || 1,
        order_id: validOrderId,
        // Ensure time format is correct for Strapi
        quiet_hours_start: formatTimeForStrapi(formData.quiet_hours_start),
        quiet_hours_end: formatTimeForStrapi(formData.quiet_hours_end),
      };

      console.log('Processed data before validation:', processedData);
      
      const validatedData = schema.parse(processedData);
      console.log('Validation successful:', validatedData);

      // Prepare data for Strapi (wrap in data object)
      const strapiData = {
        data: {
          ...validatedData,
          order: validatedData.order_id, // Strapi relation field
        }
      };
      delete strapiData.data.order_id; // Remove the temp field

      if (isEditMode) {
        // Update existing notification
        await updateNotification(session.jwt, strapiData, notificationData.id);
        toast.success('Notification updated successfully!');
      } else {
        // Create new notification
        await createNotification(session.jwt, strapiData);
        toast.success('Notification created successfully!');
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation errors:', error.errors);
        console.error('Flattened errors:', error.flatten());
        setErrors(error.flatten().fieldErrors);
        toast.error('Please check the form for errors');
        
        // Show specific validation errors in console for debugging
        error.errors.forEach((err) => {
          console.error(`Validation error on ${err.path.join('.')}: ${err.message}`);
        });
      } else {
        console.error('Form submission error:', error);
        toast.error('An error occurred while saving the notification');
      }
    } finally {
      setLoading(false);
    }
  };

  // Get order display name for edit mode
  const getOrderDisplayName = () => {
    if (orderData) {
      return `${orderData.product.name} - Order Date: ${new Date(orderData.createdAt).toLocaleDateString()}`;
    }
    return `Order ID: ${formData.order_id}`;
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditMode ? 'Edit Notification' : 'Create New Notification'}
        </CardTitle>
        <CardDescription>
          Configure notification settings for a target User.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
              <TabsTrigger value="escalation">Escalation</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order_id">Order/License *</Label>
                  {isEditMode ? (
                    <Input
                      id="order_id"
                      value={getOrderDisplayName()}
                      disabled
                      className="bg-gray-50 text-gray-700"
                    />
                  ) : (
                    <Select onValueChange={(value) => handleChange('order_id', value)} value={formData.order_id}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an order" />
                      </SelectTrigger>
                      <SelectContent>
                        {orders.map((order) => (
                          <SelectItem key={order.id} value={order.id.toString()}>
                            {order.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {!isEditMode && errors.order_id && <p className="text-red-500 text-sm">{errors.order_id}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manager_name">Target User Name *</Label>
                  <Input
                    id="manager_name"
                    value={formData.manager_name}
                    onChange={(e) => handleChange('manager_name', e.target.value)}
                    placeholder="Enter manager name"
                  />
                  {errors.manager_name && <p className="text-red-500 text-sm">{errors.manager_name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manager_phone">Phone Number *</Label>
                  <Input
                    id="manager_phone"
                    value={formData.manager_phone}
                    onChange={(e) => handleChange('manager_phone', e.target.value)}
                    placeholder="+16292765378"
                  />
                  {errors.manager_phone && <p className="text-red-500 text-sm">{errors.manager_phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manager_email">Email Address *</Label>
                  <Input
                    id="manager_email"
                    type="email"
                    value={formData.manager_email}
                    onChange={(e) => handleChange('manager_email', e.target.value)}
                    placeholder="manager@company.com"
                  />
                  {errors.manager_email && <p className="text-red-500 text-sm">{errors.manager_email}</p>}
                </div>

                <div className="space-y-2">
                  <Label 
                    title="Choose the timezone for the Target Users location."
                    htmlFor="timezone">Timezone</Label>
                  <Select onValueChange={(value) => handleChange('timezone', value)} value={formData.timezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleChange('is_active', checked)}
                  />
                  <Label 
                    title="Uncheck to stop notifications to this person."
                    htmlFor="is_active">Is Active?</Label>
                </div>
              </div>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary_channel">Primary Channel</Label>
                  <Select onValueChange={(value) => handleChange('primary_channel', value)} value={formData.primary_channel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="push">Push Notification</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary_channel">Secondary Channel</Label>
                  <Select onValueChange={(value) => handleChange('secondary_channel', value)} value={formData.secondary_channel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="push">Push Notification</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quiet_hours_start">Quiet Hours Start</Label>
                  <Input
                    id="quiet_hours_start"
                    type="time"
                    value={formData.quiet_hours_start}
                    onChange={(e) => handleChange('quiet_hours_start', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quiet_hours_end">Quiet Hours End</Label>
                  <Input
                    id="quiet_hours_end"
                    type="time"
                    value={formData.quiet_hours_end}
                    onChange={(e) => handleChange('quiet_hours_end', e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="business_hours_only"
                    checked={formData.business_hours_only}
                    onCheckedChange={(checked) => handleChange('business_hours_only', checked)}
                  />
                  <Label htmlFor="business_hours_only">Business Hours Only</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="weekend_notifications"
                    checked={formData.weekend_notifications}
                    onCheckedChange={(checked) => handleChange('weekend_notifications', checked)}
                  />
                  <Label htmlFor="weekend_notifications">Weekend Notifications</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cooldown_hours">Cooldown Hours</Label>
                  <Input
                    id="cooldown_hours"
                    type="number"
                    min="1"
                    value={formData.cooldown_hours}
                    onChange={(e) => handleChange('cooldown_hours', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_notifications_per_day">Max Notifications Per Day</Label>
                  <Input
                    id="max_notifications_per_day"
                    type="number"
                    min="1"
                    value={formData.max_notifications_per_day}
                    onChange={(e) => handleChange('max_notifications_per_day', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Thresholds Tab */}
            <TabsContent value="thresholds" className="space-y-4">
              {productType === 'costbars' ? (
                /* ── Costbars: all 7 threshold fields ── */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      title="Sets the minimum health level that triggers a notification. Yellow includes Yellow and Red projects; Green includes all."
                      htmlFor="overall_health_threshold">Overall Health Threshold</Label>
                    <Select onValueChange={(value) => handleChange('overall_health_threshold', value)} value={formData.overall_health_threshold}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {healthOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      title="Compares start or finish dates to baseline dates, if no baseline it is flagged in the notification."
                      htmlFor="days_overdue_threshold">Days Overdue Threshold</Label>
                    <Input
                      id="days_overdue_threshold"
                      type="number"
                      min="0"
                      value={formData.days_overdue_threshold}
                      onChange={(e) => handleChange('days_overdue_threshold', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      title="Compares the Budget Cost in the project to the current forecast. Does not look at Baseline."
                      htmlFor="budget_overrun_percent">Budget Overrun % Threshold</Label>
                    <Input
                      id="budget_overrun_percent"
                      type="number"
                      min="0"
                      value={formData.budget_overrun_percent}
                      onChange={(e) => handleChange('budget_overrun_percent', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      title="Sets the minimum commitment level that triggers a notification. Moderate includes Moderate, Strong and Full projects."
                      htmlFor="executive_commitment_threshold">Executive Commitment Threshold</Label>
                    <Select onValueChange={(value) => handleChange('executive_commitment_threshold', value)} value={formData.executive_commitment_threshold}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {commitmentOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="risk_size_complexity_threshold"
                      title="Sets the minimum risk score that triggers a notification. Higher values narrow alerts to only the most complex projects.">Risk/Size/Complexity Threshold</Label>
                    <Select onValueChange={(value) => handleChange('risk_size_complexity_threshold', value)} value={formData.risk_size_complexity_threshold}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {riskOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      title="Be sure to run the PPM Prioritize process from Costbars client to populate the Strategic Value for the Projects."
                      htmlFor="strategic_value_threshold">Strategic Value Threshold</Label>
                    <Input
                      id="strategic_value_threshold"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.strategic_value_threshold}
                      onChange={(e) => handleChange('strategic_value_threshold', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      title="Be sure to run the PPM Risk Score process from Costbars client to populate the Risk or Likelihood of success value for the Projects."
                      htmlFor="likelyhood_of_success">Likelihood of Success Threshold</Label>
                    <Input
                      id="likelyhood_of_success"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.likelyhood_of_success}
                      onChange={(e) => handleChange('likelyhood_of_success', e.target.value)}
                    />
                  </div>

                  <p className="md:col-span-2 text-xs text-gray-500">
                    Assumptions are made if fields are left empty in the project data. See Knowledge Base for details.
                  </p>
                </div>

              ) : productType === 'timebars' ? (
                /* ── Timebars: 3 configurable thresholds ── */
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
                    <p className="text-sm text-green-800">
                      <strong>Timebars — 3 Conditions Evaluated.</strong> A notification fires when <strong>all three</strong> conditions
                      are true on the same in-progress project. Use the selectors below to set the minimum threshold for each field.
                      The system &ldquo;climbs the chain&rdquo; — selecting Yellow will alert on Yellow <em>and</em> Red projects.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        title="Minimum health level to trigger a notification. Yellow includes Yellow and Red. Empty project values are treated as Red."
                        htmlFor="overall_health_threshold">Overall Health Threshold</Label>
                      <Select onValueChange={(value) => handleChange('overall_health_threshold', value)} value={formData.overall_health_threshold}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {healthOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">Empty project value treated as Red.</p>
                    </div>

                    <div className="space-y-2">
                      <Label
                        title="Minimum commitment level to trigger a notification. Moderate includes Moderate, Strong and Full. Empty project values are treated as Moderate."
                        htmlFor="executive_commitment_threshold">Senior Level Commitment Threshold</Label>
                      <Select onValueChange={(value) => handleChange('executive_commitment_threshold', value)} value={formData.executive_commitment_threshold}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {commitmentOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">Empty project value treated as Moderate.</p>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="risk_size_complexity_threshold"
                        title="Minimum risk score to trigger a notification. Higher values narrow alerts to only the most complex projects. Empty project values are treated as triggering.">Risk/Size/Complexity Threshold</Label>
                      <Select onValueChange={(value) => handleChange('risk_size_complexity_threshold', value)} value={formData.risk_size_complexity_threshold}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {riskOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">Empty project value treated as triggering (assumed complex).</p>
                    </div>

                    <p className="text-xs text-gray-500 self-end pb-1">
                      Ensure Project Status is set to <strong>In-Progress</strong> in your Timebars app for projects to be evaluated.
                    </p>
                  </div>
                </div>

              ) : (
                /* ── Agilebars: 2 configurable thresholds ── */
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                    <p className="text-sm text-blue-800">
                      <strong>Agilebars — 2 Conditions Evaluated.</strong> A notification fires when <strong>both</strong> conditions
                      are true on the same in-progress project. Use the selectors below to set the minimum threshold for each field.
                      The system &ldquo;climbs the chain&rdquo; — selecting Yellow will alert on Yellow <em>and</em> Red projects.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        title="Minimum health level to trigger a notification. Yellow includes Yellow and Red. Empty project values are treated as Red."
                        htmlFor="overall_health_threshold">Overall Health Threshold</Label>
                      <Select onValueChange={(value) => handleChange('overall_health_threshold', value)} value={formData.overall_health_threshold}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {healthOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">Empty project value treated as Red.</p>
                    </div>

                    <div className="space-y-2">
                      <Label
                        title="Minimum commitment level to trigger a notification. Moderate includes Moderate, Strong and Full. Empty project values are treated as Moderate."
                        htmlFor="executive_commitment_threshold">Senior Level Commitment Threshold</Label>
                      <Select onValueChange={(value) => handleChange('executive_commitment_threshold', value)} value={formData.executive_commitment_threshold}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {commitmentOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">Empty project value treated as Moderate.</p>
                    </div>

                    <p className="text-xs text-gray-500 md:col-span-2">
                      Ensure Project Status is set to <strong>In-Progress</strong> in your Agilebars app for projects to be evaluated.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Escalation Tab */}
            <TabsContent value="escalation" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enable_escalation"
                    checked={formData.enable_escalation}
                    onCheckedChange={(checked) => handleChange('enable_escalation', checked)}
                  />
                  <Label
                    htmlFor="enable_escalation"
                    title="Check to enable SMS messagging to the Phone number below. The Escalation Level field on the project must be set to Executives. Use the Core Detail form available from the Project Green Bar."
                  >Enable Escalation</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="escalation_delay_hours">Escalation Delay (Hours)</Label>
                  <Input
                    id="escalation_delay_hours"
                    type="number"
                    min="1"
                    value={formData.escalation_delay_hours}
                    onChange={(e) => handleChange('escalation_delay_hours', e.target.value)}
                    disabled={!formData.enable_escalation}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_escalation_attempts">Max Escalation Attempts</Label>
                  <Input
                    id="max_escalation_attempts"
                    type="number"
                    min="1"
                    value={formData.max_escalation_attempts}
                    onChange={(e) => handleChange('max_escalation_attempts', e.target.value)}
                    disabled={!formData.enable_escalation}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="escalation_phone">Escalation Phone</Label>
                  <Input
                    id="escalation_phone"
                    value={formData.escalation_phone}
                    onChange={(e) => handleChange('escalation_phone', e.target.value)}
                    placeholder="+16292765378"
                    disabled={!formData.enable_escalation}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Additional notes about this notification configuration..."
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 pt-6">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (isEditMode ? 'Update Notification' : 'Create Notification')}
            </Button>
          </div>
          
          {/* Debug errors - remove this after fixing */}
          {Object.keys(errors).length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
              <h4 className="font-medium text-red-800 mb-2">Validation Errors:</h4>
              <pre className="text-xs text-red-700 whitespace-pre-wrap">
                {JSON.stringify(errors, null, 2)}
              </pre>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default NotificationForm;