export interface TeamMember {
  id: string;
}

const teamDB: TeamMember[] = [
  { id: 'member1' },
  { id: 'member2' },
];

export const getTeamMembers = (): TeamMember[] => teamDB;
