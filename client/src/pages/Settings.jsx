import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Settings, MessageSquare, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    
    // Simulate API call for feedback
    setTimeout(() => {
      setSubmitted(true);
      setFeedback('');
      setTimeout(() => setSubmitted(false), 3000);
    }, 500);
  };

  return (
    <Layout activeMenu="Settings">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="text-gray-500" />
          Settings & Feedback
        </h2>
        <p className="text-gray-500 text-sm mt-1">Manage your account preferences and share your feedback</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Placeholder */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-bold text-lg text-gray-900 mb-4 border-b border-gray-100 pb-2">Profile Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Company Name</label>
              <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none" defaultValue="Acme Corp" disabled />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Email Address</label>
              <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none" defaultValue="admin@acmecorp.com" disabled />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Notification Preferences</label>
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="emailNotif" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                <label htmlFor="emailNotif" className="text-sm text-gray-700">Email notifications</label>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-bold text-lg text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
            <MessageSquare size={18} className="text-blue-500" />
            Send Feedback
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Help us improve CarbonTrace. Share your suggestions, feature requests, or report issues.
          </p>
          
          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl flex items-center gap-3">
              <CheckCircle2 size={20} className="text-emerald-500" />
              <p className="font-medium">Thank you for your feedback!</p>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit}>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What can we do better?"
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-900 h-32 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none mb-4"
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!feedback.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2 px-6 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save size={16} />
                  Submit Feedback
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
