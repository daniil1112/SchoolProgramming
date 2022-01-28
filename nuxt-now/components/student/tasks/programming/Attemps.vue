<template>
  <div class="attemps-table">
    <el-table
      v-if="attemps && attemps.length > 0"
      v-model="attemps"
      :data="attemps"
      :default-sort="{ prop: '_id', order: 'descending' }"
      :row-class-name="tableRowClassName"
    >
      <el-table-column prop="_id" label="Id" />
      <el-table-column label="status">
        <template slot-scope="scope">
          <i :class="statusBar(scope)" class="font-size-30" />
        </template>
      </el-table-column>

      <el-table-column label="points">
        <template slot-scope="scope">
          <span v-html="pointsPersent(scope)" />
        </template>
      </el-table-column>
      <el-table-column label="programLang">
        <template slot-scope="scope">
          <span v-if="scope.row.programLang === 1">PascalABCNet</span>
          <span v-else-if="scope.row.programLang === 2">Python 3</span>
        </template>
      </el-table-column>
      <el-table-column label="ErrorTest">
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
          <span v-else>OK</span>
        </template>
      </el-table-column>
      <el-table-column label="verdict">
        <template v-if="scope.row.verdict" slot-scope="scope">
          <el-button
                  v-if="scope.row.verdict"
                  type="text"
                  @click="toVerdict(scope)"
          >
            <i class="el-icon-s-order font-size-30" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "Attemps",

  props: ["attemps"],

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
    pointsPersent({ row }) {
      if (row.verdict) {
        if (row.verdict.points && row.verdict.maxPoints) {
          return Math.round((row.verdict.points / row.verdict.maxPoints) * 100)
        } else {
          return 0
        }
      }
    },
    statusBar({ row }) {
      if (row.status === "waiting") {
        return "el-icon-document-copy"
      } else if (row.status === "compiling") {
        return "el-icon-loading"
      } else {
        if (row.verdict && !row.verdict.compilation)
          return "el-icon-circle-close"
        else if (row.verdict && row.verdict.errors)
          return "el-icon-remove-outline"
        else return "el-icon-circle-check"
      }
    },
    toVerdict({ row }) {
      this.$emit("to-verdict", { verdictID: row._id })
    },
  },
}
</script>

<style scoped></style>
