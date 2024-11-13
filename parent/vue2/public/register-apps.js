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
    name: "childApp1",
    entry: "//192.168.18.171:8088/child-app1/",
    container: "#container-sub-app",
    activeRule: "/child-app1",
  },
  {
    name: 'subAppReactTest',
    entry: '//localhost:8002/sub-app-react-test/',
    container: '#container-sub-app',
    activeRule: '/sub-app-react-test',
  },
];
