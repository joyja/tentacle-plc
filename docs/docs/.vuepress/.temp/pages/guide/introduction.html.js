export const data = {
  "key": "v-1c7b2593",
  "path": "/guide/introduction.html",
  "title": "Introduction",
  "lang": "en-US",
  "frontmatter": {
    "title": "Introduction"
  },
  "excerpt": "",
  "headers": [
    {
      "level": 2,
      "title": "",
      "slug": "",
      "children": []
    }
  ],
  "git": {},
  "filePathRelative": "guide/introduction.md"
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
