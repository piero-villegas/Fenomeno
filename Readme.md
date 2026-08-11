# Prevención Fenómeno El Niño — Sullana

## 1. Descripción del proyecto

**Prevención Fenómeno El Niño** es una plataforma web desarrollada para brindar información y herramientas de prevención ante los posibles efectos del Fenómeno El Niño en el distrito de Sullana, Piura.

La plataforma permite a los usuarios consultar alertas, visualizar zonas de riesgo, conocer recomendaciones de prevención y reportar posibles inundaciones en su comunidad.

El proyecto busca facilitar el acceso a información preventiva y promover una respuesta rápida y organizada ante situaciones de emergencia.

---

## 2. Objetivo

Desarrollar una plataforma web informativa e interactiva que permita a los ciudadanos de Sullana conocer los riesgos relacionados con el Fenómeno El Niño y participar en la identificación y reporte de posibles inundaciones.

---

## 3. Problema que aborda

El distrito de Sullana puede verse afectado por lluvias intensas, inundaciones y otros eventos asociados al Fenómeno El Niño.

Uno de los principales problemas es la falta de acceso rápido y organizado a información preventiva sobre:

* Zonas con riesgo de inundación.
* Alertas meteorológicas.
* Medidas de prevención.
* Recomendaciones ante emergencias.
* Reportes realizados por los ciudadanos.

La plataforma busca contribuir a solucionar este problema mediante una herramienta digital sencilla y accesible.

---

## 4. Tecnologías utilizadas

El proyecto fue desarrollado utilizando tecnologías web:

* **HTML5:** estructura y contenido de la plataforma.
* **CSS3:** diseño visual, distribución de elementos y adaptación responsive.
* **JavaScript:** funcionalidades interactivas y procesamiento de acciones del usuario.
* **SVG:** utilización de gráficos e imágenes vectoriales.
* **Leaflet:** biblioteca utilizada para implementar funcionalidades relacionadas con mapas.
* **Font Awesome:** iconos utilizados en la interfaz.
* **Google Fonts:** tipografía Inter utilizada en el diseño.

---

## 5. Estructura del proyecto

```text
Fenomeno del niño/
│
├── assets/
│   └── images/
│       ├── logo.svg
│       └── newsletter-illustration.svg
│
├── css/
│   └── styles.css
│
├── html/
│   └── index.html
│
└── js/
    └── main.js
```

### `html/index.html`

Contiene la estructura principal de la plataforma.

Incluye:

* Encabezado y menú de navegación.
* Sección principal o Hero.
* Sistema de alertas.
* Mapa de riesgos.
* Formulario para reportar inundaciones.
* Recursos de prevención.
* Sección de contacto.
* Elementos de accesibilidad y diseño responsive.

### `css/styles.css`

Contiene los estilos visuales de la plataforma.

Se encarga de:

* Colores.
* Tipografías.
* Botones.
* Tarjetas.
* Menú de navegación.
* Diseño responsive.
* Distribución de las secciones.
* Adaptación para dispositivos móviles.
* Animaciones y transiciones.

### `js/main.js`

Contiene la lógica y funcionalidades interactivas.

Entre sus funciones se encuentran:

* Menú de navegación para dispositivos móviles.
* Actualización de la navegación según el desplazamiento.
* Gestión del mapa de riesgos.
* Selección de zonas.
* Clasificación de niveles de riesgo.
* Registro de reportes de inundaciones.
* Vista previa de fotografías.
* Ventanas modales de confirmación.
* Sistema de almacenamiento de reportes mediante `localStorage`.
* Funcionalidades relacionadas con el formulario de suscripción.

### `assets/images/`

Contiene los recursos gráficos utilizados por la plataforma, como el logotipo e ilustraciones.

---

## 6. Funcionalidades principales

### 6.1 Alertas tempranas

La plataforma muestra información sobre alertas relacionadas con lluvias intensas y posibles situaciones de riesgo en Sullana y la región Piura.

### 6.2 Mapa de riesgos

Permite visualizar diferentes zonas y niveles de riesgo.

Entre las zonas consideradas se encuentran:

* Centro de Sullana.
* Bellavista.
* Querecotillo.
* Salitral.
* La Bocana.
* El Chilalo.
* San Jacinto.
* Marcavelica.
* Otras zonas.

