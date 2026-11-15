import { fileStructure } from './fileStructure';

const isDir = (node) => node !== null && typeof node === 'object';

const getNode = (segments) => {
  let node = fileStructure;
  for (const seg of segments) {
    if (!isDir(node) || !(seg in node)) return null;
    node = node[seg];
  }
  return node;
};

export const fileToHash = (filePath) =>
  `#/${filePath.replace(/^\/resources\//, '').replace(/\.md$/, '')}`;

// "#/recipes/chili" -> "/resources/recipes/chili.md"
export const hashToFile = (hash) => {
  const rel = decodeURIComponent(hash.replace(/^#\/?/, ''));
  if (!rel) return null;
  const segments = rel.split('/').filter(Boolean);
  const node = getNode(segments) ?? getNode([...segments.slice(0, -1), `${segments.at(-1)}.md`]);
  return typeof node === 'string' && node.startsWith('/resources/') ? node : null;
};
