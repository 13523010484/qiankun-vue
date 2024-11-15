document.subApps = [
  // {
  //   name: "childApp1",
  //   entry: "//localhost:8088",
  //   container: "#container-sub-app",
  //   activeRule: "/child-app1",
  // },
  // {
  //   name: "subAppReact",
  //   entry: "//localhost:8000",
  //   container: "#container-sub-app",
  //   activeRule: "/sub-app-react",
  // },
  // 部署
  {
    name: 'childApp1',
    entry: '//localhost:8088/child-app1/',
    container: '#container-sub-app',
    activeRule: '/child-app1',
  },
  {
    name: 'subAppReact',
    entry: '//localhost:8000/sub-app-react/',
    container: '#container-sub-app',
    activeRule: '/sub-app-react',
  },
];
