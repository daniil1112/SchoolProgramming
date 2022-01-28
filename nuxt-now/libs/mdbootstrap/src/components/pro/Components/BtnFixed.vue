<template>
  <component :is="tag" :class="className" :style="style">
    <mdb-btn tag="a" floating :size="size" :color="color">
      <mdb-icon :icon="icon" :fad="fad" :far="far || regular" :fal="fal || light" :fab="fab || brands" />
    </mdb-btn>
    <ul :class="ulClass">
      <slot></slot>
    </ul>
  </component>
</template>

<script>
import mdbBtn from '../../Components/Button';
import mdbIcon from '../../Content/Fa';

const BtnFixed =  {
  components: {
    mdbBtn,
    mdbIcon
  },
  props: {
    tag: {
      type: String,
      default: "div"
    },
    color: {
      type: String,
      default: "red"
    },
    size: {
      type: String
    },
    icon: {
      type: String,
      default: "pencil"
    },
    right: {
      type: Number
    },
    bottom: {
      type: Number
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
    fad: {
      type: Boolean,
      default: false
    },
    brands: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    className() {
      return [
        'fixed-action-btn'
      ];
    },
    ulClass() {
      return [
        'list-unstyled'
      ];
    },
    style() {
      return {'bottom' : this.bottom + 'px','right' : this.right + 'px'};
    }
  }
};

export default BtnFixed;
export { BtnFixed as mdbBtnFixed };
</script>

<style scoped>
</style>
