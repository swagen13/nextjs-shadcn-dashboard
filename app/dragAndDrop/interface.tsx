export interface Skill {
  id: number;
  name: string;
  parent_id: string | null;
  level: number;
  sequence: string;
  children: Skill[];
}
