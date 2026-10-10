import type { EventItem } from '../types';
import type { StudentProfile } from '../types/profile';

export interface EventRecommendation {
  event: EventItem;
  score: number;
  reasons: string[];
  primaryReason: string;
}

export function hasPersonalizationData(profile: StudentProfile | null | undefined): boolean {
  if (!profile) return false;
  const hasInterests = Array.isArray(profile.interests) && profile.interests.length > 0;
  const hasSkills = Array.isArray(profile.skills) && profile.skills.length > 0;
  return hasInterests || hasSkills;
}

/**
 * Normalizes a text string for case-insensitive, trimmed, and hyphen-safe comparison.
 */
function normalize(str: string): string {
  return str.toLowerCase().replace(/[-_]/g, ' ').trim();
}

/**
 * Deterministic scoring engine evaluating relevance between an event and student profile.
 */
export function calculateEventRelevance(
  event: EventItem,
  profile: StudentProfile
): EventRecommendation {
  let score = 0;
  const reasons: string[] = [];

  const eventTitleNorm = normalize(event.title);
  const eventDescNorm = normalize(event.description);
  const eventCatNorm = normalize(event.category);
  const eventTagsNorm = (event.tags || []).map(normalize);
  const eventOrganizerNorm = normalize(event.organizer || '');

  // 1. Student Interests Match (+10 per unique category/interest match)
  const matchedInterests = new Set<string>();
  for (const interest of profile.interests || []) {
    const interestNorm = normalize(interest);

    // Direct match against category
    const catMatch =
      eventCatNorm.includes(interestNorm) || interestNorm.includes(eventCatNorm);

    // Direct match against tags
    const tagMatch = eventTagsNorm.some(
      (tag) => tag.includes(interestNorm) || interestNorm.includes(tag)
    );

    // Text match in title/desc for key phrases
    const textMatch =
      interestNorm.length >= 3 &&
      (eventTitleNorm.includes(interestNorm) ||
        eventDescNorm.includes(` ${interestNorm} `) ||
        eventDescNorm.includes(` ${interestNorm}.`));

    // Special interest semantic mappings
    const semanticMatch =
      (interestNorm === 'ai' && (eventTagsNorm.includes('ai') || eventTagsNorm.includes('llm') || eventTitleNorm.includes('ai'))) ||
      (interestNorm === 'web development' && (eventTagsNorm.includes('web3') || eventTagsNorm.includes('webdev') || eventDescNorm.includes('web'))) ||
      (interestNorm === 'competitive coding' && (eventCatNorm === 'competitions' || eventTagsNorm.includes('coding') || eventTagsNorm.includes('algorithms'))) ||
      (interestNorm === 'robotics' && (eventTagsNorm.includes('robotics') || eventDescNorm.includes('robotics'))) ||
      (interestNorm === 'design' && (eventCatNorm.includes('tech') || eventCatNorm.includes('design')) && (eventTagsNorm.includes('design') || eventTagsNorm.includes('ui/ux')));

    if ((catMatch || tagMatch || textMatch || semanticMatch) && !matchedInterests.has(interest)) {
      matchedInterests.add(interest);
      score += 10;
      reasons.push(`Matches your interest in ${interest}`);
    }
  }

  // 2. Student Skills Match (+8 per unique skill match)
  const matchedSkills = new Set<string>();
  for (const skill of profile.skills || []) {
    const skillNorm = normalize(skill);
    if (!skillNorm || skillNorm.length < 2) continue;

    const skillInTags = eventTagsNorm.some((t) => t === skillNorm || t.includes(skillNorm));
    const skillInTitle = eventTitleNorm.includes(skillNorm);
    const skillInDesc =
      eventDescNorm.includes(` ${skillNorm} `) ||
      eventDescNorm.includes(` ${skillNorm},`) ||
      eventDescNorm.includes(` ${skillNorm}.`);

    // Semantic skill mappings
    const skillSemantic =
      (skillNorm === 'ui/ux' && (eventTagsNorm.includes('ui/ux') || eventDescNorm.includes('interface') || eventDescNorm.includes('design systems'))) ||
      (skillNorm === 'python' && (eventTagsNorm.includes('python') || eventDescNorm.includes('python') || eventTagsNorm.includes('ai'))) ||
      (skillNorm === 'react' && (eventDescNorm.includes('react') || eventDescNorm.includes('frontend') || eventTagsNorm.includes('webdev'))) ||
      (skillNorm === 'three.js' && (eventDescNorm.includes('spatial') || eventDescNorm.includes('generative ui') || eventDescNorm.includes('3d')));

    if ((skillInTags || skillInTitle || skillInDesc || skillSemantic) && !matchedSkills.has(skill)) {
      matchedSkills.add(skill);
      score += 8;
      reasons.push(`Related to your ${skill} skills`);
    }
  }

  // 3. Discovery Preferences Match (+6)
  const preferredTypes = profile.discoveryPreferences?.eventTypes || [];
  for (const prefType of preferredTypes) {
    const prefNorm = normalize(prefType);
    if (
      eventCatNorm === prefNorm ||
      eventCatNorm.includes(prefNorm) ||
      normalize(event.badge || '').includes(prefNorm)
    ) {
      score += 6;
      reasons.push(`Aligned with preferred ${prefType.toLowerCase()} format`);
      break; // count once per event
    }
  }

  // 4. Department Relevance (+4)
  const deptNorm = normalize(profile.department || '');
  if (deptNorm.includes('computer science') || deptNorm.includes('computing')) {
    if (
      eventCatNorm.includes('hackathon') ||
      eventCatNorm.includes('competition') ||
      eventTagsNorm.includes('coding') ||
      eventTagsNorm.includes('ai')
    ) {
      score += 4;
      reasons.push(`Popular in ${profile.department.split('&')[0].trim()}`);
    }
  } else if (deptNorm.includes('design')) {
    if (eventCatNorm.includes('design') || eventTagsNorm.includes('design')) {
      score += 4;
      reasons.push(`Popular in ${profile.department}`);
    }
  }

  // 5. Affiliated Community Match (+5)
  for (const clubId of profile.communityIds || []) {
    const clubIdNorm = normalize(clubId);
    if (
      eventOrganizerNorm.includes(clubIdNorm) ||
      (clubIdNorm.includes('codechef') && eventOrganizerNorm.includes('competitive programming')) ||
      (clubIdNorm.includes('gdsc') && eventOrganizerNorm.includes('developer student club')) ||
      (clubIdNorm.includes('ai') && eventOrganizerNorm.includes('ai research')) ||
      (clubIdNorm.includes('design') && eventOrganizerNorm.includes('ux collective'))
    ) {
      score += 5;
      reasons.push('Organized by a community in your network');
      break;
    }
  }

  const primaryReason =
    reasons.length > 0 ? reasons[0] : 'Curated for your campus cohort';

  return {
    event,
    score,
    reasons,
    primaryReason,
  };
}

/**
 * Filter and rank events by relevance to the student profile.
 */
export function getRecommendedEvents(
  events: EventItem[],
  profile: StudentProfile | null | undefined,
  options?: {
    limit?: number;
    minScoreThreshold?: number;
  }
): EventRecommendation[] {
  if (!profile || !hasPersonalizationData(profile)) {
    return [];
  }

  const limit = options?.limit ?? 4;
  const minThreshold = options?.minScoreThreshold ?? 10;

  const scoredList = events
    .map((event) => calculateEventRelevance(event, profile))
    .filter((item) => item.score >= minThreshold);

  // Deterministic sort: highest relevance score first, then fallback to registrations count
  scoredList.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return (b.event.registrations || 0) - (a.event.registrations || 0);
  });

  return scoredList.slice(0, limit);
}
