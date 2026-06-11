import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Zap,
  Timer,
  Shield,
  Terminal,
  ArrowRight,
  BookOpen,
  Braces,
  Play,
  Check,
  Loader2,
  ChevronRight,
  Layers,
  Sparkles,
  ArrowUpRight
} from 'lucide-react'

const SIMULATOR_ENDPOINTS = [
  {
    path: '/users/me',
    method: 'GET',
    description: 'Fetch active developer profile mock',
    response: {
      id: 42,
      username: 'jenish_raichura',
      role: 'lead_developer',
      skills: ['REST APIs', 'React', 'Redis', 'Tailwind'],
      status: 'active',
      location: 'India',
      active_projects: 3
    }
  },
  {
    path: '/auth/login',
    method: 'POST',
    description: 'Authenticate mock user session',
    response: {
      token: 'eyJhbGciOiJIUzUxMiJ9.devforge-mock-jwt-token-demo-johndoe-ex109038209848',
      expiresIn: 86400000,
      user: {
        username: 'mock_developer',
        email: 'developer@devforge.dev',
        tier: 'developer-pro'
      }
    }
  },
  {
    path: '/projects/sandbox',
    method: 'GET',
    description: 'Fetch workspace configuration data',
    response: {
      id: 101,
      name: 'DevForge Production Mock API',
      requireApiKey: true,
      endpoints_count: 8,
      status: 'healthy',
      endpoints: [
        { path: '/users/me', method: 'GET', status: 200 },
        { path: '/auth/login', method: 'POST', status: 200 },
        { path: '/projects/sandbox', method: 'GET', status: 200 }
      ]
    }
  }
]

const FEATURES_DATA = [
  {
    id: 'instant',
    title: 'Instant Mocking',
    subtitle: 'Zero Setup Boilerplate',
    description: 'Define request paths, status codes, content types, and responses instantly. Spin up active mock routes without writing server boilerplate.',
    icon: Zap,
    color: 'text-emerald-500 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20 dark:border-emerald-500/10',
    glowColor: 'shadow-emerald-500/5',
    code: `# Endpoint configuration
route: /api/v1/health
method: GET
status: 200
contentType: application/json
response:
  status: "healthy"
  uptime: "99.999%"
  services:
    database: "UP"
    redis: "UP"`
  },
  {
    id: 'latency',
    title: 'Dynamic Latency',
    subtitle: 'Simulate Network Lag',
    description: 'Introduce artificial latency to test your frontend skeletons, loader states, and connection timeouts under real-world server stress.',
    icon: Timer,
    color: 'text-cyan-500 dark:text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20 dark:border-cyan-500/10',
    glowColor: 'shadow-cyan-500/5',
    code: `# Heavy query latency mock
route: /api/v1/heavy-analytics
delay_ms: 1500 # custom network delay
status: 200
fault_tolerance:
  timeout_threshold: 1200
  on_timeout: 504_GATEWAY_TIMEOUT`
  },
  {
    id: 'isolation',
    title: 'Project Isolation',
    subtitle: 'Independent Test Sandboxes',
    description: 'Organize mock endpoints under isolated project containers. Secure endpoints with unique header credentials and API keys.',
    icon: Shield,
    color: 'text-violet-500 dark:text-violet-400',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/20 dark:border-violet-500/10',
    glowColor: 'shadow-violet-500/5',
    code: `// Javascript SDK client
const headers = {
  "Authorization": "Bearer df_key_42a8b9c...",
  "X-Project-Origin": "devforge-sandbox"
};
fetch("https://api.devforge.com/mock/1/users", { headers })
  .then(res => res.json())
  .then(data => console.log(data));`
  },
  {
    id: 'boilerplate',
    title: 'Boilerplate-Free JSON',
    subtitle: 'Skip Server Boilerplate',
    description: 'Paste your raw JSON payloads directly. No complex model classes, no DB migrations, no router files, and no configuration nightmares.',
    icon: Braces,
    color: 'text-amber-500 dark:text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20 dark:border-amber-500/10',
    glowColor: 'shadow-amber-500/5',
    code: `// Raw JSON Mock Payload
{
  "status": "success",
  "message": "Raw JSON served directly without backend setup code!",
  "items": [],
  "metadata": {
    "total": 0,
    "limit": 10
  }
}`
  }
]

