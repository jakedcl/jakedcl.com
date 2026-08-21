import * as THREE from 'three'
import { resume } from '@/data/resume'
import type { NotebookCoverCopy, NotebookInsideCopy } from '@/data/notebook'

const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif'
const INK = '#1a1a1a'
const MUTED = '#4a4a4a'
const PAPER = '#f6f2e8'
const GRID = '#3d3d3d'

function setFont(ctx: CanvasRenderingContext2D, weight: string, size: number) {
  ctx.font = `${weight} ${size}px ${FONT}`
}

function octagonPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  cut: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + cut, y)
  ctx.lineTo(x + w - cut, y)
  ctx.lineTo(x + w, y + cut)
  ctx.lineTo(x + w, y + h - cut)
  ctx.lineTo(x + w - cut, y + h)
  ctx.lineTo(x + cut, y + h)
  ctx.lineTo(x, y + h - cut)
  ctx.lineTo(x, y + cut)
  ctx.closePath()
}

function labeledRule(
  ctx: CanvasRenderingContext2D,
  label: string,
  value: string,
  x: number,
  baseline: number,
  width: number,
  labelSize: number,
  valueSize: number,
  labelWidth: number,
) {
  setFont(ctx, '700', labelSize)
  ctx.fillStyle = INK
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(label, x, baseline)

  const lineX = x + labelWidth
  const lineY = baseline + labelSize * 0.12
  ctx.strokeStyle = INK
  ctx.lineWidth = Math.max(1.25, labelSize * 0.06)
  ctx.beginPath()
  ctx.moveTo(lineX, lineY)
  ctx.lineTo(x + width, lineY)
  ctx.stroke()

  if (!value) return
  setFont(ctx, '500', valueSize)
  ctx.fillStyle = INK
  const maxW = x + width - lineX - valueSize * 0.4
  let text = value
  if (ctx.measureText(text).width > maxW) {
    while (text.length > 1 && ctx.measureText(`${text}…`).width > maxW) {
      text = text.slice(0, -1)
    }
    text = `${text}…`
  }
  ctx.fillText(text, lineX + valueSize * 0.28, baseline)
}

function makeTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = true
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.needsUpdate = true
  return texture
}

/**
 * Marble JPG as the cover pattern, with a white COMPOSITION label drawn over
 * the baked-in handwriting so CMS copy can change without Photoshop.
 */
export function drawCompositionCover(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  marble: CanvasImageSource,
  copy: NotebookCoverCopy,
) {
  ctx.drawImage(marble, 0, 0, width, height)

  const labelW = width * 0.64
  const labelH = height * 0.375
  const labelX = (width - labelW) / 2
  const labelY = height * 0.155
  const cut = Math.min(labelW, labelH) * 0.085

  octagonPath(ctx, labelX, labelY, labelW, labelH, cut)
  ctx.fillStyle = '#fbfbfb'
  ctx.fill()

  ctx.strokeStyle = INK
  ctx.lineWidth = Math.max(2, width * 0.0034)
  ctx.stroke()
  ctx.save()
  ctx.beginPath()
  octagonPath(
    ctx,
    labelX + labelW * 0.018,
    labelY + labelH * 0.03,
    labelW * 0.964,
    labelH * 0.94,
    cut * 0.82,
  )
  ctx.lineWidth = Math.max(1.25, width * 0.0022)
  ctx.stroke()
  ctx.restore()

  const innerX = labelX + labelW * 0.08
  const innerW = labelW * 0.84
  let y = labelY + labelH * 0.2

  setFont(ctx, '700', labelH * 0.118)
  ctx.fillStyle = INK
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('COMPOSITION', labelX + labelW / 2, y)

  y = labelY + labelH * 0.36
  const labelSize = labelH * 0.055
  const valueSize = labelH * 0.072
  const gap = labelH * 0.145
  const labelCol = labelW * 0.22
  ctx.textAlign = 'left'

  labeledRule(ctx, 'NAME', copy.name, innerX, y, innerW, labelSize, valueSize, labelCol)
  y += gap
  labeledRule(ctx, 'SUBJECT', copy.subject, innerX, y, innerW, labelSize, valueSize, labelCol)
  y += gap
  labeledRule(ctx, 'E-MAIL', copy.email, innerX, y, innerW, labelSize, valueSize, labelCol)

  setFont(ctx, '400', labelH * 0.038)
  ctx.fillStyle = MUTED
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(
    '100 Sheets (200 Pages)  /  9¾ × 7½ in.',
    labelX + labelW / 2,
    labelY + labelH * 0.92,
  )
}

