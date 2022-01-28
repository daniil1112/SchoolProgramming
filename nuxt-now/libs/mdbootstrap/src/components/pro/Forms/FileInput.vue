<template>
  <form :class="formClass">
    <div v-if="img">
      <img ref="img" :style="this.circle ? `width: ${this.width}px; height: ${this.width}px` : `width: ${this.width}px`" class="z-depth-1-half mb-4" :src="src" :class="imgClass">
    </div>
    <div class="file-field">
      <div :class="btnClass">
        <span class="btn-wrapper">
          <mdb-icon v-if="icon" :class="iconClass" :icon="icon"/>
          <span v-if="!this.floating">{{btnTitle}}</span>
          <mdb-icon v-if="iconRight" :class="iconClass" :icon="iconRight"/>
        </span>
        <input v-if="img" type="file" accept=".jpg, .png, .tiff" @change="(e)=>fileChange(e.target.files)" ref="fileInput" />
        <input v-else type="file" :multiple="multiple" @change="(e)=>fileChange(e.target.files)" ref="fileInput" />
      </div>
      <div class="file-path-wrapper">
        <input v-if="!img" :class="inputFieldClass" type="text" :placeholder="files ? files : textFieldTitle" />
      </div>
    </div>
  </form>
</template>

<script>
import { mdbIcon } from '../../Content/Fa';

const FileInput = {
  components: {
    mdbIcon
  },
  props: {
    btnColor: {
      type: String,
      default: 'default'
    },
    btnTitle: {
      type: String,
      default: 'Choose file'
    },
    multiple: {
      type: Boolean,
    },
    textFieldTitle: {
      type: String,
      default: 'Upload your file'
    },
    sm: {
      type: Boolean,
      default: false
    },
    lg: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    },
    outline: {
      type: String,
    },
    gradient: String,
    icon: String,
    iconRight: String,
    floating: {
      type: Boolean,
      default: false
    },
    src: {
      type: String,
      default: "https://mdbootstrap.com/img/Photos/Others/placeholder.jpg"
    },
    img: {
      type: Boolean,
      default: false
    },
    circle: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 150
    }
  },
  data() {
    return {
      files: false,
      input: false,
    };
  },
  computed: {
    btnClass() {
      return [
        this.floating ? 'btn-floating' : 'btn',
        !this.outline && !this.gradient && 'btn-' + this.btnColor,
        this.sm ? 'btn-sm' : this.lg ? 'btn-lg' : '',
        this.img ? 'd-flex justify-content-center' : 'float-left',
        this.gradient && this.gradient + '-gradient',
        this.rounded && 'btn-rounded',
        this.outline && 'btn-outline-' + this.outline
      ];
    },
    iconClass(){
      return [
        this.iconRight ? 'ml-3' : this.floating ? '' : 'mr-3'
      ];
    },
    inputFieldClass() {
      return [
        'file-path validate',
        this.files && 'valid'
      ];
    },
    imgClass(){
      return [
        this.circle ? "rounded-circle z-depth-1-half avatar-pic" : "img-fluid"
      ];
    },
    formClass(){
      return [
        'md-form',
        this.img && 'img-placeholder'
      ];
    }
  },
  mounted() {
    this.input = this.$refs.fileInput;
  },
  methods: {
    fileReader(files){
      const fileReader = new FileReader();
      fileReader.onload = e => {
        this.$refs.img.setAttribute('src', e.target.result);
      };
      fileReader.readAsDataURL(files[0]);
    },
    fileChange(files){
      if (files.length > 0) {
        if (files.length > 1) {
          let filesNames = [];
          for (let i = 0; i < files.length; i++) {
            filesNames.push(files[i].name);
          }
          this.files = filesNames;
        } else {
          this.files = files[0].name;
        }
      } else {
        this.files = false;
      }
      this.$emit('getValue', this.$el[0].files);
      if (this.img) {
        this.fileReader(files);
      }
    },
    reset() {
      this.files = false;
      this.input.type = 'text';
      this.input.type = 'file';
      this.$emit('getValue', null);
    }
  }
};

export default FileInput;
export { FileInput as mdbFileInput };
</script>

<style scoped>
  .btn-wrapper {
    width: 100%;
  }

  .img-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
