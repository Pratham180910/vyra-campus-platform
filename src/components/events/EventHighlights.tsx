import React from 'react';
import { Trophy, Users, Zap, Award, Sparkles, Music, Terminal, Globe, Flame, CheckCircle2, type LucideIcon } from 'lucide-react';
import type { EventItem } from '../../types';

interface EventHighlightsProps {
  event: EventItem;
}

interface HighlightCard {
  title: string;
  description: string;
  icon: LucideIcon;
}


export const EventHighlights: React.FC<EventHighlightsProps> = ({ event }) => {
  // Generate customized highlights dynamically based on event category and metadata
  const highlights: HighlightCard[] = React.useMemo(() => {
    const list: HighlightCard[] = [];

    if (event.category === 'Hackathons') {
      list.push(
        { title: '36-Hour Build Sprint', description: 'Collaborate with teams of 2-4 to ship functional prototypes.', icon: Terminal },
        { title: '$25,000 Prize Pool', description: 'Category track bounties, cloud credits, and accelerator access.', icon: Trophy },
        { title: 'Industry Lead Mentors', description: 'On-demand 1:1 technical architecture sessions with domain experts.', icon: Users },
        { title: 'Hardware & API Perks', description: 'Complimentary sandbox API keys, neural clusters, and maker kits.', icon: Zap }
      );
    } else if (event.category === 'Cultural') {
      list.push(
        { title: 'Multi-Stage Spectacle', description: 'Simultaneous live music, dance battles, and digital art stages.', icon: Music },
        { title: 'Open-Air Amphitheatre', description: 'Festival lighting, laser projection mapping, and acoustic audio.', icon: Sparkles },
        { title: 'Inter-College Showcases', description: 'Synchronized crews from 40+ universities across the state.', icon: Users },
        { title: 'Pop-Up Stalls & Night Market', description: 'Student food artisan booths, thrift stalls, and merchandise.', icon: Globe }
      );
    } else if (event.category === 'Workshops') {
      list.push(
        { title: 'Hands-on Lab Environments', description: 'Interactive guided coding environments and hardware stations.', icon: Terminal },
        { title: 'Lead Researcher Insights', description: 'Direct instruction and live QA with pioneering faculty.', icon: Award },
        { title: 'Certified Credential', description: 'Verifiable digital credential upon completion of practical challenges.', icon: CheckCircle2 },
        { title: 'Project Incubator', description: 'Opportunity to pitch post-workshop ideas for collegiate seed grants.', icon: Flame }
      );
    } else if (event.category === 'Sports') {
      list.push(
        { title: 'Championship Knockouts', description: 'High-intensity tournament bracket with collegiate referees.', icon: Trophy },
        { title: 'Floodlit Arena Courts', description: 'Full stadium atmosphere, digital scoreboards, and student commentary.', icon: Zap },
        { title: 'Hostel & Club Rivalries', description: 'Inter-collegiate bragging rights and perpetual campus trophies.', icon: Users },
        { title: 'Health & Recovery Lounge', description: 'On-site sports physiotherapists and student hydration partners.', icon: Award }
      );
    } else {
      list.push(
        { title: 'Peer Collaboration', description: 'Meet passionate campusers sharing your curiosities and ambitions.', icon: Users },
        { title: 'Exclusive Campus Perks', description: 'Direct invitations to subsequent invite-only guild mixers.', icon: Sparkles },
        { title: 'Hands-on Participation', description: 'Active challenges, interactive sessions, and stage moments.', icon: Zap },
        { title: 'Memorable Moments', description: 'Part of the vibrant SRM collegiate calendar semester lineup.', icon: Trophy }
      );
    }

    return list;
  }, [event.category]);

  return (
    <section className="w-full space-y-5">
      <div className="flex items-center gap-2">
        <span className="p-1 rounded-md bg-secondary/15 text-secondary border border-secondary/25">
          <Sparkles className="w-3.5 h-3.5" />
        </span>
        <h2 className="text-xs font-mono uppercase tracking-widest text-secondary font-bold">
          WHAT TO EXPECT
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="p-5 rounded-2xl sm:rounded-3xl bg-[#10121A] border border-white/10 hover:border-primary/40 transition-all duration-300 group flex items-start gap-4 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-secondary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-glow-lime">
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-white text-base group-hover:text-glow-purple transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
