<template>
  <div class="register">
    <bm_login :base-config="myConfig"
              v-on:forgetPassword="to_forgetPassword"
              @parent_login="register">
      <!-----------------------可以自定义内容放在header中(以下为示例)--------------------------->
      <template v-slot:header>
        <div style="display: flex;flex-direction: column;align-items: flex-start;">
          <h1>无课表</h1>
          <h2>设置账号密码</h2>
        </div>
      </template>
    </bm_login>
  </div>
</template>

<script>
  // 按需引入部分组件
  import { Toast } from 'mint-ui';
  import 'mint-ui/lib/style.css'

  export default {
    name: "register",
    data(){
      return{
        myConfig:{
          forgetPwd_register_protocol: true,
          //为false时，下面三项设置为true无效
          forgetPassword:false,
          register:false,
          protocol:false,
          rememberPassword:false,
          quickLogin:false,
          otherLoginWays: false,
          login_btn_value:'注册'
        }
      }
    },
    methods:{
      //根据配置自行选择需要的方法
      to_forgetPassword(){
        //进入忘记密码页面
        this.$router.push({path:'/phoneLogin'});
      },
      register(input_info){
        //注册
        console.log(input_info);    //用户输入的用户名和密码
        let params = new URLSearchParams();
        params.append('nickname',input_info.username);
        params.append('password',input_info.password);
        params.append('sms_key',localStorage.getItem('login_key'));
        params.append('tel',this.$route.params.tel);
        this.axios.post(this.baseUrl+'/user',params)
            .then((res) => {
              console.log(res);
              if (res.data.status === 'success'){
                Toast({
                  message: '注册成功',
                  position: 'middle',
                });
                this.$router.push('/login');
              } else {
                //全局提示
                this.$notification.open({
                  message: res.data.data.errorMsg,
                  icon: <a-icon type="exclamation-circle" style="color: #FF434B" />
                });
              }
            })
            .catch((err) => {
              console.log(err);
            })
      }
    }
  }
</script>

<style scoped>
  .register{
    height: 100vh;
    overflow: hidden;
  }
</style>
