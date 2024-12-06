import {
  getImagesByType,
  getImageProject,
  getImagesNamesSorted,
  getProjectImagesMap,
  getProjectNames,
} from './utils';
import { imageResponse } from './testData';
import {
  Image,
  ImageType,
  KeyedImages,
  KeyedImageType,
} from '../../context/data/types';
import { HEADLESS, DESKTOP_APP, NOTEBOOK } from '../../context/data/constants';

describe('Image List Processing Functions', () => {
  describe('getImagesByType', () => {
    const result = getImagesByType(imageResponse as Image[]);

    it('excludes headless and desktop-app types', () => {
      expect(result[HEADLESS]).toBeUndefined();
      expect(result[DESKTOP_APP]).toBeUndefined();
    });

    it('correctly groups notebook images by project', () => {
      expect(result[NOTEBOOK]?.canucs).toBeDefined();
      expect(result[NOTEBOOK]?.canucs.length).toBe(6);
      expect(result[NOTEBOOK]?.canucs[0].id).toContain('canucs');
    });

    it('handles invalid input', () => {
      expect(getImagesByType(null)).toEqual({});
      expect(getImagesByType(undefined)).toEqual({});
      expect(getImagesByType([])).toEqual({});
      expect(getImagesByType([{}] as Image[])).toEqual({});
    });
  });

  describe('getImageProject', () => {
    it('extracts project name from image id', () => {
      const image: Image = {
        id: 'images.canfar.net/skaha/carta:4.0',
        digest: '',
        types: [],
      };
      expect(getImageProject(image)).toBe('skaha');
    });

    it('handles various image id formats', () => {
      const testCases: Array<{ id: string; expected: string | undefined }> = [
        { id: 'images.canfar.net/project/name', expected: 'project' },
        { id: 'project/name', expected: 'name' },
        { id: 'single', expected: undefined },
        { id: '', expected: undefined },
      ];

      testCases.forEach(({ id, expected }) => {
        expect(getImageProject({ id, digest: '', types: [] })).toBe(expected);
      });
    });

    it('handles invalid inputs', () => {
      expect(getImageProject(null)).toBeUndefined();
      expect(getImageProject({} as Image)).toBeUndefined();
      expect(getImageProject({ id: null } as unknown as Image)).toBeUndefined();
    });
  });

  describe('getImagesNamesSorted', () => {
    const testImages: Image[] = [
      {
        id: 'images.canfar.net/project/astroflow-gpu-notebook:23.11',
        digest: '',
        types: [],
      },
      {
        id: 'images.canfar.net/project/astroflow-gpu-notebook:latest',
        digest: '',
        types: [],
      },
      {
        id: 'images.canfar.net/project/astroflow-gpu-notebook:24.02',
        digest: '',
        types: [],
      },
      {
        id: 'images.canfar.net/project/beta-notebook:1.0.0',
        digest: '',
        types: [],
      },
      {
        id: 'images.canfar.net/project/alpha-notebook:2.0.0',
        digest: '',
        types: [],
      },
    ];

    it('sorts images alphabetically by name', () => {
      const sorted = getImagesNamesSorted(testImages);
      const imageNames = sorted.map((img) => img.imageName);
      const sortedNames = [...imageNames].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: 'base' }),
      );
      expect(imageNames).toEqual(sortedNames);
    });

    it('sorts versions in reverse order with latest first', () => {
      const sorted = getImagesNamesSorted(testImages);
      const gpuNotebookVersions = sorted
        .filter((img) => img.imageName === 'astroflow-gpu-notebook')
        .map((img) => img.version);

      expect(gpuNotebookVersions).toEqual(['latest', '24.02', '23.11']);
    });

    it('handles invalid input gracefully', () => {
      expect(getImagesNamesSorted(null)).toEqual([]);
      expect(getImagesNamesSorted(undefined)).toEqual([]);
      expect(getImagesNamesSorted([])).toEqual([]);
      const invalidImages: Array<Image | null | undefined> = [null, undefined];
      expect(getImagesNamesSorted(invalidImages as unknown as Image[])).toEqual(
        [],
      );
    });

    it('filters out images without valid id', () => {
      const mixedData: Array<Image | null | undefined | { notId: string }> = [
        { id: 'images.canfar.net/skaha/carta:4.0', digest: '', types: [] },
        { id: '', digest: '', types: [] },
        null,
        undefined,
        { notId: 'something' } as unknown as Image,
        { id: 'invalid/format', digest: '', types: [] },
      ];
      const result = getImagesNamesSorted(mixedData as Image[]);
      expect(result).toHaveLength(1);
      expect(result[0].imageName).toBe('carta');
      expect(result[0].version).toBe('4.0');
    });

    it('preserves original image object properties', () => {
      const imageWithExtra: Image = {
        id: 'images.canfar.net/skaha/carta:4.0',
        types: ['desktop-app' as ImageType],
        digest: 'sha256:123',
      };
      const result = getImagesNamesSorted([imageWithExtra]);
      expect(result[0]).toMatchObject({
        ...imageWithExtra,
        imageName: 'carta',
        version: '4.0',
      });
    });

    it('correctly sorts complex version numbers', () => {
      const versionsTest: Image[] = [
        { id: 'images.canfar.net/project/app:1.10.0', digest: '', types: [] },
        { id: 'images.canfar.net/project/app:1.2.0', digest: '', types: [] },
        { id: 'images.canfar.net/project/app:latest', digest: '', types: [] },
        { id: 'images.canfar.net/project/app:1.1.0', digest: '', types: [] },
      ];
      const sorted = getImagesNamesSorted(versionsTest);
      const versions = sorted.map((img) => img.version);
      expect(versions).toEqual(['latest', '1.10.0', '1.2.0', '1.1.0']);
    });

    it('handles images with same name but different versions', () => {
      const sameNameImages: Image[] = [
        {
          id: 'images.canfar.net/project/notebook:24.03',
          digest: '',
          types: [],
        },
        {
          id: 'images.canfar.net/project/notebook:latest',
          digest: '',
          types: [],
        },
        {
          id: 'images.canfar.net/project/notebook:23.11',
          digest: '',
          types: [],
        },
        {
          id: 'images.canfar.net/project/notebook:24.02',
          digest: '',
          types: [],
        },
      ];

      const result = getImagesNamesSorted(sameNameImages);
      const versions = result.map((img) => img.version);
      expect(versions).toEqual(['latest', '24.03', '24.02', '23.11']);
    });

    it('processes semver-style versions correctly', () => {
      const semverImages: Image[] = [
        { id: 'images.canfar.net/project/tool:2.1.0', digest: '', types: [] },
        { id: 'images.canfar.net/project/tool:2.0.0', digest: '', types: [] },
        { id: 'images.canfar.net/project/tool:2.1.1', digest: '', types: [] },
        { id: 'images.canfar.net/project/tool:latest', digest: '', types: [] },
      ];

      const result = getImagesNamesSorted(semverImages);
      const versions = result.map((img) => img.version);
      expect(versions).toEqual(['latest', '2.1.1', '2.1.0', '2.0.0']);
    });

    it('handles malformed image IDs gracefully', () => {
      const malformedData: Image[] = [
        { id: 'images.canfar.net/project/noversion', digest: '', types: [] },
        { id: 'images.canfar.net/project/:1.0', digest: '', types: [] },
        { id: 'images.canfar.net/project/', digest: '', types: [] },
        { id: 'images.canfar.net///:', digest: '', types: [] },
      ];

      const result = getImagesNamesSorted(malformedData);
      expect(
        result.every((item) => item.imageName && item.version !== undefined),
      ).toBe(true);
    });
  });
});

