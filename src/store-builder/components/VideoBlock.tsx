import { memo } from 'react'
import { useNode } from '@craftjs/core'

interface VideoBlockProps {
  url?: string
  width?: string
  aspectRatio?: string
}

const ALLOWED_HOSTS = ['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com', 'player.vimeo.com']

/** Returns true only for YouTube and Vimeo embed URLs. */
function isAllowedVideoUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ALLOWED_HOSTS.includes(parsed.hostname)
  } catch {
    return false
  }
}

/** Embedded video block that supports YouTube and Vimeo URLs. */
export const VideoBlock = memo(function VideoBlock({
  url = 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  width = '100%',
  aspectRatio = '16/9',
}: VideoBlockProps) {
  const { connectors: { connect, drag }, isActive } = useNode((node) => ({
    isActive: node.events.selected,
  }))

  const safe = isAllowedVideoUrl(url)

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)) }}
      className={`cursor-move ${isActive ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
    >
      <div style={{ width, aspectRatio }} className="bg-gray-100 rounded-lg overflow-hidden">
        {safe ? (
          <iframe
            src={url}
            title="Embedded video"
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Invalid video URL — only YouTube and Vimeo embeds are allowed.
          </div>
        )}
      </div>
    </div>
  )
})

;(VideoBlock as unknown as { craft: object }).craft = {
  displayName: 'Video',
  props: { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', width: '100%', aspectRatio: '16/9' },
}
