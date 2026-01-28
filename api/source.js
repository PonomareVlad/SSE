// noinspection JSUnusedGlobalSymbols

export const config = { runtime: 'edge' }

const headers = {
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
}

export const GET = ({ url }) => {
    const encoder = new TextEncoder()
    const signal = AbortSignal.timeout(180 * 1000)
    const stream = new ReadableStream({
        start: controller => {
            controller.enqueue(encoder.encode('retry: 0\n\n'))
            signal.addEventListener('abort', () => controller.close())
            setInterval(() => {
                const chunk = [
                    `event: refetch\n`,
                    `data: ${Date.now()}\n\n`,
                ].join('')
                controller.enqueue(encoder.encode(chunk))
            }, 5 * 1000)
        },
    })
    return new Response(stream, { headers })
}
