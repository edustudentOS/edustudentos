import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Recommendation {
  id: string;
  title: string;
  description: string | null;
  type: "course" | "roadmap";
  route: string;
  reason: string;
}

export function useRecommendations() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["recommendations", user?.id],
    queryFn: async () => {
      // Get user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("career_goal, branch, semester")
        .eq("user_id", user!.id)
        .single();

      const careerGoal = (profile?.career_goal || "").toLowerCase();

      // Get courses and roadmaps
      const [{ data: courses }, { data: roadmaps }, { data: skillProgress }] = await Promise.all([
        supabase.from("learning_courses").select("id, title, description, category").eq("is_published", true),
        supabase.from("roadmaps").select("id, title, description, category").eq("is_published", true),
        supabase.from("skill_progress").select("roadmap_id, skill_name").eq("user_id", user!.id),
      ]);

      const startedRoadmapIds = new Set(skillProgress?.map(s => s.roadmap_id) ?? []);
      const recs: Recommendation[] = [];

      // Recommend roadmaps matching career goal
      roadmaps?.forEach(r => {
        const matches = careerGoal && (
          r.title.toLowerCase().includes(careerGoal) ||
          r.category.toLowerCase().includes(careerGoal) ||
          (r.description || "").toLowerCase().includes(careerGoal)
        );
        if (matches && !startedRoadmapIds.has(r.id)) {
          recs.push({
            id: r.id,
            title: r.title,
            description: r.description,
            type: "roadmap",
            route: `/roadmaps/${r.id}`,
            reason: `Matches your goal: ${profile?.career_goal}`,
          });
        }
      });

      // Recommend courses by category relevance
      courses?.forEach(c => {
        const matches = careerGoal && (
          c.title.toLowerCase().includes(careerGoal) ||
          c.category.toLowerCase().includes(careerGoal) ||
          (c.description || "").toLowerCase().includes(careerGoal)
        );
        if (matches) {
          recs.push({
            id: c.id,
            title: c.title,
            description: c.description,
            type: "course",
            route: "/learning",
            reason: `Recommended for ${profile?.career_goal}`,
          });
        }
      });

      // If no goal-based recs, suggest popular ones
      if (recs.length === 0) {
        roadmaps?.slice(0, 2).forEach(r => {
          recs.push({
            id: r.id,
            title: r.title,
            description: r.description,
            type: "roadmap",
            route: `/roadmaps/${r.id}`,
            reason: "Popular roadmap",
          });
        });
        courses?.slice(0, 2).forEach(c => {
          recs.push({
            id: c.id,
            title: c.title,
            description: c.description,
            type: "course",
            route: "/learning",
            reason: "Popular course",
          });
        });
      }

      return recs.slice(0, 4);
    },
    enabled: !!user,
  });
}
