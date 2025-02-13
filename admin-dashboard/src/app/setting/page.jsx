import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  Settings as SettingsIcon,
  Mail,
  Smartphone,
  Moon,
  Sun,
  Lock,
  Key,
  Languages,
  Clock
} from 'lucide-react';

function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true,
    marketing: false
  });
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-12 min-h-[600px]">
            {/* Sidebar */}
            <div className="col-span-3 border-r border-gray-200">
              <nav className="p-4 space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md ${
                    activeTab === 'notifications'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md ${
                    activeTab === 'security'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Security
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md ${
                    activeTab === 'preferences'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <SettingsIcon className="w-4 h-4" />
                  Preferences
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="col-span-9 p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
                        <div className="mt-2 flex items-center gap-4">
                          <img
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt="Profile"
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <button className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100">
                            Change Photo
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">First Name</label>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            defaultValue="John"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Last Name</label>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            defaultValue="Smith"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            defaultValue="john.smith@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Phone</label>
                          <input
                            type="tel"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            defaultValue="+1 (555) 123-4567"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                            <p className="text-sm text-gray-500">Receive notifications via email</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.email}
                            onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Smartphone className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                            <p className="text-sm text-gray-500">Receive push notifications</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.push}
                            onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Lock className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Change Password</p>
                            <p className="text-sm text-gray-500">Update your password regularly</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100">
                          Update
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Key className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                            <p className="text-sm text-gray-500">Add an extra layer of security</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100">
                          Enable
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">System Preferences</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {theme === 'light' ? (
                            <Sun className="w-5 h-5 text-gray-400" />
                          ) : (
                            <Moon className="w-5 h-5 text-gray-400" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">Theme</p>
                            <p className="text-sm text-gray-500">Choose your preferred theme</p>
                          </div>
                        </div>
                        <select
                          value={theme}
                          onChange={(e) => setTheme(e.target.value)}
                          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Languages className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Language</p>
                            <p className="text-sm text-gray-500">Select your preferred language</p>
                          </div>
                        </div>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Time Zone</p>
                            <p className="text-sm text-gray-500">Set your local time zone</p>
                          </div>
                        </div>
                        <select
                          value={timezone}
                          onChange={(e) => setTimezone(e.target.value)}
                          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="UTC">UTC</option>
                          <option value="EST">EST</option>
                          <option value="PST">PST</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;