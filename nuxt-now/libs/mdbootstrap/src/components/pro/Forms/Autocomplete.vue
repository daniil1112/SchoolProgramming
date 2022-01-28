<template>
  <div class="autocomplete-wrapper">
    <mdb-input
      :label="label"
      class="mb-0 pb-0"
      inputClass="mb-0"
      :outline="outline"
      ref="autocompleteRef"
      :placeholder="placeholder"
      type="text"
      v-model="search"
      :icon="icon"
      :far="far"
      :fad="fad"
      :fal="fal"
      :fab="fab"
      :regular="regular"
      :brands="brands"
      :duotone="duotone"
      :light="light"
      :iconClass="iconClass"
      :required="validation"
      @mousedown.right.native.prevent
      @input="onChange"
      @keydown.native="handleKeyDown"
      @focus="focus"
      @blur="blur"
      role="combobox"
      :disabled="disabled"
      :aria-disabled="disabled"
      :aria-required="validation"
      :aria-haspopup="true"
      :aria-expanded="show"
      :customValidation="wasValidated"
      :isValid="isValid"
      :validFeedback="!show && validFeedback"
      :invalidFeedback="!show && invalidFeedback"
      :bg="bg"
    />

    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <span v-if="search !== '' && clearBtn" class="close-btn">
        <mdb-btn
          @click="handleClear"
          class="p-0 m-0"
          flat
          icon="times"
          :iconClass="`${active && 'text-primary'}`"
          size="sm"
        ></mdb-btn>
      </span>
    </transition>

    <div ref="popper" class="dropdown-wrapper" :style="wrapperStyle">
      <transition @enter="enter" @leave="leave" @before-enter="beforeEnter">
        <ul
          class="dropdown-content select-dropdown list-unstyled mdb-autocomplete-wrap"
          ref="options"
          :style="{ height: scroll ? maxHeight : '' }"
          :class="optionsClass"
          v-show="show"
        >
          <li class="disabled autocomplete-option" v-if="isLoading">
            {{ loadingText }}
          </li>
          <li class="disabled autocomplete-option" v-if="results.length === 0 && !isLoading">{{ resultText }}</li>
          <li
            tabindex="0"
            ref="option"
            class="autocomplete-option"
            v-for="(result, i) in results"
            :key="i"
            @click="setResult(result)"
            @keydown.prevent="navigateOptions"
            :class="{ 'is-active': i === arrowCounter }"
            role="option"
            :aria-selected="result === search"
            aria-disabled="false"
          >
            {{ result }}
          </li>
        </ul>
      </transition>
    </div>
  </div>
</template>

<script>
import mdbInput from "../../Forms/Input";
import mdbBtn from "../../Components/Button";
import Popper from "popper.js";

