export interface Project {
  id: string;
  title: string;
  descriptionKey: string;
  status: 'development';
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
