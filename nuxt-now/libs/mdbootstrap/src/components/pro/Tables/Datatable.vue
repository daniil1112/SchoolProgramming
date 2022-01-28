<template>
  <div class="dataTables_wrapper" :style="wrapperStyle">
    <!-- Entries input and search -->
    <mdb-row>
      <mdb-col sm="6" md="8">
        <mdb-row>
          <mdb-col sm="12" md="6">
            <datatable-select
              :title="entriesTitle"
              v-if="pagination"
              @getValue="updateEntries"
              :options="options"
              class="mr-3"
            />
          </mdb-col>
          <mdb-col>
            <mdb-btn
              @click="updateData"
              v-if="refresh"
              size="sm"
              class="mb-3"
              :outline="btnColor"
            >
              <mdb-icon icon="sync" />
            </mdb-btn>
          </mdb-col>
        </mdb-row>
      </mdb-col>
      <mdb-col sm="6" md="4" v-if="searching">
        <datatable-search
          :placeholder="searchPlaceholder"
          @getValue="updateSearch"
        />
      </mdb-col>
    </mdb-row>
    <!-- Entries input and search -->

    <!-- Main table -->
    <mdb-tbl
      v-if="!scrollY"
      v-bind="tableProps"
      sm
      datatable
      :key="componentKey"
    >
      <mdb-tbl-head :color="headerColor" :textWhite="headerWhite">
        <tr>
          <th v-if="checkbox && focus"></th>
          <th
            v-for="column in columns"
            :key="column.field"
            class="th-sm sorting"
            v-on:click="sort(column.field, column.sort)"
          >
            {{ column.label }}
            <i
              v-if="sorting && column.sort"
              class="fas fa-sort float-right"
            ></i>
          </th>
        </tr>
      </mdb-tbl-head>

      <mdb-tbl-body>
        <tr
          v-for="(row, i) in pages[activePage]"
          :key="i"
          :tabindex="focus && '1'"
          @mouseenter="hovered = rowsDisplay.indexOf(row)"
          @mouseleave="hovered = -1"
          @click="selectRow(row)"
          :class="`${focus && 'selectable-row'} ${focus && rowsDisplay.indexOf(row) === hovered ? hoverColor: ''} ${focus && rowsDisplay.indexOf(row) === selected ? selectColor: ''}`"
        >
          <td v-if="checkbox && focus" class="text-center">
            <mdb-icon class="px-3" :icon="rowsDisplay.indexOf(row) === selected ? 'check-square' : 'square'" far></mdb-icon>
          </td>
          <td v-for="(value, key) in row" :key="key">
            <div v-html="value"></div>
          </td>
        </tr>
        <tr v-if="!pages.length">
          <td :colspan="columns.length">{{ noFoundMessage }}</td>
        </tr>
      </mdb-tbl-body>

      <mdb-tbl-head v-if="tfoot" tag="tfoot">
        <tr>
          <th v-if="checkbox"></th>
          <th
            v-for="column in columns"
            :key="column.field + '_foot'"
            class="th-sm sorting"
          >
            {{ column.label }}
          </th>
        </tr>
      </mdb-tbl-head>
    </mdb-tbl>
    <!-- Main table -->

    <!-- ScrollY table -->
    <div v-if="scrollY" class="dataTables_scroll" :key="componentKey">
      <div class="dataTables_scrollHead" style="padding-right: 15px">
        <div class="dataTables_scrollHeadInner">
          <mdb-tbl v-bind="tableProps" sm datatable>
            <mdb-tbl-head :color="headerColor" :textWhite="headerWhite">
              <tr>
                <th v-if="checkbox && focus"></th>
                <th
                  v-for="column in columns"
                  :key="column.field"
                  class="th-sm sorting"
                  v-on:click="sort(column.field, column.sort)"
                >
                  {{ column.label }}
                  <i
                    v-if="sorting && column.sort"
                    class="fas fa-sort float-right"
                  ></i>
                </th>
              </tr>
            </mdb-tbl-head>
          </mdb-tbl>
        </div>
      </div>
      <mdb-tbl v-bind="tableProps" sm datatable>
        <mdb-tbl-body>
          <tr
            v-for="(row, i) in pages[activePage]"
            :key="i"
            :tabindex="focus && '1'"
            @click="selectRow(row)"
            @mouseenter="hovered = rowsDisplay.indexOf(row)"
            @mouseleave="hovered = -1"
            :class="`${focus && 'selectable-row'} ${focus && rowsDisplay.indexOf(row) === hovered ? hoverColor: ''} ${focus && rowsDisplay.indexOf(row) === selected ? selectColor: ''}`"
          >
            <td v-if="checkbox && focus" class="text-center">
              <mdb-icon class="px-3" :icon="rowsDisplay.indexOf(row) === selected ? 'check-square' : 'square'" far></mdb-icon>
            </td>
            <td v-for="(value, key) in row" :key="key">
              <div v-html="value"></div>
            </td>
          </tr>
          <tr v-if="!pages.length">
            <td :colspan="columns.length">{{ noFoundMessage }}</td>
          </tr>
        </mdb-tbl-body>
      </mdb-tbl>
      <div class="dataTables_scrollFoot" style="padding-right: 15px">
        <div class="dataTables_scrollFootInner">
          <mdb-tbl v-bind="tableProps" sm datatable>
            <mdb-tbl-head v-if="tfoot" tag="tfoot">
              <tr>
                <th
                  v-for="column in columns"
                  :key="column.field + '_foot'"
                  class="th-sm sorting"
                >
                  {{ column.label }}
                </th>
              </tr>
            </mdb-tbl-head>
          </mdb-tbl>
        </div>
      </div>
    </div>
    <!-- ScrollY table -->

    <!-- Labels, filter and pagination -->
    <div v-if="pagination" class="row">
      <div class="col-sm-12 col-md-5">
        <div class="dataTables_info" role="status" aria-live="polite">
          {{ showingText }}:
          {{ activePage > 0 ? activePage * entries : activePage + 1 }} -
          {{
            pages.length - 1 > activePage
              ? pages[activePage].length * (activePage + 1)
              : filteredRows.length
          }}
          ({{ filteredRows.length }})
        </div>
        <div v-if="filter" class="pl-3">
          <mdb-select
            :label="`Filter: ${filter}`"
            v-if="this.filterOptions.length !== 0"
            class="mt-0 w-50 d-inline-block"
            @getValue="updateSelect"
            :options="filterOptions"
            resetBtn
          />
        </div>
      </div>
      <div class="col-sm-12 col-md-7">
        <div class="dataTables_paginate float-right">
          <mdb-pagination id="pagination" :color="paginationColor">
            <mdb-page-item
              v-if="pages.length > display"
              v-on:click.native="changePage(0)"
              :disabled="activePage === 0 ? true : false"
            >
              <mdb-icon v-if="arrows" icon="angle-double-left" />
              <p v-else class="pagination">{{ start }}</p>
            </mdb-page-item>
            <mdb-page-item
              v-on:click.native="changePage(activePage - 1)"
              :disabled="activePage === 0 ? true : false"
            >
              <mdb-icon v-if="arrows" icon="angle-left" />
              <p v-else class="pagination">{{ previous }}</p>
            </mdb-page-item>
            <mdb-page-item
              v-for="(page, index) in visiblePages"
              :key="index"
              v-on:click.native="changePage(pages.indexOf(visiblePages[index]))"
              :active="
                activePage === pages.indexOf(visiblePages[index]) ? true : false
              "
            >
              {{ pages.indexOf(visiblePages[index]) + 1 }}
            </mdb-page-item>
            <mdb-page-item
              v-on:click.native="changePage(activePage + 1)"
              :disabled="activePage === pages.length - 1 ? true : false"
            >
              <mdb-icon v-if="arrows" icon="angle-right" />
              <p v-else class="pagination">{{ next }}</p>
            </mdb-page-item>
            <mdb-page-item
              v-if="pages.length > display"
              v-on:click.native="changePage(pages.length - 1)"
              :disabled="activePage === pages.length - 1 ? true : false"
            >
              <mdb-icon v-if="arrows" icon="angle-double-right" />
              <p v-else class="pagination">{{ end }}</p>
            </mdb-page-item>
          </mdb-pagination>
        </div>
      </div>
    </div>
    <!-- Labels, filter and pagination -->
  </div>
