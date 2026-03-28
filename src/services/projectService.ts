export interface Project {
  id: string;
  title: string;
  descriptionKey: string;
  status: 'development' | 'research';
  tags: string[];
}

const projectsDB: Project[] = [
  {
    id: 'urbi',
    title: 'Urbi',
    descriptionKey: 'projects.urbi.description',
    status: 'development',
    tags: ['React', 'React Native', '.NET', 'TypeScript'],
  },
];

export const getFeaturedProject = (): Project => {
  return projectsDB.find((p) => p.id === 'urbi') as Project;
};

export const getIncubatorProjects = (): Project[] => {
  return projectsDB.filter((p) => p.status === 'research');
};
