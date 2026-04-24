export function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    regional:       "text-emerald-700 dark:text-emerald-400",
    nacional:       "text-blue-700 dark:text-blue-400",
    internacional:  "text-violet-700 dark:text-violet-400",
    deportes:       "text-orange-600 dark:text-orange-400",
    editorial:      "text-slate-500 dark:text-slate-400",
  };
  return map[category.toLowerCase()] ?? "text-primary";
}

export function getCategoryBadge(category: string): string {
  const map: Record<string, string> = {
    regional:       "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400",
    nacional:       "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400",
    internacional:  "bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-400",
    deportes:       "bg-orange-50 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400",
    editorial:      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  };
  return map[category.toLowerCase()] ?? "bg-primary/10 text-primary";
}
