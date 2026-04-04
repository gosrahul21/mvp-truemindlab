import { supabaseRest } from './supabase-rest';
import { AgentMasterTemplate, OrganizationKnowledge } from './supabase/types';

// Simple RAM cache for templates
let cachedTemplates: AgentMasterTemplate[] | null = null;
let lastFetchTime: number = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

/**
 * Fetch all master templates from the database and cache them.
 */
export async function getMasterTemplates(): Promise<AgentMasterTemplate[]> {
  const now = Date.now();
  if (cachedTemplates && (now - lastFetchTime < CACHE_TTL)) {
    return cachedTemplates;
  }

  try {
    const templates = await supabaseRest<AgentMasterTemplate[]>(
      'agent_master_templates?select=*'
    );
    cachedTemplates = templates;
    lastFetchTime = now;
    return templates;
  } catch (error) {
    console.error('Failed to fetch master templates:', error);
    return cachedTemplates || [];
  }
}

/**
 * Find a specific template by industry, channel, and use case.
 */
export async function findTemplate(
  industry: string,
  channel: string,
  useCase: string
): Promise<AgentMasterTemplate | undefined> {
  const templates = await getMasterTemplates();
  
  // Try to find exact industry match
  let template = templates.find(
    t => t.industry === industry && t.channel === channel && t.use_case === useCase
  );

  // Fallback to 'general' if not found
  if (!template && industry !== 'general') {
    template = templates.find(
      t => t.industry === 'general' && t.channel === channel && t.use_case === useCase
    );
  }

  return template;
}

/**
 * Injects business facts into a prompt template.
 */
export function compilePrompt(
  templateText: string,
  knowledge: {
    businessName: string;
    bookingUrl: string;
    faqs: string;
    targetAudience: string;
    industry?: string;
    location?: string;
  }
): string {
  let compiled = templateText;

  const tags: Record<string, string> = {
    business_name: knowledge.businessName || '[Business Name]',
    booking_url: knowledge.bookingUrl || '[Booking URL]',
    faqs: knowledge.faqs || '[No FAQs provided]',
    target_audience: knowledge.targetAudience || 'general public',
    industry: knowledge.industry || 'general business',
    location: knowledge.location || 'various locations',
  };

  Object.entries(tags).forEach(([tag, value]) => {
    const regex = new RegExp(`{{${tag}}}`, 'g');
    compiled = compiled.replace(regex, value);
  });

  return compiled;
}
