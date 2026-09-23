// Generic JSON-tree editor. Every content section is just a JSON object, so
// instead of hand-building a form per screen, this renders one recursively
// from whatever shape the JSON happens to have — objects become fieldsets,
// arrays become repeatable lists (with add/remove), and leaf values become
// text/number/checkbox/image inputs based on the key name and value type.

const IMAGE_FOLDER_BY_SECTION = {
  galleryOfMistakes: 'gallery-swatches',
  findOutWhatsWrong: 'find-out-thumbnails',
  repairOptions: 'repair',
  mistakeOverview: 'mistake-overview',
}

// Matches the category ids in galleryOfMistakes.json — kept as a small fixed
// list here rather than fetched live, since these five rarely change and a
// repair method's `categories` field needs to pick from exactly this set.
const MISTAKE_CATEGORIES = [
  { id: 'dropped-stitches', label: 'Dropped Stitches' },
  { id: 'twisted-stitches', label: 'Twisted Stitches' },
  { id: 'split-stitches', label: 'Split Stitches' },
  { id: 'accidental-yarn-over', label: 'Accidental Yarn Over' },
  { id: 'accidental-decrease', label: 'Accidental Decrease' },
]

// Matches the `badges` map in RepairMethodCard.jsx — the only ids that map
// to a real, styled badge on the live site. Free-typing anything else here
// would just silently render no badge at all.
const BADGE_OPTIONS = [
  { id: '', label: 'No badge' },
  { id: 'recommended', label: 'Our Recommendation' },
  { id: 'good-choice', label: 'Good Choice' },
  { id: 'temporary-fix', label: 'Temporary Fix' },
  { id: 'time-consuming', label: 'Time Consuming' },
  { id: 'not-recommended', label: 'Not Recommended' },
]

let sections = []
let currentSectionId = null
let currentState = null
let dirty = false
// Internal-only metadata (where an image came from) — never part of a
// content JSON file, never read by the live site. Keyed by public image path.
let imageSources = {}

const sectionListEl = document.getElementById('section-list')
const sectionTitleEl = document.getElementById('section-title')
const formRootEl = document.getElementById('form-root')
const statusEl = document.getElementById('status')
const saveBtn = document.getElementById('save-btn')
const reloadBtn = document.getElementById('reload-btn')

init()

async function init() {
  const [sectionsRes, sourcesRes] = await Promise.all([fetch('/api/sections'), fetch('/api/image-sources')])
  sections = await sectionsRes.json()
  imageSources = await sourcesRes.json()
  sectionListEl.innerHTML = ''
  sections.forEach((section) => {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'section-list__item'
    btn.textContent = section.label
    btn.addEventListener('click', () => selectSection(section.id))
    btn.dataset.sectionId = section.id
    sectionListEl.appendChild(btn)
  })
}

async function selectSection(id) {
  if (dirty && !confirm('Discard unsaved changes in this section?')) return
  currentSectionId = id
  const section = sections.find((s) => s.id === id)
  sectionTitleEl.textContent = section.label
  ;[...sectionListEl.children].forEach((el) => el.classList.toggle('active', el.dataset.sectionId === id))

  setStatus('Loading…')
  const res = await fetch(`/api/sections/${id}`)
  currentState = await res.json()
  setDirty(false)
  saveBtn.hidden = false
  reloadBtn.hidden = false
  setStatus('')
  rerenderForm()
}

