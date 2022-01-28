<template>
  <div class="dataTables_filter md-form m-0 mt-4 float-right">
    <input v-model="search" type="search" class="form-control" :placeholder="placeholder" />
  </div>
</template>

<script>
const DatatableSearch = {
  name: 'DatatableSearch',
  data() {
    return {
      search: ''
    };
  },
  props: {
    placeholder: {
      type: String,
      default: 'Search'
    }
  },
  watch: {
    search() {
      this.$emit('getValue', this.search);
    }
  }
};

export default DatatableSearch;
</script>