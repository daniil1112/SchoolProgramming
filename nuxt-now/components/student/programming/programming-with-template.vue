<template>
    <div v-show="attempsLeft && attempsLeft > 0">
        <ModalWindow v-if="visibleModal" @close="visibleModal = false">
            <template slot="header">
                Результат
            </template>
            <template slot="body">
                <h3>Язык: {{language.label}}</h3>
                <client-only >
                    <prism-editor
                            ref="prismEditorRef"
                            v-model="allText"
                            :language="language.prism"
                            :line-numbers="true"
                            placeholder="Программа"
                            autosize
                            :readonly="true"
                    />
                </client-only>
            </template>
            <template slot="footer-buttons">
                <b-button variant="success" @click="addAttemp">На проверку</b-button>
            </template>
        </ModalWindow>
        <p v-for="(item, index) in template">
            <code v-if="item !== null">{{item}}</code>
            <client-only v-else>
                <prism-editor
                        ref="prismEditorRef"
                        v-model="programmingText[index]"
                        :language="language.prism"
                        :line-numbers="false"
                        placeholder="Программа"
                        autosize
                        :readonly="compiling"
                />
            </client-only>

        </p>


        <b-button variant="primary" @click="visibleModal = true" v-if="attempsLeft && attempsLeft > 0"> Посмотреть результат </b-button>
        <el-button
          :loading="!attemps || attemps.some((e) => e.status !== 'compiled')"
          @click="addAttemp"
          v-if="attempsLeft && attempsLeft > 0"
        >
        Проверить
      </el-button>
    </div>
</template>

<script>
    import "prismjs"
    import PrismEditor from "vue-prism-editor"
    import "prismjs/themes/prism-okaidia.css"
    import "prismjs/components/prism-pascal"
    import "prismjs/components/prism-python"
    import "vue-prism-editor/dist/VuePrismEditor.css"
    import ModalWindow from "../../ModalWindow";
    export default {
        name: "programming-with-template",

        components:{ModalWindow, PrismEditor},

        props:['template','language','attemps','attempsLeft'],

        data(){
            return{
                programmingText:[],
                compiling: false,
                visibleModal: false
            }
        },

        computed:{
            allText(){
                const {programmingText} = this
                let res = '';
                this.template.forEach ( (e, index) => {
                    if (e !== null) res = res + e + '\n';
                    else if ( programmingText[index] ) res = res + programmingText[index] + '\n'
                })
                return res
            }

        },

        methods:{
            addAttemp: async function(){
                const {programmingText,attempsLeft} = this
                if (attempsLeft && attempsLeft > 0){
                  this.$emit('add-attemp',{programmingText})
                } else {
                  this.$notify.error({
                    title: 'Ошибка',
                    message: 'Все попытки потрачены'
                  })
                }

            }
        }

    }
</script>

<style scoped>

</style>