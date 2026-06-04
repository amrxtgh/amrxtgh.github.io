export const site = {
  owner: "amrxtgh69",
  repo: "amrxtgh69.github.io",
  branch: "main",
  title: "amrxtgh",
  description: "Entries, posts, and things I find fascinating.",
};

export function editUrl(path: string): string {
  return `https://github.com/${site.owner}/${site.repo}/edit/${site.branch}/${path}`;
}

export function blobUrl(path: string): string {
  return `https://github.com/${site.owner}/${site.repo}/blob/${site.branch}/${path}`;
}
