import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

export function ImageFallback({
    src,
    fallbackSrc = '/logo.png',
    alt,
    ...props
}: ImageProps & { fallbackSrc?: string }) {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <Image
            {...props}
            src={imgSrc}
            alt={alt}
            onError={() => {
                setImgSrc(fallbackSrc);
            }}
        />
    );
}