</template>

<script>
import mdbSelect from "../Forms/Select";
import mdbIcon from "../../Content/Fa";
import DatatableSelect from "./DatatableSelect";
import DatatableSearch from "./DatatableSearch";
import { mdbDatatable } from "../../../mixins/mdbDatatable";

const Datatable = {
  name: "DatatablePro",
  props: {
    filter: {
      type: String,
      default: ""
    },
  },
  data() {
    return {
      options: [
        { value: 10, text: 10, selected: true },
        { value: 25, text: 25 },
        { value: 50, text: 50 },
        { value: 100, text: 100 }
      ],
      select: "",
      filteredArray: [],
      filterOptions: []
    };
  },
  components: {
    DatatableSearch,
    DatatableSelect,
    mdbSelect,
    mdbIcon
  },
  computed: {
    // filter objects by parameters match
    filteredRows() {
      let rows = this.rowsDisplay;
      if (this.filter) {
        rows = this.selectedRows;
      }
      return rows.filter(row => {
        return (
          row.filter(value =>
            value
              .toString()
              .toLowerCase()
              .match(this.search.toLowerCase())
          ).length > 0
        );
      });
    },
    selectedRows() {
      return this.rowsDisplay.filter(row => {
        return (
          row.filter(value => {
            if (this.select)
              return (
                value.toString().toLowerCase() === this.select.toLowerCase()
              );
            return value;
          }).length > 0
        );
      });
    }
  },
  methods: {
    updateSelect(value) {
      this.select = value;
    },
    filterArray() {
      if (this.filter) {
        this.rows.map(row => {
          if (this.filteredArray.indexOf(row[this.filter]) === -1) {
            this.filteredArray.push(row[this.filter]);
          }
        });
        this.filteredArray.sort();
        this.filteredArray = this.filteredArray.filter((elem, index, self) => {
          return index == self.indexOf(elem);
        });

        const existingOptions = this.filterOptions.map(option => option.value);
        this.filteredArray.forEach(option => {
          if (existingOptions.indexOf(option) === -1) {
            this.filterOptions.push({ value: option, text: option });
          }
        });
      }
    }
  },
  beforeMount() {
    this.filterArray();
  },
  watch: {
    rows() {
      this.filterArray();
    }
  },
  mixins: [mdbDatatable]
};

export default Datatable;
export { Datatable as mdbDatatable };
</script>

<style scoped>
.refresh-button {
  width: 4rem;
  height: 2rem;
}
.dataTables-scrollBody {
  display: block;
  overflow-y: auto;
  -ms-overflow-style: -ms-autohiding-scrollbar;
}

.dataTables-scrollBody td,
.dataTables-scrollBody th {
  white-space: nowrap;
}

.pagination {
  margin-bottom: 0px;
}

.selectable-row {
  cursor: pointer;
  transition: all 0.4s ease-out;
}

.selectable-row:focus {
  outline: none;
}
</style>