saveBtn.addEventListener('click', async () => {
  if (!currentSectionId) return
  saveBtn.disabled = true
  setStatus('Saving…')
  try {
    const res = await fetch(`/api/sections/${currentSectionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentState),
    })
    if (!res.ok) throw new Error((await res.json()).error || 'Save failed')
    setDirty(false)
    setStatus('Saved', 'saved')
  } catch (err) {
    setStatus(err.message, 'error')
  } finally {
    saveBtn.disabled = false
  }
})

reloadBtn.addEventListener('click', () => {
  if (currentSectionId) selectSection(currentSectionId)
})

window.addEventListener('beforeunload', (e) => {
  if (dirty) {
    e.preventDefault()
    e.returnValue = ''
  }
})

function setDirty(value) {
  dirty = value
  if (value) setStatus('Unsaved changes', 'dirty')
}

function setStatus(text, kind) {
  statusEl.textContent = text
  statusEl.className = 'status' + (kind ? ` status--${kind}` : '')
}

function rerenderForm() {
  formRootEl.innerHTML = ''
  formRootEl.appendChild(buildContainer(currentState))
}

// ---- shared helpers ----

function titleCase(key) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim()
}

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v)
}

function deepClone(v) {
  return v === undefined ? v : JSON.parse(JSON.stringify(v))
}

function extractYouTubeId(input) {
  if (!input) return input
  const trimmed = input.trim()
  // A YouTube video id is always exactly 11 chars of [A-Za-z0-9_-]. Anchoring
  // on that length (rather than "everything up to the next & or #") is what
  // makes this work when you paste a whole <iframe> embed snippet — the src
  // URL is surrounded by quotes and other markup, not just query params.
  const idPattern = '([A-Za-z0-9_-]{11})'
  const watchMatch = trimmed.match(new RegExp(`[?&]v=${idPattern}`))
  if (watchMatch) return watchMatch[1]
  const shortMatch = trimmed.match(new RegExp(`youtu\\.be/${idPattern}`))
  if (shortMatch) return shortMatch[1]
  const embedMatch = trimmed.match(new RegExp(`embed/${idPattern}`))
  if (embedMatch) return embedMatch[1]
  // Already a bare id, e.g. typed or pasted with no surrounding URL/markup.
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed
  return trimmed
}

function isImageKey(key) {
  return /image/i.test(key)
}

// Re-cropping overwrites a file at the *same* public path, so without this
// the browser's HTTP cache keeps serving the pre-crop bytes for that URL
// indefinitely (setting <img>.src to an unchanged string is a no-op, and
// even a fresh request can be served from cache) — the crop tool then looks
// broken because nothing on screen ever visibly updates. Never bust blob:/
// data: URLs (used for a not-yet-uploaded local file) — they aren't cached
// by URL and a query string on a blob: URL just breaks it.
function cacheBust(url) {
  if (!url || url.startsWith('blob:') || url.startsWith('data:')) return url
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}v=${Date.now()}`
}

function isLongTextKey(key) {
  return /body|description|subheading|subtitle|warningtext|detail|text$|message/i.test(key)
}

async function saveImageSource(imagePath, sourceUrl) {
  if (!imagePath) return
  if (sourceUrl) {
    imageSources[imagePath] = { sourceUrl }
  } else {
    delete imageSources[imagePath]
  }
  try {
    await fetch('/api/image-sources', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: imagePath, sourceUrl }),
    })
  } catch {
    // Best-effort — this is internal bookkeeping, not the content itself, so
    // a failed save here shouldn't block or dirty the main section editor.
  }
}

// ---- rendering ----
// `container` is a mutable object or array; children are rendered by key
// (object) or index (array), and always mutate `container` directly so no
// separate "read form back into JSON" step is needed — the in-memory state
// *is* the form's data.

function buildContainer(container) {
  const wrap = document.createElement('div')
  wrap.className = 'node__body'

  if (Array.isArray(container)) {
    container.forEach((_, index) => {
      wrap.appendChild(buildArrayItem(container, index))
    })
    wrap.appendChild(buildAddArrayItemButton(container))
  } else if (isPlainObject(container)) {
    Object.keys(container).forEach((key) => {
      wrap.appendChild(buildField(container, key))
    })
    wrap.appendChild(buildAddFieldButton(container))
  }
  return wrap
}

// Multiple items in the same array can otherwise look identical in this
// generic form (e.g. two placeholder swatches that both say "Var 5" until
// you open each one) — surfacing whatever looks like its own caption/title
// next to the item number makes it obvious which one you're actually
// editing, instead of relying on a bare, easy-to-miscount "Item 6".
function describeArrayItem(value) {
  if (!isPlainObject(value)) return null
  const key = ['caption', 'title', 'label', 'heading', 'text', 'name', 'id'].find(
    (k) => typeof value[k] === 'string' && value[k]
  )
  return key ? value[key] : null
}

function buildArrayItem(arr, index) {
  const item = document.createElement('div')
  item.className = 'array-item'

  const header = document.createElement('div')
  header.className = 'field__label-row'
  const label = document.createElement('span')
  label.className = 'field__label'
  const description = describeArrayItem(arr[index])
  label.textContent = description ? `Item ${index + 1} — "${description}"` : `Item ${index + 1}`
  header.appendChild(label)

  const removeBtn = document.createElement('button')
  removeBtn.type = 'button'
  removeBtn.className = 'btn btn--small btn--danger'
  removeBtn.textContent = 'Remove'
  removeBtn.addEventListener('click', () => {
    if (!confirm(`Remove item ${index + 1}? This can't be undone until you reload without saving.`)) return
    arr.splice(index, 1)
    setDirty(true)
    rerenderForm()
  })
  header.appendChild(removeBtn)
  item.appendChild(header)

  item.appendChild(buildValueEditor(arr, index))
  return item
}

function buildAddArrayItemButton(arr) {
  const row = document.createElement('div')
  row.className = 'add-row'
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'btn btn--link'
  btn.textContent = '+ Add item'
  btn.addEventListener('click', () => {
    if (arr.length > 0) {
      const clone = deepClone(arr[arr.length - 1])
      if (clone && typeof clone === 'object' && typeof clone.id === 'string') {
        clone.id = `${clone.id}-new`
      }
      arr.push(clone)
    } else {
      arr.push('')
    }
    setDirty(true)
    rerenderForm()
  })
  row.appendChild(btn)
  return row
}

