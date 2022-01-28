<template>
  <component :is="tag" :class="className">
    <slot></slot>
  </component>
</template>

<script>
const SideNavNav = {
  name: 'SideNavNav',
  props: {
    tag: {
      type: String,
      default: "ul"
    },
  },
  computed: {
    className() {
      return [
        'collapsible collapsible-accordion'
      ];
    }
  }
};

export default SideNavNav;
export { SideNavNav as mdbSideNavNav };
</script>

<style scoped>
</style>
