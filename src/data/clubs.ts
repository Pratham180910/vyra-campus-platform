import type { Club, ClubCategory, ClubSortOption } from '../types/club';

export const CLUBS_DATA: Club[] = [
  {
    id: 'ai-society',
    name: 'AI Society',
    shortName: 'AIS',
    description: 'Pioneering artificial intelligence research, neural architectures, deep learning workshops, and campus-wide autonomous machine hackathons.',
    coverImage: '/images/clubs/ai-society.jpg',
    category: 'AI & Robotics',
    tags: ['AI', 'DeepLearning', 'Robotics', 'MachineLearning', 'Python'],
    memberCount: 2450,
    foundedYear: 2021,
    department: 'School of Computing & Data Science',
    featured: true,
    verified: true,
    upcomingEventCount: 8,
    interests: ['Neural Networks', 'Computer Vision', 'LLMs', 'Reinforcement Learning'],
  },
  {
    id: 'codechef-srm',
    name: 'CodeChef SRM Chapter',
    shortName: 'CC SRM',
    description: 'The premier collegiate competitive programming division organizing weekly algorithm sprints, code showdowns, and global contest prep.',
    coverImage: '/images/clubs/codechef.jpg',
    category: 'Coding',
    tags: ['Algorithms', 'DataStructures', 'Competitions', 'C++', 'Python'],
    memberCount: 3120,
    foundedYear: 2018,
    department: 'Department of Computer Science',
    featured: true,
    verified: true,
    upcomingEventCount: 6,
    interests: ['Competitive Programming', 'Graph Theory', 'Dynamic Programming', 'Hackathons'],
  },
  {
    id: 'gdsc-srm',
    name: 'Google Developer Student Club',
    shortName: 'GDSC',
    description: 'Empowering university students to build real-world solutions for local communities through Google technologies, Cloud, Android, and Flutter.',
    coverImage: '/images/clubs/gdsc.jpg',
    category: 'Technology',
    tags: ['GoogleCloud', 'Flutter', 'WebDev', 'Android', 'OpenSource'],
    memberCount: 2890,
    foundedYear: 2019,
    department: 'School of Engineering & Technology',
    featured: true,
    verified: true,
    upcomingEventCount: 5,
    interests: ['Cloud Architecture', 'Mobile Systems', 'Solution Challenge', 'Web Frameworks'],
  },
  {
    id: 'robotics-club',
    name: 'Robotics & Automation Guild',
    shortName: 'RAG',
    description: 'Hands-on hardware lab for building autonomous rovers, combat bots, drone telemetry, and industrial IoT micro-controllers.',
    coverImage: '/images/clubs/robotics.jpg',
    category: 'AI & Robotics',
    tags: ['Robotics', 'IoT', 'Hardware', 'Drones', 'Arduino'],
    memberCount: 1640,
    foundedYear: 2017,
    department: 'Department of Mechatronics & Robotics',
    featured: false,
    verified: true,
    upcomingEventCount: 4,
    interests: ['Embedded Systems', 'PCB Design', 'ROS', 'Microcontrollers'],
  },
  {
    id: 'design-collective',
    name: 'Design Collective',
    shortName: 'DC',
    description: 'A cross-disciplinary creative studio advancing UI/UX architecture, kinetic motion graphics, typography, 3D spatial renders, and brand aesthetics.',
    coverImage: '/images/clubs/design-collective.jpg',
    category: 'Design',
    tags: ['UIUX', 'Motion', '3DDesign', 'Figma', 'Branding'],
    memberCount: 1880,
    foundedYear: 2020,
    department: 'Department of Visual Communication & Design',
    featured: true,
    verified: true,
    upcomingEventCount: 4,
    interests: ['Design Systems', 'Product Strategy', 'Blender', 'Typography', 'Creative Code'],
  },
  {
    id: 'music-club',
    name: 'SRM Music Club & Orchestra',
    shortName: 'SMC',
    description: 'Uniting instrumentalists, vocalists, audio engineers, and indie bands for campus amphitheatre gigs, studio recordings, and inter-collegiate battle of the bands.',
    coverImage: '/images/clubs/music-club.jpg',
    category: 'Music',
    tags: ['LiveMusic', 'Indie', 'Acoustic', 'Orchestra', 'AudioProduction'],
    memberCount: 2200,
    foundedYear: 2015,
    department: 'Directorate of Student Cultural Affairs',
    featured: false,
    verified: true,
    upcomingEventCount: 5,
    interests: ['Music Production', 'Live Performance', 'Songwriting', 'Sound Engineering'],
  },
  {
    id: 'sports-council',
    name: 'Campus Sports Council',
    shortName: 'CSC',
    description: 'Apex governing sports body coordinating collegiate tournaments, floodlit league showdowns, athletics meets, and campus fitness clinics.',
    coverImage: '/images/clubs/sports-council.jpg',
    category: 'Sports',
    tags: ['Basketball', 'Football', 'Athletics', 'Tournaments', 'Fitness'],
    memberCount: 3850,
    foundedYear: 2014,
    department: 'Department of Physical Education & Sports',
    featured: false,
    verified: true,
    upcomingEventCount: 9,
    interests: ['Collegiate Leagues', 'Knockouts', 'Strength & Conditioning', 'Intramural Cups'],
  },
  {
    id: 'entrepreneurship-cell',
    name: 'Entrepreneurship Cell',
    shortName: 'E-Cell',
    description: 'Catalyzing student venture creation with founder mentorship, pre-seed microgrants, angel pitch days, and product incubation incubators.',
    coverImage: '/images/clubs/ecell.jpg',
    category: 'Entrepreneurship',
    tags: ['Startups', 'VentureCapital', 'ProductPitch', 'Innovation', 'Founders'],
    memberCount: 2150,
    foundedYear: 2016,
    department: 'SRM Center for Innovation & Incubation',
    featured: false,
    verified: true,
    upcomingEventCount: 3,
    interests: ['Startup Incubation', 'Pitch Competitions', 'Venture Finance', 'Networking'],
  },
  {
    id: 'cyber-security-club',
    name: 'Cyber Security Guild',
    shortName: 'CSG',
    description: 'Defensive cybersecurity & red-team offensive research collective conducting live CTF challenges, reverse engineering, and threat audits.',
    coverImage: '/images/clubs/cybersec.jpg',
    category: 'Technology',
    tags: ['InfoSec', 'CTF', 'Cryptography', 'EthicalHacking', 'Networking'],
    memberCount: 1420,
    foundedYear: 2022,
    department: 'Information Assurance & Cyber Division',
    featured: false,
    verified: true,
    upcomingEventCount: 3,
    interests: ['Penetration Testing', 'Binary Exploitation', 'Web Security', 'Bug Bounty'],
  },
  {
    id: 'cultural-crew',
    name: 'SRM Cultural Crew & Dramatics',
    shortName: 'SCC',
    description: 'The heartbeat of collegiate expression, hosting state-level theatrical productions, street plays, flash mobs, and university cultural fests.',
    coverImage: '/images/clubs/cultural-crew.jpg',
    category: 'Cultural',
    tags: ['Theatre', 'Dance', 'Dramatics', 'Festivals', 'Arts'],
    memberCount: 2760,
    foundedYear: 2016,
    department: 'Student Affairs & Cultural Advisory',
    featured: false,
    verified: true,
    upcomingEventCount: 7,
    interests: ['Stage Productions', 'Street Theatre', 'Choreography', 'Creative Writing'],
  },
  {
    id: 'social-impact-initiative',
    name: 'Social Impact Initiative (Enactus)',
    shortName: 'SII',
    description: 'Student-led social entrepreneurship mobilizing sustainable green energy projects, clean water solutions, and educational outreach in local villages.',
    coverImage: '/images/clubs/social-impact.jpg',
    category: 'Social Impact',
    tags: ['Sustainability', 'Volunteering', 'SocialEnterprise', 'Community', 'GreenCampus'],
    memberCount: 1180,
    foundedYear: 2020,
    department: 'Public Outreach & Social Development',
    featured: false,
    verified: false,
    upcomingEventCount: 2,
    interests: ['Social Enterprises', 'Rural Electrification', 'Civic Action', 'Eco-Tech'],
  },
  {
    id: 'media-society',
    name: 'Campus Media & Journalism Society',
    shortName: 'CMJS',
    description: 'The official digital broadcast network covering collegiate festivals, student journalism, podcast series, drone cinematography, and live sports commentary.',
    coverImage: '/images/clubs/media-society.jpg',
    category: 'Media',
    tags: ['Broadcasting', 'Podcasts', 'Photography', 'Journalism', 'VideoEditing'],
    memberCount: 1530,
    foundedYear: 2019,
    department: 'School of Journalism & New Media',
    featured: false,
    verified: true,
    upcomingEventCount: 4,
    interests: ['Documentary Production', 'Photojournalism', 'Podcast Broadcasting', 'Campus News'],
  },
];

