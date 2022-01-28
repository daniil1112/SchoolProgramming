<template>
  <div class="mdb-vue-date">
    <div class="datepickbox">
      <mdb-input v-show="!disableInput" :bg="bg" :outline="outline" :icon="icon" :iconClass="iconClass" :far="far" :fal="fal" :fab="fab" :fad="fad" type="text" :disabled="disabled" :validation="validation" :customValidation="customValidation" :isValid="isValid" :validFeedback="validFeedback" :invalidFeedback="invalidFeedback" :title="mdbOptions.title" :label="mdbOptions.label" class="mdb-datepicker" :placeholder="value || mdbOptions.placeholder" v-model="date.time" :required="required" @keydown.native.enter.stop="open" @click.native="open" @focus.native="open" @change="emitDate" @blur="$emit('blur', $event)" @focus="$emit('focus', $event)"/>
    </div>
    <transition name="fade" mode="out-in">
      <div class="datepicker-overlay" v-if="showInfo.check && !disabled" @click="dismiss($event)" v-bind:style="{'background' : mdbOptions.overlayOpacity? 'rgba(0,0,0,'+mdbOptions.overlayOpacity+')' : 'rgba(0,0,0,0.5)'}">
        <div class="mdb-date-body" :style="{'background-color': mdbOptions.color ? mdbOptions.color.header : '#3f51b5'}">

          <!-- the Header -->
          <div :class="'mdb-date-monthly ' + mdbOptions.color.header + '-color'">
            <div :tabindex="0" class="mdb-date-previous" @keyup.enter.stop="nextMonth('pre')" @click="nextMonth('pre')">«</div>
            <div class="mdb-date-caption" :style="{'color': mdbOptions.color ? mdbOptions.color.headerText : '#fff'}">
              <div @click="showMonth">{{displayInfo.month}}</div>
              <div class="the-date">{{this.checked.day}}</div>
              <div @click="showYear"><small class="year">{{checked.year}}</small></div>
            </div>
            <div :tabindex="0" class="mdb-date-next" @keyup.enter.stop="nextMonth('next')" @click="nextMonth('next')">»</div>
          </div>
          <div class="mdb-date-box" v-if="showInfo.day">
            <div class="mdb-picker-box">
              <div class="week">
                <ul>
                  <li v-for="(weekie, index) in library.week" :key="weekie+index">{{weekie}}</li>
                </ul>
              </div>
              <div class="day" :tabindex="0" @keyup.enter.stop="handleKeyup($event, day)" v-for="(day, index) in dayList" :key="day+index" @click="checkDay(day)" :class="{'checked':day.checked,'unavailable':day.unavailable,'passive-day': !(day.inMonth),[mdbOptions.color.checkedDay + '-color'] : day.checked}">{{day.value}}</div>
            </div>
          </div>

          <!-- the Calendar -->
          <div class="mdb-date-box list-box" v-if="showInfo.year">
            <div class="mdb-picker-box date-list" id="yearList">
              <div class="date-item" v-for="(yearItem, index) in library.year" :key="yearItem+index" @click="setYear(yearItem)">{{yearItem}}</div>
            </div>
          </div>
          <div class="mdb-date-box list-box" v-if="showInfo.month">
            <div class="mdb-picker-box date-list">
              <div class="date-item" v-for="(monthItem, index) in library.month" :key="monthItem+index" @click="setMonth(monthItem)">{{monthItem}}</div>
            </div>
          </div>
          <div class="mdb-date-box list-box" v-if="showInfo.hour">
            <div class="mdb-picker-box date-list">
              <div class="watch-box">
                <div class="hour-box">
                  <ul>
                    <li class="hour-item" v-for="(hitem, index) in hours" :key="hitem+index" @click="setTime('hour', hitem, hours)" :class="{'active':hitem.checked}">{{hitem.value}}</li>
                  </ul>
                </div>
                <div class="min-box">
                  <div class="min-item" v-for="(mitem, index) in mins" :key="mitem+index" @click="setTime('min',mitem, mins)" :class="{'active':mitem.checked}">{{mitem.value}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="button-box">
            <span @click="today" v-if="!mdbDisableToday && !value">{{mdbOptions.buttons.today}}</span>
            <span @click="clear" v-if="!mdbDisableClear && value">{{mdbOptions.buttons.clear}}</span>
            <span @click="clickOk" v-if="!mdbDisableOk">{{mdbOptions.buttons.ok}}</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import moment from 'moment';
import { mdbInput } from '../../Forms/Input';

const DatePicker = {
  props: {
    required: false,
    date: {
      type: Object,
      default: () => ({
        date: ''
      })
    },
    option: {
      type: Object,
      default: () => ({})
    },
    limit: {
      type: Array,
      default: () => ([])
    },
    getValue: {
      type: Function
    },
    disableOk: Boolean,
    placeholder: String,
    label: String,
    disableClear: Boolean,
    disableToday: Boolean,
    autoHide: Boolean,
    defaultDate: [String, Date],
    value: String,
    validation : {
      type: Boolean,
      default: false
    },
    customValidation : {
      type: Boolean,
      default: false
    },
    isValid: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    validFeedback: String,
    invalidFeedback: String,
    icon: String,
    iconClass: String,
    far: Boolean,
    fab: Boolean,
    fal: Boolean,
    fad: Boolean,
    bg: Boolean,
    outline: Boolean,
    disabledPast: Boolean,
    disabledFuture: Boolean,
    disableInput: {
      type: Boolean
    }
  },
  model: {
    event: 'change'
  },
  components: {
    mdbInput
  },
  computed: {
    mdbDisableOk() {
      return this.disableOk;
    },
    mdbDisableClear() {
      return this.disableClear;
    },
    mdbDisableToday() {
      return this.disableToday;
    },
    mdbAutoHide() {
      return this.autoHide;
    },
    mdbOptions() { 
      let buttons = [];
      let colors = [];
      if (this.option.buttons) {
        buttons.ok = this.option.buttons.ok || 'OK';
        buttons.clear = this.option.buttons.clear || 'Clear';
        buttons.today = this.option.buttons.today || 'Today';
      } else {
        buttons.ok = 'OK';
        buttons.clear = 'Clear';
        buttons.today = 'Today';
      }
      if (this.option.color) {
        colors.header = this.option.color.header || 'primary';
        colors.headerText = this.option.color.headerText || 'white';
        colors.checkedDay = this.option.color.checkedDay || 'primary';
      } else {
        colors.header = 'primary';
        colors.headerText = 'white';
        colors.checkedDay = 'primary';
      }
      return {
        type: this.option.type || 'day',
        SundayFirst: this.option.SundayFirst || false,
        week: this.option.week || ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        month: this.option.month || ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        format: this.option.format || 'YYYY-MM-DD',
        color: {
          header: colors.header,
          headerText: colors.headerText,
          checkedDay: colors.checkedDay
        },
        placeholder: this.placeholder || this.option.placeholder,
        buttons: {
          ok: buttons.ok,
          clear: buttons.clear, 
          today: buttons.today
        },
        overlayOpacity: this.option.overlayOpacity || 0.5,
        label: this.label || this.option.label || ''
      };
    },
    library() {
      return {
        week: this.mdbOptions.week,
        month: this.mdbOptions.month,
        year: []
      };
    },
    hours() {
      let list = [];
      let hour = 24;
      while (hour > 0) {
        hour--;
        list.push({
          checked: false,
          value: hour < 10 ? '0' + hour : hour
        });
      }
      return list;
    },
    mins() {
      let list = [];
      let min = 60;
      while (min > 0) {
        min--;
        list.push({
          checked: false,
          value: min < 10 ? '0' + min : min
        });
      }
      return list;
    },
    defaultDateWrapper(){
      return this.defaultDate || this.value;
    }
  },
  data() {
    return {
      showInfo: {
        hour: false,
        day: false,
        month: false,
        year: false,
        check: false
      },
      displayInfo: {
        month: ''
      },
      checked: {
        oldtime: '',
        currentMoment: null,
        year: '',
        month: '',
        day: '',
        hour: '00',
        min: '00'
      },
      dayList: [],
      selectedDays: []
    };
  },
  methods: {
    clickOk(){
      this.showInfo.check=false;
      this.$emit('ok')
    },
    pad (n) {
      let m = Math.floor(n);
      return m < 10 ? '0' + m : m;
    },
    nextMonth (type) {
      let next = null;
      type === 'next' ? next = moment(this.checked.currentMoment).add(1, 'M') : next = moment(this.checked.currentMoment).add(-1, 'M');
      this.showDay(next);
    },
    showDay (time) {
      if (typeof time === "undefined" || !time) {
        this.defaultDate || this.value ? this.checked.currentMoment = moment(this.defaultDateWrapper) : this.checked.currentMoment = moment();
      } else {
        this.checked.currentMoment = moment(time, this.mdbOptions.format);
      }
      this.showOne('day');
      this.checked.year = moment(this.checked.currentMoment).format('YYYY');
      this.checked.month = moment(this.checked.currentMoment).format('MM');
      this.checked.day = moment(this.checked.currentMoment).format('DD');
      this.displayInfo.month = this.library.month[moment(this.checked.currentMoment).month()];
      let days = [];
      let currentMoment = this.checked.currentMoment;
      let firstDay = moment(currentMoment).date(1)
        .day();
      // gettting previous and next month
      // let currentMonth = moment(currentMoment)
      let previousMonth = moment(currentMoment);
      let nextMonth = moment(currentMoment);
      nextMonth.add(1, 'months');
      previousMonth.subtract(1, 'months');
      let monthDays = moment(currentMoment).daysInMonth();
      let oldtime = this.checked.oldtime;
      for (let i = 1; i <= monthDays; ++i) {
        days.push({
          value: i,
          inMonth: true,
          unavailable: false,
          checked: false,
          moment: moment(currentMoment).date(i)
        });
        if (i === Math.ceil(moment(currentMoment).format('D')) && moment(oldtime, this.mdbOptions.format).year() === moment(currentMoment).year() && moment(oldtime, this.mdbOptions.format).month() === moment(currentMoment).month()) {
          days[i - 1].checked = true;
        }
        this.checkBySelectDays(i, days);
      }
      if (firstDay === 0) firstDay = 7;
      for (let i = 0; i < firstDay - (this.mdbOptions.SundayFirst ? 0 : 1); i++) {
        let passiveDay = {
          value: previousMonth.daysInMonth() - (i),
          inMonth: false,
          action: 'previous',
          unavailable: true,
          checked: false,
          moment: moment(currentMoment).date(1)
            .subtract(i + 1, 'days')
        };
        days.unshift(passiveDay);
      }
      if (this.limit.length > 0) {
        for (let li of this.limit) {
          switch (li.type) {
            case 'fromto':
              days = this.limitFromTo(li, days);
              break;
            case 'from':
              days = this.limitFrom(li, days);
              break;
            case 'to':
              days = this.limitTo(li, days);
              break;
            case 'range':
              days = this.limitRange(li, days);
              break;
            case 'weekday':
              days = this.limitWeekDay(li, days);
              break;
            case 'exact':
              days = this.limitExactDays(li, days);
              break;
          }
        }
      }
      if (this.disabledPast) days = this.limitPast(days);
      if (this.disabledFuture) days = this.limitFuture(days);
      var passiveDaysAtFinal = 42 - days.length;
      for (let i = 1; i <= passiveDaysAtFinal; i++) {
        let passiveDay = {
          value: i,
          inMonth: false,
          action: 'next',
          unavailable: true,
          checked: false,
          moment: moment(currentMoment).add(1, 'months')
            .date(i)
        };
        days.push(passiveDay);
      }
      this.dayList = days;
    },
    checkBySelectDays (d, days) {
      this.selectedDays.forEach(day => {
        if (this.checked.year === moment(day).format('YYYY') && this.checked.month === moment(day).format('MM') && d === Math.ceil(moment(day).format('D'))) {
          days[d - 1].checked = true;
        }
      });
    },
    limitWeekDay (limit, days) {
      days.map(day => {
        if (limit.available.indexOf(Math.floor(day.moment.format('d'))) === -1) {
          day.unavailable = true;
        }
      });
      return days;
    },
    limitFromTo (limit, days) {
      if (limit.from || limit.to) {
        days.map(day => {
          if (this.getLimitCondition(limit, day)) {
            day.unavailable = true;
          }
        });
      }
      return days;
    },
    limitFrom (limit, days) {
      if (limit.from) {
        days.map(day => {
          if (this.getLimitFromCondition(limit, day)) {
            day.unavailable = true;
          }
        });
      }
      return days;
    },
    limitTo (limit, days) {
      if (limit.to) {
        days.map(day => {
          if (this.getLimitToCondition(limit, day)) {
            day.unavailable = true;
          }
        });
      }
      return days;
    },
    limitRange (limit, days) {
      if (limit.from || limit.to) {
        days.map(day => {
          if (this.getLimitRangeCondition(limit, day)) {
            day.unavailable = true;
          }
        });
      }
      return days;
    },
    limitPast (days) {
      days.map(day => {
        if (this.getLimitPastCondition(day)) {
          day.unavailable = true;
        }
      });
      return days;
    },
    limitFuture (days) {
      days.map(day => {
        if (this.getLimitFutureCondition(day)) {
          day.unavailable = true;
        }
      });
      return days;
    },
    getLimitCondition (limit, day) {
      let tmpMoment = moment(this.checked.year + '-' + this.pad(this.checked.month) + '-' + this.pad(day.value));
      if (limit.from && !limit.to) {
        return !tmpMoment.isAfter(limit.from);
      } else if (!limit.from && limit.to) {
        return !tmpMoment.isBefore(limit.to);
      }
      return !tmpMoment.isBetween(limit.from, limit.to);
    },
    getLimitFromCondition (limit, day) {
      let tmpMoment = moment(this.checked.year + '-' + this.pad(this.checked.month) + '-' + this.pad(day.value));
      return tmpMoment.isAfter(moment(limit.from), 'date');
    },
    getLimitToCondition (limit, day) {
      let tmpMoment = moment(this.checked.year + '-' + this.pad(this.checked.month) + '-' + this.pad(day.value));
      return tmpMoment.isBefore(moment(limit.to), 'date');
    },
    getLimitRangeCondition (limit, day) {
      let tmpMoment = moment(this.checked.year + '-' + this.pad(this.checked.month) + '-' + this.pad(day.value));
      return tmpMoment.isBetween(limit.from, limit.to, null, '[]');
    },
    getLimitPastCondition (day) {
      let tmpMoment = moment(this.checked.year + '-' + this.pad(this.checked.month) + '-' + this.pad(day.value));
      return tmpMoment.isBefore(moment(), 'date');
    },
    getLimitFutureCondition (day) {
      let tmpMoment = moment(this.checked.year + '-' + this.pad(this.checked.month) + '-' + this.pad(day.value));
      return tmpMoment.isAfter(moment(), 'date');
    },
    limitExactDays (limit, days) {
      if (limit.disabled) {
        days.map(day => {
          if (Array.isArray(limit.disabled)) {
            limit.disabled.map(disabledDay => {
              if (this.getExactLimitCondition(disabledDay, day)) {
                day.unavailable = true;
              }
            })
          } else {
            if (this.getExactLimitCondition(limit.disabled, day)) {
              day.unavailable = true;
            }
          }
        });
      }
      return days;
    },
    getExactLimitCondition (disabledDay, day) {
      let tmpMoment = moment(this.checked.year + '-' + this.pad(this.checked.month) + '-' + this.pad(day.value));
      let disabledDayMoment = moment(disabledDay)
      if (tmpMoment.isSame(disabledDayMoment)) return true
      return false
    },
    checkDay (obj) {
      if (obj.unavailable || obj.value === '') {
        return false;
      }
      if (!(obj.inMonth)) {
        this.nextMonth(obj.action);
      }
      if (this.mdbOptions.type === 'day' || this.mdbOptions.type === 'min') {
        this.dayList.forEach(x => {
          x.checked = false;
        });
        this.checked.day = this.pad(obj.value);
        obj.checked = true;
      } else {
        let day = this.pad(obj.value);
        let ctime = this.checked.year + '-' + this.checked.month + '-' + day;
        if (obj.checked === true) {
          obj.checked = false;
          this.selectedDays = this.selectedDays.filter(day => day !== ctime);
        } else {
          this.selectedDays.push(ctime);
          obj.checked = true;
        }
      }
      switch (this.mdbOptions.type) {
        case 'day':
          this.picked();
          break;
        case 'min':
          this.showOne('hour');
          // shift activated time items to visible position.
          this.shiftActTime();
          break;
      }
    },
    showYear () {
      let year = moment(this.checked.currentMoment).year();
      this.library.year = [];
      let yearTmp = [];
      for (let i = year - 100; i < year + 5; ++i) {
        yearTmp.push(i);
      }
      this.library.year = yearTmp;
      this.showOne('year');
      this.$nextTick(() => {
        let listDom = document.getElementById('yearList');
        listDom.scrollTop = (listDom.scrollHeight - 100);
        this.addYear();
      });
    },
    showOne (type) {
      switch (type) {
        case 'year':
          this.showInfo.hour = false;
          this.showInfo.day = false;
          this.showInfo.year = true;
          this.showInfo.month = false;
          break;
        case 'month':
          this.showInfo.hour = false;
          this.showInfo.day = false;
          this.showInfo.year = false;
          this.showInfo.month = true;
          break;
        case 'day':
          this.showInfo.hour = false;
          this.showInfo.day = true;
          this.showInfo.year = false;
          this.showInfo.month = false;
          break;
        case 'hour':
          this.showInfo.hour = true;
          this.showInfo.day = false;
          this.showInfo.year = false;
          this.showInfo.month = false;
          break;
        default:
          this.showInfo.day = true;
          this.showInfo.year = false;
          this.showInfo.month = false;
          this.showInfo.hour = false;
      }
    },
    showMonth () {
      this.showOne('month');
    },
    addYear () {
      let listDom = document.getElementById('yearList');
      listDom.addEventListener('scroll', () => {
        if (listDom.scrollTop < listDom.scrollHeight - 100) {
          let len = this.library.year.length;
          let lastYear = this.library.year[len - 1];
          this.library.year.push(lastYear + 1);
        }
      }, false);
    },
    setYear (year) {
      this.checked.currentMoment = moment(year + '-' + this.checked.month + '-' + this.checked.day);
      this.showDay(this.checked.currentMoment);
    },
    setMonth (month) {
      let mo = (this.library.month.indexOf(month) + 1);
      if (mo < 10) {
        mo = String('0' + mo);
      }
      this.checked.currentMoment = moment(this.checked.year + '-' + mo + '-' + this.checked.day);
      this.showDay(this.checked.currentMoment);
    },
    open () {
      if (this.date.time === '') {
        this.showDay();
      } else if (this.mdbOptions.type === 'day' || this.mdbOptions.type === 'min') {
        this.checked.oldtime = this.date.time;
        this.showDay(this.date.time);
      } else {
        this.selectedDays = JSON.parse(this.date.time);
        if (this.selectedDays.length) {
          this.checked.oldtime = this.selectedDays[0];
          this.showDay(this.selectedDays[0]);
        } else {
          this.showDay();
        }
      }
      this.showInfo.check = true;
    },
    setTime (type, obj, list) {
      for (let item of list) {
        item.checked = false;
        if (item.value === obj.value) {
          item.checked = true;
          this.checked[type] = item.value;
        }
      }
    },
    picked () {
      if (this.mdbOptions.type === 'day' || this.mdbOptions.type === 'min') {
        let ctime = this.checked.year + '-' + this.checked.month + '-' + this.checked.day + ' ' + this.checked.hour + ':' + this.checked.min;
        this.checked.currentMoment = moment(ctime, 'YYYY-MM-DD HH:mm');
        this.date.time = moment(this.checked.currentMoment).format(this.mdbOptions.format);
      } else {
        this.date.time = JSON.stringify(this.selectedDays);
      }
      this.$emit('getValue', this.date.time);
      this.hide();
    },
    dismiss (evt) {
      if (evt.target.className === 'datepicker-overlay') {
        this.showInfo.check = false;
        this.$emit('cancel');
      }
    },
    hide() {
      if (this.mdbAutoHide) {
        this.showInfo.check = false;
      }
    },
    close() {
      this.showInfo.check = false;
    },
    shiftActTime () {
      // shift activated time items to visible position.
      this.$nextTick(() => {
        if (!document.querySelector('.hour-item.active')) {
          return false;
        }
        document.querySelector('.hour-box').scrollTop = (document.querySelector('.hour-item.active').offsetTop || 0) - 250;
        document.querySelector('.min-box').scrollTop = (document.querySelector('.min-item.active').offsetTop || 0) - 250;
      });
    },
    clear () {
      this.date.time = '';
      this.dayList.forEach(x => {
        x.checked = false;
      });
      this.$emit('getValue', this.date.time);
      this.hide();
    },
    today () {
      let isTodayDisabled = false;
      this.dayList.forEach(x => {
        x.checked = false;
        if (x.moment.isSame(moment(), 'date') && x.unavailable === true) isTodayDisabled = true;
      });
      if (!isTodayDisabled) {
        this.checked.day = moment().format('DD');
        this.checked.month = moment().format('MM');
        this.checked.year = moment().format('YYYY');
        if (this.checked.currentMoment.isSame(moment(), 'month')) {
          this.picked();
        }
        if (!this.mdbAutoHide) {
          this.open();
        }
      }
    },
    setDefaultDate() {
      this.date.time = this.value || this.defaultDate;
      if (typeof this.defaultDateWrapper === String) {
        return new Date(this.defaultDateWrapper);
      }
      return this.defaultDateWrapper;
    },
    emitDate() {
      this.$emit('change', this.date.time);
    },
    handleKeyPress(e) {
      e.stopPropagation();
      if (e.keyCode === 13 || e.keyCode === 27) {
        this.showInfo.check=false;
      }
      else if (e.keyCode === 46) {
        this.clear();
      }
    },
    handleKeyup(e, day) {
      this.checkDay(day);
      e.target.blur();
    }
  },
  mounted() {
    this.setDefaultDate();
  },
  updated() {
    if (!this.showInfo.check) {
      this.$emit('close');
    }
    setTimeout(() => {
      if (this.showInfo.check){
        window.addEventListener('keyup', this.handleKeyPress);
      }
      else {
        window.removeEventListener('keyup', this.handleKeyPress);
      }
    }, 800);
  },
  beforeDestroy() {
    window.removeEventListener('keyup', this.handleKeyPress, false);
  },
  watch: {
    value() {
      this.setDefaultDate();
    }
  }
};

export default DatePicker;
export { DatePicker as mdbDatePicker };
</script>

<style scoped>
.datepicker-overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 99998;
  top: 0;
  left: 0;
  overflow: hidden;
}
.mdb-date-body {
  display: inline-block;
  background: #fff;
  overflow: hidden;
  position: relative;
  font-size: 0.9rem;
  font-family: 'Roboto';
  font-weight: 400;
  line-height: 1.2;
  position: fixed;
  display: block;
  width: 300px;
  max-width: 100%;
  z-index: 99999;
  top: 10%;
  left: 50%;
  -webkit-transform: translate(-50%, 0);
  -ms-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
  box-shadow: 0 12px 36px 16px rgba(0,0,0,.24);
}
.mdb-picker-box {
  background: #fff;
  width: 100%;
  display: inline-block;
  box-sizing: border-box !important;
  -moz-box-sizing: border-box !important;
  -webkit-box-sizing: border-box !important;
  -ms-box-sizing: border-box !important;
  width: 400px;
  max-width: 100%;
  height: 289px;
  text-align: start!important;
}
.mdb-picker-box td {
  height: 34px;
  width: 34px;
  padding: 0;
  line-height: 34px;
  color: #000;
  background: #fff;
  text-align: center;
  cursor: pointer;
}
.mdb-picker-box td:hover {
  background: #E6E6E6;
}

