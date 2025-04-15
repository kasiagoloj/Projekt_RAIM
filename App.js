import './App.css';

function App() {
  return (
    <div className="app-layout">
      <header className="header">
        <h1>Segmentacja Panoptyczna</h1>
        <h2>Sceny dentystycznej</h2>
      </header>

      <aside className="sidebar">
      <div className="visibility-panel">
  <label className="legend-label">Legenda kolorów</label>
  <div className="legend-box">
    {/* Tu będzie legenda */}
  </div>

  <h3>Sterowanie widocznością elementów</h3>
  <div className="opacity-controls">
    <label>Widoczność maski</label>
    <input type="range" />
    <label>Widoczność modelu</label>
    <input type="range" />
  </div>
</div>


  <div className="navigation">
    <label>Image / Video Navigation</label>
    <input type="range" />
  </div>
</aside>


      <div className="top-panels">
        <div className="panel">Zdjęcie wejściowe</div>
        <div className="panel">Maska</div>
        <div className="panel">Model</div>
      </div>

      <main className="observation-area">
        Obszar obserwacji
      </main>

      <div className="frame-controls">
        <button>Poprzednie klatki</button>
        <button className="active">Aktualna klatka</button>
        <button>Następne klatki</button>
      </div>

      <section className="metrics">
        <div className="chart">Metryki</div>
      </section>
    </div>
  );
}

export default App;
