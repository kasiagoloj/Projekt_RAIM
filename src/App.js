import './App.css';
import * as React from 'react';
import { useState } from 'react';

function App() {
  const [frames, setFrames] = useState([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [maskFile, setMaskFile] = useState(null);
  const [modelFile, setModelFile] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [observationScale, setObservationScale] = useState(1.0);
  const baseObservationSize = { width: 1100, height: 700 };
  const [maskData, setMaskData] = useState(null);


  const handleFile = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    switch (type) {
      case 'input':
        const files = Array.from(e.target.files || []);
        const previews = files.map(file => ({
          file,
          preview: URL.createObjectURL(file)
        }));
        setFrames(previews);
        setCurrentFrameIndex(0);
        break;
      case 'mask':
        setMaskFile(file);
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target.result);
                setMaskData(parsed);
            } catch (err) {
                console.error('Nie można sparsować pliku JSON z maskami:', err);
            }
        };
        reader.readAsText(file);
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

  const goToPrevious = () => {
    setCurrentFrameIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToNext = () => {
    setCurrentFrameIndex((prev) => Math.min(prev + 1, frames.length - 1));
  };

  return (
    <div className="app-wrapper">
        <header className="header">
          <h1>Segmentacja Panoptyczna</h1>
          <h2>Sceny dentystycznej</h2>
        </header>
      {sidebarVisible && (
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
              <label>Rozmiar obszaru obserwacji</label>
              <input
              type="range"
              min="0.5"
              max="1"
              step="0.01"
              value={observationScale}
              onChange={(e) => setObservationScale(parseFloat(e.target.value))}
              />
              <span>{Math.round(observationScale * 100)}%</span>
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
      )}

      {!sidebarVisible && (
        <button
          className="sidebar-toggle show-toggle"
          onClick={() => setSidebarVisible(true)}
          title="Pokaż panel"
        >
          ▶
        </button>
      )}

      <div className={`app-layout ${sidebarVisible ? 'with-sidebar' : 'no-sidebar'}`}>

        <div className="top-panels">
          <div
            className="panel"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, 'input')}
            onClick={() => document.getElementById('fileInput').click()}
          >
            {frames.length > 0 ? (
              <img
                src={frames[currentFrameIndex]?.preview}
                alt="Podgląd"
                title={frames[currentFrameIndex]?.file.name}
                style={{ maxWidth: '100%', maxHeight: '150px', marginTop: '0.5rem' }}
              />
            ) : (
              <p>Zdjęcie wejściowe<br />(kliknij lub upuść plik)</p>
            )}
            <input
              id="fileInput"
              type="file"
              multiple
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

        <main className="observation-area"
          style={{
            width: `${baseObservationSize.width * observationScale}px`,
            height: `${baseObservationSize.height * observationScale}px`
            }}
            >
          {frames.length > 0 ? (
            <img
              src={frames[currentFrameIndex]?.preview}
              alt={`Klatka ${currentFrameIndex + 1}`}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            ) : (
              <p>Brak załadowanego zdjęcia</p>
            )}
        </main>

        <div className="frames">
          <button
            onClick={goToPrevious}
            disabled={currentFrameIndex === 0}
            title="Poprzednia klatka"
          >
            {frames[currentFrameIndex - 1] ? (
              <img
                src={frames[currentFrameIndex - 1].preview}
                alt="Poprzednia"
                style={{ maxWidth: '100px', maxHeight: '80px', objectFit: 'cover' }}
              />
            ) : (
              'Poprzednia'
            )}
          </button>
          <button className="active" title="Aktualna klatka">
            {frames[currentFrameIndex] ? (
              <img
                src={frames[currentFrameIndex].preview}
                alt="Aktualna"
                style={{ maxWidth: '100px', maxHeight: '80px', objectFit: 'cover' }}
              />
            ) : (
              'Aktualna'
            )}
          </button>
          <button
            onClick={goToNext}
            disabled={currentFrameIndex >= frames.length - 1}
            title="Następna"
          >
            {frames[currentFrameIndex + 1] ? (
              <img
                src={frames[currentFrameIndex + 1].preview}
                alt="Następna"
                style={{ maxWidth: '100px', maxHeight: '80px', objectFit: 'cover' }}
              />
            ) : (
              'Następna'
            )}
          </button>
        </div>

        <section className="metrics">
          <div className="chart">Metryki</div>
        </section>
      </div>
    </div>
  );
}

export default App;