function buildField(obj, key) {
  const field = document.createElement('div')
  field.className = 'field'

  const header = document.createElement('div')
  header.className = 'field__label-row'
  const label = document.createElement('span')
  label.className = 'field__label'
  label.textContent = titleCase(key)
  header.appendChild(label)

  const removeBtn = document.createElement('button')
  removeBtn.type = 'button'
  removeBtn.className = 'btn btn--small btn--danger'
  removeBtn.textContent = 'Remove'
  removeBtn.addEventListener('click', () => {
    if (!confirm(`Remove "${titleCase(key)}"? This can't be undone until you reload without saving.`)) return
    // `tutorial` is a fixed field every method has (null, or a tutorial
    // object) — deleting the key outright would drop it from the form
    // entirely, with no "+ Add Tutorial" button left to bring it back.
    if (key === 'tutorial') obj[key] = null
    else delete obj[key]
    setDirty(true)
    rerenderForm()
  })
  header.appendChild(removeBtn)
  field.appendChild(header)

  field.appendChild(buildValueEditor(obj, key))
  return field
}

function buildAddFieldButton(obj) {
  const row = document.createElement('div')
  row.className = 'add-row'
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'btn btn--link'
  btn.textContent = '+ Add entry'
  btn.addEventListener('click', () => {
    const newKey = prompt('New key name (e.g. a new category or question id):')
    if (!newKey) return
    if (Object.prototype.hasOwnProperty.call(obj, newKey)) {
      alert('That key already exists.')
      return
    }
    const values = Object.values(obj)
    obj[newKey] = values.length > 0 ? deepClone(values[0]) : ''
    setDirty(true)
    rerenderForm()
  })
  row.appendChild(btn)
  return row
}

// container[key] is the value being edited; works for both object keys and array indices.
function buildValueEditor(container, key) {
  const value = container[key]

  // Only a repair method's `categories: ["dropped-stitches", ...]` (a list of
  // category ids) gets the checkbox picker — Gallery of Mistakes and Find Out
  // What's Wrong also have their own unrelated `categories` field, but as a
  // list of full category objects (id/label/swatches/thumbnails), which must
  // fall through to the normal array editor instead or its swatches/images
  // become impossible to reach.
  if (key === 'categories' && Array.isArray(value) && value.every((item) => typeof item === 'string')) {
    return buildReferenceChecklistEditor(container, key, MISTAKE_CATEGORIES)
  }

  // "Tools"/"Circumstances" pick from this same section's own filterGroups
  // definitions (the filter panel on Repair Options), so ids always match
  // something real instead of being free-typed and easy to typo/mismatch.
  if (key === 'tools' && Array.isArray(value) && currentState?.filterGroups?.tools?.items) {
    return buildReferenceChecklistEditor(container, key, currentState.filterGroups.tools.items)
  }
  if (key === 'circumstances' && Array.isArray(value) && currentState?.filterGroups?.circumstances?.items) {
    return buildReferenceChecklistEditor(container, key, currentState.filterGroups.circumstances.items)
  }

  // Tutorial content gets its own visually distinct callout (colored border +
  // badge) whether it's already filled in or still empty, so it's obvious at
  // a glance where a method's tutorial lives among its other fields.
  if (key === 'tutorial') {
    return buildTutorialEditor(container, key)
  }

  // Bespoke editors for a tutorial's steps and each step's checklist —
  // purpose-built cards (obvious "+ Add Step" / "+ Add Checklist Item"
  // buttons, start/stop grouped together, no bare "Item 6" labels) instead
  // of the fully generic array-of-objects rendering everything else gets.
  if (key === 'steps' && Array.isArray(value)) {
    return buildStepsEditor(container, key)
  }
  if (key === 'checklist' && Array.isArray(value)) {
    return buildChecklistEditor(container, key)
  }
  if (key === 'status') {
    return buildStatusEditor(container, key)
  }

  if (Array.isArray(value) || isPlainObject(value)) {
    const nested = document.createElement('div')
    nested.className = `node node--${Array.isArray(value) ? 'array' : 'object'}`
    nested.appendChild(buildContainer(value))
    return nested
  }

  if (typeof key === 'string' && isImageKey(key)) {
    return buildImageEditor(container, key)
  }

  if (key === 'youtubeId') {
    return buildYouTubeEditor(container, key)
  }

  if (key === 'badge') {
    return buildBadgeEditor(container, key)
  }

  if (key === 'maxMinutes') {
    return buildMaxMinutesEditor(container, key)
  }

  if (key === 'startSeconds') {
    return buildSecondsEditor(container, key, "Seconds into the video where this step's clip starts.")
  }

  if (key === 'endSeconds') {
    return buildSecondsEditor(
      container,
      key,
      "Seconds into the video where this step's clip stops and rewinds, ready to replay. Leave blank to play to the end of the video.",
      { nullable: true }
    )
  }

  if (typeof value === 'boolean') {
    return buildBooleanEditor(container, key)
  }

  if (typeof value === 'number') {
    return buildNumberEditor(container, key)
  }

  // string, null, or undefined leaf
  return buildTextEditor(container, key)
}

function buildTextEditor(container, key) {
  const value = container[key]
  const useTextarea = typeof value === 'string' && (value.length > 60 || isLongTextKey(String(key)))
  const el = document.createElement(useTextarea ? 'textarea' : 'input')
  if (!useTextarea) el.type = 'text'
  el.value = value ?? ''
  el.placeholder = value === null ? '(empty)' : ''
  el.addEventListener('input', () => {
    container[key] = el.value
    setDirty(true)
  })
  return el
}

