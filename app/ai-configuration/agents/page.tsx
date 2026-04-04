'use client'

import { useState } from 'react'
import { 
  CoreAgentIcon, 
  PlusIcon, 
  ChevronDownIcon
} from '@/app/components/dashboard/PulseIcons'

export default function CoreAgentPage() {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [doctors, setDoctors] = useState([
    { name: 'Dr. Mehta', spec: 'Implants & Oral Surgery', availability: 'Mon, Wed, Fri' },
    { name: 'Dr. Shah', spec: 'Orthodontics & Braces', availability: 'Tue, Thu, Sat' },
  ])

  // Form State
  const [clinicName, setClinicName] = useState('City Dental')
  const [agentName, setAgentName] = useState('Priya')
  const [specialty, setSpecialty] = useState('Dental / Oral Care')
  const [language, setLanguage] = useState('English + Hindi')
  const [contact, setContact] = useState('+91 98765 43210')
  const [bookingLink, setBookingLink] = useState('citydental.in/book')
  const [additionalDetails, setAdditionalDetails] = useState('We have free parking in the basement. Always mention our EMI payment option when a patient asks about cost.')
  const [advancedOverride, setAdvancedOverride] = useState('')

  return (
    <div className="flex flex-col min-h-screen">
      {/* TOPBAR */}
      <div className="h-[56px] border-b border-[#ffffff0f] flex items-center px-7 sticky top-0 bg-[#0A0D12] z-50">
        <div className="flex-1">
          <h1 className="text-[15px] font-medium text-[#E8EBF2]">Core Agent</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="pulse-btn pulse-btn-ghost">Preview conversation</button>
          <button className="pulse-btn pulse-btn-primary">
            Save changes
          </button>
        </div>
      </div>

      <div className="p-7 flex flex-col gap-5 overflow-y-auto pb-24">
        {/* HERO */}
        <div className="pulse-card p-6 flex items-center gap-5 relative overflow-hidden group">
          <div className="absolute top-[-40px] right-[-40px] w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(79,126,255,0.1)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4F7EFF] to-[#7B5FFF] flex items-center justify-center shrink-0 shadow-lg shadow-[#4f7eff1a]">
            <CoreAgentIcon className="w-7 h-7 text-white" />
          </div>

          <div className="flex-1">
            <div className="font-['Fraunces'] text-[22px] font-normal text-[#E8EBF2] tracking-[-0.02em]">
              Your <em>clinic agent</em>
            </div>
            <div className="text-[12px] text-[#555D72] mt-1">One AI. Four patient-facing modes. All conversations, consistent voice.</div>
            <div className="flex gap-1.5 mt-3 flex-wrap">
              <span className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border border-[#22d3a840] bg-[#22d3a810] text-[#22D3A8]">
                <span className="w-1 h-1 rounded-full bg-current" /> Inbound
              </span>
              <span className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border border-[#a78bfa40] bg-[#a78bfa10] text-[#A78BFA]">
                <span className="w-1 h-1 rounded-full bg-current" /> Follow-up
              </span>
              <span className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border border-[#ff6b6b40] bg-[#ff6b6b10] text-[#FF6B6B]">
                <span className="w-1 h-1 rounded-full bg-current" /> Campaign
              </span>
              <span className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border border-[#3dd68c40] bg-[#3dd68c10] text-[#3DD68C]">
                <span className="w-1 h-1 rounded-full bg-current" /> Feedback
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="bg-[#171C28] border border-[#ffffff0f] rounded-lg px-4 py-2 min-w-[80px] flex flex-col items-center">
              <span className="text-[18px] font-bold text-[#E8EBF2]">247</span>
              <span className="text-[10px] text-[#555D72]">This month</span>
            </div>
            <div className="bg-[#171C28] border border-[#ffffff0f] rounded-lg px-4 py-2 min-w-[80px] flex flex-col items-center">
              <span className="text-[18px] font-bold text-[#E8EBF2]">94%</span>
              <span className="text-[10px] text-[#555D72]">Resolved</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 items-start">
          {/* Clinic Identity */}
          <div className="pulse-card">
            <div className="px-5 py-4 border-b border-[#ffffff0f] flex items-center gap-3">
              <div className="w-8.5 h-8.5 rounded-lg bg-[#a78bfa17] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-[#A78BFA]" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 14c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              </div>
              <div>
                <div className="text-[14px] font-medium text-[#E8EBF2]">Clinic identity</div>
                <div className="text-[11px] text-[#555D72]">How the agent introduces itself</div>
              </div>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-[#8B92A8]">Clinic name <span className="text-[#FF6B6B]">*</span></label>
                  <input className="pulse-input" value={clinicName} onChange={(e) => setClinicName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-[#8B92A8]">Agent persona name <span className="text-[#FF6B6B]">*</span></label>
                  <input className="pulse-input" value={agentName} onChange={(e) => setAgentName(e.target.value)} placeholder="e.g. Priya" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-[#8B92A8]">Speciality</label>
                  <select className="pulse-input" value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
                    <option>Dental / Oral Care</option>
                    <option>General Medicine</option>
                    <option>Dermatology</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-[#8B92A8]">Response language</label>
                  <select className="pulse-input" value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option>English</option>
                    <option>Hindi</option>
                    <option>English + Hindi</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-[#8B92A8]">Primary contact number</label>
                <input className="pulse-input" value={contact} onChange={(e) => setContact(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-[#8B92A8]">Booking link / method</label>
                <input className="pulse-input" value={bookingLink} onChange={(e) => setBookingLink(e.target.value)} placeholder="URL or phone" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {/* Opening Hours */}
            <div className="pulse-card">
              <div className="px-5 py-4 border-b border-[#ffffff0f] flex items-center gap-3">
                <div className="w-8.5 h-8.5 rounded-lg bg-[#22d3a81a] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#22D3A8]" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <div className="text-[14px] font-medium text-[#E8EBF2]">Opening hours</div>
                  <div className="text-[11px] text-[#555D72]">Agent answers "are you open?" using these</div>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-medium text-[#8B92A8]">Mon – Sat</label>
                    <input className="pulse-input" defaultValue="9:00 AM – 7:00 PM" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-medium text-[#8B92A8]">Sunday</label>
                    <input className="pulse-input" defaultValue="Closed" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-[#8B92A8]">Holiday / exceptions</label>
                  <input className="pulse-input" placeholder="e.g. Closed on national holidays" />
                </div>
              </div>
            </div>

            {/* Doctors */}
            <div className="pulse-card">
              <div className="px-5 py-4 border-b border-[#ffffff0f] flex items-center gap-3">
                <div className="w-8.5 h-8.5 rounded-lg bg-[#4f7eff1a] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#4F7EFF]" viewBox="0 0 16 16" fill="none"><path d="M8 2a2 2 0 100 4 2 2 0 000-4zM4 10a2 2 0 100 4 2 2 0 000-4zM12 10a2 2 0 100 4 2 2 0 000-4z" stroke="currentColor" strokeWidth="1.3"/></svg>
                </div>
                <div>
                  <div className="text-[14px] font-medium text-[#E8EBF2]">Doctors</div>
                  <div className="text-[11px] text-[#555D72]">Agent matches doctors to patient needs</div>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-2">
                {doctors.map((doc, i) => (
                  <div key={i} className="flex grid grid-cols-[1fr_1fr_auto] items-center gap-2 p-2.5 bg-[#171C28] border border-[#ffffff0f] rounded-lg">
                    <div>
                      <div className="text-[13px] font-medium text-[#E8EBF2]">{doc.name}</div>
                      <div className="text-[11px] text-[#555D72]">{doc.spec}</div>
                    </div>
                    <div className="text-[11px] text-[#8B92A8]">{doc.availability}</div>
                    <button className="w-7 h-7 flex items-center justify-center rounded-md border border-[#ffffff0f] hover:bg-[#1E2433] text-[#555D72] transition">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12"><path d="M1 11L11 1M1 1l10 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                    </button>
                  </div>
                ))}
                <button className="flex items-center justify-center gap-2 mt-1 p-2 border border-dashed border-[#ffffff1f] rounded-lg text-[#555D72] text-[12px] hover:text-[#4F7EFF] hover:border-[#4f7eff3f] transition">
                  <PlusIcon className="w-3 h-3" /> Add doctor
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="pulse-card">
          <div className="px-5 py-4 border-b border-[#ffffff0f] flex items-center gap-3">
            <div className="w-8.5 h-8.5 rounded-lg bg-[#f5a6231a] flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-[#F5A623]" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            </div>
            <div className="flex-1">
              <div className="text-[14px] font-medium text-[#E8EBF2]">Additional details <span className="text-[11px] text-[#555D72] font-normal ml-2">— free text, 500 chars max</span></div>
              <div className="text-[11px] text-[#555D72]">Things the agent should know that don't fit a form field</div>
            </div>
          </div>
          <div className="p-5 flex flex-col gap-2.5">
            <textarea 
              className="pulse-input min-h-[72px] resize-none" 
              value={additionalDetails} 
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="e.g. We have free parking in the basement..."
            />
            <div className="text-[11px] text-[#555D72]">This is appended to the agent's context. Keep it factual — for tone adjustments, use Advanced settings.</div>
          </div>
        </div>

        {/* Prompt Preview */}
        <div className="pulse-card">
          <div className="px-5 py-4 border-b border-[#ffffff0f] flex items-center gap-3">
            <div className="w-8.5 h-8.5 rounded-lg bg-[#ffffff0a] flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-[#555D72]" viewBox="0 0 16 16" fill="none"><path d="M2 3h12M2 6h8M2 9h10M2 12h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            </div>
            <div>
              <div className="text-[14px] font-medium text-[#E8EBF2]">Prompt structure preview</div>
              <div className="text-[11px] text-[#555D72]">How your settings assemble into the agent's instructions</div>
            </div>
          </div>
          <div className="p-5 flex flex-col gap-4">
            <div className="rounded-lg border border-[#ffffff0f] overflow-hidden">
              <div className="prompt-layer">
                <div className="pl-label !text-[#22D3A8]">Fixed base</div>
                <div className="pl-content !bg-[#22d3a80a] !text-[#22D3A8]">You are a professional, warm clinic assistant. You never give medical advice or diagnose. You escalate any emergency immediately. You do not pressure patients.</div>
              </div>
              <div className="prompt-layer">
                <div className="pl-label !text-[#A78BFA]">Clinic context</div>
                <div className="pl-content !bg-[#a78bfa0a] !text-[#A78BFA]">Clinic: {clinicName} · Persona: {agentName} · Phone: {contact} · Hours: Mon–Sat 9am–7pm · Doctors: Dr Mehta (Implants), Dr Shah (Braces) · Language: {language}</div>
              </div>
              <div className="prompt-layer">
                <div className="pl-label !text-[#F5A623]">Mode block</div>
                <div className="pl-content !bg-[#f5a6230a] !text-[#F5A623]">Injected at runtime based on interaction trigger — inbound / follow_up / campaign / feedback</div>
              </div>
              <div className="prompt-layer">
                <div className="pl-label">Your additions</div>
                <div className="pl-content">{additionalDetails}</div>
              </div>
            </div>

            {/* Advanced Toggle */}
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="flex items-center gap-2 text-[12px] text-[#555D72] hover:text-[#8B92A8] transition group"
              >
                <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
                Advanced — override agent behaviour
              </button>
              
              {isAdvancedOpen && (
                <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex gap-2 p-3 bg-[#f5a62314] border border-[#f5a62333] rounded-lg text-[#F5A623] text-[11px] leading-relaxed">
                    <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" viewBox="0 0 13 13"><path d="M6.5 1L1 12h11L6.5 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6.5 5v3M6.5 9.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                    Incorrect instructions here may cause unexpected agent behaviour. This block is appended after the mode block and cannot override safety rules.
                  </div>
                  <textarea 
                    className="pulse-input font-mono min-h-[64px] !bg-[#0D1117] !border-[#ffffff0f]" 
                    placeholder="e.g. Always end calls by offering to send a WhatsApp confirmation."
                    value={advancedOverride}
                    onChange={(e) => setAdvancedOverride(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SAVE BAR */}
        <div className="fixed bottom-0 right-0 left-0 lg:left-[240px] h-[64px] bg-[#111520] border-t border-[#ffffff0f] flex items-center justify-between px-7 z-[60]">
          <span className="text-[12px] text-[#555D72]">Changes apply to all modes — agent picks up new context on next interaction.</span>
          <div className="flex gap-2">
            <button className="pulse-btn pulse-btn-ghost">Discard</button>
            <button className="pulse-btn pulse-btn-primary">Save agent config</button>
          </div>
        </div>
      </div>
    </div>
  )
}
