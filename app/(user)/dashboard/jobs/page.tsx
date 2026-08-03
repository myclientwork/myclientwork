'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Briefcase, Search, Plus, ArrowUpRight } from 'lucide-react';
import { UserBackLink } from '@/shared/components/layout/user-back-link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import type { JobRequest } from '@/lib/types';
import { fadeIn, staggerContainer } from '@/lib/motion';

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  UNDER_REVIEW: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  QUALIFIED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  IN_PROGRESS: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  COMPLETED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  REJECTED: 'bg-red-500/10 text-red-400 border-red-500/30',
  CANCELLED: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
};

export default function MyJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadJobs() {
      if (!user) return;
      const { data } = await supabase
        .from('job_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setJobs((data as JobRequest[]) ?? []);
      setLoading(false);
    }
    loadJobs();
  }, [user]);

  const filtered = jobs.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.service_type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <UserBackLink />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            My Requirements
          </h1>
          <p className="mt-1 text-xs text-muted-foreground font-medium">
            Track your submitted project specifications and execution pipeline.
          </p>
        </div>
        <Button asChild className="rounded-xl shadow-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
          <Link href="/post-a-job">
            <Plus className="mr-2 h-4 w-4" />
            Post Requirement
          </Link>
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search requirements..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 rounded-xl border-border/80 bg-card/60 backdrop-blur-xl focus:border-cyan-500/60 focus:ring-cyan-500/20"
        />
      </div>

      {loading ? (
        <Card className="rounded-2xl border-border/60 bg-card/60 p-8 text-center text-muted-foreground">
          Loading requirements...
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="rounded-2xl border-border/60 bg-card/60 p-12 text-center backdrop-blur-xl">
          <CardContent className="flex flex-col items-center p-0">
            <Briefcase className="h-12 w-12 text-muted-foreground/40 mb-3" />
            <p className="font-bold text-foreground">
              {search ? 'No requirements match your search.' : 'No requirements posted yet.'}
            </p>
            {!search && (
              <p className="mt-1 text-xs text-muted-foreground">
                Requirement specs submitted will appear here for milestone tracking.
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <motion.div
          variants={staggerContainer(0.08, 0.05)}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {filtered.map((job, i) => (
            <motion.div key={job.id} variants={fadeIn('up', i * 0.05, 0.4)}>
              <Link href={`/dashboard/jobs/${job.id}`} className="block group">
                <Card className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl transition-all duration-300 hover:border-primary/50 hover:shadow-xl">
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors truncate">
                            {job.title}
                          </h3>
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                          {job.description}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-medium">
                          <span className="text-primary font-semibold">{job.service_type}</span>
                          <span>·</span>
                          <span>
                            {job.currency} {job.budget_min_cents ? (job.budget_min_cents / 100).toLocaleString() : '—'}
                            {' – '}
                            {job.budget_max_cents ? (job.budget_max_cents / 100).toLocaleString() : '—'}
                          </span>
                          <span>·</span>
                          <span>{new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider border ${STATUS_COLORS[job.status] || 'bg-secondary text-muted-foreground'}`}
                      >
                        {job.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
