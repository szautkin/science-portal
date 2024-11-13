import { Image, ImageEx } from '../context/data/types';
import { DESKTOP_APP, HEADLESS } from '../context/data/constants';

export const getImagesByType = (images: Image[]) => {
  return images.reduce(
    (acc, img) => {
      img.types.forEach((bType) => {
        let type = bType;
        if (type === HEADLESS) {
          return acc;
        }
        // desktop-app type is for te desktop running sessions
        if (type === DESKTOP_APP) {
          return acc;
        }

        const imageProject = getImageProject(img);

        if (!acc?.[type]) {
          acc[type] = {};
        }
        if (!acc?.[type]?.[imageProject]) {
          acc[type][imageProject] = [];
        }

        acc[type][imageProject].push(img);
      });
      return acc;
    },
    {} as { [key: string]: { [key: string]: Image[] } },
  );
};

// "images.canfar.net/skaha/carta:4.0"
export const getImageProject = (image: Image): string => {
  return image.id.split('/')?.[1];
};
export const getImagesNamesSorted = (images: Image[]): ImageEx[] => {
  return images
    .map((image) => ({ ...image, imageName: image.id.split('/')?.[2] || '' }))
    .filter(Boolean)
    .sort((a, b) =>
      a.imageName.localeCompare(b.imageName, undefined, {
        sensitivity: 'base',
      }),
    );
};
