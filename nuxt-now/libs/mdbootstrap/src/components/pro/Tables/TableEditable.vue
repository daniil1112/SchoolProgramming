<template>
  <div class="dataTables_wrapper" :style="wrapperStyle">
    <span @click="addEntry" class="table-add float-right mb-3 mr-2"><a href="#!" class="text-success"><mdb-icon icon="plus" class="fa-2x"/></a></span>
    <!-- Main table -->
    <tbl v-if="!scrollY" v-bind="tableProps" sm datatable>
      <tbl-head :color="headerColor" :textWhite="headerWhite">
        <tr>
          <th
            v-for="column in columns"
            :key="column.field"
          >
            {{column.label}}
          </th>
          <th>Sort</th>
          <th>Remove</th>
        </tr>
      </tbl-head>
      <tbl-body :class="dark ? 'white-text' : ''">
        <tr v-for="(row, rowIndex) in pages[activePage]" :key="`row-${rowIndex}`">
          <td contenteditable="true" @blur="update($event, rowIndex, fieldIndex, activePage)" v-for="(value, fieldIndex) in row" :key="`field-${fieldIndex}`">
            {{value}}
          </td>
          <td>
            <a href="#!" @click="rowUpHandler(rowIndex, activePage)" class="indigo-text table-up"><mdb-icon icon="long-arrow-alt-up"/></a>
            <a href="#!" @click="rowDownHandler(rowIndex, activePage)" class="indigo-text table-down"><mdb-icon icon="long-arrow-alt-down"/></a>
          </td>
          <td>
            <mdb-btn @click.native.prevent="removeHandler(rowIndex, activePage)" color="danger" class="table-remove" size="sm" rounded>Remove</mdb-btn>
          </td>
        </tr>
      </tbl-body>
    </tbl>
    <!-- Main table -->

    <!-- Labels, filter and pagination -->
        <div v-if="pagination" class="d-flex justify-content-center">
         <pagination id="pagination" circle color="purple">
            <page-item
              v-if="pages.length > display"
              v-on:click.native="changePage(0)"
              :disabled="activePage === 0 ? true : false"
            >
              <mdb-icon  icon="angle-double-left" />
            </page-item>
            <page-item
              v-on:click.native="changePage(activePage-1)"
              :disabled="activePage === 0 ? true : false"
            >
              <mdb-icon  icon="angle-left" />
            </page-item>
            <page-item
              v-for="(page, index) in visiblePages"
              :key="index"
              v-on:click.native="changePage(pages.indexOf(visiblePages[index]))"
              :active="activePage === pages.indexOf(visiblePages[index]) ? true : false"
            >
              {{pages.indexOf(visiblePages[index])+1}}
            </page-item>
            <page-item
              v-on:click.native="changePage(activePage+1)"
              :disabled="activePage === pages.length-1 ? true : false"
            >
              <mdb-icon  icon="angle-right" />
            </page-item>
            <page-item
              v-if="pages.length > display"
              v-on:click.native="changePage(pages.length-1)"
              :disabled="activePage === pages.length-1 ? true : false"
            >
              <mdb-icon  icon="angle-double-right" />
            </page-item>
          </pagination>
        </div>
    <!-- Labels, filter and pagination -->

  </div>
</template>

<script>
// 
import Tbl from '../../Tables/Table';
import TblHead from '../../Tables/TableHead';
import TblBody from '../../Tables/TableBody';
import mdbIcon from '../../Content/Fa';
import mdbBtn from '../../Components/Button.vue';
import Pagination from '../../Components/Pagination';
import PageItem from '../../Components/PageItem';

