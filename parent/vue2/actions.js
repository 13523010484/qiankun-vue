import { initGlobalState } from 'qiankun';

// 定义初始全局状态
const initialState = {};

// 初始化全局状态，并获取 actions 对象
const actions = initGlobalState(initialState);

actions.onGlobalStateChange((state, prev) => {
  console.log('主应用: 变更前');
  console.log(prev);
  console.log('主应用: 变更后');
  console.log(state);
});

actions.setGlobalState({
  initialState: '主应用全局变量',
});
actions.offGlobalStateChange();

export default actions;