const BLANK_INSIDE: NotebookInsideCopy = {
  name: '',
  address: '',
  school: '',
  class: '',
}

/**
 * Classic US composition-book CLASS PROGRAM schedule (inside cover).
 * Pass blank copy for decorative empty lines/grid — do not auto-fill from CMS.
 */
export function drawClassProgram(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  copy: NotebookInsideCopy = BLANK_INSIDE,
) {
  ctx.fillStyle = PAPER
  ctx.fillRect(0, 0, width, height)

  const margin = width * 0.055
  const innerX = margin
  const innerY = height * 0.045
  const innerW = width - margin * 2
  const innerH = height - innerY - height * 0.05

  ctx.strokeStyle = INK
  ctx.lineWidth = Math.max(2, width * 0.003)
  ctx.strokeRect(innerX, innerY, innerW, innerH)
  ctx.lineWidth = Math.max(1, width * 0.0016)
  ctx.strokeRect(
    innerX + width * 0.008,
    innerY + width * 0.008,
    innerW - width * 0.016,
    innerH - width * 0.016,
  )

  const padX = innerX + innerW * 0.055
  const contentW = innerW * 0.89
  let y = innerY + innerH * 0.07

  setFont(ctx, '700', width * 0.048)
  ctx.fillStyle = INK
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('CLASS PROGRAM', width / 2, y)

  y += height * 0.052
  const labelSize = width * 0.02
  const valueSize = width * 0.024
  const lineGap = height * 0.034
  const labelCol = contentW * 0.2
  ctx.textAlign = 'left'

  labeledRule(ctx, 'NAME', copy.name, padX, y, contentW, labelSize, valueSize, labelCol)
  y += lineGap
  labeledRule(ctx, 'ADDRESS', copy.address, padX, y, contentW, labelSize, valueSize, labelCol)
  y += lineGap
  labeledRule(ctx, 'SCHOOL', copy.school, padX, y, contentW, labelSize, valueSize, labelCol)
  y += lineGap
  labeledRule(ctx, 'CLASS', copy.class, padX, y, contentW, labelSize, valueSize, labelCol)

  y += height * 0.032
  const gridX = padX
  const gridW = contentW
  const footerBand = height * 0.048
  const footerY = innerY + innerH - footerBand
  const gridH = footerY - y - height * 0.012
  // Header (TIME + days) + PERIOD 1–8 + SUBJECT / ROOM / INSTRUCTOR
  const rows = 12
  const periodW = gridW * 0.22
  const dayW = (gridW - periodW) / 6
  const rowH = gridH / rows
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const leftLabels = [
    'TIME',
    'PERIOD 1',
    'PERIOD 2',
    'PERIOD 3',
    'PERIOD 4',
    'PERIOD 5',
    'PERIOD 6',
    'PERIOD 7',
    'PERIOD 8',
    'SUBJECT',
    'ROOM',
    'INSTRUCTOR',
  ]

  ctx.strokeStyle = GRID
  ctx.lineWidth = Math.max(1, width * 0.0018)

  for (let r = 0; r <= rows; r++) {
    const gy = y + r * rowH
    ctx.beginPath()
    ctx.moveTo(gridX, gy)
    ctx.lineTo(gridX + gridW, gy)
    ctx.stroke()
  }
  ctx.beginPath()
  ctx.moveTo(gridX, y)
  ctx.lineTo(gridX, y + gridH)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(gridX + periodW, y)
  ctx.lineTo(gridX + periodW, y + gridH)
  ctx.stroke()
  for (let c = 1; c <= 6; c++) {
    const gx = gridX + periodW + c * dayW
    ctx.beginPath()
    ctx.moveTo(gx, y)
    ctx.lineTo(gx, y + gridH)
    ctx.stroke()
  }

  ctx.fillStyle = INK
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  setFont(ctx, '700', Math.min(rowH * 0.42, width * 0.015))
  ctx.fillText(leftLabels[0], gridX + periodW / 2, y + rowH / 2)

  // Day headers rotated like a classic composition book.
  const dayFont = Math.min(dayW * 0.42, width * 0.014)
  setFont(ctx, '700', dayFont)
  days.forEach((day, i) => {
    const cx = gridX + periodW + i * dayW + dayW / 2
    const cy = y + rowH / 2
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText(day, 0, 0)
    ctx.restore()
  })

  setFont(ctx, '600', Math.min(rowH * 0.36, width * 0.0135))
  for (let r = 1; r < rows; r++) {
    ctx.fillText(leftLabels[r], gridX + periodW / 2, y + rowH * (r + 0.5))
  }

  const footY = innerY + innerH - height * 0.02
  setFont(ctx, '400', width * 0.014)
  ctx.fillStyle = MUTED
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'left'
  ctx.fillText('9¾ in. x 7½ in.', padX, footY)
  ctx.textAlign = 'right'
  ctx.fillText('MADE IN U.S.A.', padX + contentW, footY)
}