const Autocomplete = {
  name: "Autocomplete",
  components: {
    mdbInput,
    mdbBtn
  },
  props: {
    data: {
      type: Array,
      required: false,
      default: () => []
    },
    isAsync: {
      type: Boolean,
      required: false,
      default: false
    },
    loadingText: {
      type: String,
      default: "Loading results..."
    },
    label: {
      type: String,
      required: false
    },
    value: {
      type: String
    },
    placeholder: {
      type: String,
      required: false
    },
    iconClass: {
      type: [String, Array],
      required: false
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
    bg: {
      type: Boolean,
      default: false
    },
    duotone: {
      type: Boolean,
      default: false
    },
    display: {
      type: Number,
      default: 4
    },
    flipOnScroll: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    scroll: {
      type: Boolean,
      default: true
    },
    icon: {
      type: String,
      required: false
    },
    outline: {
      type: Boolean,
      default: false
    },
    clearBtn: {
      type: Boolean,
      default: true
    },
    filterFunction: {
      type: Function,
      default: (item, search) => {
        return item.toLowerCase().indexOf(search.toLowerCase()) > -1;
      }
    },
    validation: {
      type: Boolean,
      default: false
    },
    wasValidated: {
      type: Boolean,
      default: false
    },
    invalidFeedback: {
      type: String
    },
    validFeedback: {
      type: String
    },
    resultText: {
      type: String,
      default: "no results found"
    },
    showAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      search: "",
      results: [],
      show: false,
      isLoading: false,
      active: false,
      arrowCounter: 0,
      maxHeight: 0,
      scrollOffset: 0,
      flipped: false,
      popperJS: null,
      popperOptions: {
        placement: "bottom",
        eventsEnabled: false,
        modifiers: {
          offset: {
            offset: "0, 0"
          },
          flip: {
            boundriesElement: "viewport"
          }
        }
      }
    };
  },
  computed: {
    activeIndex() {
      return this.results.indexOf(this.search) === -1
        ? 0
        : this.results.indexOf(this.search);
    },
    isValid() {
      return this.data.indexOf(this.search) !== -1;
    },
    optionsClass() {
      return this.scroll ? "options-container scrollbar-grey thin" : "";
    },
    wrapperStyle() {
      let marginLeft = this.outline ? "33px" : "40px";
      let width = this.outline ? "calc(100% - 33px)" : "calc(100% - 40px)";

      return this.icon
        ? {
            marginLeft,
            width
          }
        : {};
    },
    visibleItems() {
      return (this.display < this.results.length) && this.scroll
        ? this.display
        : this.results.length;
    }
  },
  methods: {
    blur(e) {
      this.active = false;
      this.$emit("blur", e);
    },
    createPopper() {
      this.$nextTick(() => {
        this.popperJS = new Popper(
          this.$refs.popper,
          this.$refs.options,
          this.popperOptions
        );
      });
    },
    filterResults() {
      this.results = this.data.filter(item => {
        return this.filterFunction(item, this.search);
      });

      this.setHeight();

      this.arrowCounter = 0;

      this.scrollDropdown();
    },
    focus(e) {
      this.active = true;
      this.$emit("focus", e);
    },
    handleClear() {
      this.search = "";
      this.scrollDropdown();
      this.show = false;
      this.arrowCounter = 0;
      this.$emit("input", this.search);
    },
    handleClickOutside(evt) {
      if (!this.$el.contains(evt.target)) {
        this.scrollDropdown();
        this.show = false;
      }
    },
    handleKeyDown(e) {
      const keyCodes = [38, 40, 13];
      if ((this.search === "" && !this.showAll) || keyCodes.indexOf(e.keyCode) === -1) return;

      this.show = true;
      if (this.$refs.option && this.$refs.option[this.arrowCounter])
        this.$refs.option[this.arrowCounter].focus();
    },
    navigateOptions(e) {
      const close =
        this.show && (e.keyCode === 27 || (e.keyCode === 38 && e.altKey));

      if (close) {
        this.scrollDropdown();
        this.show = false;
        this.$refs.autocompleteRef.$refs.input.focus();
        return;
      }

      let next;

      switch (e.keyCode) {
        case 13:
          this.setResult(this.results[this.arrowCounter]);
          break;
        case 38:
          next =
            this.arrowCounter > 0
              ? this.arrowCounter - 1
              : this.results.length - 1;

          this.arrowCounter = next;

          this.$refs.option[this.arrowCounter].focus();
          break;
        case 40:
          next =
            this.arrowCounter < this.results.length - 1
              ? this.arrowCounter + 1
              : 0;

          this.arrowCounter = next;

          this.$refs.option[this.arrowCounter].focus();
          break;
      }
    },
    onChange() {
      this.$emit("search", this.search);
      if (this.isAsync) {
        this.isLoading = true;
      }
      if (this.search == "") {
        this.scrollDropdown();

        if (this.showAll) this.results = [...this.data];
        else this.show = false;
      } else {
        this.filterResults();
        this.show = true;
      }
    },
    scrollDropdown() {
      this.arrowCounter = this.activeIndex;

      this.$refs.options.scrollTo({
        top: this.arrowCounter * 44,
        behavior: "smooth"
      });
    },
    setFlipped(data) {
      if (data.flipped) {
        const offset = this.outline ? "0px" : "-42px";
        const margin = this.outline ? "52px" : "0px";
        this.$refs.options.style.top = offset;
        this.$refs.options.style.marginBottom = margin;
      }
    },
    setHeight() {
      let additional = this.isLoading ? 44 : this.results.length === 0 ? 44 : 0;
      this.maxHeight = `${this.visibleItems * 44 + additional}px`;
    },
    setResult(result) {
      this.search = result;
      this.scrollDropdown();
      this.show = false;
      this.$emit("input", this.search);
      this.$refs.autocompleteRef.$refs.input.focus();
    },
    updatePopper() {
      this.popperJS ? this.popperJS.scheduleUpdate() : this.createPopper();
    },
    //transitions
    beforeEnter(el) {
      el.style.height = "0px";
    },
    enter(el) {
      setTimeout(() => {
        el.style.height = this.maxHeight;
      }),
        0;
    },
    leave(el) {
      el.style.height = "0px";
    }
  },
  mounted() {
    if (this.value) {
      this.search = this.value;
      this.filterResults();
    }

    document.addEventListener("click", this.handleClickOutside);

    if (!this.outline) this.popperOptions.modifiers.offset.offset = "0, 5px";
    this.popperOptions.onUpdate = this.setFlipped;
    this.popperOptions.onCreate = this.setFlipped;
    if (this.flipOnScroll) this.popperOptions.eventsEnabled = true;
  },
  destroyed() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  watch: {
    data(value) {
      // we want to make sure we only do this when it's an async request
      if (this.isAsync) {
        this.results = value;
        this.show = true;
        this.isLoading = false;
        this.setHeight();
      }
    },
    show(value) {
      if (value) {
        this.updatePopper();
      }
    },
    value(value) {
      this.search = value;
      this.filterResults();
    }
  }
};

