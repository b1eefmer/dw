import React from 'react';

interface VideoPlayerProps {
    src: string;
    poster?: string;
    title?: string;
}

export default function VideoPlayer({ src, poster, title }: VideoPlayerProps) {
    return (
        <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto' }}>
            <iframe
                width="100%"
                height="540"
                src={src.replace('watch?v=', 'embed/')}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: '8px' }}
            />
            {title && <h2 style={{ marginTop: '1rem' }}>{title}</h2>}
        </div>
    );
}