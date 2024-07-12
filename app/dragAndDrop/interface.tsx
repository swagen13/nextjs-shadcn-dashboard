export interface Skill {
  id: number;
  skill_name: string;
  parent_id: string | null;
  level: number;
  sequence: string;
  children: Skill[];
}