describe('getProjectImagesMap', () => {
  it('correctly groups and sorts images by project and version', () => {
    const images: Image[] = [
      { id: 'images.canfar.net/skaha/jupyter:2.0', digest: '', types: [] },
      { id: 'images.canfar.net/skaha/jupyter:latest', digest: '', types: [] },
      { id: 'images.canfar.net/skaha/jupyter:1.0', digest: '', types: [] },
      { id: 'images.canfar.net/skaha/notebook:2.0', digest: '', types: [] },
      { id: 'images.canfar.net/canucs/analysis:1.0', digest: '', types: [] },
    ];

    const result = getProjectImagesMap(images);

    expect(Object.keys(result).sort()).toEqual(['canucs', 'skaha']);
    expect(result.skaha).toHaveLength(4);
    expect(result.canucs).toHaveLength(1);

    const jupyterVersions = result.skaha
      .filter((img) => img.imageName === 'jupyter')
      .map((img) => img.version);
    expect(jupyterVersions).toEqual(['latest', '2.0', '1.0']);
  });

  it('sorts images alphabetically within projects', () => {
    const images: Image[] = [
      { id: 'images.canfar.net/skaha/zebra:1.0', digest: '', types: [] },
      { id: 'images.canfar.net/skaha/alpha:1.0', digest: '', types: [] },
      { id: 'images.canfar.net/skaha/beta:latest', digest: '', types: [] },
      { id: 'images.canfar.net/skaha/beta:2.0', digest: '', types: [] },
    ];

    const result = getProjectImagesMap(images);

    const names = result.skaha.map((img) => `${img.imageName}:${img.version}`);
    expect(names).toEqual([
      'alpha:1.0',
      'beta:latest',
      'beta:2.0',
      'zebra:1.0',
    ]);
  });

  it('preserves all original image properties', () => {
    const image: Image = {
      id: 'images.canfar.net/skaha/test:1.0',
      types: [NOTEBOOK],
      digest: 'sha256:123',
    };

    const result = getProjectImagesMap([image]);
    expect(result.skaha[0]).toEqual(
      expect.objectContaining({
        ...image,
        imageName: 'test',
        version: '1.0',
      }),
    );
  });

  it('handles invalid inputs and edge cases', () => {
    expect(getProjectImagesMap(null)).toEqual({});
    expect(getProjectImagesMap(undefined)).toEqual({});
    expect(getProjectImagesMap([])).toEqual({});
    expect(
      getProjectImagesMap([{ title: 'test' }] as unknown as Image[]),
    ).toEqual({});
    expect(
      getProjectImagesMap([{ id: 'invalid' }] as unknown as Image[]),
    ).toEqual({});

    const result = getProjectImagesMap([
      { id: 'images.canfar.net/skaha/test:1.0', digest: '', types: [] },
      null as unknown as Image,
      undefined as unknown as Image,
      { id: '' } as Image,
      { id: 'invalid/format' } as Image,
      { id: 'registry/project/' } as Image,
      { id: 'registry//name:version' } as Image,
    ]);

    expect(result).toEqual({
      skaha: expect.any(Array),
    });

    expect(result.skaha).toHaveLength(1);
    expect(result.skaha[0]).toHaveProperty('imageName', 'test');
    expect(result.skaha[0]).toHaveProperty('version', '1.0');
  });
});

describe('getProjectNames', () => {
  it('returns sorted project names from project map', () => {
    const projectMap: KeyedImages = {
      skaha: [{ id: 'test1', digest: '', types: [] }],
      canucs: [{ id: 'test2', digest: '', types: [] }],
      lsst: [{ id: 'test3', digest: '', types: [] }],
    };

    expect(getProjectNames(projectMap)).toEqual(['canucs', 'lsst', 'skaha']);
  });

  it('handles empty project map', () => {
    expect(getProjectNames({})).toEqual([]);
  });

  it('handles invalid inputs', () => {
    expect(getProjectNames(null)).toEqual([]);
    expect(getProjectNames(undefined)).toEqual([]);
  });
});
