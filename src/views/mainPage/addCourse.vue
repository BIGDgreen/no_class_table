<template>
    <div class="addCourse">
        <div class="header">
            <div class="back" @click="goback()"><a-icon type="left" /></div>
            <div class="title">添加课程</div>
        </div>
        <div class="addCourse_wrapper">
            <div v-for="(add_form,i) in add_forms">
                <a-divider orientation="left"><div class="number">{{i+1}}</div></a-divider>
                <div class="add_class_wrapper">
                    <a-form>
                        <!------------------------------------------课程时间----------------------------------------------->
                        <div class="add_class_course">
                            <div class="course_selection_wrapper">
                                <div>
                                    <a-select defaultValue="周一" @select="selectWeek($event,i)">
                                        <a-select-option value="周一">周一</a-select-option>
                                        <a-select-option value="周二">周二</a-select-option>
                                        <a-select-option value="周三">周三</a-select-option>
                                        <a-select-option value="周四">周四</a-select-option>
                                        <a-select-option value="周五">周五</a-select-option>
                                    </a-select>
                                </div>
                                <div class="course_selection_item">
                                    <a-select defaultValue="12" @change="selectPeriod($event,i)">
                                        <a-select-option value="12">12</a-select-option>
                                        <a-select-option value="34">34</a-select-option>
                                        <a-select-option value="56">56</a-select-option>
                                        <a-select-option value="78">78</a-select-option>
                                        <a-select-option value="910">910</a-select-option>
                                        <a-select-option value="91011">91011</a-select-option>
                                    </a-select>
                                </div>
                                <div class="course_num_text">节</div>
                            </div>
                            <div class="buttons">
                                <a-button type="primary" shape="circle" icon="plus" @click="plusClass(i)" size="small" ghost></a-button>
                                <a-button type="danger" shape="circle" icon="delete" @click="lessClass(i)" size="small" ghost v-if="i>0"></a-button>
                            </div>
                        </div>
                        <!-------------------------------------------课程周次---------------------------------------------->
                        <div class="add_class_week" v-for="(add_week_form,j) in add_form.add_week_forms">
                            <div class="week_selection_wrapper">
                                <a-input-number :min="1" :max="19" v-model="add_week_form.startWeek"/>
                                <div class="range_text">至</div>
                                <a-input-number :min=add_week_form.startWeek+1 :max="20" v-model="add_week_form.endWeek"/>
                                <div class="week_text">周</div>
                            </div>
                            <div class="buttons">
                                <a-button type="primary" shape="circle" icon="plus" @click="plusWeek(add_forms[i].id,j)" size="small" ghost></a-button>
                                <a-button type="danger" shape="circle" icon="delete" @click="lessWeek(add_forms[i].id,j)" size="small" ghost v-if="j>0"></a-button>
                            </div>
                        </div>
                    </a-form>
                </div>
            </div>
        </div>
        <div class="submitBtn">
            <a-button type="primary" ghost @click="submit" :loading="loading">提交</a-button>
        </div>
    </div>
</template>

