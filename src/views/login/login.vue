<template>
    <div class="login">
        <bm_login :base-config="myConfig"
                  v-on:register="to_register"
                  v-on:forgetPassword="to_forgetPassword"
                  @parent_login="login">
            <!-----------------------可以自定义内容放在header中(以下为示例)--------------------------->
            <template v-slot:header>
                <div style="display: flex;flex-direction: column;align-items: flex-start;">
                    <h1>无课表</h1>
                    <h2>登录</h2>
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
        name: "login",
        data(){
            return{
                myConfig:{
                    forgetPwd_register_protocol: true,
                    //为false时，下面三项设置为true无效
                    forgetPassword:true,
                    register:true,
                    protocol:false,
                    rememberPassword:true,
                    quickLogin:false,
                    otherLoginWays: false,
                    login_btn_value:'登录'
                }
            }
        },
        methods:{
            //根据配置自行选择需要的方法
            to_register(){
              this.$router.push({path:'/phoneRegister'})
            },
            to_forgetPassword(){
                //进入忘记密码页面
                this.$router.push({path:'/forgetPassword'});
            },
            login(input_info){
                //登录
                console.log(input_info);    //用户输入的用户名和密码
                let params = new URLSearchParams();
                params.append('username',input_info.username);
                params.append('password',input_info.password);
                this.axios.post(this.baseUrl+'/user/login',params)
                    .then((res) => {
                        console.log("res",res);
                        //保存user_id
                        sessionStorage.setItem("user_id",res.data.name);
                        //保存登录状态
                        sessionStorage.setItem("logined",res.data.authenticated);
                        //保存token
                        sessionStorage.setItem("token",res.headers.token);
                        if (res.data.authenticated){
                            this.$router.push({path:'/'});
                        } else{
                            Toast({
                                message: res.data.data,
                                position: 'middle',
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
    .login{
        height: 100vh;
        overflow: hidden;
    }
</style>
