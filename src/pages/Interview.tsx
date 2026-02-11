import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  MessageSquare,
  Lightbulb,
  Mic,
  ChevronDown,
  BookOpen,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const selfIntroFormula = {
  title: "Self Introduction Guide",
  icon: User,
  content: `Use the 3-step formula: Present → Past → Future.

"I am a CSE student at RGPV, currently in my 3rd year. I have been learning web development and built 3 projects including a task manager and e-commerce store. My goal is to become a full-stack developer at a product-based company."

Tips:
• Keep it under 60 seconds
• Mention your current role/study
• Highlight 1-2 achievements
• End with your career goal`,
};

const mockScript = {
  title: "Mock Interview Script",
  icon: Mic,
  points: [
    "Start with a confident greeting and smile",
    "Introduce yourself using the 3-step formula",
    "Listen carefully before answering",
    "Use STAR method for behavioral questions (Situation, Task, Action, Result)",
    "Ask 2-3 intelligent questions at the end",
    'End with: "Thank you for your time, I look forward to hearing from you."',
  ],
};

const Interview = () => {
  const { data: hrQuestions, isLoading } = useQuery({
    queryKey: ["hr-questions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hr_questions")
        .select("*")
        .order("category")
        .order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const categories = hrQuestions
    ? [...new Set(hrQuestions.map((q) => q.category))]
    : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Interview Prep</h1>
        <p className="text-muted-foreground mt-1">HR questions, tech basics, self-intro guide & mock scripts</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Self Intro */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-5 shadow-card border border-border/50"
        >
          <h2 className="font-display font-semibold text-foreground flex items-center gap-2 mb-3">
            <selfIntroFormula.icon className="h-5 w-5 text-primary" /> {selfIntroFormula.title}
          </h2>
          <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
            <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
              {selfIntroFormula.content}
            </p>
          </div>
        </motion.div>

        {/* Mock Script */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-xl p-5 shadow-card border border-border/50"
        >
          <h2 className="font-display font-semibold text-foreground flex items-center gap-2 mb-3">
            <mockScript.icon className="h-5 w-5 text-accent" /> {mockScript.title}
          </h2>
          <div className="space-y-2.5">
            {mockScript.points.map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-accent/10 text-accent text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-foreground">{point}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Questions from DB */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-display font-bold text-foreground mb-3 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-info" /> Interview Questions
        </h2>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border/50">
            <BookOpen className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">Questions will be added soon!</p>
          </div>
        ) : (
          <Accordion type="multiple" className="space-y-2">
            {categories.map((category) => (
              <AccordionItem
                key={category}
                value={category}
                className="bg-card rounded-xl border border-border/50 shadow-card px-4 overflow-hidden"
              >
                <AccordionTrigger className="py-3 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{category}</Badge>
                    <span className="text-sm font-medium text-foreground">
                      {hrQuestions?.filter((q) => q.category === category).length} questions
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-3">
                    {hrQuestions
                      ?.filter((q) => q.category === category)
                      .map((q, i) => (
                        <div key={q.id} className="p-3 rounded-lg bg-muted/50 border border-border/30">
                          <p className="text-sm font-medium text-foreground flex items-start gap-2">
                            <span className="text-accent font-bold">Q{i + 1}.</span>
                            {q.question}
                          </p>
                          {q.answer && (
                            <p className="text-sm text-muted-foreground mt-2 pl-6 leading-relaxed">
                              {q.answer}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </motion.div>
    </div>
  );
};

export default Interview;
