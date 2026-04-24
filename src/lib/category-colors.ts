export function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    regional:       "text-cyan-700 dark:text-cyan-400",
    nacional:       "text-blue-800 dark:text-blue-400",
    internacional:  "text-indigo-700 dark:text-indigo-400",
    deportes:       "text-red-600 dark:text-red-400",
    editorial:      "text-slate-500 dark:text-slate-400",
  };
  return map[category.toLowerCase()] ?? "text-primary";
}

export function getCategoryBadge(category: string): string {
  const map: Record<string, string> = {
    regional:       "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-400",
    nacional:       "bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400",
    internacional:  "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400",
    deportes:       "bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400",
    editorial:      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  };
  return map[category.toLowerCase()] ?? "bg-primary/10 text-primary";
}
