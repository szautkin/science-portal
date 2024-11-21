import { getImagesByType, getImageProject, getImagesNamesSorted, getProjectImagesMap, getProjectNames } from './utils';
import { imageResponse } from './testData';

describe('Image List Processing Functions', () => {
    describe('getImagesByType', () => {
        const result = getImagesByType(imageResponse);

        test('excludes headless and desktop-app types', () => {
            expect(result.headless).toBeUndefined();
            expect(result['desktop-app']).toBeUndefined();
        });

        test('correctly groups notebook images by project', () => {
            expect(result.notebook.canucs).toBeDefined();
            expect(result.notebook.canucs.length).toBe(6);
            expect(result.notebook.canucs[0].id).toContain('canucs');
        });

        test('handles invalid input', () => {
            expect(getImagesByType(null)).toEqual({});
            expect(getImagesByType(undefined)).toEqual({});
            expect(getImagesByType([])).toEqual({});
            expect(getImagesByType([{}])).toEqual({});
        });
    });

    describe('getImageProject', () => {
        test('extracts project name from image id', () => {
            const image = {
                id: 'images.canfar.net/skaha/carta:4.0'
            };
            expect(getImageProject(image)).toBe('skaha');
        });

        test('handles various image id formats', () => {
            const testCases = [
                { id: 'images.canfar.net/project/name', expected: 'project' },
                { id: 'project/name', expected: 'name' },
                { id: 'single', expected: undefined },
                { id: '', expected: undefined }
            ];

            testCases.forEach(({ id, expected }) => {
                expect(getImageProject({ id })).toBe(expected);
            });
        });

        test('handles invalid inputs', () => {
            expect(getImageProject(null)).toBeUndefined();
            expect(getImageProject({})).toBeUndefined();
            expect(getImageProject({ id: null })).toBeUndefined();
        });
    });

    describe('getImagesNamesSorted', () => {
        test('sorts images by name correctly', () => {
            const sorted = getImagesNamesSorted(imageResponse);
            const firstFew = sorted.slice(0, 3).map(img => img.imageName);
            const sortedCopy = [...firstFew].sort((a, b) =>
                a.localeCompare(b, undefined, { sensitivity: 'base' })
            );
            expect(firstFew).toEqual(sortedCopy);
        });

        test('handles invalid input gracefully', () => {
            expect(getImagesNamesSorted(null)).toEqual([]);
            expect(getImagesNamesSorted([])).toEqual([]);
            expect(getImagesNamesSorted([null, undefined])).toEqual([]);
        });

        test('filters out images without valid id', () => {
            const mixedData = [
                { id: 'images.canfar.net/skaha/carta:4.0' },
                { id: '' },
                null,
                { notId: 'something' }
            ];
            const result = getImagesNamesSorted(mixedData);
            expect(result.length).toBe(1);
            expect(result[0].imageName).toBe('carta:4.0');
        });
    });
});

describe('getProjectImagesMap', () => {
    test('correctly groups notebook images by project', () => {
        const notebookImages = [
            { id: 'images.canfar.net/skaha/jupyter:1.0', name: 'jupyter:1.0' },
            { id: 'images.canfar.net/skaha/notebook:2.0', name: 'notebook:2.0' },
            { id: 'images.canfar.net/canucs/analysis:1.0', name: 'analysis:1.0' }
        ];

        const result = getProjectImagesMap(notebookImages);

        expect(Object.keys(result)).toEqual(['skaha', 'canucs']);
        expect(result.skaha).toHaveLength(2);
        expect(result.canucs).toHaveLength(1);
        expect(result.skaha[0].name).toBe('jupyter:1.0');
    });

    test('sorts images within projects', () => {
        const images = [
            { id: 'images.canfar.net/skaha/b:1.0', name: 'b:1.0' },
            { id: 'images.canfar.net/skaha/a:1.0', name: 'a:1.0' }
        ];

        const result = getProjectImagesMap(images);
        expect(result.skaha[0].name).toBe('a:1.0');
        expect(result.skaha[1].name).toBe('b:1.0');
    });

    test('preserves original image properties', () => {
        const image = {
            id: 'images.canfar.net/skaha/test:1.0',
            name: 'test:1.0',
            types: ['notebook'],
            digest: 'sha256:123'
        };

        const result = getProjectImagesMap([image]);
        expect(result.skaha[0]).toEqual({
            ...image,
            name: 'test:1.0'
        });
    });

    test('handles invalid inputs', () => {
        expect(getProjectImagesMap(null)).toEqual({});
        expect(getProjectImagesMap(undefined)).toEqual({});
        expect(getProjectImagesMap([])).toEqual({});
        expect(getProjectImagesMap([{ name: 'test' }])).toEqual({});
        expect(getProjectImagesMap([{ id: 'invalid' }])).toEqual({});
    });
});

describe('getProjectNames', () => {
    test('returns sorted project names from project map', () => {
        const projectMap = {
            'skaha': [{ name: 'test1' }],
            'canucs': [{ name: 'test2' }],
            'lsst': [{ name: 'test3' }]
        };

        expect(getProjectNames(projectMap)).toEqual(['canucs', 'lsst', 'skaha']);
    });

    test('handles empty project map', () => {
        expect(getProjectNames({})).toEqual([]);
    });

    test('handles invalid inputs', () => {
        expect(getProjectNames(null)).toEqual([]);
        expect(getProjectNames(undefined)).toEqual([]);
    });
});