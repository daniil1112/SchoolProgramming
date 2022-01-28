<template>
  <span>
    <transition @after-leave="doDestroy">
      <span ref="popper" :class="{show:!disabled && showPopper}">
        <div :class="material ? tooltipClasses : 'tooltip tooltip-free'" ref="tooltip" :style="`max-width: ${maxWidth}px`"> 
          <div :class="material? innerClasses : null" v-if="$slots.tip"> 
            <slot name="tip"></slot>
          </div>
          <slot></slot>
        </div>
      </span>
    </transition>
    <slot name="reference"></slot>
  </span>
</template>
<script>
  
  import { mdbTooltip } from '../../../mixins/mdbTooltip';

  const Tooltip = {
    mixins: [mdbTooltip],
    props: {
      email: {
        type: Boolean,
        default: false
      },
      sm: {
        type: Boolean,
        default: false
      },
      material: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      tooltipClasses(){
        return [
          'tooltip',
          this.email ? 'md-tooltip-email' : this.sm ? 'md-tooltip' : 'md-tooltip-main'
        ];
      },
      innerClasses(){
        return [
          'tooltip-inner',
          this.email ? 'md-inner-email' : this.sm ? 'md-inner' : 'md-inner-main'
        ];
      },
      arrow(){
        if (this.material){
          return true;
        }
        return this.visibleArrow;
      }
    }
  };

  export default Tooltip;
  export { Tooltip as mdbTooltip };
</script>

<style>
  .tooltip {
    display: none;
  }

  .tooltip-inner {
    max-width: initial;
  }

  .show > .tooltip {
    opacity: 1;
    visibility: visible;
    display: block;
  }
  .tooltip[x-placement^="top"] {
    margin-bottom: 5px;
  }
  .tooltip[x-placement^="top"] .tooltip_arrow {
    bottom: -5px;
    left: calc(50% - 5px);
    margin-top: 0;
    margin-bottom: 0;
  }
  .tooltip[x-placement^="bottom"] {
    margin-top: 5px;
  }

  .tooltip[x-placement^="right"] {
    margin-left: 5px;
  }
  .tooltip[x-placement^="right"] .tooltip_arrow {
    left: -5px;
    top: calc(50% - 5px);
    margin-left: 0;
    margin-right: 0;
  }
  .tooltip[x-placement^="left"] {
    margin-right: 5px;
  }
  .tooltip[x-placement^="left"] .tooltip_arrow {
    right: -5px;
    top: calc(50% - 5px);
    margin-left: 0;
    margin-right: 0;
  }

  .tooltip-free {
    width: auto;
    background-color: rgba(0, 0, 0, 0.85);
    color: rgba(242, 239, 239, 0.95);
    text-align: center;
    padding: 0.24em 0.5em;
    border-radius: 3px;
    position: absolute;
    font-size: 0.83em;
    font-weight: normal;
    z-index: 200000;
    opacity: 0;
    transition: opacity 0.2s, visibility 0.2s;
    visibility: hidden;
  }


  .tooltip-free .tooltip_arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
  }
  

  .tooltip-free[x-placement^="top"] .tooltip_arrow {
    border-width: 5px 5px 0 5px;
    border-color:  rgba(0, 0, 0, 0.85) transparent transparent transparent;
  }
  
  .tooltip-free[x-placement^="bottom"] .tooltip_arrow {
    border-width: 0 5px 5px 5px;
    border-color: transparent transparent rgba(0, 0, 0, 0.85) transparent;
    top: -5px;
    left: calc(50% - 5px);
    margin-top: 0;
    margin-bottom: 0;
  }
  
  .tooltip-free[x-placement^="right"] .tooltip_arrow {
    border-width: 5px 5px 5px 0;
    border-color: transparent rgba(0, 0, 0, 0.85) transparent transparent;
  }
  
  .tooltip-free[x-placement^="left"] .tooltip_arrow {
    border-width: 5px 0 5px 5px;
    border-color: transparent transparent transparent rgba(0, 0, 0, 0.85);
  }
</style>