export default function HomePage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(SIMULATOR_ENDPOINTS[0])
  const [simulatorDelay, setSimulatorDelay] = useState(500)
  const [simulatorLoading, setSimulatorLoading] = useState(false)
  const [simulatorResponse, setSimulatorResponse] = useState(null)
  
  const [activeTab, setActiveTab] = useState(FEATURES_DATA[0])

  // Reset simulator output when endpoint changes
  useEffect(() => {
    setSimulatorResponse(null)
  }, [selectedEndpoint])

  // Trigger simulator request simulation
  const handleRunSimulator = () => {
    setSimulatorLoading(true)
    setSimulatorResponse(null)
    setTimeout(() => {
      setSimulatorResponse(selectedEndpoint.response)
      setSimulatorLoading(false)
    }, simulatorDelay)
  }

  // Syntax highlighting helper for JSON
  const highlightJson = (json) => {
    if (!json) return ''
    const str = JSON.stringify(json, null, 2)
    return str.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, (match) => {
      let cls = 'text-zinc-500'
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-zinc-900 dark:text-amber-400' // key
        } else {
          cls = 'text-emerald-600 dark:text-emerald-400' // string
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-blue-600 dark:text-cyan-400 font-semibold' // boolean
      } else if (/null/.test(match)) {
        cls = 'text-red-500 font-semibold' // null
      } else {
        cls = 'text-violet-600 dark:text-violet-400' // number
      }
      return `<span class="${cls}">${match}</span>`
    })
  }

  return (
    <div className="space-y-32">
      {/* ============ HERO SECTION (Asymmetric Split) ============ */}
      <section className="relative mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Bold Copy */}
          <div className="lg:col-span-6 space-y-6 text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 text-xs font-mono text-emerald-700 dark:text-emerald-400 shadow-sm shadow-emerald-500/5">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-emerald-500" />
              <span>v1.2 — Live Sandbox Simulator Included</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl lg:text-6xl leading-tight">
              Forge Mock APIs.
              <br />
              <span className="bg-gradient-to-r from-emerald-600 dark:from-emerald-400 via-cyan-600 dark:via-cyan-400 to-emerald-600 dark:to-emerald-400 bg-clip-text text-transparent">
                Accelerate Development.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
              DevForge lets frontend teams spin up mock server endpoints instantly. Skip compiling custom backends, managing database migrations, or waiting on API specs. Just define, delay, and code.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:ring-offset-2 hover:bg-emerald-500 transition-all duration-300 transform active:scale-95"
              >
                Create Sandbox Account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-sm px-6 py-3.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:-translate-y-0.5 transition-all duration-300 transform active:scale-95"
              >
                Explore Playground
                <ArrowUpRight className="h-4 w-4 text-zinc-400" />
              </a>
            </div>
            
            <div className="flex items-center gap-3 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/60 max-w-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
                $ npx devforge-cli init --local
              </span>
            </div>
          </div>

          {/* Right Column: Live Mock Simulator */}
          <div className="lg:col-span-6 w-full animate-fade-in [animation-delay:150ms]">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-1 shadow-2xl shadow-zinc-400/20 dark:shadow-black/60 transition-all backdrop-blur-sm">
              
              {/* Simulator Header */}
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 bg-zinc-50/50 dark:bg-zinc-900/40 rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500">api-playground.js</span>
                <span className="w-14" />
              </div>

              {/* Simulator Body */}
              <div className="p-5 space-y-5">
                
                {/* Selector */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2">
                    Select API Mock Route
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {SIMULATOR_ENDPOINTS.map((ep) => {
                      const isSelected = selectedEndpoint.path === ep.path
                      return (
                        <button
                          key={ep.path}
                          onClick={() => setSelectedEndpoint(ep)}
                          className={`text-left rounded-lg p-2.5 border transition-all duration-200 ${
                            isSelected
                              ? 'bg-emerald-50/80 dark:bg-emerald-500/10 border-emerald-500/30 text-zinc-900 dark:text-zinc-100'
                              : 'bg-zinc-50/30 dark:bg-zinc-950/20 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                              ep.method === 'POST'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            }`}>
                              {ep.method}
                            </span>
                          </div>
                          <p className="text-[11px] font-mono mt-1.5 truncate">{ep.path}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Delay configuration */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                      Simulated Latency
                    </label>
                    <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {simulatorDelay}ms
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {[0, 500, 1500, 3000].map((d) => (
                      <button
                        key={d}
                        onClick={() => setSimulatorDelay(d)}
                        className={`flex-1 py-1.5 rounded text-xs font-mono border transition-all ${
                          simulatorDelay === d
                            ? 'bg-zinc-900 dark:bg-zinc-800 border-zinc-800 dark:border-zinc-700 text-white shadow'
                            : 'bg-zinc-50/50 dark:bg-zinc-950/30 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-950/50'
                        }`}
                      >
                        {d === 0 ? 'No Lag' : `${d}ms`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={handleRunSimulator}
                  disabled={simulatorLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-800/80 disabled:opacity-50 text-white py-3 text-sm font-semibold shadow-md transition-all transform active:scale-[0.98]"
                >
                  {simulatorLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                      <span>Request pending ({simulatorDelay}ms delay)...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                      <span>Send Sandbox Request</span>
                    </>
                  )}
                </button>

                {/* Terminal console printout */}
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 p-4 space-y-2.5 font-mono text-xs text-zinc-300 shadow-inner overflow-hidden max-w-full w-full">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 border-b border-zinc-900 pb-2">
                    <span>Terminal output</span>
                    <span>HTTPS Client</span>
                  </div>
                  <div className="space-y-2 h-64 overflow-y-auto pr-1">
                    <p className="text-zinc-400 break-all whitespace-pre-wrap">
                      $ curl -i -X {selectedEndpoint.method} http://localhost:8080/mock/devforge{selectedEndpoint.path}
                    </p>
                    {simulatorLoading && (
                      <p className="text-cyan-400 animate-pulse">
                        &gt; Waiting for response headers...
                      </p>
                    )}
                    {simulatorResponse && !simulatorLoading && (
                      <div className="space-y-2 animate-fade-in">
                        <div className="text-zinc-500 space-y-0.5">
                          <p>HTTP/1.1 200 OK</p>
                          <p>Content-Type: application/json</p>
                          <p>X-Mock-Delay: {simulatorDelay}ms</p>
                          <p>X-Powered-By: DevForge Cache</p>
                        </div>
                        <pre className="text-left overflow-x-auto whitespace-pre leading-relaxed pt-1.5 border-t border-zinc-900 max-w-full">
                          <code className="block max-w-full overflow-x-auto whitespace-pre" dangerouslySetInnerHTML={{ __html: highlightJson(simulatorResponse) }} />
                        </pre>
                      </div>
                    )}
                    {!simulatorLoading && !simulatorResponse && (
                      <p className="text-zinc-500 dark:text-zinc-400 italic">
                        &gt; Press button above to execute simulated API mock request...
                      </p>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>      {/* ============ PLAYGROUND & FEATURES (Interactive Tabs) ============ */}
      <section id="features" className="relative border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/10 py-28 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl text-left mb-16 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-500">
              Interactive Sandbox Dashboard
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              Zero Boilerplate Mocking.
            </h2>
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
              DevForge handles route management, security validations, and cache logic out of the box. Select a feature to see it configured:
            </p>
          </div>

          {/* Interactive Layout Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Side: Dynamic Selector Tabs */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {FEATURES_DATA.map((feat) => {
                const isActive = activeTab.id === feat.id
                return (
                  <button
                    key={feat.id}
                    onClick={() => setActiveTab(feat)}
                    className={`group w-full text-left rounded-2xl border p-5 transition-all duration-300 flex items-start gap-4 ${
                      isActive
                        ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl shadow-zinc-300/40 dark:shadow-black/20'
                        : 'bg-white/40 dark:bg-transparent border-transparent hover:bg-white dark:hover:bg-zinc-900/40 hover:border-zinc-200 dark:hover:border-zinc-800/40'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl border transition-all duration-300 ${
                      isActive
                        ? `${feat.bgColor} ${feat.color} ${feat.borderColor} scale-105`
                        : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-150 dark:border-zinc-800 text-zinc-505 group-hover:scale-105'
                    }`}>
                      <feat.icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          {feat.title}
                        </h3>
                        {isActive && (
                          <ChevronRight className="w-4 h-4 text-emerald-500 hidden sm:block shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-400 uppercase tracking-wider">
                        {feat.subtitle}
                      </p>
                      {isActive && (
                        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-450 leading-relaxed pt-1 animate-fade-in">
                          {feat.description}
                        </p>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Right Side: Virtual Code Display Panel */}
            <div className="lg:col-span-7 h-full min-h-[350px] lg:min-h-auto">
              <div className="h-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 p-1 shadow-2xl flex flex-col">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-900 px-5 py-3 shrink-0 bg-zinc-950 rounded-t-2xl">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-zinc-800" />
                    <span className="font-mono text-xs text-zinc-400 dark:text-zinc-400 lowercase">
                      {activeTab.id}_config.yaml
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-500">
                      READONLY
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <pre className="flex-1 overflow-auto p-5 text-left text-xs sm:text-sm leading-relaxed font-mono bg-zinc-950/60 rounded-b-2xl animate-fade-in">
                  <code className="text-emerald-600 dark:text-emerald-400/90 whitespace-pre">
                    {activeTab.code}
                  </code>
                </pre>

              </div>
            </div>

          </div>

          {/* Footer Call to action */}
          <div className="mt-20 border-t border-zinc-200/50 dark:border-zinc-800/60 pt-16 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Ready to cut down your API dependency cycle?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Establish robust, isolated test projects in less than two minutes.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-6 py-3 shadow-md hover:shadow-lg transition-all transform active:scale-95 shrink-0"
            >
              Start Mocking Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </section>
    </div>
  )
}