function buildNumberEditor(container, key) {
  const el = document.createElement('input')
  el.type = 'number'
  el.step = 'any'
  el.value = container[key]
  el.addEventListener('input', () => {
    const n = parseFloat(el.value)
    container[key] = Number.isNaN(n) ? 0 : n
    setDirty(true)
  })
  return el
}

function buildBooleanEditor(container, key) {
  const row = document.createElement('label')
  row.className = 'checkbox-row'
  const el = document.createElement('input')
  el.type = 'checkbox'
  el.checked = Boolean(container[key])
  el.addEventListener('change', () => {
    container[key] = el.checked
    setDirty(true)
  })
  row.appendChild(el)
  row.appendChild(document.createTextNode('Enabled'))
  return row
}

// A proper "which mistakes does this apply to" checklist instead of the
// generic free-text array editor — picking from the known category list
// avoids typos silently making a method invisible everywhere.
// A checkbox per item in a known reference list (mistake categories, or a
// section's own filterGroups items) — picking ids from a real list instead
// of free-typing them into the generic array-of-strings editor.
function buildReferenceChecklistEditor(container, key, items) {
  const wrap = document.createElement('div')
  wrap.className = 'categories-field'

  items.forEach(({ id, label }) => {
    const row = document.createElement('label')
    row.className = 'checkbox-row'
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = container[key].includes(id)
    checkbox.addEventListener('change', () => {
      const selected = new Set(container[key])
      if (checkbox.checked) selected.add(id)
      else selected.delete(id)
      container[key] = items.map((i) => i.id).filter((iid) => selected.has(iid))
      setDirty(true)
    })
    row.appendChild(checkbox)
    row.appendChild(document.createTextNode(label))
    wrap.appendChild(row)
  })

  return wrap
}

function buildTutorialEditor(container, key) {
  const wrap = document.createElement('div')
  wrap.className = 'tutorial-field'

  const badge = document.createElement('span')
  badge.className = 'tutorial-field__badge'
  badge.textContent = '🎬 Tutorial'
  wrap.appendChild(badge)

  if (container[key] == null) {
    const empty = document.createElement('div')
    empty.className = 'tutorial-field__empty'

    const msg = document.createElement('p')
    msg.className = 'tutorial-field__empty-text'
    msg.textContent = "This method has no tutorial yet."
    empty.appendChild(msg)

    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'btn btn--primary tutorial-field__add-btn'
    btn.textContent = '+ Add Tutorial'
    btn.addEventListener('click', () => {
      container[key] = {
        overviewTitle: '',
        media: { type: 'youtube', youtubeId: '', startSeconds: 0 },
        overviewSteps: [],
        steps: [],
      }
      setDirty(true)
      rerenderForm()
    })
    empty.appendChild(btn)

    wrap.appendChild(empty)
  } else {
    wrap.appendChild(buildContainer(container[key]))
  }

  return wrap
}

// A step-by-step tutorial's `steps` array — one obviously-numbered card per
// step (heading preview right in its header, not buried), with clip timing
// grouped into its own labeled box and a single, unmistakable "+ Add Step"
// button at the bottom instead of a generic "+ Add item" link easy to
// confuse with every other "+" in the form.
// A step written before this editor existed (or edited by hand) might not
// match the expected {heading, startSeconds, endSeconds, checklist} shape —
// e.g. the old generic "+ Add item" button on an empty array pushed a bare
// string. Coerce it into a real step object (keeping any text as the
// heading) rather than crashing the whole form on `.checklist` of a string.
function normalizeStep(steps, index) {
  const step = steps[index]
  if (step === null || typeof step !== 'object' || Array.isArray(step)) {
    steps[index] = {
      heading: typeof step === 'string' ? step : '',
      startSeconds: 0,
      endSeconds: null,
      checklist: [],
    }
    setDirty(true)
  } else if (!Array.isArray(step.checklist)) {
    step.checklist = []
    setDirty(true)
  }
}

function buildStepsEditor(container, key) {
  const steps = container[key]
  const wrap = document.createElement('div')
  wrap.className = 'steps-field'

  steps.forEach((_, index) => {
    normalizeStep(steps, index)
    wrap.appendChild(buildStepCard(steps, index))
  })

  const addBtn = document.createElement('button')
  addBtn.type = 'button'
  addBtn.className = 'btn btn--primary steps-field__add-btn'
  addBtn.textContent = '+ Add Step'
  addBtn.addEventListener('click', () => {
    steps.push(
      steps.length > 0
        ? { ...deepClone(steps[steps.length - 1]), heading: '', checklist: [] }
        : { heading: '', startSeconds: 0, endSeconds: null, checklist: [] }
    )
    setDirty(true)
    rerenderForm()
  })
  wrap.appendChild(addBtn)

  return wrap
}

