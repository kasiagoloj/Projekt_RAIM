import './App.css';
import React, { useState, useEffect, useRef } from 'react';

function App() {
  // stałe
  const [frames, setFrames] = useState([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [maskFile, setMaskFile] = useState(null);
  const [modelFile, setModelFile] = useState(null);
  const [maskData, setMaskData] = useState(null);
  const [modelData, setModelData] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [observationScale, setObservationScale] = useState(1.0);
  const baseObservationSize = { width: 1100, height: 700 };
  const [maskOpacity, setMaskOpacity] = useState(0.6);
  const [modelOpacity, setModelOpacity] = useState(0.6);

  // kolory w legendzie
  const categoryColors = {
      1: [0.40, 0.89, 0.40],   // zielony
      2: [0.38, 0.54, 0.98],   // błękitny
      3: [0.98, 0.94, 0.40],   // żółty
      4: [1.00, 0.70, 0.43],   // pomarańczowy
      5: [0.95, 0.45, 0.98],   // różowy
      6: [0.45, 0.38, 0.98],   // fioletowy
      7: [1.00, 0.32, 0.32],   // czerwony
      8: [0.07, 0.00, 1.00],   // granatowy
      9: [0.40, 0.70, 0.70],   // turkusowy
      10: [0.90, 0.60, 0.30],  // pomarańczowy inny
      11: [1.00, 0.00, 1.00],  // różowy intensywny
    };

    const classLabels = {
      1: 'zęby',
      2: 'wiertło',
      3: 'język',
      4: 'x',
      5: 'podniebienie',
      6: 'polik',
      7: 'lignina/gaza',
      8: 'zewnętrze',
      9: 'x',
      10: 'x',
      11: 'próchnica / uszkodzenie zęba'
    };

    // przyjmowanie pliku json
  useEffect(() => {
  fetch('/frames')
    .then(res => res.json())
    .then(data => {
      const imgs = data.map((img, index) => ({
        id: index,
        file: { name: img.file_name },
        preview: img.preview,
        mask: img.mask
      }));
      setFrames(imgs);
      setCurrentFrameIndex(0);
    })
    .catch(err => console.error("Błąd przy pobieraniu ramek:", err));
}, []);

  const handleMaskFileLoad = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        setMaskData(parsed);

        setFrames(prevFrames =>
          prevFrames.map(frame => {
            const fileName = frame.file.name;
            const maskBase64 = parsed[fileName] || null;
            return {
              ...frame,
              mask: maskBase64 ? `data:image/png;base64,${maskBase64}` : null,
            };
          })
        );
      } catch (err) {
        console.error('Nie można sparsować pliku JSON z maskami:', err);
      }
    };
    reader.readAsText(file);
  };

  // przyjmowane pliki
  const handleFile = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    switch (type) {
      case 'input': {
        const files = Array.from(e.target.files || []);
        const previews = files.map(file => ({
          file,
          preview: URL.createObjectURL(file),
          mask: null,
          model: null,
        }));
        setFrames(previews);
        setCurrentFrameIndex(0);
        break;
      }
      case 'mask': {
        const files = Array.from(e.target.files || []);
        setMaskFile(files[0]); // tylko do pokazania nazwy, opcjonalne
        handleMultipleMaskPNGs(files);
        break;
      }
      case 'model': {
        const files = Array.from(e.target.files || []);
        setModelFile(files[0]);
        handleMultipleModelPNGs(files);
        break;
      }
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
    setCurrentFrameIndex(prev => Math.max(prev - 1, 0));
  };

  const goToNext = () => {
    setCurrentFrameIndex(prev => Math.min(prev + 1, frames.length - 1));
  };

  const handleMultipleMaskPNGs = (files) => {
  const fileMap = new Map();

  files.forEach(file => {
    const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
    const reader = new FileReader();
    reader.onload = (event) => {
      fileMap.set(nameWithoutExtension, event.target.result);

      // Sprawdź czy wszystkie pliki zostały załadowane
      if (fileMap.size === files.length) {
        setFrames(prevFrames =>
          prevFrames.map(frame => {
            const frameNameWithoutExt = frame.file.name.replace(/\.[^/.]+$/, "");
            const maskDataUrl = fileMap.get(frameNameWithoutExt);
            return {
              ...frame,
              mask: maskDataUrl || null,
            };
          })
        );
      }
    };
    reader.readAsDataURL(file);
  });
};

