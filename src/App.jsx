import Calculator from './components/Calculator.jsx'

function App() {
  return (
    <div className="kawaii-bg relative h-[100dvh] overflow-hidden text-[#4E3B31]">
      <span className="float-shape left-[8%] top-[10%] text-4xl opacity-60">☁️</span>
      <span className="float-shape right-[10%] top-[14%] text-3xl opacity-50">💗</span>
      <span className="float-shape left-[12%] bottom-[16%] text-3xl opacity-50">🌸</span>
      <span className="float-shape right-[14%] bottom-[24%] text-4xl opacity-60">☁️</span>
      <span className="float-shape left-[22%] top-[48%] text-2xl opacity-40">💫</span>
      <span className="float-shape right-[20%] top-[55%] text-2xl opacity-40">🫧</span>

      <main className="relative z-10 flex h-full min-h-0 flex-col">
        <header className="shrink-0 px-4 pt-3 text-center sm:pt-4">
          <h1 className="mb-1 font-display text-2xl font-bold tracking-tight text-[#4E3B31] drop-shadow-sm sm:text-3xl">
            Samson, Aries B.<span className="text-[#FF8A8A]"> :)</span>
          </h1>
          <p className="mb-2 text-sm font-medium text-[#B089A0]">BSIT 3-3</p>
        </header>

        <div className="flex min-h-0 w-full flex-1 flex-col px-3 sm:px-4">
          <Calculator />
        </div>

        <footer className="shrink-0 pb-3 text-center text-xs font-medium text-[#C9A6B5]">
          <a
            href="https://github.com/Stablhr/Simple-Calculator-Project"
            target="_blank"
            rel="noreferrer"
            className="transition duration-150 hover:text-[#FF8A8A]"
          >
            Simple Calculator Project
          </a>
        </footer>
      </main>
    </div>
  )
}

export default App