const TableEditable = {
  name: 'TableEditable',
  components: {
    Tbl,
    TblHead,
    TblBody,
    mdbIcon,
    mdbBtn,
    PageItem,
    Pagination
  },
  props: {
    columns: {
      type: Array
    },
    rows: {
      type: Array
    },
    autoWidth: {
      type: Boolean,
      default: false
    },
    bordered: {
      type: Boolean,
      default: false
    },
    borderless: {
      type: Boolean,
      default: false
    },
    dark: {
      type: Boolean,
      default: false
    },
    fixed: {
      type: Boolean,
      default: false
    },
    headerColor: {
      type: String
    },
    headerWhite: {
      type: Boolean,
      default: false
    },
    hover: {
      type: Boolean,
      default: false
    },
    maxWidth: {
      type: String
    },
    pagination: {
      type: Boolean,
      default: false
    },
    responsive: {
      type: Boolean,
      default: false
    },
    responsiveSm: {
      type: Boolean,
      default: false
    },
    responsiveMd: {
      type: Boolean,
      default: false
    },
    responsiveLg: {
      type: Boolean,
      default: false
    },
    responsiveXl: {
      type: Boolean,
      default: false
    },
    scrollY: {
      type: Boolean,
      defautl: false
    },
    entries: {
      type: Number,
      default: 10
    },
    display: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      activePage: 0,
      pages: [],
      newEntry: {},
      mutableRows: [],
      tableProps: {
        autoWidth: this.autoWidth,
        bordered: this.bordered,
        borderless: this.borderless,
        dark: this.dark,
        fixed: this.fixed,
        hover: this.hover,
        responsive: this.responsive,
        responsiveSm: this.repsonsiveSm,
        responsiveMd: this.repsonsiveMd,
        responsiveLg: this.responsiveLg,
        responsiveXl: this.responsiveXl,
        striped: this.striped,
        dtScrollY: this.scrollY
      },
      wrapperStyle: {
        maxWidth: this.maxWidth ? this.maxWidth : '100%',
        margin: '0 auto'
      }
    };
  },
  
  computed: {
    visiblePages() {
      let start = this.activePage - Math.floor(this.display/2) > 0 ? this.activePage - Math.floor(this.display/2) : 0;
      let end = start + this.display < this.pages.length ? start + this.display : this.pages.length;
      if (end - start < this.display && end - this.display >= 0) {
        start = end - this.display;
      }
      return this.pages.slice(start, end);
    },
  },
  methods: {
    setPages() {
      const pagesAmount = Math.ceil(this.mutableRows.length / this.entries);
      this.pages = [];
      if (this.pagination) {
        for (let i=1; i<=pagesAmount; i++) {
          const pageEndIndex = i*this.entries;
          this.pages.push(this.mutableRows.slice(pageEndIndex-this.entries, pageEndIndex));
        }
      }
      else {
        this.pages.push(this.mutableRows);
      }
      this.$emit('updateRows', this.mutableRows);
    },
    removeHandler(row, active) {
      const originalIndex = (active * this.entries) + row;
      this.mutableRows.splice(originalIndex, 1);
      this.setPages();
    },
    addEntry() {
      this.mutableRows.push({...this.newEntry});
      this.setPages();
    },
    rowDownHandler(row, active) {
      if (row < this.mutableRows.length - 1){
        const originalIndex = (active * this.entries) + row;
        const tmp = this.mutableRows[originalIndex];
        const nextTmp = this.mutableRows[originalIndex + 1];
        this.mutableRows[originalIndex] = nextTmp;
        this.mutableRows[originalIndex + 1] = tmp;
        this.setPages();
      }
    },
    rowUpHandler(row, active){
      if (row !== 0){
        const originalIndex = (active * this.entries) + row;
        const tmp = this.mutableRows[originalIndex];
        const previousTmp = this.mutableRows[originalIndex - 1];
        this.mutableRows[originalIndex] = previousTmp;
        this.mutableRows[originalIndex - 1] = tmp;
        this.setPages();
      }
    },
    update(event, row, field, active){
      const originalIndex = (active * this.entries) + row;
      let newRow = {...this.mutableRows[originalIndex], [field]: event.target.innerText};
      this.mutableRows[originalIndex] = newRow;
      this.setPages();
    }, 
    changePage(index) {
      this.activePage = index;
    },
  },
  mounted() {
    this.mutableRows = [...this.rows];

    this.columns.map(col => {
      this.newEntry[col.field] = col.field;
    });
    
    this.setPages();
    this.activePage = 0;
  },
  watch: {
    rows: {
      handler() {
        this.mutableRows = this.rows;
        this.setPages();
      },
      deep: true
    }
  }
};

export default TableEditable;
export { TableEditable as mdbTableEditable };
</script>

<style scoped>
.dataTables-scrollBody {
  display: block;
  overflow-y: auto;
  -ms-overflow-style: -ms-autohiding-scrollbar;
}
</style>