function buildStepCard(steps, index) {
  const step = steps[index]
  const card = document.createElement('div')
  card.className = 'step-card'

  const header = document.createElement('div')
  header.className = 'step-card__header'
  const title = document.createElement('span')
  title.className = 'step-card__title'
  title.textContent = step.heading ? `Step ${index + 1} — "${step.heading}"` : `Step ${index + 1}`
  header.appendChild(title)

  const removeBtn = document.createElement('button')
  removeBtn.type = 'button'
  removeBtn.className = 'btn btn--small btn--danger'
  removeBtn.textContent = 'Remove Step'
  removeBtn.addEventListener('click', () => {
    if (!confirm(`Remove Step ${index + 1}? This can't be undone until you reload without saving.`)) return
    steps.splice(index, 1)
    setDirty(true)
    rerenderForm()
  })
  header.appendChild(removeBtn)
  card.appendChild(header)

  const headingField = document.createElement('div')
  headingField.className = 'step-card__field'
  const headingLabel = document.createElement('span')
  headingLabel.className = 'field__label'
  headingLabel.textContent = 'What to do in this step'
  headingField.appendChild(headingLabel)
  const headingInput = buildTextEditor(step, 'heading')
  // The card's own title above needs to reflect edits without a full
  // re-render (which would drop focus mid-typing) — so wire this one up by
  // hand instead of trusting the generic input's own change handling alone.
  headingInput.addEventListener('input', () => {
    title.textContent = step.heading ? `Step ${index + 1} — "${step.heading}"` : `Step ${index + 1}`
  })
  headingField.appendChild(headingInput)
  card.appendChild(headingField)

  const timing = document.createElement('div')
  timing.className = 'step-card__timing'
  const timingLabel = document.createElement('p')
  timingLabel.className = 'step-card__timing-label'
  timingLabel.textContent = '⏱ Video Clip Timing'
  timing.appendChild(timingLabel)

  const timingRow = document.createElement('div')
  timingRow.className = 'step-card__timing-row'

  const startCol = document.createElement('div')
  startCol.className = 'step-card__timing-col'
  const startLabel = document.createElement('span')
  startLabel.className = 'field__label'
  startLabel.textContent = 'Starts at (seconds)'
  startCol.appendChild(startLabel)
  startCol.appendChild(buildSecondsEditor(step, 'startSeconds', 'When this clip begins.'))
  timingRow.appendChild(startCol)

  const endCol = document.createElement('div')
  endCol.className = 'step-card__timing-col'
  const endLabel = document.createElement('span')
  endLabel.className = 'field__label'
  endLabel.textContent = 'Stops at (seconds)'
  endCol.appendChild(endLabel)
  endCol.appendChild(
    buildSecondsEditor(step, 'endSeconds', 'Leave blank to play to the end of the video.', { nullable: true })
  )
  timingRow.appendChild(endCol)

  timing.appendChild(timingRow)
  card.appendChild(timing)

  const checklistWrap = document.createElement('div')
  checklistWrap.className = 'step-card__checklist'
  const checklistLabel = document.createElement('p')
  checklistLabel.className = 'step-card__checklist-label'
  checklistLabel.textContent = '✓ "Make Sure…" Checklist'
  checklistWrap.appendChild(checklistLabel)
  checklistWrap.appendChild(buildChecklistEditor(step, 'checklist'))
  card.appendChild(checklistWrap)

  return card
}

// Same defensive coercion as normalizeStep, for a checklist item that isn't
// a real {id, status, text, detail} object.
function normalizeChecklistItem(items, index) {
  const item = items[index]
  if (item === null || typeof item !== 'object' || Array.isArray(item)) {
    items[index] = {
      id: `c${index + 1}`,
      status: 'good',
      text: typeof item === 'string' ? item : '',
      detail: '',
    }
    setDirty(true)
  }
}

// A step's "Make Sure…" checklist — each item is one row (a good/warning
// picker, the reason itself, remove) instead of a generic nested object per
// item, plus its own clearly-labeled "+ Add Checklist Item" button.
function buildChecklistEditor(container, key) {
  const items = container[key]
  const wrap = document.createElement('div')
  wrap.className = 'checklist-field'

  items.forEach((_, index) => {
    normalizeChecklistItem(items, index)
    wrap.appendChild(buildChecklistItemCard(items, index))
  })

  const addBtn = document.createElement('button')
  addBtn.type = 'button'
  addBtn.className = 'btn btn--small checklist-field__add-btn'
  addBtn.textContent = '+ Add Checklist Item'
  addBtn.addEventListener('click', () => {
    items.push({ id: `c${items.length + 1}`, status: 'good', text: '', detail: '' })
    setDirty(true)
    rerenderForm()
  })
  wrap.appendChild(addBtn)

  return wrap
}

