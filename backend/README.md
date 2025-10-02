# 🍳 Backend API - Asistente de Cocina con IA

<div align="center">

![FastAPI](https://img.shields.io/badge/FastAPI-0.118-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

**API Backend para Asistente de Cocina con IA**

*Backend robusto con FastAPI que integra Google Gemini para procesamiento de voz, chat conversacional y generación inteligente de recetas*

[Características](#-características) • [Instalación](#-instalación) • [Deploy](#-despliegue-en-render) • [API](#-documentación-de-endpoints)

</div>

---

## 📋 Descripción del Proyecto

Backend desarrollado con **FastAPI** que actúa como puente seguro entre el frontend y la **API de Google Gemini**. Proporciona tres servicios principales: transcripción de audio a texto, chat conversacional inteligente y generación personalizada de recetas basadas en ingredientes.

### 🎯 Objetivo

Crear una API REST robusta, escalable y segura que maneje todas las interacciones con servicios de IA, manteniendo las credenciales protegidas en el servidor y proporcionando endpoints claros y bien documentados para el frontend.

---

## ✨ Características

### 🎤 Transcripción de Audio (Speech-to-Text)
- Recibe archivos de audio en múltiples formatos (webm, mp3, wav)
- Codifica el audio en base64 para envío a Gemini
- Procesa la transcripción mediante Google Gemini API
- Retorna texto en español con alta precisión
- Manejo robusto de errores y validaciones

### 🤖 Chat Conversacional con IA
- Integración directa con Google Gemini 2.5 Pro
- Procesamiento de lenguaje natural en español
- Respuestas contextuales sobre cocina y recetas
- Gestión de conversaciones fluidas y naturales
- Validación de respuestas y manejo de errores

### 🍽️ Generación Inteligente de Recetas
- Generación de 3 recetas personalizadas basadas en ingredientes
- Soporte para preferencias dietéticas (vegetariano, sin gluten, etc.)
- Respuestas estructuradas en formato JSON
- Incluye: nombre, descripción, tiempo de preparación, dificultad, ingredientes e instrucciones
- Limpieza automática de formato (elimina code fences)

### 🔍 Listado de Modelos
- Endpoint para explorar modelos disponibles en Gemini
- Útil para verificar compatibilidad
- Información detallada de capacidades de cada modelo

### 🔒 Seguridad
- API Keys protegidas en variables de entorno
- CORS configurado apropiadamente
- Validación de datos con Pydantic
- Logging estructurado para debugging
- Timeout configurado para prevenir cuelgues

### ⚡ Performance
- Cliente HTTP asíncrono (httpx)
- Manejo eficiente de conexiones
- Lifecycle events para inicialización y cleanup
- Timeout configurado (30 segundos)

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **FastAPI** | 0.118.x | Framework web moderno y rápido para APIs |
| **Python** | 3.11+ | Lenguaje de programación |
| **Uvicorn** | 0.37.x | Servidor ASGI de alto rendimiento |
| **httpx** | 0.28.x | Cliente HTTP asíncrono |
| **Pydantic** | 2.11.x | Validación de datos y serialización |
| **Google Gemini API** | 2.5-pro | Modelo de IA para NLP y audio |
| **python-dotenv** | 1.1.x | Gestión de variables de entorno |
| **python-multipart** | 0.0.20 | Manejo de uploads de archivos |

---

## 📁 Estructura del Proyecto

```
backend/
├── main.py                  # Aplicación FastAPI principal
├── requirements.txt         # Dependencias de Python
├── Dockerfile              # Configuración de contenedor Docker
├── .dockerignore           # Archivos excluidos del build
├── .env                    # Variables de entorno (NO commitear)
└── README.md               # Esta documentación
```

---

## 🚀 Instalación

### Prerequisitos

- **Python** >= 3.11
- **pip** >= 21.0
- Clave API de Google Gemini ([Obtener aquí](https://makersuite.google.com/app/apikey))

### Pasos de Instalación

#### 1. Clonar el Repositorio

```bash
git clone <tu-repositorio>
cd <tu-repositorio>
```

#### 2. Instalar Dependencias

```bash
pip install -r requirements.txt
```

#### 3. Configurar Variables de Entorno

Crear archivo `.env` en la raíz:

```env
# API Key de Google Gemini (REQUERIDA)
GEMINI_API_KEY=tu_clave_api_aqui

# Modelo a utilizar (opcional, por defecto: gemini-2.5-pro)
GEMINI_MODEL=gemini-2.5-pro
```

#### 4. Iniciar el Servidor

```bash
python main.py
```

El servidor estará disponible en: `http://localhost:8000`

Documentación interactiva: `http://localhost:8000/docs`

---

## 🐳 Despliegue en Render

### Opción 1: Despliegue Docker (Recomendado)

#### Paso 1: Preparar el Repositorio

Asegúrate de que tu repositorio tenga:
- `Dockerfile` ✅
- `.dockerignore` ✅
- `main.py` ✅
- `requirements.txt` ✅

#### Paso 2: Crear Web Service en Render

1. Ingresa a [render.com](https://render.com)
2. Click en **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub/GitLab
4. Selecciona el repositorio

#### Paso 3: Configuración del Servicio

| Campo | Valor |
|-------|-------|
| **Name** | `api-asistente-cocina` (o tu preferencia) |
| **Environment** | `Docker` |
| **Region** | Selecciona la más cercana a tus usuarios |
| **Branch** | `main` (o tu rama principal) |
| **Plan** | Free / Starter / Professional |

#### Paso 4: Variables de Entorno

En la sección **"Environment Variables"**, agregar:

```
GEMINI_API_KEY = tu_clave_api_de_google_gemini
GEMINI_MODEL = gemini-2.5-pro
```

#### Paso 5: Deploy

1. Click en **"Create Web Service"**
2. Render construirá automáticamente la imagen Docker
3. El despliegue tardará 2-5 minutos

#### Paso 6: Verificación

Tu API estará disponible en:
```
https://tu-servicio.onrender.com
```

Prueba visitando:
```
https://tu-servicio.onrender.com/
```

Deberías ver:
```json
{"message": "API de Asistente de Comida"}
```

### Opción 2: Despliegue Python Nativo

Si prefieres despliegue sin Docker:

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

---

## 📡 Documentación de Endpoints

### GET `/`
**Descripción:** Health check del servicio

**Response:**
```json
{
  "message": "API de Asistente de Comida"
}
```

---

### POST `/api/chat`
**Descripción:** Envía un mensaje al asistente conversacional

**Request Body:**
```json
{
  "message": "¿Qué puedo cocinar con pollo y arroz?"
}
```

**Response:**
```json
{
  "response": "Con pollo y arroz puedes preparar deliciosas recetas como..."
}
```

**Códigos de Estado:**
- `200` - Éxito
- `404` - Modelo no encontrado
- `500` - Error del servidor
- `502` - Error de Gemini API

---

### POST `/api/speech-to-text`
**Descripción:** Transcribe audio a texto

**Request:**
- Content-Type: `multipart/form-data`
- Campo: `file` (archivo de audio)
- Formatos soportados: webm, mp3, wav, ogg

**Response:**
```json
{
  "transcript": "Qué recomiendas para la cena de hoy"
}
```

**Ejemplo con cURL:**
```bash
curl -X POST http://localhost:8000/api/speech-to-text \
  -F "file=@audio.webm"
```

**Códigos de Estado:**
- `200` - Transcripción exitosa
- `400` - Archivo inválido
- `500` - Error de procesamiento
- `502` - Error de Gemini API

---

### POST `/api/recipes`
**Descripción:** Genera 3 recetas personalizadas basadas en ingredientes

**Request Body:**
```json
{
  "ingredients": ["pollo", "arroz", "cebolla", "tomate"],
  "preferences": "sin gluten, rápido de preparar"
}
```

**Response:**
```json
{
  "recipes": [
    {
      "name": "Arroz con Pollo al Horno",
      "description": "Plato tradicional latinoamericano saludable y delicioso",
      "prepTime": "45 minutos",
      "difficulty": "media",
      "ingredients": [
        "500g de pollo en trozos",
        "2 tazas de arroz",
        "1 cebolla picada",
        "2 tomates cortados",
        "Sal y pimienta al gusto"
      ],
      "instructions": [
        "Precalentar el horno a 180°C",
        "Dorar el pollo en una sartén",
        "Agregar cebolla y tomate, sofreír 5 minutos",
        "Añadir el arroz y 4 tazas de agua",
        "Hornear por 30 minutos tapado"
      ]
    },
    {
      "name": "Pollo Salteado con Verduras",
      "description": "Receta rápida y saludable",
      "prepTime": "20 minutos",
      "difficulty": "fácil",
      "ingredients": ["..."],
      "instructions": ["..."]
    },
    {
      "name": "Sopa de Pollo Casera",
      "description": "Reconfortante y nutritiva",
      "prepTime": "35 minutos",
      "difficulty": "fácil",
      "ingredients": ["..."],
      "instructions": ["..."]
    }
  ]
}
```

**Códigos de Estado:**
- `200` - Recetas generadas exitosamente
- `502` - Error al parsear respuesta de Gemini
- `500` - Error del servidor

---

### GET `/api/models`
**Descripción:** Lista todos los modelos disponibles en Gemini API

**Response:**
```json
{
  "models": [
    {
      "name": "models/gemini-2.5-pro",
      "displayName": "Gemini 2.5 Pro",
      "description": "...",
      "supportedGenerationMethods": ["generateContent"]
    }
  ]
}
```

**Uso:** Útil para verificar qué modelos soportan `generateContent`

---

## 🔐 Configuración CORS

Por defecto, la API acepta peticiones desde cualquier origen (`*`). **Para producción**, se recomienda restringir a dominios específicos:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://tu-frontend.com",
        "https://www.tu-frontend.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🧪 Scripts Disponibles

### Desarrollo Local
```bash
# Iniciar con auto-reload
python main.py

# O con uvicorn directamente
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Producción
```bash
# Con uvicorn (workers múltiples)
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Docker Local
```bash
# Construir imagen
docker build -t asistente-cocina-api .

# Ejecutar contenedor
docker run -p 8000:8000 --env-file .env asistente-cocina-api
```

---

## 📊 Arquitectura del Sistema

```
┌─────────────┐
│   Frontend  │
│  (Vue.js)   │
└──────┬──────┘
       │ HTTP/REST
       ▼
┌─────────────────────────────┐
│   Backend API (FastAPI)     │
│  ┌─────────────────────┐   │
│  │  /api/chat          │   │
│  │  /api/speech-to-text│   │
│  │  /api/recipes       │   │
│  │  /api/models        │   │
│  └──────────┬──────────┘   │
│             │               │
│    ┌────────▼─────────┐    │
│    │  httpx Client    │    │
│    │  (async)         │    │
│    └────────┬─────────┘    │
└─────────────┼──────────────┘
              │ HTTPS
              ▼
  ┌────────────────────────┐
  │  Google Gemini API     │
  │  - generateContent     │
  │  - Audio processing    │
  │  - Chat completion     │
  └────────────────────────┘
```

---

## 🔍 Flujo de Procesamiento de Audio

```
Usuario → Frontend → Backend → Codifica base64 → Gemini API
                        ↓                              ↓
                    Recibe audio              Transcribe audio
                        ↓                              ↓
                    Extrae texto ←── Respuesta JSON ──┘
                        ↓
                    Retorna transcript
```

---

## 📈 Monitoreo en Render

Render proporciona herramientas integradas de monitoreo:

### Logs en Tiempo Real
- Dashboard → Logs
- Filtra por nivel (INFO, WARNING, ERROR)
- Busca por texto específico

### Métricas
- CPU usage
- Memory usage
- Request count
- Response times

### Health Checks
- Automáticos en la URL raíz (`/`)
- Configurables para endpoints específicos

---

## 🚨 Manejo de Errores

### Errores Comunes y Soluciones

#### 1. `GEMINI_API_KEY no configurado`
**Causa:** Variable de entorno no definida

**Solución:**
```bash
# Agregar en Render
GEMINI_API_KEY = tu_clave_aqui
```

#### 2. `404 - Modelo no encontrado`
**Causa:** El modelo especificado no existe o no soporta `generateContent`

**Solución:**
```bash
# Verificar modelos disponibles
curl https://tu-api.onrender.com/api/models

# Actualizar variable
GEMINI_MODEL = models/gemini-2.5-pro
```

#### 3. `Timeout en requests`
**Causa:** Respuesta de Gemini tarda más de 30 segundos

**Solución:** Aumentar timeout en `main.py`:
```python
client = httpx.AsyncClient(timeout=60.0)
```

#### 4. `JSON decode error en recetas`
**Causa:** Gemini devolvió texto que no es JSON válido

**Solución:** El backend ya incluye limpieza automática de code fences. Si persiste, revisar el prompt.

---

## 🔧 Variables de Entorno

| Variable | Requerida | Default | Descripción |
|----------|-----------|---------|-------------|
| `GEMINI_API_KEY` | ✅ Sí | - | API Key de Google Gemini |
| `GEMINI_MODEL` | ❌ No | `gemini-2.5-pro` | Modelo a utilizar |
| `PORT` | ❌ No | `8000` | Puerto del servidor (Render lo asigna automáticamente) |

---

## 📝 Logging

El backend incluye logging estructurado:

```python
logging.basicConfig(level=logging.INFO)
```

**Logs importantes:**
- `Httpx AsyncClient creado en startup`
- `Llamando a Gemini url=...`
- `Error desde Gemini: ...`
- `Respuesta no JSON de Gemini`

---

## 🧪 Testing

### Test Manual con cURL

**Chat:**
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Dame una receta rápida"}'
```

**Audio:**
```bash
curl -X POST http://localhost:8000/api/speech-to-text \
  -F "file=@test-audio.webm"
```

**Recetas:**
```bash
curl -X POST http://localhost:8000/api/recipes \
  -H "Content-Type: application/json" \
  -d '{
    "ingredients": ["pollo", "arroz"],
    "preferences": "fácil"
  }'
```

---

## 🌐 CORS y Seguridad

### Configuración Actual (Desarrollo)
```python
allow_origins=["*"]  # Permite todos los orígenes
```

### Configuración Recomendada (Producción)
```python
allow_origins=[
    "https://tu-frontend.com",
    "https://tu-dominio-personalizado.com"
]
```

### Mejores Prácticas de Seguridad

✅ **Hacer:**
- Mantener `.env` en `.gitignore`
- Usar variables de entorno en Render
- Rotar API keys periódicamente
- Restringir CORS en producción
- Validar todos los inputs con Pydantic

❌ **No hacer:**
- Commitear API keys al repositorio
- Usar `allow_origins=["*"]` en producción
- Loggear información sensible
- Exponer detalles de errores internos al cliente

---

## 🚀 Optimizaciones de Performance

### Cliente HTTP Asíncrono
```python
client = httpx.AsyncClient(timeout=30.0)
```

### Lifecycle Management
```python
@app.on_event("startup")
async def startup_event():
    global client
    client = httpx.AsyncClient(timeout=30.0)

@app.on_event("shutdown")
async def shutdown_event():
    if client:
        await client.aclose()
```

### Recomendaciones Adicionales
- Usar caché para respuestas frecuentes (Redis)
- Implementar rate limiting (slowapi)
- Habilitar compresión (gzip)
- Usar CDN para assets estáticos

---

## 📚 Documentación Interactiva

FastAPI genera documentación automática:

### Swagger UI
```
http://localhost:8000/docs
```

### ReDoc
```
http://localhost:8000/redoc
```

### OpenAPI Schema
```
http://localhost:8000/openapi.json
```

---

## 🐛 Debugging

### Logs Detallados
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Inspeccionar Respuesta Completa de Gemini
```python
logging.info("Respuesta completa de Gemini: %s", data)
```

### Verificar Payload Enviado
```python
logging.info("Payload enviado a Gemini: %s", payload)
```

---

## 🔄 Actualización de Dependencias

```bash
# Ver dependencias desactualizadas
pip list --outdated

# Actualizar una dependencia específica
pip install --upgrade fastapi

# Regenerar requirements.txt
pip freeze > requirements.txt
```

---

## 📦 Dependencias Principales

```txt
fastapi==0.118.0          # Framework web
uvicorn==0.37.0           # Servidor ASGI
httpx==0.28.1             # Cliente HTTP asíncrono
pydantic==2.11.9          # Validación de datos
python-dotenv==1.1.1      # Variables de entorno
python-multipart==0.0.20  # Upload de archivos
```

---

## 🎓 Recursos Útiles

### Documentación Oficial
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Google Gemini API](https://ai.google.dev/docs)
- [Render Documentation](https://render.com/docs)
- [httpx Documentation](https://www.python-httpx.org/)

### Tutoriales Recomendados
- [FastAPI Best Practices](https://fastapi.tiangolo.com/tutorial/)
- [Deploying FastAPI on Render](https://render.com/docs/deploy-fastapi)
- [Working with Gemini API](https://ai.google.dev/tutorials)

---

## 🤝 Contribuciones

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Añade nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos y de demostración técnica.

---

<div align="center">

**Desarrollado con FastAPI y Google Gemini AI**

*Backend robusto para asistentes culinarios inteligentes*

</div>
