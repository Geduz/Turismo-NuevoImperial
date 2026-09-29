import { useEffect, useRef, useState } from 'react'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  Expand,
  Info,
  MapPin,
  Minus,
  Mouse,
  Plus,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react'

// Pannellum necesita una imagen panorámica equirectangular 2:1; reemplaza esta URL por cada sitio turístico.
const panoramaImage = '/panoramas/area-ti.jpeg'

const locations = [
  { id: 'palacio', label: 'Palacio Municipal', detail: 'Centro administrativo de Nuevo Imperial', position: 'center' },
  { id: 'plaza', label: 'Plaza de Armas', detail: 'Espacio público y encuentro ciudadano', position: 'right' },
  { id: 'cultura', label: 'Centro Cultural', detail: 'Cultura, tradición y comunidad', position: 'left' },
]

export default function Page() {
  const [activeLocation, setActiveLocation] = useState(locations[0])
  const [isMuted, setIsMuted] = useState(false)
  const [showInfo, setShowInfo] = useState(true)
  const viewerRef = useRef<HTMLDivElement>(null)
  const pannellumRef = useRef<any>(null)

  useEffect(() => {
    let cancelled = false

    async function createViewer() {
      if (!viewerRef.current) return
      if (!window.pannellum) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          script.src = '/pannellum.js'
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('No se pudo cargar Pannellum'))
          document.head.appendChild(script)
        })
      }
      if (cancelled || !viewerRef.current || !window.pannellum) return

      pannellumRef.current = window.pannellum.viewer(viewerRef.current, {
      type: 'equirectangular',
      panorama: panoramaImage,
      autoLoad: true,
      compass: true,
      showControls: false,
      hfov: 100,
      minHfov: 50,
      maxHfov: 120,
      title: 'Palacio Municipal de Nuevo Imperial',
      author: 'Municipalidad Distrital de Nuevo Imperial',
      })
    }

    createViewer()

    return () => {
      cancelled = true
      pannellumRef.current?.destroy()
      pannellumRef.current = null
    }
  }, [])

  const moveLocation = (direction: 'next' | 'previous') => {
    const index = locations.findIndex((location) => location.id === activeLocation.id)
    const nextIndex = direction === 'next'
      ? (index + 1) % locations.length
      : (index - 1 + locations.length) % locations.length
    setActiveLocation(locations[nextIndex])
  }

  return (
    <main className="tour-app">
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Municipalidad de Nuevo Imperial">
          <span className="brand-mark">N<span>I</span></span>
          <span className="brand-copy"><strong>NUEVO</strong><b>IMPERIAL</b></span>
        </a>
        <nav className="main-nav" aria-label="Navegación principal">
          <a href="#inicio" className="active">Inicio</a>
          <a href="#recorrido">Recorrido 360°</a>
          <a href="#municipalidad">Municipalidad</a>
          <a href="#comunicados">Comunicados</a>
          <a href="#contacto">Contacto</a>
        </nav>
        <button className="portal-button">Mesa de Partes <span>↗</span></button>
      </header>

      <section className="tour-hero" id="inicio">
        <div className="breadcrumb">Inicio <span>/</span> Recorrido Virtual 360°</div>
        <div className="hero-heading">
          <div>
            <p className="eyebrow"><Compass size={15} /> EXPERIENCIA INMERSIVA</p>
            <h1>Recorrido Virtual <em>360°</em></h1>
            <p className="hero-description">Explora los espacios de nuestra municipalidad desde cualquier lugar.</p>
          </div>
          <div className="hero-note"><span className="live-dot" /> Vista interactiva disponible</div>
        </div>

        <div className="viewer-shell" id="recorrido">
          <div
            ref={viewerRef}
            className="panorama"
            role="img"
            aria-label={`Vista 360 grados de ${activeLocation.label}`}
          >
            <div className="panorama-overlay" aria-hidden="true" />
            <button className="hotspot hotspot-left" onClick={() => setActiveLocation(locations[2])} aria-label="Ver Centro Cultural"><MapPin size={18} /></button>
            <button className="hotspot hotspot-center" onClick={() => setActiveLocation(locations[0])} aria-label="Ver Palacio Municipal"><MapPin size={18} /></button>
            <button className="hotspot hotspot-right" onClick={() => setActiveLocation(locations[1])} aria-label="Ver Plaza de Armas"><MapPin size={18} /></button>
            <div className="direction-hint"><Mouse size={17} /> Arrastra para explorar</div>
            {showInfo && <div className="location-card"><div className="location-icon"><MapPin size={16} /></div><div><span>ESTÁS VISITANDO</span><strong>{activeLocation.label}</strong><small>{activeLocation.detail}</small></div><button onClick={() => setShowInfo(false)} aria-label="Ocultar información">×</button></div>}
          </div>
          <div className="viewer-toolbar">
            <div className="toolbar-group"><button onClick={() => moveLocation('previous')} aria-label="Ubicación anterior"><ChevronLeft /></button><span>{locations.findIndex((location) => location.id === activeLocation.id) + 1} / {locations.length}</span><button onClick={() => moveLocation('next')} aria-label="Siguiente ubicación"><ChevronRight /></button></div>
            <div className="toolbar-group toolbar-center"><button onClick={() => pannellumRef.current?.setHfov(Math.min(120, pannellumRef.current.getHfov() + 10))} aria-label="Alejar"><Minus /></button><span>360°</span><button onClick={() => pannellumRef.current?.setHfov(Math.max(50, pannellumRef.current.getHfov() - 10))} aria-label="Acercar"><Plus /></button></div>
            <div className="toolbar-group"><button onClick={() => setShowInfo(!showInfo)} aria-label="Información"><Info /></button><button onClick={() => setIsMuted(!isMuted)} aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}>{isMuted ? <VolumeX /> : <Volume2 />}</button><button onClick={() => pannellumRef.current?.setHfov(100)} aria-label="Restablecer vista"><RotateCcw /></button><button onClick={() => pannellumRef.current?.toggleFullscreen()} aria-label="Pantalla completa"><Expand /></button></div>
          </div>
        </div>
      </section>

      <section className="locations-section" id="municipalidad">
        <div className="section-heading"><div><p className="eyebrow">PUNTOS DE INTERÉS</p><h2>Descubre Nuevo Imperial</h2></div><button className="select-location">Selecciona una ubicación <ChevronDown size={16} /></button></div>
        <div className="location-grid">{locations.map((location, index) => <button key={location.id} className={`location-tile ${activeLocation.id === location.id ? 'selected' : ''}`} onClick={() => { setActiveLocation(location); setShowInfo(true) }}><span className="tile-number">0{index + 1}</span><div><strong>{location.label}</strong><small>{location.detail}</small></div><ChevronRight size={17} /></button>)}</div>
      </section>

      <section className="visit-banner" id="comunicados"><div><p className="eyebrow">UNA MUNICIPALIDAD CERCA DE TI</p><h2>Conoce nuestros espacios,<br /><em>vive nuestra comunidad.</em></h2></div><a href="#recorrido">Volver al recorrido <ChevronRight size={18} /></a></section>
      <footer id="contacto"><span>© 2025 Municipalidad Distrital de Nuevo Imperial</span><span>Gestión moderna para una ciudad que avanza</span></footer>
    </main>
  )
}
