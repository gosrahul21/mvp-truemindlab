'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  defaultOnboardingData,
  TOTAL_ONBOARDING_STEPS,
  type OnboardingData,
  type OnboardingStatus,
  type ToneStyle,
} from '@/lib/onboarding-types'
import type { VoicePreset } from '@/lib/voicePresets'
import { getActiveVoicePresets } from '@/lib/voicePresets'

const toneOptions: { value: ToneStyle; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'premium', label: 'Premium' },
]

const voiceOptions = getActiveVoicePresets().map(preset => ({
  value: preset.id,
  label: preset.name
}))

type WizardState = {
  orgId: string
  currentStep: number
  status: OnboardingStatus
  data: OnboardingData
}

const localStorageKey = 'closeflow_onboarding_v1'

function getOrCreateOrgId() {
  if (typeof window === 'undefined') return ''

  const existing = window.localStorage.getItem('closeflow_org_id')
  if (existing) return existing

  const id = crypto.randomUUID()
  window.localStorage.setItem('closeflow_org_id', id)
  return id
}

function StepInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  type?: 'text' | 'url' | 'email'
}) {
  return (
    <label className="block">
      <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-[#11192d] dark:text-gray-100 dark:focus:border-gray-600 dark:focus:ring-gray-700"
      />
    </label>
  )
}

export default function OnboardingPage() {
  const [state, setState] = useState<WizardState>({
    orgId: '',
    currentStep: 1,
    status: 'not_started',
    data: defaultOnboardingData,
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const progressPercentage = useMemo(
    () => Math.round((state.currentStep / TOTAL_ONBOARDING_STEPS) * 100),
    [state.currentStep]
  )

  useEffect(() => {
    const orgId = getOrCreateOrgId()
    setState((previous) => ({ ...previous, orgId }))

    const localStateRaw = window.localStorage.getItem(localStorageKey)
    if (localStateRaw) {
      try {
        const parsed = JSON.parse(localStateRaw) as WizardState
        if (parsed?.orgId === orgId) {
          setState(parsed)
        }
      } catch {
        // Ignore local parse errors and continue remote recovery.
      }
    }

    const loadRemoteProfile = async () => {
      const response = await fetch(`/api/onboarding?orgId=${orgId}`)
      const payload = (await response.json()) as { profile?: WizardState; error?: string }
      if (payload.error || !payload.profile) return

      const profile = payload.profile
      setState((previous) => {
        const merged: WizardState = {
          orgId,
          currentStep: Math.max(previous.currentStep, profile.currentStep),
          status: profile.status,
          data: { ...previous.data, ...profile.data },
        }
        window.localStorage.setItem(localStorageKey, JSON.stringify(merged))
        return merged
      })
    }

    void loadRemoteProfile()
  }, [])

  const saveProgress = async (nextState: WizardState) => {
    setIsSaving(true)
    setErrorMessage('')
    window.localStorage.setItem(localStorageKey, JSON.stringify(nextState))

    const response = await fetch('/api/onboarding', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nextState),
    })

    setIsSaving(false)
    if (!response.ok) {
      const payload = (await response.json()) as { error?: string }
      setErrorMessage(payload.error ?? 'Failed to save progress.')
    }
  }

  const updateData = (partial: Partial<OnboardingData>) => {
    setState((previous) => ({ ...previous, data: { ...previous.data, ...partial } }))
  }

  const validateStep = () => {
    const data = state.data
    switch (state.currentStep) {
      case 1:
        return data.businessName.trim().length >= 2
      case 2:
        return /^https?:\/\/.+/i.test(data.websiteUrl.trim())
      case 3:
        return data.primaryOffer.trim().length >= 3
      case 4:
        return data.businessLocation.trim().length >= 2
      case 5:
        return Boolean(data.toneStyle)
      case 6:
        return data.bookingMethod === 'internal_placeholder' || /^https?:\/\/.+/i.test(data.bookingLink.trim())
      case 7:
        return Boolean(data.voicePreset)
      case 8:
        return data.communication.smsEnabled || data.communication.emailEnabled || data.communication.voiceEnabled
      case 9:
        return data.email.fromName.trim().length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.fromEmail)
      default:
        return true
    }
  }

  const goNext = async () => {
    if (!validateStep()) {
      setErrorMessage('Please complete required fields before continuing.')
      return
    }
    const nextState: WizardState = {
      ...state,
      currentStep: Math.min(state.currentStep + 1, TOTAL_ONBOARDING_STEPS),
      status: 'in_progress',
    }
    setState(nextState)
    await saveProgress(nextState)
  }

  const goBack = async () => {
    const nextState: WizardState = {
      ...state,
      currentStep: Math.max(state.currentStep - 1, 1),
      status: state.status === 'not_started' ? 'not_started' : 'in_progress',
    }
    setState(nextState)
    await saveProgress(nextState)
  }

  const triggerGeneration = async () => {
    setIsGenerating(true)
    setErrorMessage('')

    await saveProgress({ ...state, status: 'generating' })

    const response = await fetch('/api/onboarding/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orgId: state.orgId, data: state.data }),
    })

    setIsGenerating(false)

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string }
      setErrorMessage(payload.error ?? 'Failed to generate onboarding system.')
      return
    }

    const completedState: WizardState = { ...state, status: 'completed', currentStep: TOTAL_ONBOARDING_STEPS }
    setState(completedState)
    await saveProgress(completedState)
    setIsSuccess(true)
  }

  const statusPill = {
    not_started: 'bg-gray-100 text-gray-700 ring-1 ring-gray-200',
    in_progress: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    generating: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    completed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  }[state.status]

  const renderStep = () => {
    const data = state.data
    switch (state.currentStep) {
      case 1:
        return <StepInput label="Business name" value={data.businessName} onChange={(value) => updateData({ businessName: value })} placeholder="Acme Dental Studio" />
      case 2:
        return <StepInput label="Website URL" value={data.websiteUrl} onChange={(value) => updateData({ websiteUrl: value })} placeholder="https://acmedental.com" type="url" />
      case 3:
        return <StepInput label="Primary offer" value={data.primaryOffer} onChange={(value) => updateData({ primaryOffer: value })} placeholder="Free consultation and whitening package" />
      case 4:
        return <StepInput label="Business location" value={data.businessLocation} onChange={(value) => updateData({ businessLocation: value })} placeholder="Austin, TX" />
      case 5:
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            {toneOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateData({ toneStyle: option.value })}
                className={`cursor-pointer rounded-xl border p-4 text-left text-sm font-medium transition ${
                  data.toneStyle === option.value
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-[#11192d] dark:text-gray-200 dark:hover:bg-[#14203a]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )
      case 6:
        return (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => updateData({ bookingMethod: 'external_link' })}
                className={`cursor-pointer rounded-xl border p-4 text-left text-sm font-medium transition ${
                  data.bookingMethod === 'external_link'
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-[#11192d] dark:text-gray-200 dark:hover:bg-[#14203a]'
                }`}
              >
                External booking link
              </button>
              <button
                onClick={() => updateData({ bookingMethod: 'internal_placeholder' })}
                className={`cursor-pointer rounded-xl border p-4 text-left text-sm font-medium transition ${
                  data.bookingMethod === 'internal_placeholder'
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-[#11192d] dark:text-gray-200 dark:hover:bg-[#14203a]'
                }`}
              >
                Internal scheduling placeholder
              </button>
            </div>
            <StepInput
              label="Booking link"
              value={data.bookingLink}
              onChange={(value) => updateData({ bookingLink: value })}
              placeholder="https://your-booking-url.com"
              type="url"
            />
          </div>
        )
      case 7:
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            {voiceOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateData({ voicePreset: option.value })}
                className={`cursor-pointer rounded-xl border p-4 text-left text-sm font-medium transition ${
                  data.voicePreset === option.value
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-[#11192d] dark:text-gray-200 dark:hover:bg-[#14203a]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )
      case 8:
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { key: 'smsEnabled', label: 'SMS enabled' },
              { key: 'emailEnabled', label: 'Email enabled' },
              { key: 'voiceEnabled', label: 'Voice enabled' },
              { key: 'businessHoursOnly', label: 'Business hours only' },
            ].map((item) => (
              <label key={item.key} className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                <input
                  type="checkbox"
                  checked={Boolean(state.data.communication[item.key as keyof OnboardingData['communication']])}
                  onChange={(event) =>
                    updateData({
                      communication: {
                        ...state.data.communication,
                        [item.key]: event.target.checked,
                      },
                    })
                  }
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
              </label>
            ))}
          </div>
        )
      case 9:
        return (
          <div className="space-y-4">
            <label className="block">
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Email provider</p>
              <select
                value={data.email.provider}
                onChange={(event) =>
                  updateData({
                    email: {
                      ...data.email,
                      provider: event.target.value as OnboardingData['email']['provider'],
                    },
                  })
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-[#11192d] dark:text-gray-100 dark:focus:border-gray-600 dark:focus:ring-gray-700"
              >
                <option value="platform_smtp">Platform SMTP</option>
                <option value="custom_smtp">Custom SMTP</option>
              </select>
            </label>
            <StepInput label="From name" value={data.email.fromName} onChange={(value) => updateData({ email: { ...data.email, fromName: value } })} placeholder="CloseFlow AI Team" />
            <StepInput label="From email" value={data.email.fromEmail} onChange={(value) => updateData({ email: { ...data.email, fromEmail: value } })} placeholder="hello@closeflow.ai" type="email" />
            <StepInput label="Reply-to email" value={data.email.replyToEmail} onChange={(value) => updateData({ email: { ...data.email, replyToEmail: value } })} placeholder="support@closeflow.ai" type="email" />
          </div>
        )
      case 10:
        return (
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-[#11192d]">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Ready to generate your system</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                We will generate business summary, prompts, follow-up sequences, qualification questions, and booking CTA assets.
              </p>
            </div>
            <button
              disabled={isGenerating}
              onClick={triggerGeneration}
              className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGenerating ? 'Generating...' : 'Generate System'}
            </button>
          </div>
        )
      default:
        return null
    }
  }

  if (isSuccess) {
    return (
      <section className="rounded-2xl border border-gray-200/80 bg-white/90 p-8 shadow-sm dark:border-gray-800 dark:bg-[#0d1220]/90">
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">Onboarding completed</span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Your CloseFlow AI system is ready</h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
          We saved your onboarding profile and linked it to your organization record. You can now manage leads, campaigns, and settings from your dashboard.
        </p>
        <a
          href="/dashboard"
          className="mt-6 inline-flex rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Go to Dashboard
        </a>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-sm dark:border-gray-800 dark:bg-[#0d1220]/90">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Onboarding Wizard</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Set up your business profile and generate your AI follow-up system</p>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusPill}`}>{state.status.replace('_', ' ')}</span>
        </div>
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>
              Step {state.currentStep} / {TOTAL_ONBOARDING_STEPS}
            </span>
            <span>{progressPercentage}% complete</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
            <div className="h-2 rounded-full bg-gradient-to-r from-slate-900 to-slate-600 transition-all dark:from-slate-300 dark:to-slate-500" style={{ width: `${progressPercentage}%` }} />
          </div>
        </div>
      </header>

      <article className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#0d1220]">
        {renderStep()}

        {errorMessage && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/30">
            {errorMessage}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={goBack}
            disabled={state.currentStep === 1 || isGenerating}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-[#11192d]"
          >
            Back
          </button>
          {state.currentStep < TOTAL_ONBOARDING_STEPS && (
            <button
              onClick={goNext}
              disabled={isGenerating}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          )}
          <button
            onClick={() => saveProgress(state)}
            disabled={isGenerating}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-[#11192d]"
          >
            Save progress
          </button>
          {isSaving && <span className="text-xs text-gray-500 dark:text-gray-400">Saving...</span>}
        </div>
      </article>
    </section>
  )
}
