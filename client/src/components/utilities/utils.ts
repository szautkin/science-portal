import {
  Image,
  ImageType,
  KeyedImages,
  KeyedImageType,
  KeyedSortedImages,
  SortedImage,
} from '../../context/data/types';

export const DESKTOP_APP = 'desktop-app';
export const HEADLESS = 'headless';

export const getImagesByType = (
  images?: Array<Image> | null,
): KeyedImageType => {
  if (!images || !Array.isArray(images)) return {};

  return images.reduce((acc, img) => {
    if (!img?.types) return acc;

    img.types.forEach((bType) => {
      let type: ImageType = bType;
      if (type === HEADLESS || type === DESKTOP_APP) {
        return acc;
      }

      const imageProject = getImageProject(img);
      if (!imageProject) return acc;

      if (!acc[type]) {
        acc[type] = {};
      }
      if (!acc[type][imageProject]) {
        acc[type][imageProject] = [];
      }

      acc[type][imageProject].push(img);
    });
    return acc;
  }, {} as KeyedImageType);
};

export const getImageProject = (image?: Image | null): string | undefined => {
  if (!image?.id) return undefined;
  const parts = image.id.split('/');
  return parts?.[1];
};

export const getImageName = (image: Image) => {
  if (!image?.id) return undefined;
  const parts = image.id.split('/');
  return parts?.[2];
};

export const isValidImageId = (id: string) => {
  if (!id || typeof id !== 'string') return false;
  const parts = id.split('/');
  if (parts.length !== 3) return false;
  const [registry, project, imageWithVersion] = parts;
  if (!registry || !project || !imageWithVersion) return false;
  const [imageName, version] = imageWithVersion.split(':');
  return Boolean(imageName && version);
};

export const getImagesNamesSorted = (
  images?: Image[] | null,
): SortedImage[] => {
  if (!Array.isArray(images)) return [];

  return images
    .filter((image) => image?.id)
    .map((image) => {
      const parts = image.id.split('/');
      const imageWithVersion = parts[2] || '';
      const [imageName, version] = imageWithVersion.split(':');

      return {
        ...image,
        name: imageWithVersion,
        imageName,
        version: version || '',
      };
    })
    .filter((image) => image.imageName)
    .sort((a, b) => {
      if (a.imageName === b.imageName) {
        // Handle version comparison for same image names
        if (a.version === 'latest') return -1;
        if (b.version === 'latest') return 1;
        return b.version.localeCompare(a.version, undefined, {
          numeric: true,
          sensitivity: 'base',
        });
      }
      // Sort image names alphabetically
      return a.imageName.localeCompare(b.imageName, undefined, {
        sensitivity: 'base',
      });
    });
};

export const getProjectImagesMap = (
  images?: Image[] | null,
): KeyedSortedImages => {
  if (!Array.isArray(images)) return {};

  // First group images by project
  const projectGroups = images.reduce((acc, image) => {
    if (!image?.id) return acc;

    const projectName = getImageProject(image);
    // Skip invalid project names or malformed IDs
    if (!projectName || !isValidImageId(image.id)) return acc;

    if (!acc[projectName]) {
      acc[projectName] = [];
    }

    acc[projectName].push(image);
    return acc;
  }, {} as KeyedImages);
  const sortedGroups: KeyedSortedImages = {};
  // Then sort images within each project
  Object.keys(projectGroups).forEach((projectName) => {
    sortedGroups[projectName] = getImagesNamesSorted(
      projectGroups[projectName],
    );
  });

  return sortedGroups;
};

export const getProjectNames = (
  keyedProjects: KeyedImages | undefined | null,
) => {
  if (!keyedProjects) return [];
  return Object.keys(keyedProjects).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' }),
  );
};

export default null;
