<template>
  <div>
    <mdb-card>
      <mdb-card-title>
        <mdb-container v-if="!loading">
          <el-table v-if="materials || tasks || blocks" :data="tableData">
            <el-table-column prop="_id" label="ID" />
            <el-table-column prop="title" label="Название" />
            <el-table-column>
              <template slot="header" slot-scope="scope">
                <el-select
                    v-model="filterSelect"
                    :disabled="selected !== null"
                    placeholder="Отобразить"
                >
                  <el-option
                      v-for="item in filter"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </template>
              <template v-slot="scope">
                <el-tag :type="getTypeColor(scope)">
                  {{ type(scope) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column>
              <template v-slot="scope">
                <el-button v-if="!selected" @click="select(scope)">
                  Выбрать
                </el-button>
                <el-button v-else @click="deleteSelected">
                  Отменить
                </el-button>
              </template>
            </el-table-column>
          </el-table>

        </mdb-container>

        <div class="ph-item"  v-else>
          <div class="ph-col-12">
            <div class="ph-row">
              <div class="ph-col-12 big"></div>
            </div>
            <div class="ph-picture"></div>
          </div>
        </div>
      </mdb-card-title>
      <mdb-card-body>
        <add-tests
            v-if="selected && blocks.some((e) => e._id === selected._id)"
            @addtest="saveTestInGroup"
        />
        <add-programming
            v-if="selected && tasks.some((e) => e._id === selected._id)"
            @addprogramming="saveProgrammingInGroup"
        />
        <add-material
            v-if="selected && materials.some((e) => e._id === selected._id)"
            @addmaterial="saveMaterialInGroup"
        />
      </mdb-card-body>
    </mdb-card>



  </div>
</template>

<script>
import AddTests from "@/components/groups/addTests"
import AddProgramming from "../../../../../components/groups/addProgramming"
import AddMaterial from "../../../../../components/groups/addMaterial"
export default {
  name: "AddTask",
  middleware: "authTeacher",
  layout: "teacher",
  components: { AddMaterial, AddProgramming, AddTests },
  data() {
    return {
      loading: true,
      materials: null,
      tasks: null,
      blocks: null,
      selected: null,
      search: null,
      filterSelect: 1,
      filter: [
        {
          value: 1,
          label: "Все",
        },
        {
          value: 2,
          label: "Тесты",
        },
        {
          value: 3,
          label: "Програмирование",
        },
        {
          value: 4,
          label: "Материалы",
        },
      ],

      form: {
        title: null,
        start: null,
        end: null,
      },
    }
  },

  computed: {
    tableData() {
      if (!this.selected) {
        if (this.filterSelect === 1) {
          return this.materials.concat(this.tasks, this.blocks)
        } else if (this.filterSelect === 2) {
          return this.blocks
        } else if (this.filterSelect === 3) {
          return this.tasks
        } else {
          return this.materials
        }
      }
      return this.materials
          .concat(this.tasks, this.blocks)
          .filter((e) => e._id === this.selected._id)
    },
  },

  async mounted() {
    await this.loadAllTasks()
    this.loading = false
  },

  methods: {
    async loadAllTasks() {
      const result = await this.$axios.post(
          "/api/teacher/lessons/loadMaterialBlockProgramming"
      )
      if (result.data.materials) {
        this.materials = result.data.materials
      }
      if (result.data.tasks) {
        this.tasks = result.data.tasks
      }
      if (result.data.blocks) {
        this.blocks = result.data.blocks
      }
    },
    type({ row }) {
      if (this.materials.some((element) => element._id === row._id))
        return "Материалы"
      else if (this.tasks.some((element) => element._id === row._id))
        return "Програмирование"
      else if (this.blocks.some((element) => element._id === row._id))
        return "Тесты"
    },
    getTypeColor({ row }) {
      if (this.materials.some((element) => element._id === row._id)) return ""
      else if (this.tasks.some((element) => element._id === row._id))
        return "success"
      else if (this.blocks.some((element) => element._id === row._id))
        return "warning"
    },
    select({ row }) {
      this.selected = row
    },
    deleteSelected() {
      this.selected = null
    },
    async saveTestInGroup(data) {
      const result = await this.$axios.post(
          "/api/teacher/lessons/addTaskToGroup",
          {
            group: this.$route.params.group,
            type: 1,
            task: this.selected._id,
            title: data.title,
            start: data.start,
            end: data.end,
            options: data.options,
          }
      )
      if (result.data.success) {
        this.$notify.success({
          title: "Успех",
          message: "Тесты добавлены к группе",
        })
      } else {
        this.$notify.error({
          title: "Ошибка!",
          message: "Что-то пошло не так",
        })
      }
      console.log(result)
    },
    async saveProgrammingInGroup(data) {
      const result = await this.$axios.post(
          "/api/teacher/lessons/addTaskToGroup",
          {
            group: this.$route.params.group,
            type: 2,
            task: this.selected._id,
            title: data.title,
            start: data.start,
            end: data.end,
            options: data.options,
          }
      )
      if (result.data.success) {
        this.$notify.success({
          title: "Успех",
          message: "Задание по програмированию добавлено к группе",
        })
      } else {
        this.$notify.error({
          title: "Ошибка!",
          message: "Что-то пошло не так",
        })
      }
      console.log(result)
    },
    async saveMaterialInGroup(data) {
      const result = await this.$axios.post(
          "/api/teacher/lessons/addTaskToGroup",
          {
            group: this.$route.params.group,
            type: 3,
            task: this.selected._id,
            title: data.title,
            start: data.start,
            end: data.end,
            options: data.options,
          }
      )
      if (result.data.success) {
        this.$notify.success({
          title: "Успех",
          message: "Материал добавлен к группе",
        })
      } else {
        this.$notify.error({
          title: "Ошибка!",
          message: "Что-то пошло не так",
        })
      }
      console.log(result)
    },
  },
}
</script>

<style scoped></style>
