<template>
  <div v-if="answerChoice.length > 1">
    <b-table
      ref="selectableTable"
      :items="answerChoice"
      :fields="fields"
      :tbody-tr-class="rowClass"
      responsive="sm"
    />
  </div>
</template>

<script>
export default {
  name: "MultiAnswer",
  props: ["answerChoice", "rightAnswer"],

  data() {
    return {
      fields: [
        {
          key: "answer",
          label: "Ответ",
        },
      ],
    }
  },
  methods: {
    rowClass(item, type) {
      if (!item || type !== "row") return
      if (this.rightAnswer.some((e) => e === item.id))
        return "table-success-row"
    },
  },
}
</script>
