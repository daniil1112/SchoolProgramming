<template>
  <component
    ref="popper"
    @keyup.enter="$event.target.click()"
    :is="tag"
    :class="className"
    :style="style"
    v-on="hover ? { mouseover: handleHover, mouseout: handleMouseleave } : null"
    v-on-clickaway="multiAway"
  >
    <span
      class="dropdown-toggler"
      tabindex="0"
      @click="handleToggle"
      v-on-clickaway="away"
      @keyup.stop.enter="handleToggle"
    >
      <slot name="toggle"></slot>
    </span>
    <transition
      @enter="enter"
      @after-enter="afterEnter"
      @before-leave="beforeLeave"
    >
      <div
        class="mb-0"
        style="z-index: 1000; transition: opacity .2s linear"
        ref="options"
        :class="collapseClass"
        v-show="toggle"
      >
        <slot></slot>
      </div>
    </transition>
  </component>
</template>

<script>
import { mdbDropdown } from "../../../mixins/mdbDropdown";

const Dropdown = {
  props: {
    megaMenu: {
      type: Boolean
    },
    hover: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      timer: null,
    };
  },
  mixins: [mdbDropdown],
  methods: {
    handleToggle(e) {
      this.toggle = !this.toggle;
      e.preventDefault();
    },
    handleHover(e) {
      clearTimeout(this.timer);
      this.toggle = true;
      e.preventDefault();
    },
    handleMouseleave() {
      this.timer = setTimeout(this.away, 200);
    }
  },
  computed: {
    className() {
      return [
        "dropdown",
        this.btnGroup && "btn-group",
        this.show && "show",
        this.megaMenu && "mega-dropdown",
        this.mdbClass
      ];
    },
    collapseClass() {
      return [this.megaMenu ? "mega-menu-collapse-item" : ""];
    }
  },
};

export default Dropdown;
export { Dropdown as mdbDropdown };
</script>

<style scoped>
.dropdown {
  display: inline-block;
}
.collapse-item {
  position: relative;
  z-index: 1000;
  transition: opacity 0.2s;
}

.mega-menu-collapse-item {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  z-index: 1000;
  transition: opacity 0.2s;
}

</style>

<style>
.dropdown-menu {
  top: 0 !important;
  position: relative !important;
}

.dropdown-toggler:focus {
  outline: none;
}
.navbar .dropdown-menu a:hover {
  color: inherit !important;
}
.navbar .mega-dropdown .dropdown-menu.mega-menu .sub-menu ul li a {
  display: inline-block;
}


</style>
