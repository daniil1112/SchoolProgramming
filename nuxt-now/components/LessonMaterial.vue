<template>
  <div>
    <span>{{ material.title }}</span>
    <span v-html="material.text" />
  </div>
</template>

<script>
export default {
  name: "LessonMaterial",
  props: ["id"],
  data() {
    return {
      material: null,
    }
  },

  async mounted() {
    await this.loadMaterial()
  },

  methods: {
    async loadMaterial() {
      const material = await this.$axios.post(
        "https://server-now.moiplansh028.now.sh/api/student/materials/load",
        { id: this.id }
      )
      if (material.data.result) this.material = material.data.result
      console.log(material)
    },
  },
}
</script>

<style scoped></style>