export default Autocomplete;
export { Autocomplete as mdbAutocomplete };
</script>

<style>
.mdb-autocomplete-wrap {
  max-height: unset!important;
}

.autocomplete-wrapper .md-form .form-control.is-valid {
  background-position: center right calc(0.75em + 0.75rem) !important;
}

.autocomplete-wrapper .md-form .form-control.is-invalid {
  background-position: center right calc(0.75em + 0.75rem) !important;
}

.autocomplete-wrapper label {
  text-overflow: ellipsis;
  display: inline-block;
  overflow: hidden;
  max-width: 300px;
  white-space: nowrap;
  vertical-align: middle;
}
</style>
<style scoped>
.is-active {
  background-color: #eee;
}

.autocomplete-option {
  transition: background-color 0.2s linear;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 100%;
  white-space: nowrap;
  vertical-align: middle;
}

.autocomplete-option:focus {
  outline: none !important;
  background-color: #f5f5f5;
}

.autocomplete-option:hover {
  background-color: #f5f5f5;
}
.clear {
  position: absolute;
  z-index: 2;
  top: 0.5rem;
  right: 0;
  border: none;
  background: 0 0;
  padding-bottom: 0.2rem;
}
.clear svg {
  fill: #a6a6a6;
}

.dropdown-wrapper {
  top: 0;
  width: 100%;
  position: relative;
}

.dropdown-content {
  display: block;
  opacity: 1;
  width: 100%;
  overflow-y: hidden;
  transition: height 0.3s linear;
}

.scrollbar-grey::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  background-color: #f5f5f5;
  border-radius: 10px;
}

.scrollbar-grey::-webkit-scrollbar {
  width: 12px;
  background-color: #f5f5f5;
}

.scrollbar-grey::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  background-color: #9e9e9e;
}

.thin::-webkit-scrollbar {
  width: 4px;
}

.options-container {
  overflow-y: scroll;
}

.close-btn {
  position: absolute;
  top: 32px;
  right: 20px;
  transition: all 0.2s ease-out;
}

.close-btn:hover {
  transform: scale(1.2);
}
</style>
<style></style>