const handleMultipleModelPNGs = (files) => {
  const fileMap = new Map();

  files.forEach(file => {
    const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
    const reader = new FileReader();
    reader.onload = (event) => {
      fileMap.set(nameWithoutExtension, event.target.result);

      // Sprawdź czy wszystkie pliki zostały załadowane
      if (fileMap.size === files.length) {
        setFrames(prevFrames =>
          prevFrames.map(frame => {
            const frameNameWithoutExt = frame.file.name.replace(/\.[^/.]+$/, "");
            const modelDataUrl = fileMap.get(frameNameWithoutExt) || Array.from(fileMap.values())[0];
            return {
              ...frame,
              model: modelDataUrl || null,
            };
          })
        );
      }
    };
    reader.readAsDataURL(file);
  });
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
            <div
              className="legend-box"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                gap: '5px',
                height: '200px',
                overflowY: 'auto',
                padding: '10px',
                border: '5px solid #ccc',
                borderRadius: '10px',
                backgroundColor: '#f9f9f9',
                paddingTop: '60px',
              }}
            >
              {Object.entries(categoryColors).map(([id, rgb]) => {
                const [r, g, b] = rgb.map(v => Math.round(v * 255));
                const color = `rgb(${r}, ${g}, ${b})`;
                return (
                  <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      backgroundColor: color,
                      border: '1px solid #ccc'
                    }}></div>
                    <span>{classLabels[id]}</span>
                  </div>
                );
              })}
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
              <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={maskOpacity}
                  onChange={(e) => setMaskOpacity(parseFloat(e.target.value))}
                />
                <span>{Math.round(maskOpacity * 100)}%</span>
              <label>Widoczność modelu</label>
              <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={modelOpacity}
                  onChange={(e) => setModelOpacity(parseFloat(e.target.value))}
                />
                <span>{Math.round(modelOpacity * 100)}%</span>
            </div>
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
            {frames.length > 0 && frames[currentFrameIndex]?.preview ? (
              <img
                src={frames[currentFrameIndex].preview}
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
            {frames.length > 0 && frames[currentFrameIndex]?.mask ? (
              <img
                src={frames[currentFrameIndex].mask}
                alt="Podgląd"
                title={frames[currentFrameIndex]?.file.name}
                style={{ maxWidth: '100%', maxHeight: '150px', marginTop: '0.5rem' }}
              />
            ) : (
              <p>Maski<br />(kliknij lub upuść plik)</p>
            )}
            <input
              id="fileMask"
              type="file"
              multiple
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
            {frames.length > 0 && frames[currentFrameIndex]?.model ? (
              <img
                src={frames[currentFrameIndex].model}
                alt="Podgląd"
                title={frames[currentFrameIndex]?.file.name}
                style={{ maxWidth: '100%', maxHeight: '150px', marginTop: '0.5rem' }}
              />
            ) : (
              <p>Model<br />(kliknij lub upuść plik)</p>
            )}
            <input
              id="fileModel"
              type="file"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => handleFile(e, 'model')}
            />
          </div>
        </div>

        <main className="observation-area"
  style={{
    width: `${baseObservationSize.width * observationScale}px`,
    height: `${baseObservationSize.height * observationScale}px`,
    position: 'relative',
  }}
>
  {frames.length > 0 ? (
    <>
      <img
        src={frames[currentFrameIndex]?.preview}
        alt={`Klatka ${currentFrameIndex + 1}`}
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block', position: 'relative', zIndex: 1 }}
      />
      
      {frames[currentFrameIndex]?.mask && (
        <img
          src={frames[currentFrameIndex].mask}
          alt="Maska"
          style={{ maxWidth: '96%', maxHeight: '96%', position: 'absolute', opacity: maskOpacity, objectFit:'contain',
          pointerEvents: 'none', zIndex: 2 }}
        />
      )}

      {frames[currentFrameIndex]?.model && (
        <img
          src={frames[currentFrameIndex].model}
          alt="Model"
          style={{ maxWidth: '96%', maxHeight: '96%', position: 'absolute', opacity: modelOpacity, objectFit:'contain',
          pointerEvents: 'none', zIndex: 3 }}
        />
      )}
    </>
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