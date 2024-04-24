// store/modules/home.js
import { tableListApi, tableSaveApi, tableDelApi } from '@/api/home';

export default {
  state: {
    todos: []
  },
  mutations: {
    SET_TODO(state, todo) {
      state.todos = todo;
    },
    ADD_TODO(state, todo) {
      state.todos.push(todo);
    },
    REMOVE_TODO(state, index) {
      state.todos.splice(index, 1);
    }
  },
  actions: {
    async tableListApi({ commit }) {
      try {
        const response = await tableListApi();
        commit('SET_TODO', response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    },
    async addTodo({ commit }, todo) {
      try {
        const response = await tableSaveApi(todo);
        commit('ADD_TODO', response.data);
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    },
    async removeTodo({ commit }, params) {
      console.log('removeTodo params::', params);
      try {
        const response = await tableDelApi(params);
        console.log('removeTodo response::', response);
        commit('REMOVE_TODO', index);
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  },
  getters: {
    todos: (state) => state.todos
  }
};
