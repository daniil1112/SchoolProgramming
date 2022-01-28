<template>
    <div>
      <div class="input-group">
        <label>
          <input v-model="title" type="text" placeholder="Названия блока" class="form-control">
        </label>
      </div>

      <div class="start-time">
        <span class="demonstration">date</span>
        <el-date-picker
          v-model="openingTime"
          type="datetime"
          value-format="timestamp"
          placeholder="Select date and time">
        </el-date-picker>
      </div>
      <div>
        <span>класс:</span>
        <el-select v-model="group" clearable placeholder="">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      {{openingTime}}
      {{group}}
    </div>
</template>

<script>
    export default {
        name: "new",
        data:function () {
          return{
            group:null,
            title:null,
            tests:[],
            abstract:null,
            openingTime:null,
            closingTime:null,
            options:[{
              value: '1',
              label: 'Option1'
            }, {
              value: '2',
              label: 'Option2'
            }, {
              value: '3',
              label: 'Option3'
            }, {
              value: '4',
              label: 'Option4'
            }, {
              value: '5',
              label: 'Option5'
            }],
            group:null,
          }
        }
    }
</script>

<style scoped>

</style>
