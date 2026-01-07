import React from 'react';

export default function VideoPlayer({
    kind,
    src,
    poster,
    title,
    height = 540,
    startAtSeconds,
    onProgress,
}: VideoPlayerProps) {
    const videoRef = React.useRef<HTMLVideoElement | null>(null);
    const didSeekRef = React.useRef(false);

    // когда поменялся src или startAtSeconds — попробуем установить время
    React.useEffect(() => {
        if (kind !== 'file') return;
        const v = videoRef.current;
        if (!v) return;

        didSeekRef.current = false; // разрешаем сделать seek заново для нового видео/позиции

        const trySeek = () => {
            if (!videoRef.current) return;
            const vv = videoRef.current;

            const start = Number(startAtSeconds ?? 0);
            if (!Number.isFinite(start) || start <= 0) return;

            // duration может быть NaN пока метаданные не загрузились
            if (!Number.isFinite(vv.duration) || vv.duration <= 0) return;

            const safe = Math.min(Math.max(start, 0), Math.max(vv.duration - 0.5, 0));
            if (didSeekRef.current) return;

            // пробуем установить
            try {
                vv.currentTime = safe;
                // повтор через чуть-чуть (часто помогает)
                setTimeout(() => {
                    if (!videoRef.current) return;
                    if (Math.abs(videoRef.current.currentTime - safe) > 1) {
                        videoRef.current.currentTime = safe;
                    }
                }, 150);
            } catch (e) {
                console.warn('seek failed', e);
            }
            

            didSeekRef.current = true;
        };

        // пробуем сразу и при событиях готовности
        trySeek();
        v.addEventListener('loadedmetadata', trySeek);
        v.addEventListener('loadeddata', trySeek);
        v.addEventListener('canplay', trySeek);

        return () => {
            v.removeEventListener('loadedmetadata', trySeek);
            v.removeEventListener('loadeddata', trySeek);
            v.removeEventListener('canplay', trySeek);
        };
    }, [kind, src, startAtSeconds]);

    return (
        <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto' }}>
            {kind === 'youtube' ? (
                <iframe
                    width="100%"
                    height={height}
                    src={src}
                    title={title || 'Video'}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ borderRadius: '8px' }}
                />
            ) : (
                <video
                    ref={videoRef}
                    width="100%"
                    height={height}
                    controls
                    poster={poster}
                    src={src}
                    style={{ borderRadius: '8px' }}
                    onLoadedMetadata={() => {
                        const v = videoRef.current;
                        if (!v) return;
                        // просто лог для проверки
                        console.log('loadedmetadata duration=', v.duration, 'startAt=', startAtSeconds);
                    }}
                    onTimeUpdate={(e) => {
                        const v = e.currentTarget;
                        onProgress?.({
                            positionSeconds: Math.floor(v.currentTime),
                            durationSeconds: Number.isFinite(v.duration) ? Math.floor(v.duration) : undefined,
                        });
                    }}
                    onPause={(e) => {
                        const v = e.currentTarget;
                        onProgress?.({
                            positionSeconds: Math.floor(v.currentTime),
                            durationSeconds: Number.isFinite(v.duration) ? Math.floor(v.duration) : undefined,
                        });
                    }}
                    onEnded={(e) => {
                        const v = e.currentTarget;
                        onProgress?.({
                            positionSeconds: Math.floor(v.duration || v.currentTime),
                            durationSeconds: Number.isFinite(v.duration) ? Math.floor(v.duration) : undefined,
                            ended: true,
                        });
                    }}
                />
            )}

            {title && <h2 style={{ marginTop: '1rem' }}>{title}</h2>}
        </div>
    );
}
