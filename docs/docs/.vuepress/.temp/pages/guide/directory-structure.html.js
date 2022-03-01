export const data = {
  "key": "v-040800dc",
  "path": "/guide/directory-structure.html",
  "title": "Directory Structure",
  "lang": "en-US",
  "frontmatter": {},
  "excerpt": "",
  "headers": [
    {
      "level": 2,
      "title": "The runtime directory",
      "slug": "the-runtime-directory",
      "children": [
        {
          "level": 3,
          "title": "The config.json file",
          "slug": "the-config-json-file",
          "children": []
        },
        {
          "level": 3,
          "title": "The variables.json file",
          "slug": "the-variables-json-file",
          "children": []
        },
        {
          "level": 3,
          "title": "NPM files (package.json, package-lock.json, & node_modules)",
          "slug": "npm-files-package-json-package-lock-json-node-modules",
          "children": []
        }
      ]
    }
  ],
  "git": {
    "updatedTime": null,
    "contributors": []
  },
  "filePathRelative": "guide/directory-structure.md"
}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
