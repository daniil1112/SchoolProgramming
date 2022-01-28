<template>
  <div>
    <b-input-group v-if="visibleButton">
      <b-button variant="primary" v-if="!visibleAttemps" @click="togglevisibleAttemps"> <b-icon-arrow-down/>Показать попытки </b-button>
      <b-button variant="primary" v-else @click="togglevisibleAttemps"><b-icon-arrow-up/>Скрыть попытки</b-button>
    </b-input-group>
    <el-table
      v-show="attemps && (visibleAttemps || !visibleButton ) && attemps !== [] && attemps !== {}"
      :data="attemps"
      :default-sort="{ prop: '_id', order: 'descending' }"
      :row-class-name="tableRowClassName"
    >
      <el-table-column prop="_id" label="Id" />
      <el-table-column label="status">
        <template slot-scope="scope">
          <i :class="statusBar(scope)" class="font-size-30 icon-status" />
        </template>
      </el-table-column>
      <el-table-column label="programLang">
        <template slot-scope="scope">
          <span v-if="scope.row.programLang === 1">PascalABCNet</span>
          <span v-else-if="scope.row.programLang === 2">Python 3</span>
        </template>
      </el-table-column>
      <el-table-column label="ErrorTest" v-if="visibleErrorTest">
        <template v-if="scope.row.verdict" slot-scope="scope">
          <span
            v-if="scope.row.verdict.errors"
            v-html="scope.row.verdict.firstErrorTest"
          />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="CompilerVerdict">
        <template v-if="scope.row.verdict" slot-scope="scope">
          <span
            v-if="scope.row.verdict.errors"
            v-html="scope.row.verdict.firstErrorType"
          />
          <span v-else-if="!scope.row.verdict.compilation">CE</span>
          <span v-else-if="scope.row.verdict.maxPoints === 0">UE</span>
          <span v-else>OK</span>
        </template>
      </el-table-column>
      <el-table-column label="verdict" v-if="visibleVerdict">
        <template v-if="scope.row.verdict" slot-scope="scope">
          <el-button
            v-if="scope.row.verdict"
            type="text"
            @click="toVerdict(scope)"
          >
            <i class="el-icon-s-order icon-status font-size-30" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "AttempsTable",
  props:{
    attemps:{
      type: Array,
      default: []
    },
    page:{
      type: String,
      default: ""
    },
    visibleButton:{
      type: Boolean,
      default: true
    },
    visibleErrorTest:{
      type: Boolean,
      default: true
    },
    visibleVerdict:{
      type: Boolean,
      default: true
    }
  },


  data() {
    return {
      visibleAttemps: false,
    }
  },

  methods: {
    tableRowClassName({ row }) {
      if (row.status === "waiting" || row.status === "compiling") {
        return "waiting-row"
      } else {
        if (row.verdict) {
          if (
            !row.verdict.compilation ||
            row.verdict.maxPoints === 0 ||
            row.verdict.maxPoints !== row.verdict.points
          ) {
            return "error-row"
          } else return "success-row"
        }
      }
    },
    statusBar({ row }) {
      if (row.status === "waiting") {
        return "el-icon-document-copy"
      } else if (row.status === "compiling") {
        return "el-icon-loading"
      } else {
        if (!row.verdict.compilation) return "el-icon-circle-close"
        else if (
          row.verdict.maxPoints === 0 ||
          row.verdict.maxPoints !== row.verdict.points
        ) {
          return "el-icon-remove-outline"
        } else return "el-icon-circle-check"
      }
    },
    toVerdict({ row }) {
      if (this.page === "cc") {
        this.$router.push(
          `/teacherinterface/materials/programming/verdict/${row._id}`
        )
      } else {
        this.$router.push("/")
      }
    },

    togglevisibleAttemps() {
      this.visibleAttemps = !this.visibleAttemps
    },
  },
}
</script>

<style scoped></style>