function buildChecklistItemCard(items, index) {
  const item = items[index]
  const card = document.createElement('div')
  card.className = 'checklist-item-card'

  const row = document.createElement('div')
  row.className = 'checklist-item-card__row'

  row.appendChild(buildStatusEditor(item, 'status'))

  const textInput = document.createElement('input')
  textInput.type = 'text'
  textInput.className = 'checklist-item-card__text'
  textInput.placeholder = 'What to check for…'
  textInput.value = item.text ?? ''
  textInput.addEventListener('input', () => {
    item.text = textInput.value
    setDirty(true)
  })
  row.appendChild(textInput)

  const removeBtn = document.createElement('button')
  removeBtn.type = 'button'
  removeBtn.className = 'btn btn--small btn--danger'
  removeBtn.textContent = 'Remove'
  removeBtn.addEventListener('click', () => {
    if (!confirm('Remove this checklist item?')) return
    items.splice(index, 1)
    setDirty(true)
    rerenderForm()
  })
  row.appendChild(removeBtn)
  card.appendChild(row)

  const detailHint = document.createElement('p')
  detailHint.className = 'field__hint'
  detailHint.textContent = 'Optional: extra detail shown when someone taps the "?" next to this item.'
  card.appendChild(detailHint)

  const detailInput = document.createElement('textarea')
  detailInput.placeholder = '(optional)'
  detailInput.value = item.detail ?? ''
  detailInput.addEventListener('input', () => {
    item.detail = detailInput.value
    setDirty(true)
  })
  card.appendChild(detailInput)

  return card
}

function buildStatusEditor(container, key) {
  const select = document.createElement('select')
  select.className = 'status-select'
  ;[
    { id: 'good', label: '✓ Good sign' },
    { id: 'warning', label: '⚠ Watch out for' },
  ].forEach(({ id, label }) => {
    const option = document.createElement('option')
    option.value = id
    option.textContent = label
    select.appendChild(option)
  })
  select.value = container[key] === 'warning' ? 'warning' : 'good'
  select.addEventListener('change', () => {
    container[key] = select.value
    setDirty(true)
  })
  return select
}

function buildSecondsEditor(container, key, hintText, { nullable = false } = {}) {
  const wrap = document.createElement('div')
  const el = document.createElement('input')
  el.type = 'number'
  el.step = 'any'
  el.min = '0'
  el.value = container[key] === null || container[key] === undefined ? '' : container[key]
  if (nullable) el.placeholder = 'end of video'
  el.addEventListener('input', () => {
    if (el.value === '' && nullable) {
      container[key] = null
    } else {
      const n = parseFloat(el.value)
      container[key] = Number.isNaN(n) ? 0 : n
    }
    setDirty(true)
  })
  const hint = document.createElement('p')
  hint.className = 'field__hint'
  hint.textContent = hintText
  wrap.appendChild(el)
  wrap.appendChild(hint)
  return wrap
}

function buildMaxMinutesEditor(container, key) {
  const wrap = document.createElement('div')
  const el = document.createElement('input')
  el.type = 'number'
  el.step = 'any'
  el.value = container[key] === null ? '' : container[key]
  el.placeholder = 'unlimited'
  el.addEventListener('input', () => {
    container[key] = el.value === '' ? null : parseFloat(el.value)
    setDirty(true)
  })
  const hint = document.createElement('p')
  hint.className = 'field__hint'
  hint.textContent = 'Leave blank for "no time limit".'
  wrap.appendChild(el)
  wrap.appendChild(hint)
  return wrap
}

function buildBadgeEditor(container, key) {
  const select = document.createElement('select')
  select.className = 'badge-select'
  BADGE_OPTIONS.forEach(({ id, label }) => {
    const option = document.createElement('option')
    option.value = id
    option.textContent = label
    select.appendChild(option)
  })
  select.value = BADGE_OPTIONS.some((opt) => opt.id === container[key]) ? container[key] ?? '' : ''
  select.addEventListener('change', () => {
    container[key] = select.value
    setDirty(true)
  })
  return select
}

function buildYouTubeEditor(container, key) {
  const wrap = document.createElement('div')
  const el = document.createElement('input')
  el.type = 'text'
  el.value = container[key] ?? ''
  el.placeholder = 'Paste a YouTube URL or video ID'
  el.addEventListener('change', () => {
    container[key] = extractYouTubeId(el.value)
    el.value = container[key]
    setDirty(true)
  })
  el.addEventListener('input', () => {
    container[key] = el.value
    setDirty(true)
  })
  const hint = document.createElement('p')
  hint.className = 'field__hint'
  hint.textContent = 'A full YouTube link is fine — it gets reduced to just the video ID on save.'
  wrap.appendChild(el)
  wrap.appendChild(hint)
  return wrap
}

function guessMimeFromPath(publicPath) {
  if (/\.png$/i.test(publicPath)) return 'image/png'
  return 'image/jpeg'
}