.the-date {
  font-size: 4.5rem;
  line-height: 1.25;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
}
.day {
  width: 14.2857143%;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  height: 43px;
  padding: 0;
  line-height: 42px;
  color: #595959;
  background: #fff;
  vertical-align: middle;
  border-radius: 50%;
}
.day:not(.unavailable):hover {
  cursor: pointer;
  color: #000;
  font-weight: 500;
  background-color: #eee;
}
.week ul {
  margin: 0 0 8px;
  padding: 0;
  list-style: none;
}
.week ul li {
  width: 14.2%;
  display: inline-block;
  text-align: center;
  background: transparent;
  color: #999;
  font-weight: bold;
  padding-top: 20px;
}
.passive-day {
  color: #bbb;
}
.checked {
  background: #F50057;
  color: #FFF !important;
  border-radius: 50%;
  box-shadow: 0 5px 11px 0 rgba(0,0,0,.18), 0 4px 15px 0 rgba(0,0,0,.15);
  -webkit-transform: scale(.9);
  -ms-transform: scale(.9);
  transform: scale(.9);
}
.unavailable {
  color: #ccc;
  cursor: not-allowed;
}
.mdb-date-monthly {
  height: 185px;
}
.mdb-date-monthly > div {
  padding: 0;
  margin: 0;
  vertical-align: middle;
  color: #fff;
  height: 185px;
  float: left;
  text-align: center;
  cursor: pointer;
}
.mdb-date-previous,
.mdb-date-next {
  position: relative;
  width: 20% !important;
  text-indent: -300px;
  overflow: hidden;
  color: #fff;
  height: 185px;
}
.mdb-date-caption {
  width: 60%;
  padding: 18px 0!important;
  box-sizing: border-box;
  font-size: 24px;
}
.year {
  color: rgba(255,255,255,.4);
  font-weight: 300;
  font-size: 1.8rem;
}
.mdb-date-caption span:hover {
  color: rgba(255, 255, 255, 0.7);
}
.mdb-date-previous:hover,
.mdb-date-next:hover {
  background: rgba(255, 255, 255, 0.1);
}
.unavailable:hover {
  background: none;
}
.checked:hover {
  background: #FF4F8E;
}
.mdb-date-next::before,
.mdb-date-previous::before {
  width: 20px;
  height: 2px;
  text-align: center;
  position: absolute;
  background: #fff;
  top: 50%;
  margin-top: -7px;
  margin-left: -7px;
  left: 50%;
  line-height: 0;
  content: '';
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  transform: rotate(45deg);
}
.mdb-date-next::after,
.mdb-date-previous::after {
  width: 20px;
  height: 2px;
  text-align: center;
  position: absolute;
  background: #fff;
  margin-top: 6px;
  margin-left: -7px;
  top: 50%;
  left: 50%;
  line-height: 0;
  content: '';
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  transform: rotate(-45deg);
}
.mdb-date-previous::after {
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  transform: rotate(45deg);
}
.mdb-date-previous::before {
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  transform: rotate(-45deg);
}
.date-item {
  text-align: center;
  font-size: 20px;
  padding: 10px 0;
  cursor: pointer;
}
.date-item:hover {
  background: #e0e0e0;
}
.date-list {
  overflow: auto;
  vertical-align: top;
  padding: 0;
}
.button-box {
  background: #fff;
  vertical-align: top;
  height: 50px;
  line-height: 50px;
  text-align: right;
  padding: 20px auto;
  padding-right: 10px;
  margin-top: 10px;
}
.button-box span {
  cursor: pointer;
  padding: 10px 15px;
}
.button-box span:hover {
  background: #eee;
  color: #000;
}
.watch-box {
  height: 100%;
  overflow: hidden;
}
.hour-box,
.min-box {
  width: 50%;
  text-align: center;
  height: 100%;
  overflow: auto;
  float: left;
}
.hour-box ul,
.min-box ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.hour-item,
.min-item {
  padding: 10px;
  font-size: 36px;
  cursor: pointer;
}
.hour-item:hover,
.min-item:hover {
  background: #E3E3E3;
}
.hour-box .active,
.min-box .active {
  background: #F50057;
  color: #FFF !important;
}
::-webkit-scrollbar {
  width: 2px;
}
::-webkit-scrollbar-track {
  background: #E3E3E3;
}
::-webkit-scrollbar-thumb {
  background: #C1C1C1;
  border-radius: 2px;
}
div:focus {
  outline: none;
  background: rgba(0,0,0,.15);
}
</style>

<style>
.mdb-datepicker input[type="text"]:not(.browser-default) {
  cursor: pointer;
}
</style>