import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';
import { Github, Linkedin, Mail, Code, Server, Heart, Zap, Database, Shield, Activity } from 'lucide-react';

const TECH_STACK = [
  { icon: Server, label: 'Spring Boot 4', desc: 'Reactive WebFlux backend', color: 'green' },
  { icon: Database, label: 'PostgreSQL', desc: 'Relational data store', color: 'blue' },
  { icon: Code, label: 'React + Vite', desc: 'Modern frontend', color: 'cyan' },
  { icon: Shield, label: 'JWT + AES', desc: 'Security layers', color: 'purple' },
  { icon: Zap, label: 'Java 21', desc: 'Virtual threads', color: 'amber' },
  { icon: Activity, label: 'WebClient', desc: 'Async HTTP polling', color: 'red' },
];

const colorMap = {
  green:  { bg: 'bg-green-50  dark:bg-green-900/20',  text: 'text-green-600  dark:text-green-400',  ring: 'ring-green-100  dark:ring-green-900/30' },
  blue:   { bg: 'bg-blue-50   dark:bg-blue-900/20',   text: 'text-blue-600   dark:text-blue-400',   ring: 'ring-blue-100   dark:ring-blue-900/30' },
  cyan:   { bg: 'bg-cyan-50   dark:bg-cyan-900/20',   text: 'text-cyan-600   dark:text-cyan-400',   ring: 'ring-cyan-100   dark:ring-cyan-900/30' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', ring: 'ring-purple-100 dark:ring-purple-900/30' },
  amber:  { bg: 'bg-amber-50  dark:bg-amber-900/20',  text: 'text-amber-600  dark:text-amber-400',  ring: 'ring-amber-100  dark:ring-amber-900/30' },
  red:    { bg: 'bg-red-50    dark:bg-red-900/20',    text: 'text-red-600    dark:text-red-400',    ring: 'ring-red-100    dark:ring-red-900/30' },
};

export default function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <PublicNavbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full relative">
        {/* Subtle dot matrix background */}
        <div className="absolute inset-0 z-0 opacity-[0.25] dark:opacity-10 pointer-events-none"
             style={{ 
               backgroundImage: 'radial-gradient(circle, rgb(148 163 184 / 0.8) 1px, transparent 1px)', 
               backgroundSize: '24px 24px',
               animation: 'pan-matrix 4s linear infinite'
             }} />
        <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-plus-lighter" />
        <div className="absolute top-40 right-10 w-[400px] h-[400px] bg-indigo-300/20 dark:bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-plus-lighter" />

        {/* Hero */}
        <div className="text-center mb-16 relative z-10">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5 rounded-full mb-6 ring-1 ring-blue-100 dark:ring-blue-800 shadow-sm">
            <Activity className="w-3.5 h-3.5" /> Built for developers
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-5">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">ApiSentinel</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Built to give developers real-time observability over their critical API infrastructure — before users notice anything is wrong.
          </p>
        </div>

        {/* Mission card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-blue-50 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-10 lg:p-14 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-5">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Modern applications rely on external APIs and microservices. When they go down, finding out from your users is the worst possible scenario. ApiSentinel was created to solve exactly this — providing an elegant, intuitive platform for monitoring uptime, tracking incidents, and delivering real-time latency analytics.
              </p>
              <div className="space-y-3">
                {[
                  { icon: Server, label: 'Reliable polling with Spring Boot', color: 'blue' },
                  { icon: Code, label: 'Beautiful React + Vite dashboard', color: 'green' },
                  { icon: Shield, label: 'AES-encrypted API keys, JWT auth', color: 'purple' },
                ].map(({ icon: Icon, label, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`${colorMap[color].bg} ${colorMap[color].ring} ring-1 p-2 rounded-lg`}>
                      <Icon className={`w-4 h-4 ${colorMap[color].text}`} />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 lg:p-14 text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-10 translate-x-10" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl translate-y-10 -translate-x-10" />
              <div className="relative z-10">
                <div className="bg-white/15 p-5 rounded-2xl backdrop-blur-sm mb-6 ring-4 ring-white/20 inline-flex">
                  <Heart className="w-10 h-10 text-white" fill="currentColor" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Developer First</h3>
                <p className="text-blue-100 leading-relaxed max-w-xs">
                  Designed for software engineers, DevOps teams, and indie hackers who want a no-nonsense, gorgeous interface to monitor their endpoints.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tech stack */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tech Stack</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Built with modern, production-grade technologies</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {TECH_STACK.map(({ icon: Icon, label, desc, color }) => (
              <div key={label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 text-center hover:-translate-y-1 hover:shadow-md transition-all duration-200 group">
                <div className={`${colorMap[color].bg} ${colorMap[color].ring} ring-1 p-3 rounded-xl inline-flex mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${colorMap[color].text}`} />
                </div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{label}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Creator section */}
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Meet the Creator</h2>
          <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full mb-10" />
          
          <div className="bg-white dark:bg-gray-900 max-w-2xl mx-auto rounded-3xl shadow-md border border-gray-100 dark:border-gray-800 p-8 sm:p-10 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl -translate-y-32 translate-x-32 pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-2xl font-bold mb-4 shadow-lg shadow-blue-600/30">
                J
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Jenish Raichura</h3>
              <p className="text-blue-600 dark:text-blue-400 font-semibold mb-5">Full Stack Developer & Software Engineer</p>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed text-sm max-w-lg mx-auto">
                Passionate about building scalable backend systems and beautiful, intuitive interfaces. ApiSentinel is a testament to blending enterprise-grade Spring Boot architectures with modern React web applications.
              </p>
              <div className="flex justify-center flex-wrap gap-3">
                {[
                  { href: 'https://github.com/Jenish1409', icon: Github, label: 'GitHub', cls: 'bg-gray-900 dark:bg-gray-800 text-white hover:bg-gray-800 dark:hover:bg-gray-700' },
                  { href: 'https://www.linkedin.com/in/jenish-raichura-9b535727b/', icon: Linkedin, label: 'LinkedIn', cls: 'btn-shine-effect bg-blue-600 text-white hover:bg-blue-500' },
                  { href: 'mailto:jenishraichura58@gmail.com', icon: Mail, label: 'Email Me', cls: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700' },
                ].map(({ href, icon: Icon, label, cls }) => (
                  <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all hover:-translate-y-0.5 ${cls}`}>
                    <Icon className="w-4 h-4" /> {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