<script>
    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 8 },
    };
    export default {
        name: "addCourse",
        data(){
          return{
              loading: false,
              formItemLayout,
              form: this.$form.createForm(this),
              add_forms:[
                  {
                      id:0,
                      week:"周一",//当前选择的星期
                      period:12,//当前选择的节数
                      add_week_forms:[{
                          index:0,
                          startWeek:1,
                          endWeek:2
                      }],
                      weeks_text:[],
                      weeks:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]//当前选择的周次，已选为1，未选为0(共二十周)
                  }
              ]
          }
        },
        methods:{
            goback(){
                // 返回主页
                this.$router.push({path:'/'});
            },
            judgeExist(){
                let that = this;
                this.axios.get(this.baseUrl+'/course',{
                    params:{
                        user_id:sessionStorage.getItem("user_id")
                    },
                    headers:{
                        'Authorization':sessionStorage.getItem('token'),
                    }
                })
                    .then((res) => {
                        res.data.data.map((course) => {
                            that.add_forms.map((add_form) => {
                                if (add_form.week === course.week && add_form.period === course.period) {
                                    //课程已存在，不能添加
                                    //全局提示
                                    this.$notification.open({
                                        message: `${add_form.week}的${add_form.period}已存在，不能重复添加（如有需要，请在编辑里修改）`,
                                        icon: <a-icon type="exclamation-circle" style="color: #FF434B" />
                                    });
                                    this.loading = false;
                                }
                            })
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            },
            submit(){
                // console.log("after_add_forms",JSON.stringify(this.add_forms));
                //提交
                this.form.validateFields(
                    (err) => {
                        if (!err) {
                            let that = this;
                            // let success = [];
                            console.log("add_forms",this.add_forms);
                            //判断用户添加的课程是否已经存在
                            this.judgeExist();
                            //将用户输入的起止周转化为20个01形式
                            for (let i = 0 ; i < this.add_forms.length ; i++){
                                for (let j = 0 ; j < this.add_forms[i].add_week_forms.length ; j++){
                                    this.add_forms[i].weeks_text.push(this.add_forms[i].add_week_forms[j].startWeek+"-"+this.add_forms[i].add_week_forms[j].endWeek);//文字形式
                                    for (let k = this.add_forms[i].add_week_forms[j].startWeek - 1 ; k < this.add_forms[i].add_week_forms[j].endWeek ; k++){
                                        that.add_forms[i].weeks[k] = 1;
                                    }
                                }
                                this.add_forms[i].weeks = this.add_forms[i].weeks.join("");
                                this.add_forms[i].weeks_text = this.add_forms[i].weeks_text.join();
                            }
                            console.log("after_edit",this.add_forms);
                            this.loading = true;//按钮进入加载状态
                            //删除原对象中的add_week_forms，得到一个新的对象
                            let new_add_forms = [];
                            this.add_forms.map((add_form) => {
                                new_add_forms.push((({week, period, weeks_text, weeks}) => ({week, period, weeks_text, weeks}))(add_form));
                            });
                            console.log("new_add_forms",new_add_forms);
                            //发送请求，将用户添加的课程以数组的形式发给后端
                            let params = new URLSearchParams();
                            params.append("add_forms_arr",JSON.stringify(new_add_forms));
                            params.append("user_id",sessionStorage.getItem("user_id"));
                            this.axios.post(this.baseUrl+'/course',params,{
                                headers:{
                                    'Token':sessionStorage.getItem('token')
                                }
                            })
                                // for (let i = 0 ; i < this.add_forms.length ; i ++){
                                //     // this.finishItem.push(false);
                                //     let params = new URLSearchParams();
                                //     params.append('user_id',sessionStorage.getItem('user_id'));
                                //     params.append('period',this.add_forms[i].selected_period);
                                //     params.append('week',this.add_forms[i].selected_week);
                                //     params.append('weeks',this.add_forms[i].selected_weeks.join(""));
                                //     params.append("weeks_text",this.add_forms[i].selected_weeks_text.join());
                                //     this.axios.post(this.baseUrl+'/course',params,{
                                //         headers:{
                                //             'Token':sessionStorage.getItem('token'),
                                //         }
                                //     })
                                .then((res) => {
                                    console.log("res",res);
                                    if (res.data.status === "fail"){
                                        //显示错误信息
                                        this.$notification.open({
                                            message: res.data.data.errorMsg,
                                            icon: <a-icon type="exclamation-circle" style="color: #FF434B" />
                                        });
                                        this.loading = false;
                                    } else {
                                        //请求发送成功
                                        setTimeout(() => {
                                            //按钮加载状态结束
                                            that.loading = false;
                                            //全局提示
                                            that.$notification.open({
                                                message: '添加成功',
                                                icon: <a-icon type="check-circle" style="color: #108ee9" />
                                            });
                                            //跳转到主页
                                            that.$router.push({path:'/'});
                                        },1500);
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                    //请求失败，向用户显示错误信息
                                    this.$notification.open({
                                        message: '发生未知错误，请再试一次！',
                                        icon: <a-icon type="exclamation-circle" style="color: #FF434B" />
                                    });
                                    this.loading = false;
                                })
                            // if (success.length === 0){            //请求全部成功
                            //     //所有请求都发送成功
                            //     setTimeout(() => {
                            //         this.loading = false;
                            //         //全局提示
                            //         this.$notification.open({
                            //             message: '添加成功',
                            //             icon: <a-icon type="check-circle" style="color: #108ee9" />
                            //     });
                            //         //跳转到主页
                            //         this.$router.push({path:'/'});
                            //     },1500);
                            // } else {
                            //     this.$notification.open({
                            //         message: errMsg,
                            //         icon: <a-icon type="exclamation-circle" style="color: #FF434B" />
                            //     });
                            // }
                        }
                    },
                );
            },
            selectWeek(value,index) {
                //将用户选择的周存入数组
                this.add_forms[index].week = value;
            },
            selectPeriod(value,index){
                //将用户选择的节次存入数组
                this.add_forms[index].period = value;
            },
            /*******
             * 按钮操作
             */
            plusClass(i){
                //添加课程
                this.add_forms.push({
                    id:i+1,
                    week:"周一",
                    period:12,
                    add_week_forms:[{
                        index:0,
                        startWeek:1,
                        endWeek:2
                    }],
                    weeks_text:[],
                    weeks:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                });
            },
            lessClass(i){
                //删除课程
                if (i > 0){
                    this.add_forms.splice(i,1);
                }
            },
            plusWeek(i,j){
                //同一课程，添加周次
                this.add_forms[i].add_week_forms.push({
                    index:j+1,
                    startWeek:this.add_forms[i].add_week_forms[j].endWeek + 1,
                    endWeek:this.add_forms[i].add_week_forms[j].endWeek + 2
                });
            },
            lessWeek(i,j){
                console.log(i,j);
                //同一课程，删除周次
                this.add_forms[i].add_week_forms.splice(j,1)
            },
        }
    }
</script>

<style lang="less" scoped>
    @mainColor:#3fa4ff;
    @headerHeight:3rem;
    @maxWidth:350px;
    .addCourse{
        margin: 0 auto;
        //顶部操作栏
        .header{
            width: 100%;
            height: @headerHeight;
            background: #f6f6f6;
            border-bottom: 1px solid #eeeeee;
            box-shadow: 0 2px 6px #b3b3b3;
            display: flex;
            flex-direction: row;
            align-items: center;
            .back{
                margin-left: 1.2rem;
                flex: 1;
            }
            .title{
                margin-left: 1.2rem;
                color: @mainColor;
                flex: 2;
            }
        }
        .number{
            color: rgba(0,0,0,0.54);
        }
        //提交按钮
        .submitBtn{
            width: 100%;
            text-align: center;
            /deep/ .ant-btn-primary{
                width: 54%;
                margin: 3.2rem auto;
            }
        }
        .addCourse_wrapper{
            width: 90%;
            margin: 1rem auto 0 auto;
            .add_class_wrapper{
                display: flex;
                flex-direction: column;
                width: 86%;
                margin: 0 auto;
                text-align: center;
                @media(max-width: @maxWidth){
                    width: 96%;
                }
                .add_class_course{
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    .course_selection_wrapper{
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        .course_selection_item{
                            margin-left: 1rem;
                        }
                        .course_num_text{
                            margin-left: .68rem;
                        }
                    }
                }
                /deep/ .ant-input-number{
                    width: 74px;
                    @media(max-width: @maxWidth){
                        width: 68px;
                    }
                }
                /deep/ .ant-select-selection{
                    width: 84px;
                    @media(max-width: @maxWidth){
                        width: 78px;
                    }
                }

                .add_class_week{
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    margin-top: .72rem;
                    .week_selection_wrapper{
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        .range_text{
                            margin-left: .68rem;
                            margin-right: .68rem;
                        }
                        .week_text{
                            margin-left: .68rem;
                        }
                    }
                }
                .buttons{
                    display: flex;
                    flex-direction: row;
                    margin-left: 1.2rem;
                    /deep/ .ant-btn-danger{
                        margin-left: 1rem;
                    }
                }
            }
        }
    }
</style>
