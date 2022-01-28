<template>
  <div class="dataTables_length d-flex">
    <label class="mt-4 pt-3 mr-4">{{title}}</label>
    <mdb-select @getValue="getOptionValue" :wrapperClass="'mdb-select'" :options="options"></mdb-select>
  </div>
</template>

<script>
import mdbSelect from '../Forms/Select';

const DatatableSelect = {
  name: "DatatabMaterialeSelect",
  components: {
    mdbSelect
  },
  props: {
    entries: {
      type: Number,
      default: 10
    },
    options: {
      type: Array
    },
    title: {
      type: String,
      default: 'Show entries'
    }
  },
  methods: {
    getOptionValue(value) {
      this.$emit('getValue', value);
    }
  }
};

export default DatatableSelect;
</script>