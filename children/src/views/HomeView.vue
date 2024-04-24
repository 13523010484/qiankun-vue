<template>
  <div class="home">
    <el-form
      ref="ruleForm"
      :model="form"
      label-width="80px"
      style="width: 400px"
    >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSubmit('ruleForm')" type="primary">新增</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="todos" style="width: 100%">
      <el-table-column prop="name" label="姓名" width="200"> </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
      <el-table-column prop="date" label="日期" width="200"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="removeTodo(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  },
  data() {
    return {
      form: {
        name: '',
        address: ''
      }
    };
  },
  computed: {
    todos() {
      return this.$store.getters.todos;
    }
  },
  mounted() {
    this.$store.dispatch('tableListApi');
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('addTodo', this.form);
          this.resetForm('ruleForm');
          this.$store.dispatch('tableListApi');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    removeTodo(index, item) {
      console.log('removeTodo item::', item);
      this.$store.dispatch('removeTodo', {
        id: item.id
      });
      this.$store.dispatch('tableListApi');
    }
  }
};
</script>
