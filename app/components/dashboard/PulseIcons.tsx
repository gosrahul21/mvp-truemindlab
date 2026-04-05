import React, { CSSProperties } from 'react'

type IconProps = { className?: string; style?: CSSProperties }

export const LogoIcon = ({ className = "w-4 h-4", style }: IconProps) => (
  <svg className={className} style={style} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2C4.69 2 2 4.69 2 8s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 2.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 7.75c-2 0-3.76-1.02-4.8-2.57.02-1.59 3.2-2.47 4.8-2.47 1.59 0 4.78.88 4.8 2.47C11.76 11.23 10 12.25 8 12.25z" fill="white"/>
  </svg>
)

export const DashboardIcon = ({ className = "w-4 h-4", style }: IconProps) => (
  <svg className={className} style={style} viewBox="0 0 16 16" fill="none">
    <rect x="2" y="2" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="9" y="2" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="2" y="9" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="9" y="9" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
  </svg>
)

export const LeadsIcon = ({ className = "w-4 h-4", style }: IconProps) => (
  <svg className={className} style={style} viewBox="0 0 16 16" fill="none">
    <path d="M13 5H3a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1V6a1 1 0 00-1-1z" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M5 5V4a2 2 0 014 0v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

export const AppointmentsIcon = ({ className = "w-4 h-4", style }: IconProps) => (
  <svg className={className} style={style} viewBox="0 0 16 16" fill="none">
    <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M5 4V3a1 1 0 012 0v1M9 4V3a1 1 0 012 0v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

export const CoreAgentIcon = ({ className = "w-4 h-4", style }: IconProps) => (
  <svg className={className} style={style} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M2 14c0-2.21 2.686-4 6-4s6 1.79 6 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

export const InboundIcon = ({ className = "w-4 h-4", style }: IconProps) => (
  <svg className={className} style={style} viewBox="0 0 16 16" fill="none">
    <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/>
  </svg>
)

export const FollowUpIcon = ({ className = "w-4 h-4", style }: IconProps) => (
  <svg className={className} style={style} viewBox="0 0 16 16" fill="none">
    <path d="M14 8A6 6 0 112 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M14 8l-2-2M14 8l-2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const CampaignIcon = ({ className = "w-4 h-4", style }: IconProps) => (
  <svg className={className} style={style} viewBox="0 0 16 16" fill="none">
    <path d="M2 10l5-7 3 4 2-2 2 5H2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
)

export const FeedbackIcon = ({ className = "w-4 h-4", style }: IconProps) => (
  <svg className={className} style={style} viewBox="0 0 16 16" fill="none">
    <path d="M8 2l1.5 3 3.5.5-2.5 2.5.6 3.5L8 10l-3.1 1.5.6-3.5L3 5.5l3.5-.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
)

export const SettingsIcon = ({ className = "w-4 h-4", style }: IconProps) => (
  <svg className={className} style={style} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M8 2v2M8 12v2M2 8h2M12 8h2M3.76 3.76l1.42 1.42M10.82 10.82l1.42 1.42M3.76 12.24l1.42-1.42M10.82 5.18l1.42-1.42" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

export const BillingIcon = ({ className = "w-4 h-4", style }: IconProps) => (
  <svg className={className} style={style} viewBox="0 0 16 16" fill="none">
    <path d="M7 2H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M9 2l5 5-5-5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M9 2v4a1 1 0 001 1h4" stroke="currentColor" strokeWidth="1.3"/>
  </svg>
)

export const PlusIcon = ({ className = "w-4 h-4", style }: IconProps) => (
  <svg className={className} style={style} viewBox="0 0 13 13" fill="none">
    <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

export const ChevronDownIcon = ({ className = "w-4 h-4", style }: IconProps) => (
  <svg className={className} style={style} viewBox="0 0 14 14" fill="none">
    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

/* Channel Icons */
export const WhatsAppIcon = ({ className = "w-4 h-4", style }: IconProps) => (
  <svg className={className} style={style} viewBox="0 0 18 18" fill="none">
    <path d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9c0 1.32.34 2.56.94 3.64L1.5 16.5l3.96-.92A7.48 7.48 0 009 16.5c4.14 0 7.5-3.36 7.5-7.5S13.14 1.5 9 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M6.5 7.5s.5-1 1.5-1 1.5.75 1.5 1.5-1 1.5-1.5 2 1 1.5 2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)

export const VoiceIcon = ({ className = "w-4 h-4", style }: IconProps) => (
  <svg className={className} style={style} viewBox="0 0 18 18" fill="none">
    <path d="M3.5 3.5h3l1.5 3.5L6.5 8.5a9 9 0 004 4l1.5-1.5 3.5 1.5v3s-1 1.5-4 1.5C5 17 1 13 1 9c0-3 1.5-5.5 1.5-5.5h1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
)

export const SMSIcon = ({ className = "w-4 h-4", style }: IconProps) => (
  <svg className={className} style={style} viewBox="0 0 18 18" fill="none">
    <rect x="2" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M6 13l-2 2v-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.5 8h7M5.5 6h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

export const EmailIcon = ({ className = "w-4 h-4", style }: IconProps) => (
  <svg className={className} style={style} viewBox="0 0 18 18" fill="none">
    <rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M2 7l7 5 7-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
