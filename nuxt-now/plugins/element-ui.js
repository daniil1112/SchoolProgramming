import Vue from "vue"
import ElementUI from "element-ui"
import { Button, TimePicker, DatePicker } from "element-ui"
import lang from "element-ui/lib/locale/lang/ru-RU"
import locale from "element-ui/lib/locale"
locale.use(lang)

Vue.use(ElementUI)

Vue.component(Button.name, Button)
Vue.component(TimePicker.name, TimePicker)
Vue.component(DatePicker.name, DatePicker)