function buildImageEditor(container, key) {
  const wrap = document.createElement('div')
  wrap.className = 'image-field'

  // Doubles as a drop target and a click-to-browse control (the hidden file
  // input inside it is what actually opens the file picker on click).
  const dropzone = document.createElement('label')
  dropzone.className = 'image-field__dropzone'
  dropzone.title = 'Click to choose a file, or drag an image here'

  const preview = document.createElement('img')
  preview.className = 'image-field__preview'
  preview.alt = ''
  if (container[key]) preview.src = cacheBust(container[key])
  dropzone.appendChild(preview)

  const dropHint = document.createElement('span')
  dropHint.className = 'image-field__drop-hint'
  dropHint.textContent = 'Drop image here, or click to browse'
  dropzone.appendChild(dropHint)

  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'image/*'
  fileInput.className = 'image-field__file-input'
  dropzone.appendChild(fileInput)

  const pathInput = document.createElement('input')
  pathInput.type = 'text'
  pathInput.value = container[key] ?? ''
  pathInput.placeholder = '/content-images/...'
  pathInput.addEventListener('input', () => {
    container[key] = pathInput.value
    preview.src = cacheBust(pathInput.value)
    setDirty(true)
    refreshSourceField()
  })

  // Where this photo came from — internal bookkeeping only. Saved straight
  // to its own store on the server (not part of this section's JSON), so it
  // never ships to the live site and is never rendered for a site visitor.
  const sourceInput = document.createElement('input')
  sourceInput.type = 'text'
  sourceInput.className = 'image-field__source'
  sourceInput.placeholder = 'https://... (where you got this photo)'
  sourceInput.addEventListener('change', () => {
    saveImageSource(container[key], sourceInput.value.trim())
  })

  function refreshSourceField() {
    const currentPath = container[key]
    sourceInput.disabled = !currentPath
    sourceInput.value = currentPath ? imageSources[currentPath]?.sourceUrl || '' : ''
  }
  refreshSourceField()

  const cropBtn = document.createElement('button')
  cropBtn.type = 'button'
  cropBtn.className = 'btn btn--small'
  cropBtn.textContent = 'Crop…'
  cropBtn.hidden = !container[key]
  cropBtn.addEventListener('click', async () => {
    const currentPath = container[key]
    if (!currentPath) return
    const result = await openCropper(currentPath, guessMimeFromPath(currentPath))
    if (!result) return
    const filename = currentPath.split('/').pop()
    await performUpload({ blob: result.blob, filename, overwritePath: currentPath, container, key, preview, pathInput })
    refreshSourceField()
  })

  const uploadNewFile = async (file) => {
    if (!file) return
    if (!/^image\//.test(file.type)) {
      setStatus('That file is not an image', 'error')
      return
    }
    const objectUrl = URL.createObjectURL(file)
    const result = await openCropper(objectUrl, file.type)
    URL.revokeObjectURL(objectUrl)
    if (!result) return
    cropBtn.hidden = false
    await performUpload({ blob: result.blob, filename: file.name, container, key, preview, pathInput })
    refreshSourceField()
  }

  fileInput.addEventListener('change', () => uploadNewFile(fileInput.files[0]))

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault()
    dropzone.classList.add('image-field__dropzone--active')
  })
  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('image-field__dropzone--active')
  })
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault()
    dropzone.classList.remove('image-field__dropzone--active')
    uploadNewFile(e.dataTransfer.files[0])
  })

  const row = document.createElement('div')
  row.className = 'image-field__row'
  row.appendChild(pathInput)
  row.appendChild(cropBtn)

  const sourceHint = document.createElement('p')
  sourceHint.className = 'field__hint'
  sourceHint.textContent = "Source link — internal only, never shown on the site."

  wrap.appendChild(dropzone)
  wrap.appendChild(row)
  wrap.appendChild(sourceHint)
  wrap.appendChild(sourceInput)

  return wrap
}

// ---- crop-on-upload ----
// A single reused modal: drag the corner handles to select a region (it
// starts covering the whole image, so applying with no changes just uploads
// it unmodified), then Apply Crop renders the selection onto a canvas at the
// image's native resolution and hands back a Blob to upload.

async function performUpload({ blob, filename, folder, overwritePath, container, key, preview, pathInput }) {
  const formData = new FormData()
  formData.append('file', blob, filename)
  if (overwritePath) {
    formData.append('overwritePath', overwritePath)
  } else {
    formData.append('folder', folder || IMAGE_FOLDER_BY_SECTION[currentSectionId] || currentSectionId || 'misc')
  }
  setStatus('Uploading image…')
  try {
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (!res.ok) throw new Error((await res.json()).error || 'Upload failed')
    const { path: uploadedPath } = await res.json()
    container[key] = uploadedPath
    pathInput.value = uploadedPath
    preview.src = cacheBust(uploadedPath)
    setDirty(true)
    setStatus('Unsaved changes', 'dirty')
  } catch (err) {
    setStatus(err.message, 'error')
  }
}

let cropModalEls = null

function ensureCropModal() {
  if (cropModalEls) return cropModalEls

  const overlay = document.createElement('div')
  overlay.className = 'crop-modal'
  overlay.hidden = true

  const panel = document.createElement('div')
  panel.className = 'crop-modal__panel'

  const stage = document.createElement('div')
  stage.className = 'crop-modal__stage'

  const img = document.createElement('img')
  img.className = 'crop-modal__image'
  img.draggable = false
  stage.appendChild(img)

  const box = document.createElement('div')
  box.className = 'crop-modal__box'
  ;['nw', 'ne', 'sw', 'se'].forEach((corner) => {
    const handle = document.createElement('div')
    handle.className = `crop-modal__handle crop-modal__handle--${corner}`
    handle.dataset.corner = corner
    box.appendChild(handle)
  })
  stage.appendChild(box)

  const hint = document.createElement('p')
  hint.className = 'crop-modal__hint'
  hint.textContent = 'Drag a corner to crop. Leave it as-is to upload the full photo.'

  const actions = document.createElement('div')
  actions.className = 'crop-modal__actions'
  const cancelBtn = document.createElement('button')
  cancelBtn.type = 'button'
  cancelBtn.className = 'btn btn--ghost'
  cancelBtn.textContent = 'Cancel'
  const resetBtn = document.createElement('button')
  resetBtn.type = 'button'
  resetBtn.className = 'btn btn--ghost'
  resetBtn.textContent = 'Reset'
  const applyBtn = document.createElement('button')
  applyBtn.type = 'button'
  applyBtn.className = 'btn btn--primary'
  applyBtn.textContent = 'Apply Crop'
  actions.append(cancelBtn, resetBtn, applyBtn)

  panel.append(stage, hint, actions)
  overlay.appendChild(panel)
  document.body.appendChild(overlay)

  cropModalEls = { overlay, img, box, cancelBtn, resetBtn, applyBtn }
  return cropModalEls
}

