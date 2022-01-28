<template>
  <loading :active.sync="loading" :can-cancel="false" :is-full-page="true" />
</template>

<script>
// Import component
import Loading from "vue-loading-overlay"
// Import stylesheet
import "vue-loading-overlay/dist/vue-loading.css"
export default {
  components: { Loading },

  computed: {
    loading() {
      if (
        this.$store.state.loading.loading &&
        this.$store.state.loading.loading > 0
      )
        return true
      return false
    },
  },
}
</script>