export function createCoverTexture(
  marble: CanvasImageSource,
  copy: NotebookCoverCopy,
  width: number,
  height: number,
) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not create 2D context for notebook cover')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  drawCompositionCover(ctx, width, height, marble, copy)
  return makeTexture(canvas)
}

export function createInsideCoverTexture(
  width: number,
  height: number,
  copy: NotebookInsideCopy = BLANK_INSIDE,
) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not create 2D context for inside cover')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  drawClassProgram(ctx, width, height, copy)
  return makeTexture(canvas)
}

function wrapCanvasText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (current && ctx.measureText(next).width > maxWidth) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }
  if (current) lines.push(current)
  return lines
}

function paintPaperGrain(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Sparse soft flecks — reads as paper tooth on the mesh without a second texture load.
  const flecks = Math.floor((width * height) / 1800)
  for (let i = 0; i < flecks; i++) {
    const x = (i * 127 + 41) % width
    const y = (i * 311 + 17) % height
    const a = 0.02 + ((i * 17) % 7) * 0.005
    ctx.fillStyle = i % 3 === 0 ? `rgba(80,70,55,${a})` : `rgba(255,252,245,${a * 1.35})`
    ctx.fillRect(x, y, 1 + (i % 2), 1 + ((i * 3) % 2))
  }
}

function fillTrackedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  tracking: number,
) {
  if (tracking <= 0) {
    ctx.fillText(text, x, y)
    return
  }
  let cursor = x
  for (const ch of text) {
    ctx.fillText(ch, cursor, y)
    cursor += ctx.measureText(ch).width + tracking
  }
}

/**
 * Ruled composition-notebook page with resume copy on the blue rules.
 * Bound to the cloth spine in 3D (not binder paper) — no punch holes.
 *
 * Design space matches the CSS sheet (400×560, 28px rules). Type sits in the
 * ruling band with the alphabetic baseline just above each blue rule.
 */