function openCropper(src, mimeType) {
  const els = ensureCropModal()

  return new Promise((resolve) => {
    let rect = { x: 0, y: 0, w: 0, h: 0 }
    let drag = null
    const clamp = (v, min, max) => Math.min(Math.max(v, min), max)

    function applyRectStyle() {
      els.box.style.left = `${rect.x}px`
      els.box.style.top = `${rect.y}px`
      els.box.style.width = `${rect.w}px`
      els.box.style.height = `${rect.h}px`
    }

    function resetRect() {
      rect = { x: 0, y: 0, w: els.img.clientWidth, h: els.img.clientHeight }
      applyRectStyle()
    }

    function onImageLoad() {
      // Show the overlay before measuring: a hidden element reports 0 for
      // clientWidth/clientHeight, so measuring first produced a 0×0 crop box
      // whenever the browser resolved the image synchronously (e.g. src
      // unchanged from last time, so no 'load' event actually fires).
      els.overlay.hidden = false
      resetRect()
    }

    function onBoxMouseDown(e) {
      const corner = e.target.dataset.corner
      drag = corner
        ? { mode: 'resize', corner, startX: e.clientX, startY: e.clientY, startRect: { ...rect } }
        : { mode: 'move', startX: e.clientX, startY: e.clientY, startRect: { ...rect } }
      e.preventDefault()
    }

    function onMouseMove(e) {
      if (!drag) return
      const dx = e.clientX - drag.startX
      const dy = e.clientY - drag.startY
      const stageW = els.img.clientWidth
      const stageH = els.img.clientHeight
      const min = 24

      if (drag.mode === 'move') {
        rect.x = clamp(drag.startRect.x + dx, 0, stageW - rect.w)
        rect.y = clamp(drag.startRect.y + dy, 0, stageH - rect.h)
      } else {
        let { x, y, w, h } = drag.startRect
        if (drag.corner.includes('e')) w = clamp(drag.startRect.w + dx, min, stageW - x)
        if (drag.corner.includes('s')) h = clamp(drag.startRect.h + dy, min, stageH - y)
        if (drag.corner.includes('w')) {
          const newX = clamp(drag.startRect.x + dx, 0, drag.startRect.x + drag.startRect.w - min)
          w = drag.startRect.w + (drag.startRect.x - newX)
          x = newX
        }
        if (drag.corner.includes('n')) {
          const newY = clamp(drag.startRect.y + dy, 0, drag.startRect.y + drag.startRect.h - min)
          h = drag.startRect.h + (drag.startRect.y - newY)
          y = newY
        }
        rect = { x, y, w, h }
      }
      applyRectStyle()
    }

    function onMouseUp() {
      drag = null
    }

    function onOverlayClick(e) {
      if (e.target === els.overlay) finish(null)
    }

    function finish(result) {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      els.box.removeEventListener('mousedown', onBoxMouseDown)
      els.img.removeEventListener('load', onImageLoad)
      els.overlay.removeEventListener('click', onOverlayClick)
      els.cancelBtn.onclick = null
      els.resetBtn.onclick = null
      els.applyBtn.onclick = null
      els.overlay.hidden = true
      resolve(result)
    }

    els.cancelBtn.onclick = () => finish(null)
    els.resetBtn.onclick = () => resetRect()
    els.applyBtn.onclick = () => {
      const scaleX = els.img.naturalWidth / els.img.clientWidth
      const scaleY = els.img.naturalHeight / els.img.clientHeight
      const sx = rect.x * scaleX
      const sy = rect.y * scaleY
      const sw = rect.w * scaleX
      const sh = rect.h * scaleY

      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(sw))
      canvas.height = Math.max(1, Math.round(sh))
      canvas.getContext('2d').drawImage(els.img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)

      const outputType = mimeType === 'image/png' ? 'image/png' : 'image/jpeg'
      canvas.toBlob((blob) => finish(blob ? { blob } : null), outputType, 0.92)
    }

    els.box.addEventListener('mousedown', onBoxMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    els.overlay.addEventListener('click', onOverlayClick)
    els.img.addEventListener('load', onImageLoad)

    els.img.src = cacheBust(src)
    if (els.img.complete && els.img.naturalWidth) onImageLoad()
  })
}
