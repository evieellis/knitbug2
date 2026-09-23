// Local content-editing admin tool. Runs only on your machine (npm run admin),
// reads/writes the JSON files under src/content/data and images under
// public/content-images directly on disk. Never deployed — nothing here ships
// with the actual site.
import express from 'express'
import multer from 'multer'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DATA_DIR = path.join(ROOT, 'src/content/data')
const IMAGES_DIR = path.join(ROOT, 'public/content-images')
// Lives under admin-server/, not src/content/data — nothing here ever gets
// imported by a content/*.js wrapper, so it can never reach the live site or
// be shown to a visitor. Keyed by each image's public "/content-images/..."
// path, e.g. { "/content-images/gallery-swatches/swatch-1.jpg": { sourceUrl: "..." } }.
const IMAGE_SOURCES_FILE = path.join(__dirname, 'image-sources.json')
const PORT = process.env.PORT || 5175

// One entry per JSON content file the admin UI can edit. Adding a new content
// area later just needs a new entry here (and the matching content/*.js thin
// wrapper on the site side) — the UI itself is generic and needs no changes.
const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'findOutWhatsWrong', label: "Find Out What's Wrong" },
  { id: 'galleryOfMistakes', label: 'Gallery of Mistakes' },
  { id: 'mistakeOverview', label: 'Mistake Overview' },
  // Each repair method carries its own tutorial nested inside it (see its
  // `tutorial` field) — there's no separate Tutorials section, so a method's
  // repair-card content and its tutorial are always edited in one place.
  { id: 'repairOptions', label: 'Repair Options' },
  { id: 'questionnaire', label: 'Questionnaire' },
]
const SECTION_IDS = new Set(SECTIONS.map((s) => s.id))

function sectionFile(id) {
  return path.join(DATA_DIR, `${id}.json`)
}

const FOLDER_NAME_RE = /^[a-z0-9-]{1,60}$/

function sanitizeFilename(name) {
  const ext = path.extname(name).toLowerCase().replace(/[^a-z0-9.]/g, '')
  const base = path
    .basename(name, path.extname(name))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  return `${base || 'image'}${ext || '.jpg'}`
}

async function uniqueDestination(dir, filename) {
  const ext = path.extname(filename)
  const base = path.basename(filename, ext)
  let candidate = filename
  let n = 1
  while (
    await fsp
      .access(path.join(dir, candidate))
      .then(() => true)
      .catch(() => false)
  ) {
    candidate = `${base}-${n}${ext}`
    n += 1
  }
  return candidate
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true)
    else cb(new Error('Only image files are allowed'))
  },
})

const app = express()
app.use(express.json({ limit: '10mb' }))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/content-images', express.static(IMAGES_DIR))

app.get('/api/sections', (req, res) => {
  res.json(SECTIONS)
})

app.get('/api/sections/:id', async (req, res) => {
  const { id } = req.params
  if (!SECTION_IDS.has(id)) return res.status(404).json({ error: 'Unknown section' })
  try {
    const raw = await fsp.readFile(sectionFile(id), 'utf8')
    res.json(JSON.parse(raw))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/sections/:id', async (req, res) => {
  const { id } = req.params
  if (!SECTION_IDS.has(id)) return res.status(404).json({ error: 'Unknown section' })
  const body = req.body
  if (typeof body !== 'object' || body === null) {
    return res.status(400).json({ error: 'Body must be a JSON object' })
  }
  try {
    await fsp.writeFile(sectionFile(id), JSON.stringify(body, null, 2) + '\n', 'utf8')
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

async function readImageSources() {
  try {
    return JSON.parse(await fsp.readFile(IMAGE_SOURCES_FILE, 'utf8'))
  } catch (err) {
    if (err.code === 'ENOENT') return {}
    throw err
  }
}

app.get('/api/image-sources', async (req, res) => {
  try {
    res.json(await readImageSources())
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/image-sources', async (req, res) => {
  const { path: imagePath, sourceUrl } = req.body || {}
  if (typeof imagePath !== 'string' || !imagePath.startsWith('/content-images/')) {
    return res.status(400).json({ error: 'Invalid image path' })
  }
  try {
    const sources = await readImageSources()
    if (sourceUrl) {
      sources[imagePath] = { sourceUrl: String(sourceUrl) }
    } else {
      delete sources[imagePath]
    }
    await fsp.writeFile(IMAGE_SOURCES_FILE, JSON.stringify(sources, null, 2) + '\n', 'utf8')
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Resolves a "/content-images/..." public path to an on-disk path, refusing
// anything that would escape IMAGES_DIR (e.g. via "..").
function resolveExistingImagePath(publicPath) {
  if (typeof publicPath !== 'string' || !publicPath.startsWith('/content-images/')) return null
  const relative = publicPath.slice('/content-images/'.length)
  const resolved = path.resolve(IMAGES_DIR, relative)
  if (!resolved.startsWith(IMAGES_DIR + path.sep)) return null
  return resolved
}

app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file received' })

  // A re-crop of an already-uploaded image overwrites that exact file in
  // place, rather than filing a new numbered copy next to it every time.
  const overwriteTarget = resolveExistingImagePath(req.body.overwritePath)
  if (req.body.overwritePath && !overwriteTarget) {
    return res.status(400).json({ error: 'Invalid overwritePath' })
  }

  try {
    if (overwriteTarget) {
      await fsp.writeFile(overwriteTarget, req.file.buffer)
      return res.json({ path: req.body.overwritePath })
    }

    const folderInput = String(req.body.folder || 'misc').toLowerCase()
    const folder = FOLDER_NAME_RE.test(folderInput) ? folderInput : 'misc'
    const dir = path.join(IMAGES_DIR, folder)
    await fsp.mkdir(dir, { recursive: true })
    const safeName = sanitizeFilename(req.file.originalname)
    const finalName = await uniqueDestination(dir, safeName)
    await fsp.writeFile(path.join(dir, finalName), req.file.buffer)
    res.json({ path: `/content-images/${folder}/${finalName}` })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.use((err, req, res, next) => {
  if (err) return res.status(400).json({ error: err.message })
  next()
})

app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`
  console.log(`\nKnitBug content admin running at ${url}\n`)
  if (process.platform === 'darwin') {
    import('node:child_process').then(({ exec }) => exec(`open ${url}`))
  }
})
