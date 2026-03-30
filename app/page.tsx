import Image from "next/image";
import Link from "next/link";
import { 
  Trophy, 
  Code2, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  Users,
  ArrowRight
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-black/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">DevProgress</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <Link href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</Link>
            <Link href="#stats" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Statistics</Link>
            <Link href="/leaderboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Leaderboard</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-indigo-600 transition-colors">
              Log in
            </Link>
            <Link 
              href="/login" 
              className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-lg shadow-indigo-500/10"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 sm:py-32">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-30 dark:opacity-20 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/30 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 blur-[120px] rounded-full" />
          </div>

          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-8 text-center lg:text-left">
              <div className="inline-flex items-center self-center lg:self-start gap-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 px-3 py-1 rounded-full">
                <Zap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">New: Codeforces Sync</span>
              </div>
              <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1]">
                Master the Art of <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">Competitive Programming</span>
              </h1>
              <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto lg:mx-0">
                The ultimate platform for developers to track, analyze, and accelerate their progress on Codeforces and beyond. Built for champions.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link 
                  href="/login" 
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-500/25"
                >
                  Start Your Journey <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/leaderboard" 
                  className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                >
                  View Leaderboard
                </Link>
              </div>
              
              <div className="flex items-center gap-4 pt-4 justify-center lg:justify-start">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-black bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                      <Image 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} 
                        alt="User" 
                        width={40} 
                        height={40} 
                      />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white dark:border-black bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                    +500
                  </div>
                </div>
                <span className="text-sm font-medium text-zinc-500">Joined by 500+ developers</span>
              </div>
            </div>

            <div className="relative group perspective-1000">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:rotate-y-2 group-hover:rotate-x-2">
                <Image 
                  src="/hero_programming_dashboard.png" 
                  alt="Platform Dashboard Preview" 
                  width={800} 
                  height={600} 
                  className="opacity-90 group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Mockup Stats */}
                <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.1em]">Accuracy</div>
                      <div className="text-xl font-bold text-white">94.2%</div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl animate-float-delayed">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.1em]">Global Rank</div>
                      <div className="text-xl font-bold text-white">#128</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Everything You Need to Succeed</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                A robust suite of tools designed specifically for competitive programmers who want to reach the next level.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
                  title: "Strict Normalization",
                  desc: "Our Oracle-powered database (3NF) ensures your data is clean, secure, and always accessible."
                },
                {
                  icon: <Trophy className="w-6 h-6 text-amber-500" />,
                  title: "Codeforces Integration",
                  desc: "Verify your handle and sync your submissions instantly. No more manual data entry."
                },
                {
                  icon: <BarChart3 className="w-6 h-6 text-indigo-500" />,
                  title: "Advanced Analytics",
                  desc: "Detailed breakdowns of your solved tags, rating distribution, and accuracy metrics."
                },
                {
                  icon: <Users className="w-6 h-6 text-blue-500" />,
                  title: "Global Leaderboard",
                  desc: "Compete with peers and see where you stand in the global coding community."
                },
                {
                  icon: <Code2 className="w-6 h-6 text-rose-500" />,
                  title: "Problem Collections",
                  desc: "Save questions, add personal hints, and bookmark challenging tasks for later review."
                },
                {
                  icon: <Zap className="w-6 h-6 text-cyan-500" />,
                  title: "Real-time Stats",
                  desc: "Your UserStats table updates automatically via database triggers on every AC submission."
                }
              ].map((feature, idx) => (
                <div key={idx} className="bg-white dark:bg-black p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 tracking-tight">{feature.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="bg-indigo-600 rounded-[3rem] p-12 sm:p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-500/40">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 flex flex-col items-center gap-8">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Ready to Level Up Your <br className="hidden sm:block" /> Programming Skills?
                </h2>
                <p className="text-indigo-100 text-lg max-w-lg">
                  Join hundreds of developers tracking their progress and competing to be the best. Sign up today and start building your future.
                </p>
                <Link 
                  href="/login" 
                  className="px-10 py-5 bg-white text-indigo-600 rounded-2xl font-black text-lg hover:bg-zinc-50 hover:scale-105 transition-all shadow-xl"
                >
                  Create Your Free Account
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-lg tracking-tight">DevProgress</span>
          </div>
          <div className="text-sm font-medium text-zinc-500">
            © 2026 Programming Practice Progress Management System. Built with Next.js & OracleDB.
          </div>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">GitHub</Link>
            <Link href="#" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Discord</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
