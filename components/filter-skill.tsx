export function filterSkillsByLevel(skills: any[], minLevel: number) {
  const result: any[] = [];

  function traverse(skill: { level: number; children: any[] }) {
    if (skill.level >= minLevel) {
      result.push(skill);
    }
    skill.children.forEach(traverse);
  }

  skills.forEach(traverse);

  return result;
}
