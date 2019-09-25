import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
Vue.prototype.axios = axios;
//引入图标
import './assets/css/iconfont.css'
//引入悬浮菜单组件
import VueFab from 'vue-float-action-button'
Vue.use(VueFab,{
  iconType:'iconfont'
});
//引入登录组件
import bm_Vlogin from 'bm-vlogin'
Vue.use(bm_Vlogin);
//引入侧拉菜单组件
import {DrawerLayout} from 'vue-drawer-layout'
Vue.component(DrawerLayout.name, DrawerLayout);
//引入ant design组件
import DropDown from 'ant-design-vue/lib/dropdown'
import Menu from 'ant-design-vue/lib/menu'
import Icon from 'ant-design-vue/lib/icon'
import Modal from 'ant-design-vue/lib/modal'
import Button from 'ant-design-vue/lib/button'
import Form from 'ant-design-vue/lib/form'
import Input from 'ant-design-vue/lib/input'
import InputNumber from 'ant-design-vue/lib/input-number'
import Notification from 'ant-design-vue/lib/notification'
Vue.prototype.$notification = Notification;
import Select from 'ant-design-vue/lib/select'
import Divider from 'ant-design-vue/lib/divider'
import Carousel from 'ant-design-vue/lib/carousel'
import Spin from 'ant-design-vue/lib/spin'
import Switch from 'ant-design-vue/lib/switch'
import 'ant-design-vue/dist/antd.css'
Vue.use(DropDown);
Vue.use(Menu);
Vue.use(Icon);
Vue.use(Modal);
Vue.use(Button);
Vue.use(Form);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Select);
Vue.use(Divider);
Vue.use(Carousel);
Vue.use(Spin);
Vue.use(Switch);

// Vue.prototype.baseUrl='http://10.111.144.242:8688';
Vue.prototype.baseUrl='http://39.106.92.171:8688';//服务器
// Vue.prototype.baseUrl='http://192.168.0.130:8688'; //2A311

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
