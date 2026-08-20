import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve, sep } from 'node:path'

const root = resolve('storybook-static')
const port = Number(process.env.PORT ?? 6007)
const host = process.env.HOST ?? '127.0.0.1'

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
])

async function resolveAsset(urlPath) {
  const cleanPath = normalize(decodeURIComponent(urlPath.split('?')[0] ?? '/')).replace(
    /^(\.\.[/\\])+/,
    ''
  )
  const candidate = resolve(join(root, cleanPath))

  if (candidate !== root && !candidate.startsWith(`${root}${sep}`)) {
    return null
  }

  try {
    const asset = await stat(candidate)
    if (asset.isDirectory()) {
      return join(candidate, 'index.html')
    }

    return candidate
  } catch {
    return join(root, 'index.html')
  }
}

const server = createServer(async (request, response) => {
  const assetPath = await resolveAsset(request.url ?? '/')

  if (!assetPath) {
    response.writeHead(403)
    response.end('Forbidden')
    return
  }

  createReadStream(assetPath)
    .on('error', () => {
      response.writeHead(404)
      response.end('Not found')
    })
    .once('open', () => {
      response.writeHead(200, {
        'Cache-Control': 'no-store',
        'Content-Type': contentTypes.get(extname(assetPath)) ?? 'application/octet-stream',
      })
    })
    .pipe(response)
})

server.listen(port, host, () => {
  console.log(`Serving Storybook from ${root} at http://${host}:${port}`)
})
