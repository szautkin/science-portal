const DESKTOP_APP = 'desktop-app';
const HEADLESS = 'headless';

const getImagesByType = (images) => {
    if (!Array.isArray(images)) return {};

    return images.reduce((acc, img) => {
        if (!img?.types) return acc;

        img.types.forEach((bType) => {
            let type = bType;
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
    }, {});
};

const getImageProject = (image) => {
    if (!image?.id) return undefined;
    const parts = image.id.split('/');
    return parts?.[1];
};

const getImageName = (image) => {
    if (!image?.id) return undefined;
    const parts = image.id.split('/');
    return parts?.[2];
};

const getImagesNamesSorted = (images) => {
    if (!Array.isArray(images)) return [];

    return images
        .filter(image => image?.id)
        .map(image => ({
            ...image,
            imageName: image.id.split('/')?.[2] || ''
        }))
        .filter(image => image.imageName)
        .sort((a, b) =>
            a.imageName.localeCompare(b.imageName, undefined, {
                sensitivity: 'base',
            })
        );
};

const getProjectImagesMap = (images) => {
    if (!Array.isArray(images)) return {};

    return images.reduce((acc, image) => {
        if (!image?.id) return acc;

        const projectName = getImageProject(image);
        if (!projectName) return acc;

        if (!acc[projectName]) {
            acc[projectName] = [];
        }

        const imageName = getImageName(image)
        acc[projectName].push({
           ...image,
            name: imageName,
        });

        acc[projectName].sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        );

        return acc;
    }, {});
};

const getProjectNames = (keyedProjects) => {
    if (!keyedProjects) return []
    return Object.keys(keyedProjects).sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: 'base' })
    );
};

module.exports = {
    getImagesByType,
    getImageProject,
    getImagesNamesSorted,
    getProjectImagesMap,
    getProjectNames
};