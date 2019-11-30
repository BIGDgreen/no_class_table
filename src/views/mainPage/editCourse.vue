<template>
    <div class="editCourse">
        <div class="header">
            <div class="back" @click="goback()"><a-icon type="left" /></div>
            <div class="title">编辑课程</div>
        </div>
        <div class="editCourse_wrapper">
            <div v-for="(edit_form,i) in edit_forms" :key="edit_form.id">
<!--                <div :class="{changeColor:finishItem[i]}">-->
                    <a-divider orientation="left"><div class="number">{{i+1}}</div></a-divider>
<!--                </div>-->
                <div class="edit_class_wrapper">
                    <a-form>
                        <!------------------------------------------课程时间----------------------------------------------->
                        <div class="edit_class_course">
                            <div class="course_selection_wrapper">
                                <div>
                                    <a-select v-model="edit_form.week" @select="selectWeek($event,i)">
                                        <a-select-option value="周一">周一</a-select-option>
                                        <a-select-option value="周二">周二</a-select-option>
                                        <a-select-option value="周三">周三</a-select-option>
                                        <a-select-option value="周四">周四</a-select-option>
                                        <a-select-option value="周五">周五</a-select-option>
                                    </a-select>
                                </div>
                                <div class="course_selection_item">
                                    <a-select v-model="edit_form.period" @change="selectPeriod($event,i)">
                                        <a-select-option value="12">12</a-select-option>
                                        <a-select-option value="34">34</a-select-option>
                                        <a-select-option value="56">56</a-select-option>
                                        <a-select-option value="78">78</a-select-option>
                                        <a-select-option value="910">910</a-select-option>
                                        <a-select-option value="91011">91011</a-select-option>
                                    </a-select>
                                </div>
                                <div class="course_num_text">节</div>
                                <div class="buttons">
                                    <a-button type="primary" shape="circle" icon="plus" @click="plusClass(i)" size="small" ghost></a-button>
                                    <a-button type="danger" shape="circle" icon="delete" @click="lessClass(i)" size="small" ghost></a-button>
                                </div>
                            </div>
                        </div>
                        <!-------------------------------------------课程周次---------------------------------------------->
                        <div class="edit_class_week" v-for="(edit_week_form,j) in edit_form.edit_week_forms" :key="edit_week_form.index">
                            <div class="week_selection_wrapper">
                                <a-input-number :min="1" :max="19" v-model="edit_week_form.startWeek" @change="changeStartWeek($event,i,j)" />
                                <div class="range_text">至</div>
                                <a-input-number :min="1" :max="20" v-model="edit_week_form.endWeek" @change="changeEndWeek($event,i,j)" />
                                <div class="week_text">周</div>
                            </div>
                            <div class="buttons">
                                <a-button type="primary" shape="circle" icon="plus" @click="plusWeek(i,j)" size="small" ghost></a-button>
                                <a-button type="danger" shape="circle" icon="delete" @click="lessWeek(i,j)" size="small" ghost v-if="j>0"></a-button>
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
        name: "editCourse",
        data(){
            return{
                loading: false,
                formItemLayout,
                form: this.$form.createForm(this),
                // finishItem:[false],//该项录入完成为true，否则为false
                edit_forms:[],//实际的课表，删除即从数组中移除，用于显示数据
                new_edit_forms:[]  //传给后台的课表，删除时将数值置空，并非真正删除
            }
        },
        mounted(){
            //获取课表
            let that = this;
            this.axios.get(this.baseUrl+'/course',{
                params:{
                    user_id:localStorage.getItem("user_id")
                },
                headers:{
                    'Authorization':localStorage.getItem('token'),
                }
            })
                .then((res) => {
                    // console.log("res",res);
                    let data = res.data.data;
                    for (let i = 0 ; i < data.length ; i++){
                        //获取初始课表
                        that.edit_forms.push({
                            id:data[i].id,
                            week: data[i].week,
                            period: data[i].period,
                            weeks_text:[],
                            weeks:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                            edit_week_forms: []
                        });
                        that.new_edit_forms.push({
                            id:data[i].id,
                            week: data[i].week,
                            period: data[i].period,
                            weeks_text:[],
                            weeks:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                            edit_week_forms: []
                        });
                        let week_forms = data[i].weeksText.split(",");
                        for(let j = 0 ; j < week_forms.length ; j++){
                            that.edit_forms[i].edit_week_forms.push({
                                index:j,
                                startWeek:week_forms[j].split('-')[0],
                                endWeek:week_forms[j].split('-')[1]
                            });
                            that.new_edit_forms[i].edit_week_forms.push({
                                index:j,
                                startWeek:week_forms[j].split('-')[0],
                                endWeek:week_forms[j].split('-')[1]
                            });
                        }
                    }
                    // console.log("edit_forms",this.edit_forms);
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        methods:{
            goback(){
                this.$router.push({path:'/'});
            },
            submit(){
                //提交
                this.form.validateFields(
                    (err) => {
                        if (!err) {
                            for (let i = 0 ; i < this.new_edit_forms.length ; i++){
                                if (this.new_edit_forms[i].edit_week_forms !== null) {
                                    for (let j = 0 ; j < this.new_edit_forms[i].edit_week_forms.length ; j++){
                                        this.new_edit_forms[i].weeks_text.push(this.new_edit_forms[i].edit_week_forms[j].startWeek+"-"+this.new_edit_forms[i].edit_week_forms[j].endWeek);
                                        for (let k = this.new_edit_forms[i].edit_week_forms[j].startWeek - 1 ; k < this.new_edit_forms[i].edit_week_forms[j].endWeek ; k++ ){
                                            this.new_edit_forms[i].weeks[k] = 1;
                                        }
                                    }
                                    this.new_edit_forms[i].weeks = this.new_edit_forms[i].weeks.join("");
                                    this.new_edit_forms[i].weeks_text = this.new_edit_forms[i].weeks_text.join();
                                }
                            }
                            console.log("new_edit_forms",this.new_edit_forms);
                            this.loading = true;
                            // 删除原对象中的edit_forms，得到一个新的对象
                            let real_edit_forms = [];
                            this.new_edit_forms.map((new_edit_form) => {
                                if ( new_edit_form.period === "91011" ) {
                                    console.log("---------------------");
                                    real_edit_forms.push(
                                        {
                                            week: new_edit_form.week,
                                            period: '910',
                                            weeks_text: new_edit_form.weeks_text,
                                            weeks: new_edit_form.weeks
                                        },
                                        {
                                            week: new_edit_form.week,
                                            period: '11',
                                            weeks_text: new_edit_form.weeks_text,
                                            weeks: new_edit_form.weeks
                                        }
                                    )
                                } else {
                                    real_edit_forms.push((({id, week, period, weeks_text, weeks}) => ({id, week, period, weeks_text, weeks}))(new_edit_form));
                                }
                            });
                            console.log("real_edit_forms",real_edit_forms);
                            let params = new URLSearchParams();
                            params.append('user_id',localStorage.getItem('user_id'));
                            params.append("edit_forms_arr",JSON.stringify(real_edit_forms));
                            params.append("_method","PUT");
                            this.axios.post(this.baseUrl+'/course',params,{
                                headers:{
                                    'Authorization':localStorage.getItem('token'),
                                }
                            })
                                .then((res) => {
                                    // console.log("res",res);
                                    if (res.data.status === "fail"){
                                        let errMsg = res.data.data.errorMsg;
                                        this.loading = false;
                                        this.$notification.open({
                                            message: errMsg,
                                            icon: <a-icon type="exclamation-circle" style="color: #FF434B" />
                                        });
                                    } else {
                                        setTimeout(() => {
                                            this.loading = false;
                                            //全局提示
                                            this.$notification.open({
                                                message: '编辑成功',
                                                icon: <a-icon type="check-circle" style="color: #108ee9" />
                                            });
                                            //跳转到主页
                                            this.$router.push({path:'/'});
                                        },1500);
                                    }
                                })
                                .catch((err) => {
                                    // console.log(err);
                                    // 当前请求失败，向用户显示错误信息
                                    this.$notification.open({
                                        message: '发生未知错误，请再试一次！',
                                        icon: <a-icon type="exclamation-circle" style="color: #FF434B" />
                                    });
                                    this.loading = false;
                                });
                        }
                    },
                );
            },
            selectWeek(value,index) {
                //将用户选择的周存入数组
                this.edit_forms[index].week = value;
                this.new_edit_forms[index].week = value;
            },
            selectPeriod(value,index){
                //将用户选择的节次存入数组
                this.edit_forms[index].period = value;
                this.new_edit_forms[index].period = value;
            },
            changeStartWeek(value,i,j){
                // console.log("changedStart",value);
                this.new_edit_forms[i].edit_week_forms[j].startWeek = value;
            },
            changeEndWeek(value,i,j){
                // console.log("changedEnd,index",value,i);
                this.new_edit_forms[i].edit_week_forms[j].endWeek = value;
                // console.log(this.new_edit_forms);
            },
            /*******
             * 按钮操作
             */
            plusClass(i){
                //添加课程
                this.edit_forms.push({
                    id:-1,
                    week:"周一",
                    period:12,
                    edit_week_forms:[{
                        index:0,
                        startWeek:1,
                        endWeek:2
                    }],
                    weeks_text:[],
                    weeks:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                });
                this.new_edit_forms.push({
                    id:-1,
                    week:"周一",
                    period:12,
                    edit_week_forms:[{
                        index:0,
                        startWeek:1,
                        endWeek:2
                    }],
                    weeks_text:[],
                    weeks:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                });
            },
            lessClass(i){
                // debugger;
                // if (console.log(this.edit_forms.length)) {
                //     console.log("i",i);
                //     console.log("edit_forms",this.edit_forms);
                //删除课程
                if (i > 0) {
                    this.edit_forms.splice(i,1);
                }

                // console.log(this.edit_forms.length)

                //将删除的课程id传给存入数组,其余元素置空
                this.new_edit_forms[i] = {
                    id:this.new_edit_forms[i].id,
                    week:null,
                    period:null,
                    weeks_text:'delete',
                    weeks:null,
                    edit_week_forms: null
                }
            },
            plusWeek(i,j) {
                let edit_week_forms = this.edit_forms[i].edit_week_forms;
                // 同一课程，添加周次
                edit_week_forms.push({
                    index: j + 1,
                    startWeek: parseInt(edit_week_forms[j].endWeek) + 2,
                    endWeek: parseInt(edit_week_forms[j].endWeek) + 3
                });
                // console.log("添加edit_week_forms",edit_week_forms);

                // 数组去重
                for (let m = 0; m < edit_week_forms.length - 1; m++) {
                    for (let n = m + 1; n < edit_week_forms.length; n++) {
                        if (edit_week_forms[m].index === edit_week_forms[n].index) {
                            // 删除第n项
                            this.$delete(edit_week_forms, n);
                        }
                    }
                }

                this.new_edit_forms[i].edit_week_forms.push({
                    index: j+1,
                    startWeek: parseInt(this.new_edit_forms[i].edit_week_forms[j].endWeek) + 2,
                    endWeek: parseInt(this.new_edit_forms[i].edit_week_forms[j].endWeek) + 3
                });
            },
            lessWeek(i,j){
                // console.log(i,j);
                //同一课程，删除周次
                // 删除数组中的第j项
                this.$delete(this.edit_forms[i].edit_week_forms, j);
                // this.edit_forms[i].edit_week_forms.splice(j,1);
                // console.log("删除edit_week_forms",this.edit_forms[i].edit_week_forms);
                //将删除周次的课程id传给存入数组
                this.new_edit_forms[i] = {
                    id: this.new_edit_forms[i].id,
                    week: this.new_edit_forms[i].week,
                    period: this.new_edit_forms[i].period,
                    weeks_text: this.new_edit_forms[i].weeks_text,
                    weeks: this.new_edit_forms[i].weeks,
                    edit_week_forms: this.edit_forms[i].edit_week_forms  //传入删除周次后的周次
                }
            },
        }
    }
</script>

<style lang="less" scoped>
    @mainColor:#3fa4ff;
    @headerHeight:3rem;
    @maxWidth:350px;
    .editCourse{
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
        .editCourse_wrapper{
            width: 90%;
            margin: 1rem auto 0 auto;
            /*改变分割线和文字颜色*/
            /*<!--.changeColor{-->*/
            /*<!--    /deep/ .ant-divider-horizontal.ant-divider-with-text:before, .ant-divider-horizontal.ant-divider-with-text-left:before, .ant-divider-horizontal.ant-divider-with-text-right:before, .ant-divider-horizontal.ant-divider-with-text:after, .ant-divider-horizontal.ant-divider-with-text-left:after, .ant-divider-horizontal.ant-divider-with-text-right:after{-->*/
            /*<!--        border-top:1px solid @mainColor;-->*/
            /*<!--    }-->*/
            /*<!--    .number{-->*/
            /*<!--        color: @mainColor;-->*/
            /*<!--    }-->*/
            /*<!--}-->*/
            .edit_class_wrapper{
                display: flex;
                flex-direction: column;
                width: 86%;
                margin: 0 auto;
                text-align: center;
                @media(max-width: @maxWidth){
                    width: 96%;
                }
                .edit_class_course{
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

                .edit_class_week{
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
