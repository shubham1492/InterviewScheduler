import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings as SettingsIcon, 
  Calendar, 
  Video, 
  Bell, 
  Sun, 
  Moon, 
  User, 
  Key, 
  Webhook, 
  ShieldCheck, 
  Check, 
  Copy, 
  Save, 
  RefreshCw,
  Sparkles,
  Link2
} from 'lucide-react';

export const SettingsView = () => {
  const { isDarkMode, toggleDarkMode, showToast, hostWhatsAppPhone, setHostWhatsAppPhone } = useApp();

  const [activeTab, setActiveTab] = useState('integrations');

  // Integrations State
  const [integrations, setIntegrations] = useState({
    googleCal: true,
    msCal: false,
    zoom: true,
    googleMeet: true
  });

  // Notifications State
  const [notifications, setNotifications] = useState({
    emailInvite: true,
    emailReminder: true,
    smsReminder: false,
    cancellationAlerts: true
  });

  // API Key State
  const [apiKey, setApiKey] = useState('sk_live_99a8b7c6d5e4f3a2b1_sch');
  const [webhookUrl, setWebhookUrl] = useState('https://api.yourdomain.com/webhooks/interviews');
  const [copiedKey, setCopiedKey] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    showToast('API Key copied to clipboard');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleGenerateKey = () => {
    const newKey = `sk_live_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
    setApiKey(newKey);
    showToast('New secret API key generated!');
  };

  const handleSave = () => {
    showToast('Settings & integration preferences saved successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
            <SettingsIcon className="w-4 h-4" />
            <span>Platform Configuration</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Settings & Integrations
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage calendar integrations, notification channels, security keys, and UI appearance.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 shadow-lg shadow-brand-500/25 active:scale-95 transition-all flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center space-x-1 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'integrations', label: 'Calendar & Video Apps', icon: Calendar },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'appearance', label: 'Appearance & Theme', icon: Sun },
          { id: 'profile', label: 'Profile & Security', icon: User },
          { id: 'apikeys', label: 'Webhooks & API Keys', icon: Key },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content 1: Integrations */}
      {activeTab === 'integrations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Google Calendar */}
          <div className="glass-panel p-6 rounded-card border border-white/60 dark:border-slate-800 shadow-soft flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Google Calendar</h4>
                <p className="text-xs text-slate-500">2-way sync for primary availability</p>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 mt-1">
                  <Check className="w-3 h-3" />
                  <span>Connected as alex.rivera@tech.io</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setIntegrations({ ...integrations, googleCal: !integrations.googleCal })}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                integrations.googleCal ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                integrations.googleCal ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Microsoft Outlook Calendar */}
          <div className="glass-panel p-6 rounded-card border border-white/60 dark:border-slate-800 shadow-soft flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Microsoft Outlook</h4>
                <p className="text-xs text-slate-500">Office 365 calendar integration</p>
                <span className="text-[10px] text-slate-400 mt-1 block">Not connected</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIntegrations({ ...integrations, msCal: !integrations.msCal });
                showToast(integrations.msCal ? 'Disconnected Outlook' : 'Connected Microsoft Outlook');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                integrations.msCal 
                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30' 
                  : 'bg-brand-600 text-white hover:bg-brand-500'
              }`}
            >
              {integrations.msCal ? 'Connected' : 'Connect'}
            </button>
          </div>

          {/* Zoom */}
          <div className="glass-panel p-6 rounded-card border border-white/60 dark:border-slate-800 shadow-soft flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-500 flex items-center justify-center">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Zoom Meetings</h4>
                <p className="text-xs text-slate-500">Auto-generate Zoom video URLs</p>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 mt-1">
                  <Check className="w-3 h-3" />
                  <span>Connected (Pro License)</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setIntegrations({ ...integrations, zoom: !integrations.zoom })}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                integrations.zoom ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                integrations.zoom ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Google Meet */}
          <div className="glass-panel p-6 rounded-card border border-white/60 dark:border-slate-800 shadow-soft flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Google Meet</h4>
                <p className="text-xs text-slate-500">Default video channel</p>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 mt-1">
                  <Check className="w-3 h-3" />
                  <span>Default Active</span>
                </span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-bold border border-emerald-500/20">
              Active
            </span>
          </div>

        </div>
      )}

      {/* Tab Content 2: Notifications */}
      {activeTab === 'notifications' && (
        <div className="glass-panel p-6 rounded-card border border-white/60 dark:border-slate-800 shadow-soft space-y-4 max-w-2xl">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Notification Channels</h3>
          
          {[
            { key: 'emailInvite', title: 'Email Calendar Invites', desc: 'Send automatic .ics invites to candidate & interviewer.' },
            { key: 'emailReminder', title: '24-Hour Email Reminders', desc: 'Notify candidates 1 day prior to scheduled interview.' },
            { key: 'smsReminder', title: 'SMS Text Message Alerts', desc: 'Send text reminders 15 minutes before meeting start.' },
            { key: 'cancellationAlerts', title: 'Cancellation & Reschedule Instant Alert', desc: 'Receive immediate push/email if candidate cancels.' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.title}</div>
                <div className="text-[11px] text-slate-400">{item.desc}</div>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                  notifications[item.key] ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  notifications[item.key] ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          ))}

          {/* Host WhatsApp Notification Configuration */}
          <div className="pt-4 space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider flex items-center space-x-1">
              <span>💬 Host WhatsApp Direct Alerts</span>
            </h4>
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
                  💬
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Host WhatsApp Target Phone</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Where 1-click booking notifications are dispatched (+91 9595579336)</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={hostWhatsAppPhone}
                  onChange={(e) => setHostWhatsAppPhone(e.target.value)}
                  placeholder="919595579336"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <button
                  onClick={() => showToast('WhatsApp Target Phone number updated successfully!')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/20 whitespace-nowrap"
                >
                  Update Phone
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: Appearance & Theme */}
      {activeTab === 'appearance' && (
        <div className="glass-panel p-6 rounded-card border border-white/60 dark:border-slate-800 shadow-soft space-y-6 max-w-2xl">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">UI Theme Preference</h3>
            <p className="text-xs text-slate-500">Switch between sleek Dark mode and clean Light mode.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => isDarkMode && toggleDarkMode()}
              className={`p-5 rounded-2xl border text-left space-y-3 transition-all ${
                !isDarkMode
                  ? 'border-brand-500 bg-brand-50/50 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">Light Mode</div>
                <div className="text-xs text-slate-400">Clean Apple minimal layout</div>
              </div>
            </button>

            <button
              onClick={() => !isDarkMode && toggleDarkMode()}
              className={`p-5 rounded-2xl border text-left space-y-3 transition-all ${
                isDarkMode
                  ? 'border-purple-500 bg-purple-950/40 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">Dark Mode (Default)</div>
                <div className="text-xs text-slate-400">Linear & Raycast dark aesthetic</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Tab Content 4: Profile */}
      {activeTab === 'profile' && (
        <div className="glass-panel p-6 rounded-card border border-white/60 dark:border-slate-800 shadow-soft space-y-4 max-w-2xl">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Host Profile Settings</h3>
          
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300">Host Display Name</label>
              <input
                type="text"
                defaultValue="Alex Rivera"
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300">Engineering Title</label>
              <input
                type="text"
                defaultValue="Full Stack Systems Engineer"
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300">Change Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 5: Webhooks & API Keys */}
      {activeTab === 'apikeys' && (
        <div className="space-y-6 max-w-3xl">
          
          {/* API Key Box */}
          <div className="glass-panel p-6 rounded-card border border-white/60 dark:border-slate-800 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Key className="w-4 h-4 text-brand-500" />
                  <span>Developer API Keys</span>
                </h3>
                <p className="text-xs text-slate-500">Authenticate API calls to schedule interviews programmatically.</p>
              </div>

              <button
                onClick={handleGenerateKey}
                className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold hover:bg-purple-500/20 transition-colors flex items-center space-x-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Roll Key</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 p-3 rounded-xl bg-slate-900 text-white font-mono text-xs">
              <span className="flex-1 truncate">{apiKey}</span>
              <button
                onClick={handleCopyKey}
                className="px-3 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-sans text-xs font-semibold flex items-center space-x-1"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Webhook Box */}
          <div className="glass-panel p-6 rounded-card border border-white/60 dark:border-slate-800 shadow-soft space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Webhook className="w-4 h-4 text-purple-500" />
                <span>Webhook Delivery URL</span>
              </h3>
              <p className="text-xs text-slate-500">Receive HTTP POST payloads when an interview is booked or modified.</p>
            </div>

            <div className="space-y-2">
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none"
              />
              
              <button
                onClick={() => showToast('Pinged test webhook payload to endpoint (Status 200 OK)')}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Send Test Webhook Ping
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
