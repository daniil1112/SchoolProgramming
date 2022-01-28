<template>
  <div>
    <el-form  ref="dynamicValidateForm" name="dynamicValidateForm" :model="dynamicValidateForm">
      <el-form-item
        prop="title"
        label="Заголовок"
        :rules="[
         {required: true,  message: 'Введите название блока', trigger: 'blur'}
      ]" >
        <el-input v-model="dynamicValidateForm.title" />
      </el-form-item>
      <el-button type="info" @click="save('dynamicValidateForm')">Создать</el-button>
      <div><span>Выберите тесты для блока</span></div>
      <el-input
        v-model="search"
        size="mini"
        placeholder="Type to search"/>
      <el-table
        :data="tests.filter(data => !search|| data.title.toLowerCase().includes(search.toLowerCase()))"
        :default-sort="{prop:'_id', order: 'descending'}"
      >
        <el-table-column
          sortable
          prop="_id"
          label="Id">
<!--          <template slot-scope="scope" >-->
<!--            {{scope.$index+1}}-->
<!--          </template>-->
        </el-table-column>
        <el-table-column
          prop="title"
          label="Название"
        />
        <el-table-column
          fixed="right"
          label="Operations"
          width="120"
        >
          <template slot-scope="scope">

            <el-button
              v-if="!find(scope.row._id)"
              @click="add(scope.row._id)"
              type="success"
              icon="el-icon-plus"
              size="small"
              circle />
            <el-button
              v-else
              @click="unsetid(scope.row._id)"
              type="danger"
              icon="el-icon-minus"
              size="small"
              circle />
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
  import eventsBus from '@/plugins/eventBus'
  export default {
    name: "add",
    data:function () {
      return{
        title: null,
        ids: [],
        dynamicValidateForm: {
          title: ''
        },
        search:null,
      }
    },
    mounted: async function() {
      await this.$store.dispatch('test/allTestes');
    },
    computed:{
      tests(){
        return this.$store.getters['test/tests']
      }
    },
    methods:{
      add(id){
        this.ids.push(id);
      },
      find(id){
        var isFind = false;
        for (var i = 0; i < this.ids.length; i++) {
          if (this.ids[i] === id)  isFind = true;
        }
        return isFind
      },
      unsetid(id)
      {
        for (var i = 0; i < this.ids.length; i++) {
          if (this.ids[i] === id)  this.ids.splice(i,1)
        }
      },
      save(formName)
      {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('groupTests/addTestsGroup',{
              testes: this.ids,
              title: this.dynamicValidateForm.title
            });
          } else {
            eventsBus.$emit('error', 'Ошибка при форматировании группы тестов');
          }
        });

      }
    }
  }
</script>

<style scoped>

</style>