export const CLUB_CATEGORIES: ClubCategory[] = [
  'All',
  'Technology',
  'AI & Robotics',
  'Coding',
  'Design',
  'Cultural',
  'Music',
  'Sports',
  'Entrepreneurship',
  'Social Impact',
  'Media',
];

export const getAllClubs = (): Club[] => {
  return CLUBS_DATA;
};

export const getFeaturedClubs = (): Club[] => {
  return CLUBS_DATA.filter((c) => c.featured);
};

export const getClubById = (id: string): Club | undefined => {
  return CLUBS_DATA.find((c) => c.id === id);
};

export const filterAndSortClubs = (
  clubs: Club[],
  searchQuery: string,
  category: ClubCategory,
  sortBy: ClubSortOption
): Club[] => {
  const query = searchQuery.trim().toLowerCase();

  let filtered = clubs.filter((club) => {
    // 1. Category check
    if (category !== 'All' && club.category !== category) {
      return false;
    }

    // 2. Search query check
    if (query) {
      const nameMatch = club.name.toLowerCase().includes(query);
      const shortNameMatch = club.shortName.toLowerCase().includes(query);
      const descMatch = club.description.toLowerCase().includes(query);
      const categoryMatch = club.category.toLowerCase().includes(query);
      const deptMatch = club.department?.toLowerCase().includes(query) ?? false;
      const tagMatch = club.tags.some((t) => t.toLowerCase().includes(query));
      const interestMatch = club.interests?.some((i) => i.toLowerCase().includes(query)) ?? false;

      return (
        nameMatch ||
        shortNameMatch ||
        descMatch ||
        categoryMatch ||
        deptMatch ||
        tagMatch ||
        interestMatch
      );
    }

    return true;
  });

  // 3. Sorting
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'Most Members':
        return b.memberCount - a.memberCount;
      case 'Most Active':
        return b.upcomingEventCount - a.upcomingEventCount;
      case 'Newest':
        return b.foundedYear - a.foundedYear;
      case 'Recommended':
      default:
        // Featured and verified first, then by member count
        if (a.featured !== b.featured) {
          return a.featured ? -1 : 1;
        }
        if (a.verified !== b.verified) {
          return a.verified ? -1 : 1;
        }
        return b.memberCount - a.memberCount;
    }
  });

  return filtered;
};
