'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Loader2, ExternalLink, User as UserIcon, Code2, Clock } from 'lucide-react';

interface Submission {
  SUBMISSIONID: number;
  USERID: number;
  QUESTIONID: number;
  VERDICTID: number;
  VERDICTNAME: string;
  SUBMITTEDCODE: string;
  SUBMITTEDAT: string;
  TITLE: string;
  FULLNAME: string;
  CF_HANDLE: string;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllSubmissions = async () => {
      try {
        const res = await api.get('/submissions/all');
        setSubmissions(res.data);
      } catch (err) {
        console.error('Failed to fetch submissions', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllSubmissions();
  }, []);

  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case 'AC': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'WA': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Recent Submissions</h1>
        <p className="text-muted-foreground">Activity from all community members</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 font-medium">
                <tr>
                  <th className="px-6 py-4">Solver</th>
                  <th className="px-6 py-4">Question</th>
                  <th className="px-6 py-4">Verdict</th>
                  <th className="px-6 py-4">Code / ID</th>
                  <th className="px-6 py-4">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {submissions.map((s) => (
                  <tr key={s.SUBMISSIONID} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold">{s.FULLNAME}</span>
                        <span className="text-xs text-muted-foreground">@{s.CF_HANDLE}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-[200px] truncate font-medium text-primary">
                        {s.TITLE}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${getVerdictStyle(s.VERDICTNAME)}`}>
                        {s.VERDICTNAME}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Code2 className="h-3 w-3" />
                        <span className="max-w-[150px] truncate">{s.SUBMITTEDCODE}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(s.SUBMITTEDAT).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && submissions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <p>No submissions yet.</p>
        </div>
      )}
    </div>
  );
}
