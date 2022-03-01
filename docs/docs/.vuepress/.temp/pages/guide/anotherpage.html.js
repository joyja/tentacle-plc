export const data = {
  "key": "v-9d5ba61a",
  "path": "/guide/anotherpage.html",
  "title": "More",
  "lang": "en-US",
  "frontmatter": {
    "title": "More"
  },
  "excerpt": "",
  "headers": [],
  "git": {},
  "filePathRelative": "guide/anotherpage.md"
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
