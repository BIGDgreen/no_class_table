<template>
    <div class="resetPassword">
        <bm_reset_password @parent_finish="finish_modify">
            <!-----------------------可以自定义内容放在header中(以下为示例)--------------------------->
            <template v-slot:header>
                <div style="display: flex;flex-direction: column;align-items: flex-start;">
                    <h1>无课表</h1>
                    <h2>重置密码</h2>
                </div>
            </template>
        </bm_reset_password>
    </div>
</template>

<script>
    // 按需引入部分组件
    import { Toast } from 'mint-ui';
    import 'mint-ui/lib/style.css'

    export default {
        name: "resetPassword",
        data(){
            return{

            }
        },
        methods:{
            finish_modify(password){
                // console.log(password);
                //发送请求，提交用户输入的新密码
                let params = new URLSearchParams();
                params.append('password',password);  //用户输入的新密码
                params.append('sms_key',localStorage.getItem('login_key'));
                params.append('tel',this.$route.params.tel);
                this.axios.post(this.baseUrl+'user/resetPassword',params)
                    .then((res) => {
                        console.log(res);
                        if (res.data.status === "fail") {
                            //全局提示
                            this.$notification.open({
                                message: res.data.data.errorMsg,
                                icon: <a-icon type="exclamation-circle" style="color: #FF434B" />
                            });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });

                //跳转到登录页面
                this.$router.push('/login');
            }
        }
    }
</script>
