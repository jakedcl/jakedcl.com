import * as THREE from 'three'
import { resume } from '@/data/resume'

const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif'
const CREAM = '#f4efe3'
const INK = '#1a1a1a'
const MUTED = '#5c5c5c'
const RULE = '#c5d4e6'
const MARGIN_RED = '#d98989'

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (ctx.measureText(next).width <= maxWidth) {
      current = next
    } else {
      if (current) lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines
}

function drawLinedBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  redX: number,
  ruleGap: number,
) {
  ctx.fillStyle = CREAM
  ctx.fillRect(0, 0, width, height)

  ctx.strokeStyle = RULE
  ctx.lineWidth = 1.25
  for (let y = ruleGap * 0.85; y < height - 8; y += ruleGap) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }

  ctx.strokeStyle = MARGIN_RED
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(redX, 0)
  ctx.lineTo(redX, height)
  ctx.stroke()
}

function setFont(
  ctx: CanvasRenderingContext2D,
  weight: string,
  size: number,
) {
  ctx.font = `${weight} ${size}px ${FONT}`
}

/**
 * Lined composition-book page with the resume typeset in Helvetica.
 * Drawn once and used as the PAGE mesh albedo so the cover can occlude it in 3D.
 */
export function drawResumePage(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const padL = width * 0.118
  const padR = width * 0.07
  const padT = height * 0.055
  const redX = width * 0.082
  const inner = width - padL - padR
  const ruleGap = height * 0.0285

  const nameSize = width * 0.0255
  const contactSize = width * 0.0166
  const bodySize = width * 0.0184
  const headingSize = width * 0.0156
  const metaSize = width * 0.0162
  const nameH = nameSize * 1.22
  const contactH = contactSize * 1.45
  const bodyH = bodySize * 1.38
  const headingH = headingSize * 1.7
  const roleGap = bodySize * 0.95
  const sectionGap = bodySize * 1.15
  const bulletIndent = bodySize * 1.15

  drawLinedBackground(ctx, width, height, redX, ruleGap)

  ctx.textBaseline = 'top'
  ctx.fillStyle = INK
  let y = padT

  const fillWrapped = (
    text: string,
    size: number,
    lineH: number,
    color: string,
    weight = '400',
    maxWidth = inner,
    x = padL,
  ) => {
    setFont(ctx, weight, size)
    ctx.fillStyle = color
    const lines = wrapText(ctx, text, maxWidth)
    for (const line of lines) {
      ctx.fillText(line, x, y)
      y += lineH
    }
    return lines.length
  }

  const underlineAt = (x: number, textWidth: number, size: number) => {
    ctx.strokeStyle = INK
    ctx.lineWidth = Math.max(1, size * 0.06)
    ctx.beginPath()
    ctx.moveTo(x, y + size * 1.05)
    ctx.lineTo(x + textWidth, y + size * 1.05)
    ctx.stroke()
  }

  setFont(ctx, '500', nameSize)
  ctx.fillStyle = INK
  ctx.fillText(resume.legalName, padL, y)
  y += nameH + bodySize * 0.15

  setFont(ctx, '400', contactSize)
  const contactParts = resume.contact.map((link) => link.label)
  let cx = padL
  contactParts.forEach((label, index) => {
    if (index > 0) {
      ctx.fillStyle = '#b0b0b0'
      const sep = '  |  '
      ctx.fillText(sep, cx, y)
      cx += ctx.measureText(sep).width
    }
    ctx.fillStyle = MUTED
    ctx.fillText(label, cx, y)
    const w = ctx.measureText(label).width
    if (resume.contact[index]?.href) underlineAt(cx, w, contactSize)
    cx += w
  })
  y += contactH

  fillWrapped(resume.summary, bodySize, bodyH, INK)
  y += sectionGap * 0.35

  const heading = (label: string) => {
    y += sectionGap * 0.15
    setFont(ctx, '700', headingSize)
    ctx.fillStyle = INK
    ctx.fillText(label, padL, y)
    const underlineY = y + headingSize * 1.18
    ctx.strokeStyle = '#c8c8c8'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(padL, underlineY)
    ctx.lineTo(padL + inner, underlineY)
    ctx.stroke()
    y += headingH
  }

  heading('TECHNICAL SKILLS')
  for (const group of resume.skills) {
    fillWrapped(group.label, bodySize, bodyH, INK, '600')
    y += bodySize * 0.08
    fillWrapped(group.items.join(', '), bodySize, bodyH, INK)
    y += roleGap * 0.45
  }

  heading('EXPERIENCE')
  for (const role of resume.experience) {
    setFont(ctx, '600', bodySize)
    ctx.fillStyle = INK
    const period = role.period
    setFont(ctx, '400', metaSize)
    const periodW = period ? ctx.measureText(period).width : 0
    const titleMax = inner - (periodW ? periodW + bodySize * 0.8 : 0)

    setFont(ctx, '600', bodySize)
    const titleLines = wrapText(ctx, role.title, titleMax)
    titleLines.forEach((line, i) => {
      ctx.fillStyle = INK
      ctx.fillText(line, padL, y)
      if (i === 0 && period) {
        setFont(ctx, '400', metaSize)
        ctx.fillStyle = MUTED
        ctx.fillText(period, padL + inner - periodW, y + (bodySize - metaSize) * 0.15)
        setFont(ctx, '600', bodySize)
      }
      y += bodyH
    })

    fillWrapped(role.organization, metaSize, metaSize * 1.32, MUTED)
    y += bodySize * 0.12

    for (const bullet of role.bullets) {
      setFont(ctx, '400', bodySize)
      ctx.fillStyle = INK
      ctx.fillText('•', padL, y)
      fillWrapped(bullet, bodySize, bodyH, INK, '400', inner - bulletIndent, padL + bulletIndent)
      y += bodySize * 0.08
    }
    y += roleGap
  }

  setFont(ctx, '400', bodySize)
  ctx.fillStyle = MUTED
  const pdfLabel = 'Download Resume PDF'
  ctx.fillText(pdfLabel, padL, y)
  underlineAt(padL, ctx.measureText(pdfLabel).width, bodySize)
  y += bodyH + sectionGap * 0.25

  heading('EDUCATION')
  for (const role of resume.education) {
    setFont(ctx, '400', metaSize)
    const periodW = role.period ? ctx.measureText(role.period).width : 0
    setFont(ctx, '600', bodySize)
    ctx.fillStyle = INK
    const titleLines = wrapText(ctx, role.title, inner - (periodW ? periodW + bodySize * 0.8 : 0))
    titleLines.forEach((line, i) => {
      ctx.fillText(line, padL, y)
      if (i === 0 && role.period) {
        setFont(ctx, '400', metaSize)
        ctx.fillStyle = MUTED
        ctx.fillText(role.period, padL + inner - periodW, y + (bodySize - metaSize) * 0.15)
        setFont(ctx, '600', bodySize)
        ctx.fillStyle = INK
      }
      y += bodyH
    })
    fillWrapped(role.organization, metaSize, metaSize * 1.32, MUTED)
  }
}

export function createResumePageTexture(width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Could not create 2D context for resume page texture')
  }
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  drawResumePage(ctx, width, height)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = true
  texture.needsUpdate = true
  return texture
}
