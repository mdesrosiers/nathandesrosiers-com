import { describe, it, expect } from 'vitest';
import { getProjects, getProject } from './projects';

describe('projects', () => {
  it('returns at least one project', () => {
    expect(getProjects().length).toBeGreaterThan(0);
  });

  it('returns projects sorted by date descending (newest first)', () => {
    const dates = getProjects().map((p) => p.date);
    const sorted = [...dates].sort().reverse();
    expect(dates).toEqual(sorted);
  });

  it('every project has a unique slug', () => {
    const slugs = getProjects().map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('getProject returns the matching project by slug', () => {
    const [first] = getProjects();
    expect(getProject(first.slug)?.slug).toBe(first.slug);
  });

  it('getProject returns undefined for an unknown slug', () => {
    expect(getProject('does-not-exist')).toBeUndefined();
  });
});
