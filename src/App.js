import './App.css';
import * as React from 'react';
import { useState } from 'react';

function App() {
  const [inputImage, setInputImage] = useState(null);
  const [maskFile, setMaskFile] = useState(null);
  const [modelFile, setModelFile] = useState(null);

  const [sidebarVisible, setSidebarVisible] = useState(true);

  const handleFile = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    switch (type) {
      case 'input':
        setInputImage(file);
        break;
      case 'mask':
        setMaskFile(file);
        break;
      case 'model':
        setModelFile(file);
        break;
      default:
        break;
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    handleFile({ target: { files: [file] } }, type);
  };

  return (
    <div className="app-wrapper">
      <div className={`app-layout ${sidebarVisible ? 'with-sidebar' : 'no-sidebar'}`}>
        <header className="header">
          <h1>Segmentacja Panoptyczna</h1>
          <h2>Sceny dentystycznej</h2>
        </header>

        {sidebarVisible ? (
          <aside className="sidebar">
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarVisible(false)}
              title="Ukryj panel"
            >
              ◀
            </button>
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
        ) : (
          <button
            className="sidebar-toggle show-toggle"
            onClick={() => setSidebarVisible(true)}
            title="Pokaż panel"
          >
            ▶
          </button>
        )}

        <div className="top-panels">
          <div
            className="panel"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, 'input')}
            onClick={() => document.getElementById('fileInput').click()}
          >
            {inputImage ? (
              <p>Plik: <strong>{inputImage.name}</strong></p>
            ) : (
              <p>Zdjęcie wejściowe<br />(kliknij lub upuść plik)</p>
            )}
            <input
              id="fileInput"
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => handleFile(e, 'input')}
            />
          </div>

          <div
            className="panel"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, 'mask')}
            onClick={() => document.getElementById('fileMask').click()}
          >
            {maskFile ? (
              <p>Plik: <strong>{maskFile.name}</strong></p>
            ) : (
              <p>Maska<br />(kliknij lub upuść plik)</p>
            )}
            <input
              id="fileMask"
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => handleFile(e, 'mask')}
            />
          </div>

          <div
            className="panel"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, 'model')}
            onClick={() => document.getElementById('fileModel').click()}
          >
            {modelFile ? (
              <p>Plik: <strong>{modelFile.name}</strong></p>
            ) : (
              <p>Model<br />(kliknij lub upuść plik)</p>
            )}
            <input
              id="fileModel"
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => handleFile(e, 'model')}
            />
          </div>
        </div>

        <main className="observation-area">
          Obszar obserwacji
        </main>

        <div className="frames">
          <button>Poprzednie klatki</button>
          <button className="active">Aktualna klatka</button>
          <button>Następne klatki</button>
        </div>

        <section className="metrics">
          <div className="chart">Metryki</div>
        </section>
      </div>
    </div>
  );
}

export default App;
