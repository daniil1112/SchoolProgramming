<template>
  <component :is="tag" :class="liClass">
    <a v-if="href" :href="href" v-bind="$attrs" :class="className" @click="wave">
      <mdb-icon v-if="icon" :icon="icon" />
      <span v-if="slim" class="sv-slim">{{slim}}</span>
      <span v-if="slimIcon" class="sv-slim"><mdb-icon :icon="slimIcon"/></span>
      <slot></slot>
    </a>
    <a v-if="toggler" v-bind="$attrs" :class="className" @click="handleClick">
      <mdb-icon v-if="!isCollapsed" :icon="icon" />
      <slot v-if="!isCollapsed"></slot>
      <mdb-icon :icon="openIcon" v-if="isCollapsed"/>
    </a>
    <router-link v-if="to" :to="to" v-bind="$attrs" :class="className" @click="wave">
      <i v-if="icon" :class="iconClass" />
      <span v-if="slim" class="sv-slim">{{slim}}</span>
      <slot></slot>
    </router-link>
  </component>
</template>

<script>
import waves from '../../../mixins/waves';
import { mdbIcon } from '../../Content/Fa';

const SideNavItem = {
  name: 'SideNavItem',
  components: {
    mdbIcon
  },
  props: {
    tag: {
      type: String,
      default: "li"
    },
    wrapperClass: {
      type: String
    },
    href: {
      type: String
    },
    to: [String, Object],
    header: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String
    },
    openIcon: {
      type: String
    },
    slimIcon: {
      type: String
    },
    far: {
      type: Boolean,
      default: false
    },
    regular: {
      type: Boolean,
      default: false
    },
    fal: {
      type: Boolean,
      default: false
    },
    light: {
      type: Boolean,
      default: false
    },
    fab: {
      type: Boolean,
      default: false
    },
    brands: {
      type: Boolean,
      default: false
    },
    fad: {
      type: Boolean,
      default: false
    },
    duotone: {
      type: Boolean,
      default: false
    },
    isCollapsed: {
      type: Boolean,
      default: false
    },
    toggler: {
      type: Boolean,
      default: false
    },
    slim: String
  },
  computed: {
    className() {
      return [
        'ripple-parent',
        this.header && 'collapsible-header',
        this.normal ? 'sv-normal' : '',
        this.slim && 'sv-slim'
      ];
    },
    iconClass() {
      return [
        this.far || this.regular ? 'far' :
          this.fal || this.light ? 'fal' :
            this.fad || this.duotone ? 'fad' :
              this.fab || this.brands ? 'fab' : 'fas',
        'fa-' + this.icon
      ];
    },
    liClass() {
      return [
        'menu-item',
        this.wrapperClass
      ];
    }
  },
  mixins: [waves],
  methods: {
    handleClick(e) {
      this.wave(e);
      this.$emit('toggle', e);
    }
  }
};

export default SideNavItem;
export { SideNavItem as mdbSideNavItem };
</script>

<style scoped>
</style>
