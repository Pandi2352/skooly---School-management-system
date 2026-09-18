import fs from 'node:fs'
import path from 'node:path'

const API_BASE = 'http://localhost:4000/api'
const BRAIN_DIR = 'C:/Users/Pandiselvam/.gemini/antigravity-ide/brain/fec34783-06d2-4945-a56a-52790f5d92ce'

async function run() {
  console.log('--- 1. Testing GET /api/branding ---')
  const getRes = await fetch(`${API_BASE}/branding`).then((r) => r.json())
  console.log('GET /branding status:', getRes.statusCode, getRes.message)
  console.log('Current displayName:', getRes.data?.displayName)

  console.log('\n--- 2. Testing GET /api/branding/asset-rules ---')
  const rulesRes = await fetch(`${API_BASE}/branding/asset-rules`).then((r) => r.json())
  console.log('GET /branding/asset-rules count:', rulesRes.data?.length)
  const rulesMap = Object.fromEntries(rulesRes.data.map((r) => [r.type, r]))

  console.log('\n--- 3. Testing PATCH /api/branding ---')
  const patchRes = await fetch(`${API_BASE}/branding`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      displayName: 'Skooly International Academy',
      shortName: 'SIA',
      tagline: 'Inspiring excellence, cultivating integrity',
      documentFooter: 'Affiliated to CBSE, New Delhi · Affiliation No. 1930248',
      colorTheme: 'navy',
    }),
  }).then((r) => r.json())
  console.log('PATCH /branding status:', patchRes.statusCode, patchRes.data?.displayName)

  // Find generated images in BRAIN_DIR
  const files = fs.readdirSync(BRAIN_DIR)
  const logoFile = files.find((f) => f.startsWith('school_logo_') && f.endsWith('.jpg'))
  const sealFile = files.find((f) => f.startsWith('school_seal_') && f.endsWith('.jpg'))
  const sigFile = files.find((f) => f.startsWith('principal_signature_') && f.endsWith('.jpg'))
  const bgFile = files.find((f) => f.startsWith('login_campus_bg_') && f.endsWith('.jpg'))

  console.log('\nFound asset files in brain:', { logoFile, sealFile, sigFile, bgFile })

  async function uploadSlot(slot, filename, mimeType = 'image/jpeg') {
    if (!filename) {
      console.log(`Skipping slot ${slot} (file not found)`)
      return
    }
    const filePath = path.join(BRAIN_DIR, filename)
    const buffer = fs.readFileSync(filePath)
    const blob = new Blob([buffer], { type: mimeType })
    const formData = new FormData()
    formData.append('file', blob, filename)

    console.log(`\nUploading ${slot} (${buffer.length} bytes)...`)
    const res = await fetch(`${API_BASE}/branding/assets/${slot}`, {
      method: 'PUT',
      body: formData,
    }).then(async (r) => {
      const json = await r.json()
      return { ok: r.ok, status: r.status, json }
    })
    console.log(`Upload ${slot} result:`, res.status, res.json.message || res.json)
    if (res.ok) {
      const asset = res.json.data?.assets?.[slot]
      console.log(`Asset ${slot} url:`, asset?.url, `size: ${asset?.width}x${asset?.height}`)
    }
    return res
  }

  // Upload logo
  if (logoFile) {
    await uploadSlot('logo', logoFile, 'image/jpeg')
  }

  // Upload seal (PNG)
  const sealPng = 'school_seal.png'
  if (fs.existsSync(path.join(BRAIN_DIR, sealPng))) {
    await uploadSlot('schoolSeal', sealPng, 'image/png')
  }

  // Upload favicon (PNG)
  const favPng = 'school_favicon.png'
  if (fs.existsSync(path.join(BRAIN_DIR, favPng))) {
    await uploadSlot('favicon', favPng, 'image/png')
  }

  // Upload principal signature
  if (sigFile) {
    await uploadSlot('principalSignature', sigFile, 'image/jpeg')
  }

  // Upload login background
  if (bgFile) {
    await uploadSlot('loginBackground', bgFile, 'image/jpeg')
  }

  console.log('\n--- 4. Final GET /api/branding validation ---')
  const finalRes = await fetch(`${API_BASE}/branding`).then((r) => r.json())
  console.log('Final Branding State:')
  console.log('DisplayName:', finalRes.data?.displayName)
  console.log('ShortName:', finalRes.data?.shortName)
  console.log('Tagline:', finalRes.data?.tagline)
  console.log('DocumentFooter:', finalRes.data?.documentFooter)
  console.log('ColorTheme:', finalRes.data?.colorTheme)
  console.log('Assets count with URLs:')
  for (const [key, asset] of Object.entries(finalRes.data?.assets || {})) {
    console.log(`  - ${key}: ${asset ? asset.url : 'null'}`)
  }
}

run().catch(console.error)

