import Vue from 'vue'
import App from './App.vue'

// // 字体自适应
// import "./assets/js/rem.js";

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
