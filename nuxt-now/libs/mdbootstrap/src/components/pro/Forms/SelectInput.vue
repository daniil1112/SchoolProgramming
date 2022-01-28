<template>
  <form :class="formClass" :novalidate="wasValidated">
    <mdb-input
      selectInput
      @focus="toggleActive($event, 'focus')"
      @blur="toggleActive($event, 'blur')"
      ref="input"
      type="text"
      :data-value="value"
      :value="text"
      :class="className"
      :disabled="disabled"
      :placeholder="placeholder"
      :label="label"
      :icon="icon"
      :iconClass="iconClasses"
      :far="far"
      :fab="fab"
      :fal="fal"
      :labelClass="labelClasses"
      :role="search ? 'combobox' : 'listbox'"
      :aria-multiselectable="multiple"
      :aria-disabled="disabled"
      :aria-required="validation"
      :aria-haspopup="true"
      :aria-expanded="toggle"
      read-only
      :name="name"
      :required="required"
      :bg="bg"
    />
    <div v-if="validFeedback" class="valid-feedback">{{ validFeedback }}</div>
    <div v-if="invalidFeedback" class="invalid-feedback">
      {{ invalidFeedback }}
    </div>
  </form>
</template>

<script>
import mdbInput from "./Input";

const SelectInput = {
  name: "SelectInput",
  components: {
    mdbInput
  },
  props: {
    value: {
      type: [String, Number, Array]
    },
    text: {
      type: [String, Number, Array]
    },
    classes: {
      type: String
    },
    validation: {
      type: Boolean
    },
    valid: {
      type: Boolean
    },
    validFeedback: {
      type: [String, Boolean]
    },
    invalidFeedback: {
      type: [String, Boolean]
    },
    disabled: {
      type: Boolean
    },
    placeholder: String,
    label: String,
    icon: String,
    iconClass: {
      type: String
    },
    far: Boolean,
    fab: Boolean,
    fal: Boolean,
    bg: Boolean,
    labelClass: [String, Array],
    toggle: Boolean,
    multiple: Boolean,
    search: Boolean,
    name: String,
    required: Boolean
  },
  data() {
    return {
      wasValidated: false,
      active: false,
      dropdown: this.toggle
    };
  },
  computed: {
    formClass() {
      return [
        this.wasValidated
          ? this.valid
            ? "needs-validation is-valid"
            : "needs-validation is-invalid"
          : false
      ];
    },
    labelClasses() {
      return [this.dropdown && "active", this.labelClass];
    },
    iconClasses() {
      return [this.iconClass, this.dropdown && "active"].join(" ");
    },
    className() {
      return [
        "select-dropdown",
        (this.dropdown || this.active) && "select-active",
        this.wasValidated ? (this.valid ? "is-valid" : "is-invalid") : false,
        this.classes
      ];
    }
  },
  methods: {
    toggleActive(event, emit) {
      if (emit === "focus") {
        this.active = true;
      } else this.active = false;
      this.$emit(emit, event);
    }
  },
  watch: {
    validation(value) {
      this.wasValidated = value;
    },
    active(value) {
      this.$emit("active", value);
    },
    toggle(val) {
      this.dropdown = val;
    }
  }
};

export default SelectInput;
export { SelectInput as mdbSelectInput };
</script>

<style>
.select-wrapper label,
.select-wrapper span.caret {
  pointer-events: none;
}
.select-wrapper form:focus input:not([disabled]) {
  border-color: #4285f4 !important;
}
.select-wrapper form:focus label,
.select-wrapper form:focus ~ span.caret {
  color: #4285f4 !important;
}

</style>

<style scoped>
form:focus {
  outline: none;

}

.select-dropdown.is-valid {
  border-color: #28a745;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: center right calc(0.375em + 0.1875rem);
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.select-dropdown.is-invalid {
  border-color: #dc3545;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23dc3545' viewBox='-2 -2 7 7'%3e%3cpath stroke='%23dc3545' d='M0 0l3 3m0-3L0 3'/%3e%3ccircle r='.5'/%3e%3ccircle cx='3' r='.5'/%3e%3ccircle cy='3' r='.5'/%3e%3ccircle cx='3' cy='3' r='.5'/%3e%3c/svg%3E");
  background-repeat: no-repeat;
  background-position: center right calc(0.375em + 0.1875rem);
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}


.needs-validation.is-valid .valid-feedback {
  display: block;
}
.needs-validation.is-invalid .invalid-feedback {
  display: block;
}
</style>
<style>
.select-active input {
  border-bottom: 1px solid #4285f4 !important;
  box-shadow: 0 1px 0 0 #4285f4, 0 1px 0 0 #4285f4 !important;
}

.md-outline .select-active input {
  border-color: #4285f4 !important;
  box-shadow: inset 0 0 0 1px #4285f4!important;

}

.select-active ::selection {
  background: transparent!important; /* WebKit/Blink Browsers */
}

.select-active label {
  color: #4285f4;
}

.md-outline .select-active label {
  color: #4285f4!important;
}

.md-form input:read-only {
  cursor: pointer;
}

.select-dropdown input {
  cursor: pointer !important;
}
</style>