export function drawCompositionPageResume(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const designLine = 28
  const designWidth = 400
  const scaledLine = designLine * (width / designWidth)
  // Cap row height so the full resume fits on the mesh (no HTML scroll).
  // /42: ~4 blank header rows + 2-row name + wraps/gaps without clipping education.
  const line = Math.max(1, Math.round(Math.min(scaledLine, height / 42)))
  const margin = Math.round(width * (40 / 400))
  const textX = margin + Math.round(width * (12 / 400))
  const maxWidth = width - textX - Math.round(width * (20 / 400))
  const fontScale = line / designLine
  // ~2× ruled line height so the name spans two rule rows.
  const nameSize = line * 2
  const bodySize = 12.5 * fontScale
  const mutedSize = 11.5 * fontScale
  // Sit glyphs in the band above the rule (classic lined-paper writing).
  const baselineLift = line * 0.2
  const ink = '#171717'
  const muted = '#525252'
  const soft = '#8a8a8a'
  const ruleBlue = '#b7c9de'
  const marginRed = '#d27c7c'

  ctx.fillStyle = '#f3eee2'
  ctx.fillRect(0, 0, width, height)
  paintPaperGrain(ctx, width, height)

  // Classic looseleaf header: ~4 blank lines above the name — no blue rules there.
  const nameRow = 5
  ctx.strokeStyle = ruleBlue
  ctx.lineWidth = Math.max(1, fontScale * 0.85)
  for (let y = nameRow * line; y < height; y += line) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }

  ctx.strokeStyle = marginRed
  ctx.lineWidth = Math.max(2, width * 0.0022)
  ctx.beginPath()
  ctx.moveTo(margin, 0)
  ctx.lineTo(margin, height)
  ctx.stroke()

  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'

  let row = nameRow + 1
  const remaining = () => row * line <= height - line
  const baselineY = () => row * line - baselineLift

  const write = (
    text: string,
    weight: string,
    size: number,
    color = ink,
    tracking = 0,
  ) => {
    if (!remaining()) return
    setFont(ctx, weight, size)
    ctx.fillStyle = color
    for (const piece of wrapCanvasText(ctx, text, maxWidth)) {
      if (!remaining()) return
      fillTrackedText(ctx, piece, textX, baselineY(), tracking)
      row += 1
    }
  }

  const writeLabeled = (label: string, rest: string, size: number) => {
    if (!remaining()) return
    setFont(ctx, '600', size)
    ctx.fillStyle = ink
    const labelText = `${label}:  `
    const labelW = ctx.measureText(labelText).width
    ctx.fillText(labelText, textX, baselineY())
    setFont(ctx, '400', size)
    const pieces = wrapCanvasText(ctx, rest, Math.max(8, maxWidth - labelW))
    if (pieces.length === 0) {
      row += 1
      return
    }
    ctx.fillText(pieces[0], textX + labelW, baselineY())
    row += 1
    for (const piece of pieces.slice(1)) {
      if (!remaining()) return
      setFont(ctx, '400', size)
      ctx.fillStyle = ink
      ctx.fillText(piece, textX, baselineY())
      row += 1
    }
  }

  // Tall name: baseline on the lower of its two rule rows so glyphs fill both;
  // write() advances past that row so contact starts clear of the name.
  write(resume.legalName, '500', nameSize)

  // Contact with softer separators (matches /resume paper styling).
  if (remaining()) {
    setFont(ctx, '400', mutedSize)
    let cursor = textX
    resume.contact.forEach((link, index) => {
      if (index > 0) {
        ctx.fillStyle = soft
        const sep = '  |  '
        ctx.fillText(sep, cursor, baselineY())
        cursor += ctx.measureText(sep).width
      }
      ctx.fillStyle = muted
      ctx.fillText(link.label, cursor, baselineY())
      cursor += ctx.measureText(link.label).width
    })
    row += 1
  }

  write(resume.summary, '400', bodySize)
  row += 1
  // ~0.06em tracking on section titles, like the CSS lined sheet.
  write('TECHNICAL SKILLS', '700', bodySize, ink, bodySize * 0.06)
  for (const group of resume.skills) {
    writeLabeled(group.label, group.items.join(', '), bodySize)
  }
  write('EXPERIENCE', '700', bodySize, ink, bodySize * 0.06)
  for (const role of resume.experience) {
    const head = role.period ? `${role.title}  ·  ${role.period}` : role.title
    write(head, '600', bodySize)
    write(role.organization, '400', mutedSize, muted)
    for (const bullet of role.bullets) {
      write(`•  ${bullet}`, '400', bodySize)
    }
  }
  row += 1
  write('EDUCATION', '700', bodySize, ink, bodySize * 0.06)
  for (const role of resume.education) {
    write(role.title, '600', bodySize)
    const school = role.period ? `${role.organization}  ·  ${role.period}` : role.organization
    write(school, '400', mutedSize, muted)
  }
}

export function createCompositionPageResumeTexture(width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not create 2D context for composition page resume')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  drawCompositionPageResume(ctx, width, height)
  return makeTexture(canvas)
}
