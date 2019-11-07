import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
// import EleMultiCascader from "ele-multi-cascader"
// import "ele-multi-cascader/dist/cascader.css"
//
// Vue.use(Element)
// Vue.use(EleMultiCascader)


Vue.config.productionTip = false;

Vue.use(ElementUI);

new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App }
})
