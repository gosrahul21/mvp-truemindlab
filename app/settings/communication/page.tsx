'use client'

import { useState, useEffect } from 'react'
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  ShieldCheck, 
  Zap, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Save,
  ChevronDown,
  Edit2,
  ExternalLink,
  Info,
  Globe
} from 'lucide-react'
import { OrganizationCommunication } from '@/lib/supabase/types'

export default function CommunicationSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [testing, setTesting] = useState<string | null>(null)
  const [provisioning, setProvisioning] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>('twilio')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const [formData, setFormData] = useState<Partial<OrganizationCommunication>>({
    twilio_account_sid: '',
    twilio_auth_token: '',
    twilio_phone_number: '',
    twilio_voice_number: '',
    twilio_use_own_number: true,
    twilio_provisioning_status: 'none',
    whatsapp_provider: 'twilio',
    whatsapp_api_key: '',
    whatsapp_phone_number: '',
    email_provider: 'sendgrid',
    email_api_key: '',
    email_from_address: '',
    email_from_name: ''
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      const res = await fetch('/api/settings/communication')
      const data = await res.json()
      if (data && !data.error) {
        setFormData(prev => ({ ...prev, ...data }))
      }
    } catch (err) {
      console.error('Error fetching settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSection = async (section: string) => {
    setSaving(section)
    setMessage(null)
    try {
      const res = await fetch('/api/settings/communication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!res.ok) throw new Error('Failed to save settings')
      setMessage({ type: 'success', text: `${section.toUpperCase()} settings saved.` })
      // Delay closing to show success
      setTimeout(() => setActiveSection(null), 1000)
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(null)
    }
  }

  const testConnection = async (type: string, config: any) => {
    setTesting(type)
    try {
      const res = await fetch('/api/settings/communication/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, config })
      })
      const data = await res.json()
      if (res.ok) {
        setMessage({ type: 'success', text: `Test Success: ${data.message}` })
      } else {
        setMessage({ type: 'error', text: `Test Failed: ${data.error}` })
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setTesting(null)
    }
  }

  const handleProvision = async () => {
    setProvisioning(true)
    try {
      // Simulate provisioning API call
      const res = await fetch('/api/settings/communication/provision', { method: 'POST' })
      if (!res.ok) throw new Error('Provisioning failed')
      setFormData(prev => ({ 
        ...prev, 
        twilio_provisioning_status: 'provisioned',
        twilio_phone_number: '+1888-AUTO-GEN' 
      }))
      setMessage({ type: 'success', text: 'New AI phone number provisioned successfully!' })
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setProvisioning(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      {/* Header */}
      <header className="rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-[#0d1220]/90">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
            <Zap className="text-white" size={24} />
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-2xl font-semibold tracking-tight text-transparent dark:from-gray-100 dark:to-gray-400">
              Communication Center
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage Twilio, WhatsApp, and Email integrations for your AI workforce</p>
          </div>
        </div>
      </header>

      {/* Accordion Sections */}
      <div className="space-y-4">
        
        {/* TWILIO SECTION */}
        <div className={`group overflow-hidden rounded-[32px] border transition-all duration-300 ${
          activeSection === 'twilio' 
          ? 'bg-white border-indigo-200 shadow-xl dark:bg-[#0d1220] dark:border-indigo-500/30' 
          : 'bg-gray-50/50 border-transparent hover:border-gray-200 dark:bg-[#11192d]/50 dark:hover:border-gray-800'
        }`}>
          <button 
            onClick={() => setActiveSection(activeSection === 'twilio' ? null : 'twilio')}
            className="w-full flex items-center justify-between p-8 text-left"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl transition-colors ${activeSection === 'twilio' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 dark:bg-[#0d1220]'}`}>
                <Phone size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Twilio (SMS & Voice)</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {formData.twilio_use_own_number ? 'Using custom credentials' : 'Managed AI phone number'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {activeSection !== 'twilio' && <Edit2 size={18} className="text-gray-400 group-hover:text-indigo-500" />}
              <ChevronDown className={`transition-transform duration-300 ${activeSection === 'twilio' ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {activeSection === 'twilio' && (
            <div className="p-8 pt-0 border-t border-gray-100 dark:border-gray-800/50 animate-in slide-in-from-top-4 duration-300">
              <div className="space-y-8">
                {/* Number Type Toggle */}
                <div className="flex p-1 bg-gray-100 dark:bg-[#11192d] rounded-2xl w-fit">
                  <button 
                    onClick={() => setFormData({ ...formData, twilio_use_own_number: true })}
                    className={`px-6 py-2 rounded-xl text-xs font-bold transition ${formData.twilio_use_own_number ? 'bg-white shadow-sm text-indigo-600 dark:bg-indigo-600 dark:text-white' : 'text-gray-500'}`}
                  >
                    Bring Own Credentials
                  </button>
                  <button 
                    onClick={() => setFormData({ ...formData, twilio_use_own_number: false })}
                    className={`px-6 py-2 rounded-xl text-xs font-bold transition ${!formData.twilio_use_own_number ? 'bg-white shadow-sm text-indigo-600 dark:bg-indigo-600 dark:text-white' : 'text-gray-500'}`}
                  >
                    Managed Provisioning
                  </button>
                </div>

                {formData.twilio_use_own_number ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 px-1">Account SID</label>
                      <input 
                        type="text"
                        value={formData.twilio_account_sid || ''}
                        onChange={(e) => setFormData({ ...formData, twilio_account_sid: e.target.value })}
                        className="w-full bg-gray-50 border-gray-200 dark:bg-[#11192d] dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none"
                        placeholder="ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 px-1">Auth Token</label>
                      <input 
                        type="password"
                        value={formData.twilio_auth_token || ''}
                        onChange={(e) => setFormData({ ...formData, twilio_auth_token: e.target.value })}
                        className="w-full bg-gray-50 border-gray-200 dark:bg-[#11192d] dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none"
                        placeholder="••••••••••••••••••••••••••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 px-1">SMS Number</label>
                      <input 
                        type="text"
                        value={formData.twilio_phone_number || ''}
                        onChange={(e) => setFormData({ ...formData, twilio_phone_number: e.target.value })}
                        className="w-full bg-gray-50 border-gray-200 dark:bg-[#11192d] dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none"
                        placeholder="+1234567890"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 px-1">Voice Number (Optional)</label>
                        <span className="text-[9px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-500 uppercase">Leave blank to use SMS Number</span>
                      </div>
                      <input 
                        type="text"
                        value={formData.twilio_voice_number || ''}
                        onChange={(e) => setFormData({ ...formData, twilio_voice_number: e.target.value })}
                        className="w-full bg-gray-50 border-gray-200 dark:bg-[#11192d] dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none"
                        placeholder="+1234567890"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-indigo-50/50 dark:bg-indigo-500/5 rounded-3xl p-8 border border-indigo-100 dark:border-indigo-500/20">
                    <div className="flex flex-col items-center text-center max-w-sm mx-auto space-y-4">
                      <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl">
                        <Globe size={32} />
                      </div>
                      {formData.twilio_provisioning_status === 'provisioned' ? (
                        <div>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">Active Phone Number</p>
                          <p className="text-2xl font-black text-indigo-600 mt-1">{formData.twilio_phone_number}</p>
                          <button className="mt-4 text-xs font-bold text-indigo-500 hover:text-indigo-600 flex items-center gap-1.5 mx-auto">
                            Manage Routing <ExternalLink size={12} />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">Get a Managed Number</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">We will automatically provision a local phone number for your AI agents to use for SMS and Voice calling.</p>
                          <button 
                            onClick={handleProvision}
                            disabled={provisioning}
                            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2"
                          >
                            {provisioning ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                            {provisioning ? 'Provisioning...' : 'Provision New AI Number'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button 
                    onClick={() => testConnection('twilio', { sid: formData.twilio_account_sid, token: formData.twilio_auth_token })}
                    disabled={testing === 'twilio' || !formData.twilio_use_own_number}
                    className="text-xs font-bold text-indigo-500 hover:text-indigo-600 flex items-center gap-2 disabled:opacity-50"
                  >
                    {testing === 'twilio' ? <Loader2 size={12} className="animate-spin" /> : <ShieldCheck size={14} />}
                    Verify Credentials
                  </button>
                  <button 
                    onClick={() => handleSaveSection('twilio')}
                    disabled={!!saving}
                    className="bg-[#0f172a] text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg hover:bg-indigo-600 transition flex items-center gap-2"
                  >
                    {saving === 'twilio' ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                    Save Twilio Configuration
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* WHATSAPP SECTION */}
        <div className={`group overflow-hidden rounded-[32px] border transition-all duration-300 ${
          activeSection === 'whatsapp' 
          ? 'bg-white border-emerald-200 shadow-xl dark:bg-[#0d1220] dark:border-emerald-500/30' 
          : 'bg-gray-50/50 border-transparent hover:border-gray-200 dark:bg-[#11192d]/50 dark:hover:border-gray-800'
        }`}>
          <button 
            onClick={() => setActiveSection(activeSection === 'whatsapp' ? null : 'whatsapp')}
            className="w-full flex items-center justify-between p-8 text-left"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl transition-colors ${activeSection === 'whatsapp' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600 dark:bg-[#0d1220]'}`}>
                <MessageSquare size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">WhatsApp Integration</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Business communication via WhatsApp</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {activeSection !== 'whatsapp' && <Edit2 size={18} className="text-gray-400 group-hover:text-emerald-500" />}
              <ChevronDown className={`transition-transform duration-300 ${activeSection === 'whatsapp' ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {activeSection === 'whatsapp' && (
            <div className="p-8 pt-0 border-t border-gray-100 dark:border-gray-800/50 animate-in slide-in-from-top-4 duration-300">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 px-1">Provider</label>
                    <select 
                      value={formData.whatsapp_provider || 'twilio'}
                      onChange={(e) => setFormData({ ...formData, whatsapp_provider: e.target.value as any })}
                      className="w-full bg-gray-50 border-gray-200 dark:bg-[#11192d] dark:border-gray-700 rounded-xl px-4 py-3 text-sm"
                    >
                      <option value="twilio">Twilio WhatsApp</option>
                      <option value="meta">Meta Business API</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 px-1">API Key / Token</label>
                    <input 
                      type="password"
                      value={formData.whatsapp_api_key || ''}
                      onChange={(e) => setFormData({ ...formData, whatsapp_api_key: e.target.value })}
                      className="w-full bg-gray-50 border-gray-200 dark:bg-[#11192d] dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button 
                    onClick={() => testConnection('whatsapp', { apiKey: formData.whatsapp_api_key })}
                    disabled={testing === 'whatsapp'}
                    className="text-xs font-bold text-emerald-500 hover:text-emerald-600 flex items-center gap-2"
                  >
                    {testing === 'whatsapp' ? <Loader2 size={12} className="animate-spin" /> : <ShieldCheck size={14} />}
                    Verify API Key
                  </button>
                  <button 
                    onClick={() => handleSaveSection('whatsapp')}
                    disabled={!!saving}
                    className="bg-[#0f172a] text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg hover:bg-emerald-600 transition"
                  >
                    Save WhatsApp
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* EMAIL SECTION */}
        <div className={`group overflow-hidden rounded-[32px] border transition-all duration-300 ${
          activeSection === 'email' 
          ? 'bg-white border-purple-200 shadow-xl dark:bg-[#0d1220] dark:border-purple-500/30' 
          : 'bg-gray-50/50 border-transparent hover:border-gray-200 dark:bg-[#11192d]/50 dark:hover:border-gray-800'
        }`}>
          <button 
            onClick={() => setActiveSection(activeSection === 'email' ? null : 'email')}
            className="w-full flex items-center justify-between p-8 text-left"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl transition-colors ${activeSection === 'email' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 dark:bg-[#0d1220]'}`}>
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Email Provider</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Outbound campaigns and follow-ups</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {activeSection !== 'email' && <Edit2 size={18} className="text-gray-400 group-hover:text-purple-500" />}
              <ChevronDown className={`transition-transform duration-300 ${activeSection === 'email' ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {activeSection === 'email' && (
            <div className="p-8 pt-0 border-t border-gray-100 dark:border-gray-800/50 animate-in slide-in-from-top-4 duration-300">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 px-1">Provider</label>
                    <select 
                      value={formData.email_provider || 'sendgrid'}
                      onChange={(e) => setFormData({ ...formData, email_provider: e.target.value as any })}
                      className="w-full bg-gray-50 border-gray-200 dark:bg-[#11192d] dark:border-gray-700 rounded-xl px-4 py-3 text-sm"
                    >
                      <option value="sendgrid">SendGrid</option>
                      <option value="postmark">Postmark</option>
                      <option value="ses">Amazon SES</option>
                      <option value="smtp">Custom SMTP</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 px-1">API Key / SMTP Password</label>
                    <input 
                      type="password"
                      value={formData.email_api_key || ''}
                      onChange={(e) => setFormData({ ...formData, email_api_key: e.target.value })}
                      className="w-full bg-gray-50 border-gray-200 dark:bg-[#11192d] dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 px-1">From Address</label>
                    <input 
                      type="email"
                      value={formData.email_from_address || ''}
                      onChange={(e) => setFormData({ ...formData, email_from_address: e.target.value })}
                      className="w-full bg-gray-50 border-gray-200 dark:bg-[#11192d] dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 px-1">From Name</label>
                    <input 
                      type="text"
                      value={formData.email_from_name || ''}
                      onChange={(e) => setFormData({ ...formData, email_from_name: e.target.value })}
                      className="w-full bg-gray-50 border-gray-200 dark:bg-[#11192d] dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button 
                    onClick={() => testConnection(formData.email_provider || 'sendgrid', { apiKey: formData.email_api_key })}
                    disabled={!!testing}
                    className="text-xs font-bold text-purple-500 hover:text-purple-600 flex items-center gap-2"
                  >
                    {testing ? <Loader2 size={12} className="animate-spin" /> : <ShieldCheck size={14} />}
                    Verify Connection
                  </button>
                  <button 
                    onClick={() => handleSaveSection('email')}
                    disabled={!!saving}
                    className="bg-[#0f172a] text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg hover:bg-purple-600 transition"
                  >
                    Save Email
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Global Notifications */}
      {message && (
        <div className="fixed bottom-8 right-8 z-[100] w-80 animate-in slide-in-from-right duration-300">
          <div className={`p-4 rounded-3xl border shadow-2xl flex items-start gap-4 ${
            message.type === 'success' 
              ? 'bg-indigo-50 border-indigo-100 text-indigo-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300' 
              : 'bg-red-50 border-red-100 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="mt-1 flex-shrink-0" size={20} /> : <AlertCircle className="mt-1 flex-shrink-0" size={20} />}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest">{message.type === 'success' ? 'Update Complete' : 'Error'}</p>
              <p className="text-[11px] mt-1 font-medium leading-relaxed">{message.text}</p>
            </div>
            <button onClick={() => setMessage(null)} className="ml-auto text-gray-400 hover:text-gray-900 transition-colors">×</button>
          </div>
        </div>
      )}
    </div>
  )
}
