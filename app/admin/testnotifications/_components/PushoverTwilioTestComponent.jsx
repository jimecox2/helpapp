// app/admin/testnotifications/_components/PushoverTwilioTestComponent.jsx
'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bell, Send, Settings, TestTube, MessageSquare } from 'lucide-react';
import { sendPushoverNotification, buildNotificationMessage } from '@/lib/notifications/pushover';
import { FRONTEND_URL } from '@/config/site';

const PushoverTwilioTestComponent = ({ jwt }) => {
  console.log('Client-side JWT:', jwt);

  const [testData, setTestData] = useState({
    message: 'Test notification from PPM system',
    title: 'PPM Test Alert',
    priority: 0,
    sound: 'pushover',
    url: '',
    url_title: '',
  });

  const [twilioData, setTwilioData] = useState({
    to: '',
    message: '🚨 EXECUTIVE ALERT: Test User\n\nProject: Test Project (TEST-001)\nExec Commitment: Full\nStrategic Value: 85\nSuccess Likelihood: 75\nBudget: $125,000\nWork Hours: 2,400\nIssue: Critical project with Red health status\n\nReview: ' + FRONTEND_URL + '/admin/notifications',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [configStatus, setConfigStatus] = useState(null);
  const [twilioConfigStatus, setTwilioConfigStatus] = useState(null);

  if (!jwt) {
    return (
      <Card className="max-w-2xl mx-auto mt-6">
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please sign in to test notifications.</p>
        </CardContent>
      </Card>
    );
  }

  const handleTestDataChange = (field, value) => {
    setTestData(prev => ({ ...prev, [field]: value }));
  };

  const handleTwilioDataChange = (field, value) => {
    setTwilioData(prev => ({ ...prev, [field]: value }));
  };

  const checkPushoverConfiguration = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${FRONTEND_URL}/api/notifications/pushover`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
      });

      // Check if response is OK before parsing JSON
      if (!response.ok) {
        const errorText = await response.text(); // Get raw response for debugging
        throw new Error(`HTTP ${response.status}: ${errorText || 'Method Not Allowed'}`);
      }

      const result = await response.json();
      if (response.ok) {
        setConfigStatus(result);
        toast.success('Pushover configuration is valid!');
      } else {
        setConfigStatus(result);
        toast.error(`Configuration error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error checking Pushover configuration:', error);
      toast.error(`Failed to check Pushover configuration: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkTwilioConfiguration = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${FRONTEND_URL}/api/notifications/twilio`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to check Twilio configuration'}`);
      }

      const result = await response.json();
      if (response.ok) {
        setTwilioConfigStatus(result);
        toast.success('Twilio configuration is valid!');
      } else {
        setTwilioConfigStatus(result);
        toast.error(`Configuration error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error checking Twilio configuration:', error);
      toast.error(`Failed to check Twilio configuration: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const sendPushoverTestNotification = async () => {
    if (!testData.message.trim()) {
      toast.error('Message is required');
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendPushoverNotification(testData.message, {
        title: testData.title,
        priority: testData.priority,
        sound: testData.sound,
        url: testData.url,
        url_title: testData.url_title,
      }, jwt);
      toast.success('Test Pushover notification sent successfully!');
      console.log('Pushover response:', result);
    } catch (error) {
      toast.error(`Failed to send Pushover notification: ${error.message}`);
      console.error('Pushover error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendTwilioTestNotification = async () => {
    if (!twilioData.to.trim() || !twilioData.message.trim()) {
      toast.error('Phone number and message are required');
      return;
    }

    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(twilioData.to.replace(/\s/g, ''))) {
      toast.error('Please enter a valid phone number (e.g., +1234567890)');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${FRONTEND_URL}/api/notifications/twilio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          to: twilioData.to,
          message: twilioData.message,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success('Test SMS sent successfully!');
        console.log('Twilio response:', result);
      } else {
        toast.error(`Failed to send SMS: ${result.error}`);
        console.error('Twilio API error:', result);
      }
    } catch (error) {
      toast.error(`Failed to send SMS: ${error.message}`);
      console.error('Twilio error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendActualNotificationMessage = async () => {
    const sampleNotificationConfig = {
      manager_name: 'Test User',
      days_overdue_threshold: 5,
      budget_overrun_percent: 20,
      overall_health_threshold: 'Red',
      executive_commitment_threshold: 'Moderate',
      strategic_value_threshold: 75,
      likelyhood_of_success: 60,
      risk_size_complexity_threshold: 'Significant Complexity',
      primary_channel: 'push',
      enable_escalation: true,
    };

    const sampleProjectData = {
      project_name: 'Website Redesign Project',
      issues: [
        'Budget exceeded by 25%',
        'Timeline delayed by 7 days',
        'Key stakeholder approval pending',
        'Resource allocation needs review',
      ],
    };

    setIsLoading(true);
    try {
      const actualMessage = buildNotificationMessage(sampleNotificationConfig, sampleProjectData);
      const result = await sendPushoverNotification(actualMessage, {
        title: 'PPM Alert - Sample Project',
        priority: 1,
        sound: 'pushover',
        url: FRONTEND_URL || '',
        url_title: 'View PPM Dashboard',
      }, jwt);
      toast.success('Actual notification message sent successfully!');
      console.log('Actual notification result:', result);
      console.log('Message sent:', actualMessage);
    } catch (error) {
      toast.error(`Failed to send actual notification: ${error.message}`);
      console.error('Actual notification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const priorityOptions = [
    { value: -2, label: 'Lowest' },
    { value: -1, label: 'Low' },
    { value: 0, label: 'Normal' },
    { value: 1, label: 'High' },
    { value: 2, label: 'Emergency' },
  ];

  const soundOptions = [
    'pushover', 'bike', 'bugle', 'cashregister', 'classical', 'cosmic', 'falling',
    'gamelan', 'incoming', 'intermission', 'magic', 'mechanical', 'pianobar',
    'siren', 'spacealarm', 'tugboat', 'alien', 'climb', 'persistent', 'echo', 'updown', 'none',
  ];

  return (
    <>
      <Card className="max-w-2xl mx-auto mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Pushover & Twilio Testing
          </CardTitle>
          <CardDescription className="text-gray-700">
            Test Pushover notifications and Twilio SMS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Pushover Status</h4>
                <p className="text-sm text-gray-700">
                  {configStatus
                    ? configStatus.features?.pushover
                      ? 'Configured'
                      : 'Not configured'
                    : 'Check configuration status'}
                </p>
              </div>
              <Button
                onClick={checkPushoverConfiguration}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Check Pushover
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Twilio Status</h4>
                <p className="text-sm text-gray-700">
                  {twilioConfigStatus
                    ? twilioConfigStatus.features?.sms
                      ? 'Configured'
                      : 'Not configured'
                    : 'Check configuration status'}
                </p>
              </div>
              <Button
                onClick={checkTwilioConfiguration}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Check Twilio
              </Button>
            </div>
          </div>

          {/* Pushover Test Message Form */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Pushover Test
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="test-title">Title</Label>
                <Input
                  id="test-title"
                  value={testData.title}
                  onChange={(e) => handleTestDataChange('title', e.target.value)}
                  placeholder="Notification title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-priority">Priority</Label>
                <Select
                  value={testData.priority.toString()}
                  onValueChange={(value) => handleTestDataChange('priority', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-message">Message</Label>
              <Textarea
                id="test-message"
                value={testData.message}
                onChange={(e) => handleTestDataChange('message', e.target.value)}
                placeholder="Enter your test message..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="test-sound">Sound</Label>
                <Select
                  value={testData.sound}
                  onValueChange={(value) => handleTestDataChange('sound', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {soundOptions.map((sound) => (
                      <SelectItem key={sound} value={sound}>
                        {sound}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-url">URL (optional)</Label>
                <Input
                  id="test-url"
                  value={testData.url}
                  onChange={(e) => handleTestDataChange('url', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-url-title">URL Title (optional)</Label>
              <Input
                id="test-url-title"
                value={testData.url_title}
                onChange={(e) => handleTestDataChange('url_title', e.target.value)}
                placeholder="Link text"
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button
                onClick={sendPushoverTestNotification}
                disabled={isLoading || !testData.message.trim()}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Test Pushover
                  </>
                )}
              </Button>
              <Button
                onClick={sendActualNotificationMessage}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Actual Notification
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Twilio SMS Test Form */}
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Twilio SMS Test
            </h4>
            <div className="space-y-2">
              <Label htmlFor="twilio-to">To Phone Number</Label>
              <Input
                id="twilio-to"
                value={twilioData.to}
                onChange={(e) => handleTwilioDataChange('to', e.target.value)}
                placeholder="+1234567890"
              />
              <p className="text-xs text-gray-500">
                Include country code (e.g., +1 for US/Canada)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="twilio-message">SMS Message</Label>
              <Textarea
                id="twilio-message"
                value={twilioData.message}
                onChange={(e) => handleTwilioDataChange('message', e.target.value)}
                placeholder="Enter your test SMS message..."
                rows={6}
              />
              <p className="text-xs text-gray-500">
                SMS messages are limited to 160 characters per segment
              </p>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={sendTwilioTestNotification}
                disabled={isLoading || !twilioData.to.trim() || !twilioData.message.trim()}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Test SMS
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Configuration Display */}
          {(configStatus || twilioConfigStatus) && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Configuration Details</h4>
              <div className="text-sm space-y-1">
                <div>Pushover: {configStatus?.features?.pushover ? '✅ Set' : '❌ Missing'}</div>
                <div>Twilio SMS: {twilioConfigStatus?.features?.sms ? '✅ Set' : '❌ Missing'}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <ToastContainer />
    </>
  );
};

export default PushoverTwilioTestComponent;