import React, { useState, useRef } from 'react'
import './Palette.sass'

const MAX_PALETTE_BOXES = 32

const randomHex = () => {
  let hex = Math.floor(Math.random() * 0xffffff).toString(16)
  return `#${hex.padStart(6, '0')}`
}

const generateColors = () => Array.from({ length: MAX_PALETTE_BOXES }, () => randomHex())

export default function Palette() {
  const [colors, setColors] = useState(() => generateColors())
  const [copiedIndex, setCopiedIndex] = useState(null)
  const timeoutRef = useRef(null)

  const refresh = () => setColors(generateColors())

  const copyToClipboard = async (hex, index) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(hex)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = hex
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'absolute'
        textarea.style.left = '-9999px'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }

      setCopiedIndex(index)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setCopiedIndex(null), 1000)
    } catch (err) {
      alert('Failed to copy the color code!')
    }
  }

  return (
    <div>
      <ul className="container">
        {colors.map((hex, i) => (
          <li key={i} className="color" onClick={() => copyToClipboard(hex, i)}>
            <div className="rect-box" style={{ background: hex }} />
            <span className="hex-value">{copiedIndex === i ? 'Copied' : hex}</span>
          </li>
        ))}
      </ul>
      <button className="refresh-btn" onClick={refresh}>Refresh Palette</button>
    </div>
  )
}
