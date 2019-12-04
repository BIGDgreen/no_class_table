<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="phoneRegister">
        <bm_phone_login  @parent_choose_area="to_chooseArea"
                         @parent_get_code="getCode"
                         @parent_phone_login="phoneLogin"
                         v-on:accountLogin="to_account_login"
                         :base-config="myConfig">
            <!-----------------------可以自定义内容放在header中(以下为示例)--------------------------->
            <template v-slot:header>
                <div style="display: flex;flex-direction: column;align-items: flex-start;">
                    <h1>无课表</h1>
                    <h2>注册</h2>
                </div>
            </template>
            <!--------------------------------初始区号：+86(建议不要改变)-------------------------->
            <template v-slot:country_tel>+{{countryTel}}</template>
        </bm_phone_login>
    </div>
</template>

<script>
    export default {
        name: "phoneLogin",
        data(){
            return{
                countryTel:"",
                myConfig: {
                    code_length:6,
                    accountLogin:true,
                    changedPhone: false,
                    protocol: false,
                    otherLoginWays: false,
                    login_btn_value:'注册'
                }
            }
        },
        methods:{
            to_account_login(){
              //跳转到账号密码登录页面
              this.$router.push({path:'/login'});
            },
            to_chooseArea(){
                // 跳转到区号选择页面
                this.$router.push({path:'/selectCode'});
            },
            getCode(tel){
                //获取验证码
                console.log("tel:"+tel);//用户输入的手机号
                let params = new URLSearchParams();
                //参数：手机号（可根据自己需要自行添加）
                params.append('tel',tel);
                params.append('action','register');
                //发送请求
                this.$axios.post(this.baseUrl+'/sys/sms/send',params)
                    .then((res) => {
                        console.log(res);
                        let errorMsg = "";
                        if (res.data.status === "fail") {
                            if (res.data.data.errorMsg === "验证码已发送") {
                                errorMsg = "请勿重复发送验证码"
                            } else {
                                errorMsg = res.data.data.errorMsg;
                            }
                            //全局提示
                            this.$notification.open({
                                message: errorMsg,
                                icon: <a-icon type="exclamation-circle" style="color: #FF434B" />
                            });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            },
            phoneLogin(inputInfo){
                //进入账号密码设置页面
                console.log(inputInfo);//用户输入的手机号及验证码
                let params = new URLSearchParams();
                //参数：手机号，验证码（可根据自己需要自行添加）
                params.append('tel',inputInfo.phone);
                params.append('code',inputInfo.code);
                params.append('_method','PUT');
                //发送请求
                this.$axios.post(this.baseUrl+'/sys/sms/validate',params)
                // this.axios.put(this.baseUrl+`/sys/sms/validate?tel=${inputInfo.phone}&code=${inputInfo.code}`)
                    .then((res) => {
                        console.log(res);
                        if (res.data.status === 'success'){
                            localStorage.setItem('login_key',res.data.data);
                            // 跳转到设置账号密码登录页面
                            this.$router.push({
                                name: "register",
                                params: {
                                    tel: inputInfo.phone
                                }
                            });
                        } else {

                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        },
        mounted() {
            this.countryTel = this.$route.params.tel || 86;
        }
    }
</script>

<style scoped>
    .phoneRegister{
        height: 100vh;
        overflow: hidden;
    }
</style>