### 6.3 Reporte de inundaciones

Los ciudadanos pueden registrar información sobre posibles inundaciones mediante un formulario.

El sistema permite registrar información como:

* Zona.
* Nivel de riesgo.
* Descripción.
* Fotografía.
* Datos relacionados con el reporte.

### 6.4 Diseño responsive

La plataforma está preparada para adaptarse a diferentes tamaños de pantalla, incluyendo:

* Computadoras.
* Laptops.
* Tablets.
* Teléfonos móviles.

El menú de navegación incorpora un sistema específico para dispositivos móviles.

### 6.5 Almacenamiento local

Los reportes realizados desde la plataforma pueden almacenarse utilizando `localStorage` del navegador.

Esto permite conservar los datos localmente sin necesidad de una base de datos externa.

---

## 7. Configuración geográfica

El sistema utiliza coordenadas correspondientes a diferentes zonas de Sullana para representar ubicaciones relacionadas con el mapa de riesgos.

El punto central utilizado para Sullana es:

```text
Latitud: -4.9039
Longitud: -80.6853
```

Las zonas se identifican mediante coordenadas y etiquetas configuradas en `main.js`.

---

## 8. Requisitos para ejecutar el proyecto

Para ejecutar el proyecto se necesita:

* Un navegador web actualizado.
* Visual Studio Code u otro editor de código.
* Conexión a Internet para cargar recursos externos como Font Awesome, Google Fonts y Leaflet.

No es necesario instalar un servidor backend para ejecutar la versión actual.

---

## 9. Instalación y ejecución

### Paso 1

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

### Paso 2

Ingresar a la carpeta:

```bash
cd "Fenomeno del niño"
```

### Paso 3

Abrir el proyecto con Visual Studio Code.

### Paso 4

Abrir el archivo:

```text
html/index.html
```

También se recomienda utilizar una extensión como **Live Server** para ejecutar la plataforma durante el desarrollo.

---

## 10. Flujo de funcionamiento

El usuario ingresa a la plataforma y puede:

1. Consultar el nivel de riesgo.
2. Revisar las alertas disponibles.
3. Consultar el mapa de zonas de riesgo.
4. Revisar recomendaciones de prevención.
5. Registrar un reporte de inundación.
6. Consultar información adicional sobre prevención.

---

## 11. Diseño responsive

La interfaz utiliza CSS responsive para adaptar los componentes a diferentes resoluciones.

En dispositivos móviles:

* El menú principal se transforma en un menú desplegable.
* Los elementos se reorganizan verticalmente.
* Los botones se adaptan al ancho disponible.
* Las tarjetas modifican su distribución.
* Se optimiza la navegación táctil.

---

## 12. Seguridad y limitaciones

La versión actual funciona principalmente en el navegador del usuario.

Los reportes almacenados mediante `localStorage` son locales y no constituyen una base de datos central.

Por lo tanto, para una implementación real se recomienda incorporar posteriormente:

* Backend.
* Base de datos.
* Sistema de autenticación.
* API para alertas meteorológicas.
* Servidor para almacenar fotografías.
* Sistema de administración de reportes.
* Integración con fuentes oficiales de información.

---

## 13. Público objetivo

La plataforma está dirigida principalmente a:

* Ciudadanos de Sullana.
* Familias ubicadas en zonas vulnerables.
* Estudiantes.
* Docentes.
* Organizaciones comunitarias.
* Personas interesadas en la prevención ante desastres naturales.

---

## 14. Finalidad del proyecto

El proyecto tiene una finalidad educativa y preventiva. Busca demostrar cómo las tecnologías web pueden utilizarse para comunicar información de riesgo y fomentar la participación ciudadana en la prevención de desastres.

---

## 15. Autores

**Proyecto:** Prevención Fenómeno El Niño — Sullana

**Institución educativa:** Colegio San José Obrero — Sullana

**Área:** Computación / Emprendimiento

**Año:** 2026

---

## 16. Licencia

Proyecto desarrollado con fines educativos.

El código puede ser utilizado como referencia para proyectos académicos relacionados con prevención, tecnología y gestión de riesgos.
