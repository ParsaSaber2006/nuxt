<template>
  <div
    :style="{
      width: `${percent}%`,
      height: height,
      top: '1px',
      opacity: show ? 1 : 0,
      'background-color': canSuccess ? color : failedColor,
    }"
    class="progress"
  />
</template>
<script>
import { useAppProgressStore } from "@/stores/appProgress";

// https://github.com/nuxt/nuxt.js/blob/master/lib/app/components/nuxt-loading.vue
export default {
  name: 'AppProgress',
  data: () => ({
    percent: 20,
    show: false,
    canSuccess: true,
    duration: 3000,
    height: "2px",
    color: "#fff",
    failedColor: "red",
  }),
  computed: {
    progressbar() {
      return useAppProgressStore();
    },
    loading() {
      return this.progressbar.loading;
    },
  },
  watch: {
    loading(val) {
      if(val){
        this.start();
      }
      else{
        this.finish();
      }
    },
  },
  methods: {
    start() {
      this.show = true;
      this.canSuccess = true;
      if (this._timer) {
        clearInterval(this._timer);
        this.percent = 20;
      }
      this._cut = 10000 / Math.floor(this.duration);
      this._timer = setInterval(() => {
        this.increase(this._cut * Math.random());
        if (this.percent > 95) {
          this.finish();
        }
      }, 100);
      return this;
    },
    set(num) {
      this.show = true;
      this.canSuccess = true;
      this.percent = Math.floor(num);
      return this;
    },
    get() {
      return Math.floor(this.percent);
    },
    increase(num) {
      this.percent = this.percent + Math.floor(num);
      return this;
    },
    decrease(num) {
      this.percent = this.percent - Math.floor(num);
      return this;
    },
    finish() {
      this.percent = 100;
      this.hide();
      return this;
    },
    pause() {
      clearInterval(this._timer);
      return this;
    },
    hide() {
      clearInterval(this._timer);
      this._timer = null;
      setTimeout(() => {
        this.show = false;
        this.$nextTick(() => {
          setTimeout(() => {
            this.percent = 20;
          }, 200);
        });
      }, 500);
      return this;
    },
    fail() {
      this.canSuccess = false;
      return this;
    },
  },
};
</script>

<style scoped>
.progress {
  position: fixed;
  top: 0px;
  right: 0px;
  height: 60px;
  width: 0%;
  transition: width 0.2s, opacity 0.4s;
  opacity: 1;
  background-color: #efc14e;
  z-index: 999999;
}
</style>
