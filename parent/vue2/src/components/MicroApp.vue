<template>
  <div id="container-sub-app"></div>
</template>

<script>
import { loadMicroApp } from "qiankun";
import actions from "../../actions.js";

export default {
  name: "microApp",
  mixins: [actions],
  data() {
    return {
      microApp: null,
    };
  },
  mounted() {
    const getMicroInfo = this.getMicroInfo();
    this.microApp = loadMicroApp(getMicroInfo);
  },
  beforeDestroy() {
    console.log("beforeDestroy...");
    this.microApp.unmount();
  },
  methods: {
    // 手动加载微应用
    getMicroInfo() {
      const appIdentifying = this.$route.path.split("/")[1];
      let data = {};
      const href = window.location.host;
      for (let i = 0; i < document.subApps.length; i++) {
        const element = document.subApps[i];
        if (element.activeRule.includes(appIdentifying)) {
          if (typeof element.entry !== "string") {
            data = {
              ...element,
              entry: element.entry[href]
                ? element.entry[href]
                : Object.values(element.entry)[0],
            };
          } else {
            data = { ...element };
          }
          data.props = {
            token: {
              userInfo: {
                userName: "小明",
                userId: "123",
                date: new Date().toLocaleString(),
              },
            },
          };
          data.activeRule = [appIdentifying];
          break;
        }
      }
      console.log("data::", data);
      return data;
    },
  },
};
</script>
