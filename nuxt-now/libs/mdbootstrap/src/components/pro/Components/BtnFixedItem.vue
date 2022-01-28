<template>
  <li>
    <mdb-btn tag="a" floating :size="size" :color="color" :style="style">
      <mdb-icon v-if="icon" :icon="icon" :fad="fad" :far="far || regular" :fal="fal || light" :fab="fab || brands"/>
      <slot></slot>
    </mdb-btn>
  </li>
</template>

<script>
import mdbBtn from '../../Components/Button';
import mdbIcon from '../../Content/Fa';

const BtnFixedItem = {
  components: {
    mdbBtn,
    mdbIcon
  },
  props: {
    color: {
      type: String
    },
    icon: {
      type: String
    },
    size: {
      type: String
    },
    show: {
      type: Boolean,
      default: false
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
  },
  computed: {
    style() {
      return this.show ? {'opacity' : 1, 'transform' : 'scaleY(1) scaleX(1) translateY(0) translateX(0)'} : {'opacity' : 0, 'transform' : 'scaleY(0.4) scaleX(0.4) translateY(40px) translateX(0)'};
    }
  }
};

export default BtnFixedItem;
export { BtnFixedItem as mdbBtnFixedItem };
</script>

<style>
.fixed-action-btn ul {
  height: auto;
  opacity: 1;
  bottom: 80px;
}
</style>
