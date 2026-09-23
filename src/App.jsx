import Calculator from './components/Calculator.jsx'
import InstructionsPanel from './components/InstructionsPanel.jsx'

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0B0F14] to-[#1A2230] text-white">
      <div
        className="calc-blob left-1/2 top-0 h-80 w-80 -translate-x-1/2 -translate-y-1/3 bg-blue-500/25"
        style={{ filter: 'blur(80px)' }}
      />
      <div
        className="calc-blob bottom-0 right-0 h-72 w-72 translate-x-1/3 translate-y-1/4 bg-blue-400/15"
        style={{ filter: 'blur(90px)' }}
      />
      <div
        className="calc-blob left-0 top-1/2 h-64 w-64 -translate-x-1/3 bg-sky-500/10"
        style={{ filter: 'blur(70px)' }}
      />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-10">
        <h1 className="mb-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
          Calculator
        </h1>
        <p className="mb-6 text-sm text-white/40">Frosted glass on a glowing dark canvas</p>
        <Calculator />
        <InstructionsPanel />
      </main>

      <footer className="relative z-10 pb-6 text-center text-xs text-white/30">
        <a
          href="https://github.com/Stablhr/Simple-Calculator-Project"
          target="_blank"
          rel="noreferrer"
          className="transition duration-150 hover:text-white/60"
        >
          Simple Calculator Project
        </a>
      </footer>
    </div>
  )
}

export default App