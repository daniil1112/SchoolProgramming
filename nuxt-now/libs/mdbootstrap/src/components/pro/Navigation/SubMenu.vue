<template>
  <component :is="tag" :class="className">
    <slot></slot>
  </component>
</template>

<script>
const SubMenu = {
  name: 'SubMenu',
  props: {
    tag: {
      type: String,
      default: "div"
    }
  },
  computed: {
    className() {
      return [
        'sub-menu'
      ];
    }
  }
};

export default SubMenu;
export { SubMenu as mdbSubMenu };
</script>

<style scoped>
</style>
