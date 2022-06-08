import { Extension } from '@codemirror/state';
import { hoverTooltip, Tooltip } from '@codemirror/view';
import { imagePreviewStateField } from '..';
import { imageURLStateField } from '../state/image';

const imageTooltip = hoverTooltip((view, pos): Tooltip => {
    const imageInfo = view.state
        .field(imagePreviewStateField)
        .find((val) => val.from <= pos && pos <= val.to);

    return {
        pos,
        above: false,
        create: () => {
            const dom = document.createElement('div');
            const message = document.createElement('span');
            const img = new Image();

            message.textContent = 'Loading...';
            dom.appendChild(message);
            dom.appendChild(img);

            return {
                dom,
                mount: async () => {
                    const blob = await fetch(imageInfo.url)
                        .then((res) => res.blob())
                        .catch(() => {
                            message.textContent = `Error loading image preview; Image description: ${imageInfo.alt}`;
                        });
                    if (blob) {
                        img.src = URL.createObjectURL(blob);
                        img.addEventListener('load', () => {
                            message.textContent = '';
                        });
                    }
                }
            };
        }
    };
});

export const image = (): Extension => [imageTooltip, imageURLStateField];
