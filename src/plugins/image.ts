import { Extension } from '@codemirror/state';
import { hoverTooltip, Tooltip } from '@codemirror/view';
import { imageURLStateField } from '../state/image';

export interface ImagePluginOptions {
    preview?: {
        maxHeight?: number;
        maxWidth?: number;
    };
}

const imagePreviewTooltip = (config?: ImagePluginOptions['preview']) =>
    hoverTooltip((view, pos): Tooltip => {
        const imageInfo = view.state
            .field(imageURLStateField)
            .find((val) => val.from <= pos && pos <= val.to);

        const onTooltipMount = async (
            message: HTMLSpanElement,
            img: HTMLImageElement
        ) => {
            const blob = await fetch(imageInfo.url)
                .then((res) => res.blob())
                .catch(() => {
                    message.textContent = `Error loading image preview; Image description: ${imageInfo.alt}`;
                });
            if (blob) {
                img.src = imageInfo.url;
                img.alt = imageInfo.alt;
                img.addEventListener('load', () => {
                    message.textContent = '';
                });
            }
        };

        return {
            pos,
            above: false,
            create: () => {
                const dom = document.createElement('div');
                const message = document.createElement('span');
                const img = new Image();
                img.style.objectFit = 'contain';
                if (config && config.maxHeight)
                    img.style.maxHeight = `${config.maxHeight}px`;
                if (config && config.maxWidth)
                    img.style.maxWidth = `${config.maxWidth}px`;

                message.textContent = 'Loading...';
                dom.appendChild(message);
                dom.appendChild(img);

                return {
                    dom,
                    mount: () => onTooltipMount(message, img)
                };
            }
        };
    });

export const image = (config?: ImagePluginOptions): Extension => [
    imagePreviewTooltip(config?.preview),
    imageURLStateField
];
