export const data = {
  "key": "v-ec14f14a",
  "path": "/guide/README%20copy.html",
  "title": "Introduction",
  "lang": "en-US",
  "frontmatter": {
    "title": "Introduction"
  },
  "excerpt": "",
  "headers": [
    {
      "level": 2,
      "title": "somthing",
      "slug": "somthing",
      "children": []
    }
  ],
  "git": {},
  "filePathRelative": "guide/README copy.md"
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
