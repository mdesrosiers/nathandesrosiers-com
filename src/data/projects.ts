export type Project = {
  slug: string;
  title: string;
  description: string;
  date: string;
  media:
    | { type: 'image'; src: string; alt: string }
    | { type: 'video'; alt: string };
};

const projects: readonly Project[] = [
  {
    slug: 'placeholder-one',
    title: 'Placeholder Project One',
    description:
      'A short placeholder description of the first project. Real content coming soon.',
    date: '2026-01-01',
    media: {
      type: 'image',
      src: '/media/placeholder-1.svg',
      alt: 'Placeholder artwork one',
    },
  },
  {
    slug: 'placeholder-two',
    title: 'Placeholder Project Two',
    description:
      'A short placeholder description of the second project. Real content coming soon.',
    date: '2026-02-01',
    media: {
      type: 'image',
      src: '/media/placeholder-2.svg',
      alt: 'Placeholder artwork two',
    },
  },
  {
    slug: 'placeholder-three',
    title: 'Placeholder Project Three',
    description:
      'A short placeholder description of a video project. Real content coming soon.',
    date: '2026-03-01',
    media: { type: 'video', alt: 'Placeholder video project' },
  },
];

export function getProjects(): readonly Project[] {
  return [...projects].sort((a, b) => b.date.localeCompare(a.date));
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
