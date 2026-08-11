/**
 * Prevención Fenómeno El Niño — Sullana
 * JavaScript principal
 */

(function () {
  'use strict';

  /* ========== CONFIGURACIÓN SULLANA ========== */
  const SULLANA_CENTER = [-4.9039, -80.6853];
  const ZONE_COORDS = {
    centro:       [-4.9030, -80.6850],
    bellavista:   [-4.8980, -80.6780],
    querecotillo: [-4.9150, -80.6700],
    salitral:     [-4.9200, -80.6950],
    'la-bocana':  [-4.8900, -80.7000],
    'el-chilalo': [-4.9100, -80.6600],
    'san-jacinto':[-4.8950, -80.6900],
    marcavelica:  [-4.9080, -80.6750],
    otro:         [-4.9039, -80.6853]
  };

  const ZONE_LABELS = {
    centro: 'Centro de Sullana',
    bellavista: 'Bellavista',
    querecotillo: 'Querecotillo',
    salitral: 'Salitral',
    'la-bocana': 'La Bocana',
    'el-chilalo': 'El Chilalo',
    'san-jacinto': 'San Jacinto',
    marcavelica: 'Marcavelica',
    otro: 'Otra zona'
  };

  const SEVERITY_LABELS = {
    bajo: 'Bajo',
    moderado: 'Moderado',
    alto: 'Alto',
    critico: 'Crítico'
  };

  const SEVERITY_ICONS = {
    bajo: 'fa-droplet',
    moderado: 'fa-water',
    alto: 'fa-house-flood-water',
    critico: 'fa-triangle-exclamation'
  };

  const STORAGE_KEY = 'sullana_flood_reports';

  /* ========== DOM REFERENCES ========== */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const navOverlay = document.getElementById('navOverlay');
  const navLinks = document.querySelectorAll('.nav__link, .nav__cta-mobile');
  const mapPins = document.querySelectorAll('.map-pin');
  const mapTooltip = document.getElementById('mapTooltip');
  const floodForm = document.getElementById('floodReportForm');
  const floodPhoto = document.getElementById('floodPhoto');
  const fileLabel = document.getElementById('fileLabel');
  const photoPreview = document.getElementById('photoPreview');
  const formMessage = document.getElementById('formMessage');
  const floodReportsList = document.getElementById('floodReportsList');
  const reportCount = document.getElementById('reportCount');
  const successModal = document.getElementById('successModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalOk = document.getElementById('modalOk');
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterMessage = document.getElementById('newsletterMessage');

  let floodMap = null;
  let mapMarkers = [];

  /* ========== NAVEGACIÓN MÓVIL ========== */
  function openNav() {
    mainNav.classList.add('open');
    navOverlay?.classList.add('active');
    document.body.classList.add('nav-open');
    navToggle?.setAttribute('aria-expanded', 'true');
    navOverlay?.setAttribute('aria-hidden', 'false');
  }

  function closeNav() {
    mainNav.classList.remove('open');
    navOverlay?.classList.remove('active');
    document.body.classList.remove('nav-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navOverlay?.setAttribute('aria-hidden', 'true');
    const icon = navToggle?.querySelector('i');
    if (icon) {
      icon.classList.add('fa-bars');
      icon.classList.remove('fa-xmark');
    }
  }

  function toggleNav() {
    if (mainNav.classList.contains('open')) {
      closeNav();
    } else {
      openNav();
      const icon = navToggle?.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      }
    }
  }

  if (navToggle && mainNav) {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.addEventListener('click', toggleNav);

    navOverlay?.addEventListener('click', closeNav);

    navLinks.forEach(link => {
      link.addEventListener('click', closeNav);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && mainNav.classList.contains('open')) {
        closeNav();
      }
    });
  }

  /* ========== NAV ACTIVE ON SCROLL ========== */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll('.nav__link').forEach(link => {
          link.classList.remove('nav__link--active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('nav__link--active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);

  /* ========== MAPA DE RIESGOS (SVG) ========== */
  mapPins.forEach(pin => {
    pin.addEventListener('mouseenter', (e) => {
      const zone = pin.dataset.zone;
      const level = pin.dataset.level;
      mapTooltip.textContent = `${zone}: Riesgo ${level}`;
      mapTooltip.classList.add('visible');

      const rect = pin.getBoundingClientRect();
      const canvas = document.getElementById('riskMapCanvas').getBoundingClientRect();
      mapTooltip.style.left = `${rect.left - canvas.left + 10}px`;
      mapTooltip.style.top = `${rect.top - canvas.top - 30}px`;
    });

    pin.addEventListener('mouseleave', () => {
      mapTooltip.classList.remove('visible');
    });

    pin.addEventListener('click', () => {
      const zone = pin.dataset.zone;
      const level = pin.dataset.level;
      alert(`Zona: ${zone}\nNivel de riesgo: ${level}\n\nMantente alerta y sigue las recomendaciones de prevención.`);
    });
  });

  /* ========== MAPA LEAFLET — SULLANA ========== */
  function initFloodMap() {
    const mapEl = document.getElementById('floodMap');
    if (!mapEl || typeof L === 'undefined') return;

    floodMap = L.map('floodMap', {
      center: SULLANA_CENTER,
      zoom: 14,
      scrollWheelZoom: !L.Browser.mobile,
      tap: true,
      touchZoom: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
    }).addTo(floodMap);

    L.circle(SULLANA_CENTER, {
      radius: 3000,
      color: '#1e40af',
      fillColor: '#3b82f6',
      fillOpacity: 0.08,
      weight: 2,
      dashArray: '6 4'
    }).addTo(floodMap).bindPopup('<strong>Distrito de Sullana</strong><br>Área de reportes de inundación');

    setTimeout(() => floodMap.invalidateSize(), 200);

    window.addEventListener('resize', debounce(() => {
      floodMap?.invalidateSize();
    }, 200));

    window.addEventListener('orientationchange', () => {
      setTimeout(() => floodMap?.invalidateSize(), 300);
    });
  }

  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function getMarkerColor(severity) {
    const colors = {
      bajo: '#22c55e',
      moderado: '#eab308',
      alto: '#f97316',
      critico: '#ef4444'
    };
    return colors[severity] || '#3b82f6';
  }

  function createMarkerIcon(severity) {
    const color = getMarkerColor(severity);
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width:28px;height:28px;background:${color};border:3px solid white;
        border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);
        display:flex;align-items:center;justify-content:center;
        color:white;font-size:12px;
      "><i class="fa-solid fa-water"></i></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
  }

  function addReportToMap(report) {
    if (!floodMap) return;

    const icon = createMarkerIcon(report.severity);
    const marker = L.marker([report.lat, report.lng], { icon }).addTo(floodMap);

    const urgentBadge = report.needsHelp
      ? '<p style="color:#ef4444;font-weight:700;margin-top:4px;"><i class="fa-solid fa-triangle-exclamation"></i> ¡Necesita ayuda urgente!</p>'
      : '';

    const photoHtml = report.photo
      ? `<img src="${report.photo}" alt="Foto del incidente" style="max-width:180px;border-radius:6px;margin-top:6px;">`
      : '';

    marker.bindPopup(`
      <div class="popup-title">${ZONE_LABELS[report.zone] || report.zone}</div>
      <span class="popup-severity popup-severity--${report.severity}">${SEVERITY_LABELS[report.severity]}</span>
      <p><strong>${report.reporterName}</strong></p>
      <p>${report.address}</p>
      <p style="font-size:0.75rem;color:#64748b;">${report.description.substring(0, 120)}${report.description.length > 120 ? '...' : ''}</p>
      ${urgentBadge}
      ${photoHtml}
      <p style="font-size:0.6875rem;color:#94a3b8;margin-top:4px;">${formatDate(report.timestamp)}</p>
    `);

    mapMarkers.push(marker);
  }

  function clearMapMarkers() {
    mapMarkers.forEach(m => floodMap.removeLayer(m));
    mapMarkers = [];
  }

  /* ========== LOCAL STORAGE ========== */
  function getReports() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  function saveReports(reports) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  }

  function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /* ========== RENDER REPORTS LIST ========== */
  function renderReportsList() {
    const reports = getReports().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    reportCount.textContent = `${reports.length} reporte${reports.length !== 1 ? 's' : ''}`;

    if (reports.length === 0) {
      floodReportsList.innerHTML = '<li class="flood-reports-empty">No hay reportes aún. Sé el primero en reportar una inundación.</li>';
      return;
    }

    floodReportsList.innerHTML = reports.map(report => `
      <li class="flood-report-item flood-report-item--${report.severity}" data-id="${report.id}">
        <span class="flood-report-item__severity flood-report-item__severity--${report.severity}">
          <i class="fa-solid ${SEVERITY_ICONS[report.severity]}"></i>
        </span>
        <div class="flood-report-item__info">
          <h4>${ZONE_LABELS[report.zone] || report.zone}</h4>
          <p>${report.description.substring(0, 80)}${report.description.length > 80 ? '...' : ''}</p>
          <div class="flood-report-item__meta">
            <span><i class="fa-solid fa-user"></i> ${report.reporterName}</span>
            <span><i class="fa-solid fa-clock"></i> ${formatDate(report.timestamp)}</span>
            ${report.needsHelp ? '<span class="flood-report-item__urgent"><i class="fa-solid fa-triangle-exclamation"></i> Ayuda urgente</span>' : ''}
          </div>
        </div>
      </li>
    `).join('');

    floodReportsList.querySelectorAll('.flood-report-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        const report = reports.find(r => r.id === id);
        if (report && floodMap) {
          floodMap.setView([report.lat, report.lng], 16);
          const idx = reports.indexOf(report);
          if (mapMarkers[idx]) mapMarkers[idx].openPopup();
        }
      });
    });
  }

  function refreshMap() {
    if (!floodMap) return;
    clearMapMarkers();
    getReports().forEach(addReportToMap);
  }

  /* ========== FORM VALIDATION ========== */
  function validateForm(formData) {
    const errors = [];
    const fields = ['reporterName', 'floodZone', 'floodAddress', 'floodSeverity', 'floodDescription'];

    fields.forEach(field => {
      const el = document.getElementById(field === 'floodZone' ? 'floodZone' :
        field === 'floodAddress' ? 'floodAddress' :
        field === 'floodSeverity' ? 'floodSeverity' :
        field === 'floodDescription' ? 'floodDescription' : 'reporterName');
      el.classList.remove('error');
    });

    if (!formData.reporterName.trim()) {
      errors.push('El nombre es obligatorio.');
      document.getElementById('reporterName').classList.add('error');
    }

    if (!formData.zone) {
      errors.push('Selecciona una zona de Sullana.');
      document.getElementById('floodZone').classList.add('error');
    }

    if (!formData.address.trim()) {
      errors.push('La ubicación precisa es obligatoria.');
      document.getElementById('floodAddress').classList.add('error');
    }

    if (!formData.severity) {
      errors.push('Selecciona el nivel de inundación.');
      document.getElementById('floodSeverity').classList.add('error');
    }

    if (!formData.description.trim() || formData.description.trim().length < 10) {
      errors.push('La descripción debe tener al menos 10 caracteres.');
      document.getElementById('floodDescription').classList.add('error');
    }

    return errors;
  }

  /* ========== PHOTO PREVIEW ========== */
  if (floodPhoto) {
    floodPhoto.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) {
        photoPreview.innerHTML = '';
        fileLabel.textContent = 'Seleccionar imagen';
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido.');
        floodPhoto.value = '';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar 5 MB.');
        floodPhoto.value = '';
        return;
      }

      fileLabel.textContent = file.name;
      const reader = new FileReader();
      reader.onload = (ev) => {
        photoPreview.innerHTML = `<img src="${ev.target.result}" alt="Vista previa">`;
      };
      reader.readAsDataURL(file);
    });
  }

  /* ========== SUBMIT FLOOD REPORT ========== */
  if (floodForm) {
    floodForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      formMessage.className = 'form-message';
      formMessage.style.display = 'none';

      const formData = {
        reporterName: document.getElementById('reporterName').value,
        phone: document.getElementById('reporterPhone').value,
        zone: document.getElementById('floodZone').value,
        address: document.getElementById('floodAddress').value,
        severity: document.getElementById('floodSeverity').value,
        description: document.getElementById('floodDescription').value,
        needsHelp: document.getElementById('needsHelp').checked
      };

      const errors = validateForm(formData);
      if (errors.length > 0) {
        formMessage.textContent = errors.join(' ');
        formMessage.className = 'form-message error';
        return;
      }

      const baseCoords = ZONE_COORDS[formData.zone] || SULLANA_CENTER;
      const lat = baseCoords[0] + (Math.random() - 0.5) * 0.008;
      const lng = baseCoords[1] + (Math.random() - 0.5) * 0.008;

      let photoData = null;
      const photoFile = floodPhoto.files[0];
      if (photoFile) {
        photoData = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target.result);
          reader.readAsDataURL(photoFile);
        });
      }

      const report = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        ...formData,
        lat,
        lng,
        photo: photoData,
        timestamp: new Date().toISOString()
      };

      const reports = getReports();
      reports.push(report);
      saveReports(reports);

      addReportToMap(report);
      renderReportsList();

      floodForm.reset();
      photoPreview.innerHTML = '';
      fileLabel.textContent = 'Seleccionar imagen';

      if (formData.severity === 'critico' || formData.needsHelp) {
        updateRiskLevel('high');
      }

      showModal();

      if (floodMap) {
        floodMap.setView([lat, lng], 16);
      }
    });
  }

  /* ========== MODAL ========== */
  function showModal() {
    successModal.classList.add('active');
    successModal.setAttribute('aria-hidden', 'false');
  }

  function hideModal() {
    successModal.classList.remove('active');
    successModal.setAttribute('aria-hidden', 'true');
  }

  if (modalOverlay) modalOverlay.addEventListener('click', hideModal);
  if (modalClose) modalClose.addEventListener('click', hideModal);
  if (modalOk) modalOk.addEventListener('click', hideModal);

  /* ========== RISK LEVEL UPDATE ========== */
  function updateRiskLevel(level) {
    const el = document.getElementById('currentRiskLevel');
    if (!el) return;

    const levels = {
      low: { text: 'Riesgo Bajo', class: 'risk-card__level--low' },
      moderate: { text: 'Riesgo Moderado', class: 'risk-card__level--moderate' },
      high: { text: 'Riesgo Alto', class: 'risk-card__level--high' }
    };

    const data = levels[level] || levels.moderate;
    el.textContent = data.text;
    el.className = 'risk-card__level ' + data.class;
  }

  /* ========== NEWSLETTER ========== */
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletterEmail').value;
      if (email) {
        newsletterMessage.textContent = '¡Gracias por suscribirte! Te enviaremos alertas importantes.';
        newsletterForm.reset();
        setTimeout(() => { newsletterMessage.textContent = ''; }, 4000);
      }
    });
  }

  /* ========== DEMO DATA (solo si no hay reportes) ========== */
  function seedDemoReports() {
    if (getReports().length > 0) return;

    const demoReports = [
      {
        id: 'demo1',
        reporterName: 'María López',
        phone: '987654321',
        zone: 'bellavista',
        address: 'Av. Panamericana Norte, altura del mercado',
        severity: 'moderado',
        description: 'Agua acumulada en la vía principal. Vehículos con dificultad para transitar.',
        needsHelp: false,
        lat: -4.8985,
        lng: -80.6785,
        photo: null,
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'demo2',
        reporterName: 'Carlos Mendoza',
        phone: '',
        zone: 'querecotillo',
        address: 'Jr. Lima 340, zona residencial',
        severity: 'alto',
        description: 'Varias viviendas con agua hasta el tobillo. Familias evacuando hacia la escuela cercana.',
        needsHelp: true,
        lat: -4.9155,
        lng: -80.6705,
        photo: null,
        timestamp: new Date(Date.now() - 7200000).toISOString()
      }
    ];

    saveReports(demoReports);
  }

  /* ========== INIT ========== */
  function init() {
    initFloodMap();
    seedDemoReports();
    refreshMap();
    renderReportsList();
    updateActiveNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
