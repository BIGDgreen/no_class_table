<template>
    <div class="mainPage">
        <div v-if="logined">
            <vue-drawer-layout
                    ref="drawer"
                    :drawer-width="250"
                    :enable="true"
                    :animatable="true"
                    :z-index="0"
                    :drawable-distance="Math.floor(800/3)"
                    :content-drawable="true"
                    :backdrop="true"
                    :backdrop-opacity-range="[0,0.4]">
                <div class="drawer-content" slot="drawer">
                    <!------------------------------------------左拉菜单内容-------------------------------------------------->
                    <a-menu
                            @click="handleClick"
                            style="width: 250px"
                            :defaultSelectedKeys="['1']"
                            :openKeys.sync="openKeys"
                            mode="inline">
                        <a-sub-menu key="sub1" @titleClick="titleClick">
                            <span slot="title"><a-icon type="appstore" /><span>我管理的</span></span>
                            <a-sub-menu v-for="(group,index) in manage_groups" :key="'g1,'+index+group.org" :title="group.org" @titleClick="orgClick">
                                <a-menu-item v-for="(part,k) in group.parts" :key="'1,'+index+','+k+part.branch_name" @click="partClick">{{part.branch_name}}</a-menu-item>
                            </a-sub-menu>
                        </a-sub-menu>

                        <a-sub-menu key="sub2" @titleClick="titleClick">
                            <span slot="title"><a-icon type="plus" /><span>我加入的</span></span>
                            <a-sub-menu v-for="(group,index) in join_groups" :key="'g2,'+index+group.org" :title="group.org" @titleClick="orgClick">
                                <a-menu-item v-for="(part,k) in group.parts" :key="'2,'+index+','+k+part.branch_name">{{part.branch_name}}</a-menu-item>
                            </a-sub-menu>
                        </a-sub-menu>
                    </a-menu>
                    <!--删除按钮-->
                    <div class="menu_delete_btn" v-if="deleteAllowed">
                        <a-button type="danger" shape="circle" icon="delete" @click="deleteBranch" ghost></a-button>
                    </div>
                    <!--编辑按钮-->
                    <div class="menu_edit_btn" v-if="isManager">
                        <a-button type="primary" shape="circle" icon="edit" @click="editBranch" ghost></a-button>
                    </div>

                    <!--注销登录按钮-->
                    <div class="menu_exit_btn">
                        <a-button type="danger" shape="circle" icon="poweroff" @click="exitLogin" ghost></a-button>
                    </div>
                </div>

                <div slot="content" class="mainContent">
                    <!-- main-content -->
                    <div class="header">
                        <div class="logo"><b>Fehead</b></div>
                            <!---------------周次---------------->
                            <div v-if="isManager">
                                <a-dropdown>
                                    <a class="ant-dropdown-link" href="#">
                                        {{defaultWeek}}<a-icon type="down" />
                                    </a>
                                    <a-menu slot="overlay" @click="onClick_week">
                                        <a-menu-item v-for="(weeknum,index) in weeknums" :key="index">{{weeknum}}</a-menu-item>
                                    </a-menu>
                                </a-dropdown>
                            </div>
                            <!---------------左拉菜单按钮---------------->
                            <span class="iconfont icon-NMStubiao-" @click="showLayer()"></span>
                        </div>
<!----------------------------------------------------------------------课程表-------------------------------------------------------------------->
                        <div class="course_table">
                            <div class="column" :class="'column'+index" v-for="(day,index) in courses" :key="index">
                                <div class="course_header">
                                    {{day.weekday}}
                                </div>
                                <div v-for="(course,k) in courses[index].classes" :key="k" class="rows" :class="{rowsFull:course!==''}" ref="rows_style">
                                    <div class="cell" :ref="'cell_style'">
                                        <pre>{{course}}</pre>
                                    </div>
                                </div>
                            </div>
                        </div>

<!-------------------------------------------------底部按钮-------------------------------------------------------------->
                    <div class="button_wrapper">
                        <!-------------------------点开菜单------------------------------->
                        <div class="menuBtn">
                            <vue-fab icon="icon-jiahao"
                                     mainBtnColor="#3fa4ff"
                                     :scrollAutoHide = scrollAutoHide
                            >
                                <fab-item
                                        v-for="(item, index) in menu"
                                        :idx="index"
                                        :title="item.title"
                                        :color="item.color"
                                        :icon="item.icon"
                                        size="big"
                                        @clickItem="clickItem" />
                            </vue-fab>
                        </div>
                        <!---------------------------包括我开关--------------------------->
                        <div class="includeMeBtn" v-if="isManager">
                            <a-switch checkedChildren="包括我" unCheckedChildren="不包括我" defaultChecked @change="switchInclude"/>
                        </div>
                        <!---------------------------编辑课表----------------------------->
                        <div class="editBtn" v-if="!isManager">
                            <vue-fab icon="icon-bianji"
                                     mainBtnColor="white"
                                     @clickMainBtn="editTable"
                                     :scrollAutoHide = scrollAutoHide
                            >
                            </vue-fab>
                        </div>
                        <!-------------------------查看邀请码----------------------------->
                        <div class="viewBtn" v-if="isManager">
                            <vue-fab icon="icon-yaoqingma"
                                     mainBtnColor="white"
                                     @clickMainBtn="viewCode"
                                     :scrollAutoHide = scrollAutoHide
                            >
                            </vue-fab>
                        </div>
                        <!-------------------------返回我的课表---------------------------->
                        <div class="backBtn" v-if="isManager">
                            <vue-fab icon="icon-tuichu"
                                     mainBtnColor="white"
                                     @clickMainBtn="backMain"
                                     :scrollAutoHide = scrollAutoHide
                            >
                            </vue-fab>
                        </div>
                        <!-------------------------查看部门成员---------------------------->
                        <div class="memberBtn" v-if="isManager">
                            <vue-fab icon="icon-chengyuanguanli"
                                     mainBtnColor="white"
                                     @clickMainBtn="viewMember"
                                     :scrollAutoHide=scrollAutoHide
                            >
                            </vue-fab>
                        </div>
                    </div>
                    <!-----------------------------------编辑组织/部门弹出框-------------------------------------->
                    <a-modal
                            v-model="visibleEdit"
                            title="编辑组织/部门名称">
                        <template slot="footer">
                            <a-button key="back" @click="handleCancel">取消</a-button>
                            <a-button key="submit" type="primary" :loading="loading" @click="handleCreate">
                                提交
                            </a-button>
                        </template>

                        <a-form :form="form">
                            <a-form-item
                                    :label-col="formItemLayout.labelCol"
                                    :wrapper-col="formItemLayout.wrapperCol"
                                    label="组织/部门名称">
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                {{selectedOrg.substr(4,selectedOrg.length-4)+selectedPart.substr(5,selectedPart.length-5)||selectedOrg.substr(4,selectedOrg.length-4)||"尚未选择组织/部门！"}}
                            </a-form-item>
                            <a-form-item
                                    :label-col="formItemLayout.labelCol"
                                    :wrapper-col="formItemLayout.wrapperCol"
                                    label="组织/部门新名称">
                                <a-input v-decorator="['new_partName',{rules: [{ required: true, message: '请填入组织/部门新名称' }]}]" />
                            </a-form-item>
                        </a-form>
                    </a-modal>
                    <!-----------------------------------创建组织弹出框-------------------------------------->
                    <a-modal
                            v-model="visibleCreate"
                            title="创建组织">
                        <template slot="footer">
                            <a-button key="back" @click="handleCancel">取消</a-button>
                            <a-button key="submit" type="primary" :loading="loading" @click="handleCreate" :disabled="disabled">
                                提交
                            </a-button>
                        </template>
                        <a-form :form="form">
                            <a-form-item
                                :label-col="formItemLayout.labelCol"
                                :wrapper-col="formItemLayout.wrapperCol"
                                label="组织名称">
                                <a-input v-decorator="['create_orgName',{rules: [{ required: true, message: '请填入组织名称' }]}]" />
                            </a-form-item>
                            <a-form-item
                                    :label-col="formItemLayout.labelCol"
                                    :wrapper-col="formItemLayout.wrapperCol"
                                    label="部门名称">
                                <div class="create_part_wrapper" style="display: flex;flex-direction: row;justify-content: space-between;" v-for="(part,index) in create_parts">
                                    <a-input v-decorator="[`create_partName${index}`,{rules: [{ required: true, message: '请填入部门名称' }]}]" style="width: 76%" />
                                    <div class="buttons">
                                        <a-button type="primary" shape="circle" icon="plus" @click="plusPart()" size="small" ghost></a-button>
                                        <a-button type="danger" shape="circle" icon="delete" @click="lessPart(index)" size="small" ghost v-if="index > 0" style="margin-left: .4rem"></a-button>
                                    </div>
                                </div>
                            </a-form-item>
                        </a-form>
                        <div class="inviteCode" v-if="inviteSuccess">您的邀请码为：<br>
                            <div class="codeGroup" style="text-align: center;">
                                <pre v-for="code in inviteCodes" style="font-weight: bold;color:red;">
                                    {{code}}<br>
                                </pre>
                            </div>
                        </div>
                    </a-modal>
                    <!-----------------------------加入部门弹出框--------------------------------->
                    <a-modal
                            v-model="visibleJoin"
                            title="加入部门">
                        <template slot="footer">
                            <a-button key="back" @click="handleCancel">取消</a-button>
                            <a-button key="submit" type="primary" :loading="loading" @click="handleJoin">
                                提交
                            </a-button>
                        </template>
                        <a-form :form="form">
                            <a-form-item
                                    :label-col="formItemLayout.labelCol"
                                    :wrapper-col="formItemLayout.wrapperCol"
                                    label="部门邀请码">
                                <a-input v-decorator="['join_partName',{rules: [{ required: true, message: '请填入部门邀请码' }]}]"/>
                            </a-form-item>
                        </a-form>
                    </a-modal>
                    <!-----------------------------查看邀请码弹出框--------------------------------->
                    <a-modal
                            v-model="visibleView"
                            title="查看邀请码">
                        <template slot="footer">
                            <a-button key="back" @click="cancelView">取消</a-button>
                        </template>
                        <div class="inviteCode">当前部门为：{{this_part.branch_name}}</div>
                        <div class="inviteCode">您的邀请码为：<b style="color:red;">{{this_part.group_key}}</b></div>
                    </a-modal>
                    <!-----------------------------查看部门成员弹出框--------------------------------->
                    <a-modal
                            v-model="visibleMember"
                            title="查看成员">
                        <template slot="footer">
                            <a-button key="back" @click="cancelView">取消</a-button>
                        </template>
                        <span v-for="member in part_members">
                            {{member.nickname}}&nbsp;&nbsp;
                        </span>
                    </a-modal>
                </div>
            </vue-drawer-layout>
            <!----------------------------------------加载中----------------------------------------------->
            <div class="loading_wrapper" v-if="isLoad">
                <div class="loading">
                    <a-spin tip="loading...">
                        <div class="spin-content">
                            加载中，请稍候...
                        </div>
                    </a-spin>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 8 },
    };
    export default {
        name: "mainPage",
        data(){
            return{
                scrollAutoHide: false,
                //加载状态
                isLoad:false,
                //登录状态
                logined:localStorage.getItem("logined"),
                //周次
                weeknums:['第一周','第二周','第三周','第四周','第五周','第六周','第七周','第八周','第九周','第十周','第十一周','第十二周','第十三周','第十四周','第十五周','第十六周','第十七周','第十八周','第十九周','第二十周'],
                //默认显示周次
                defaultWeek:"第一周",
                isManager:false,  //管理者可以根据周次查看无课表
                this_part:"",   //当前选中的部门
                //部门成员
                part_members:[],
                //课程
                courses:[
                    {
                        weekday:'周一',
                        classes:["","","","","",""]
                    },
                    {
                        weekday:'周二',
                        classes:["","","","","",""]
                    },
                    {
                        weekday:'周三',
                        classes:["","","","","",""]
                    },
                    {
                        weekday:'周四',
                        classes:["","","","","",""]
                    },
                    {
                        weekday:'周五',
                        classes:["","","","","",""]
                    },
                ],
                //左拉菜单
                openKeys: ['sub1'],
                selectedPart:"",
                selectedOrg:"",
                manage_groups:[],
                join_groups:[],
                //删除按钮
                deleteAllowed:false,
                //悬浮按钮菜单
                menu: [
                    {
                        icon: 'icon-kecheng',
                        title: '添加课程',
                        color: '#66cc99'
                    },
                    {
                        icon: 'icon-jiaruwomen',
                        title: '加入部门',
                        color: '#856499'
                    },
                    {
                        icon: 'icon-jiarujiazuxianxing',
                        title: '创建组织',
                        color: '#ffcc00'
                    }
                ],
                mainBtnColor: '#3fa4ff',
                //悬浮按钮弹出框
                visibleEdit:false,
                visibleCreate: false,
                visibleJoin: false,
                visibleView: false,
                visibleMember:false,
                loading: false,
                formItemLayout,
                form: this.$form.createForm(this),
                create_orgName:"",
                create_partName:"",
                create_parts:[""],
                inviteSuccess:false,
                inviteCodes:[],
                disabled:false,
            };
        },
        mounted(){
            let that = this;
            //获取课表
            this.axios.get(this.baseUrl+'/course',{
              params:{
                  user_id:localStorage.getItem("user_id")
              },
               headers:{
                    'Authorization':localStorage.getItem('token'),
                }
            })
                .then((res) => {
                    // console.log("myClass",res);
                    if (res.data.status === "success"){
                        this.dataToClass(res.data.data);
                        this.setRowsHeight(res.data.data);
                    }
                })
                .catch((err) => {
                    // console.log(err);
                    //全局提示
                    this.$notification.open({
                        message: '网络连接错误！',
                        icon: <a-icon type="exclamation-circle" style="color: #FF434B" />
                    });
                });
            //获取我管理的组织
            this.getManageData();
            //获取我加入的组织
            that.getJoinData();
        },
        methods:{
            //退出登录
            exitLogin(){
                // 删除用户信息
                localStorage.clear();
                this.$router.push({path:"/login"});
            },
            //查找课程表中文字最多的单元格，动态设置rows高度
            setRowsHeight(res){
                // console.log("res",res);
                let that = this;
                let length_arr = [];  // 长度数组
                let new_res = [];  // 去除周六周日后的数组
                res.map((item) => {
                    // 删除数组中的周六和周日
                    if (item.week !== "周六" && item.week !== "周日") {
                        new_res.push(item);
                    }
                });
                // console.log("new_res",new_res);
                new_res.map((item_new) => {
                    let len = 0;
                    if (item_new.username !== null && item_new.username !== undefined) {
                        len = item_new.username.length;   // 数组长度
                    } else if (item_new.weeksText !== null && item_new.weeksText !== undefined) {
                        len = item_new.weeksText.length;  // 字符串长度
                    }
                    length_arr.push(len);
                });

                let maxLength = Math.max(...length_arr);//获取最大长度
                // console.log("maxLength",maxLength);
                // console.log("length_arr",length_arr);
                let indexOfMax = length_arr.indexOf(maxLength);//获取最大长度元素对应下标
                // console.log("indexOfMax",indexOfMax);
                //设置rows高度
                if (new_res.length > 0){        //当课表不为空时
                    this.$nextTick(() => {
                        this.$refs.rows_style.map((row_style) => {
                            let x = this.weekToNum(new_res[indexOfMax].week); // 周次
                            let y = this.periodToNum(new_res[indexOfMax].period); // 节次
                            // console.log("周"+x+"，第"+y+"节");
                            let index = (x-1)*6 + y - 1;   // 最大长度的课程对应的数组下标
                            // console.log(x,y,index);
                            this.$nextTick(() => {
                                if ( this.$refs.cell_style[index] !== null && this.$refs.cell_style[index] !== undefined ) {
                                    let cell_height = this.$refs.cell_style[index].offsetHeight;
                                    if (cell_height < 40) {
                                        row_style.style.height = (cell_height + 50) + "px";
                                    } else if (cell_height >= 40) {
                                        row_style.style.height = (cell_height + 20) + "px";
                                    }
                                } else {
                                    console.info("Set Height Fail!");
                                }
                            });
                        });
                    })
                }
            },
            //转换周次与数字
            weekToNum(week){
                if (week !== undefined) {
                    switch (week) {
                        case "周一":
                            return 1;
                        case "周二":
                            return 2;
                        case "周三":
                            return 3;
                        case "周四":
                            return 4;
                        case "周五":
                            return 5;
                        default :
                            return -1;
                    }
                }
            },
            //转换节次与数字
            periodToNum(period){
                if (period !== undefined){
                    switch (period) {
                        case 12:
                            return 1;
                        case 34:
                            return 2;
                        case 56:
                            return 3;
                        case 78:
                            return 4;
                        case 910:
                            return 5;
                        case 11:
                            return 6;
                        default:
                            return -1;
                    }
                }
            },
            // 将后端传过来的以部门为单位的数组转化为以组织为单位分类展示
            singleToGroup(data,groups){
                let that = this;
                for (let i = 0 ; i < data.length ; i++){        //全部部门
                    if (i === 0) {
                        //第一项直接加入数组
                        groups.push({
                            index:0,
                            org:data[0].groupName,
                            parts:[
                                {
                                    branch_name:data[0].branchName,
                                    id:data[0].id,
                                    group_key:data[0].groupKey
                                }
                            ]
                        });
                    } else if(i > 0) {   //从第二项开始
                        let different = []; //当有重复组织时，push false
                        //组织去重
                        for(let k = 0 ; k < i ; k++){       //从第二项开始,当前项与当前项之前的所有项进行比较
                            if (data[i].groupName === data[k].groupName) {  //该组织名出现过
                                // console.log("k,i",k,i);
                                different.push(false);
                                groups[groups.length - 1].parts.push({   //将部门加入重复的组织
                                    branch_name:data[i].branchName,
                                    id:data[i].id,
                                    group_key:data[i].groupKey
                                });
                                break;
                            }
                        }
                        //比较完成
                        if (different.length === 0) {        //该组织名没有出现过
                            // console.log("唯一");
                            groups.push({               //将组织加入数组
                                index:i,
                                org:data[i].groupName,
                                parts:[
                                    {
                                        branch_name:data[i].branchName,
                                        id:data[i].id,
                                        group_key:data[i].groupKey
                                    }
                                ]
                            });
                        }
                    }
                }
            },
            getManageData(){
                this.axios.get(this.baseUrl+'/group/adminGroup',{
                    params:{
                        user_id:localStorage.getItem('user_id')
                    },
                    headers:{
                        'Authorization':localStorage.getItem('token'),
                    }
                })
                    .then((res) => {
                        // console.log("manage",res);
                        this.singleToGroup(res.data.data,this.manage_groups);//将数据分类
                        // console.log("my_manage_groups",this.manage_groups);
                    })
                    .catch((err) => {
                        this.$notification.open({
                            message: '网络连接错误！',
                            icon: <a-icon type="exclamation-circle" style="color: #FF434B" />
                        });
                    });
            },
            //获取我加入的组织
            getJoinData(){
                let that = this;
                this.axios.get(this.baseUrl+'/group/attendGroup',{
                    params:{
                        user_id:localStorage.getItem('user_id')
                    },
                    headers:{
                        'Authorization':localStorage.getItem('token'),
                    }
                })
                    .then((res) => {
                        // console.log("join",res);
                        that.singleToGroup(res.data.data,this.join_groups);//将数据分类
                        // console.log("my_join",this.join_groups);
                    })
                    .catch((err) => {
                        that.$notification.open({
                            message: '网络连接错误！',
                            icon: <a-icon type="exclamation-circle" style="color: #FF434B" />
                        });
                    })
            },
            //将数据转化为课表，呈现出来
            dataToClass(res){
                this.defaultWeek = '第一周';
                // console.info("class",res);
                let that = this;
                this.courses.map((courseItem) => {
                    res.map((item) => {
                        if (item.week === courseItem.weekday){
                            let courseNum = this.periodToNum(item.period) - 1;  // 将节次转换为数字
                            let item_value = item.weeksText || item.username.join();  // 表格里的内容（节次或者人名）
                            // console.log(item_value);
                            if (item.username !== undefined && item.username !== null) {
                                // 将人名按字典树排序
                                let item_value_arr = item_value.split(',');
                                item_value_arr.sort((a,b) => {
                                    return a.localeCompare(b);
                                });
                                // 每个人名后面都加换行符
                                let str = '';
                                for(let i = 0; i < item_value_arr.length; i++) {
                                    str += item_value_arr[i];
                                    str += `\n`;
                                }
                                item_value = str;
                            }
                            if (courseNum === 5){    // 第11节课
                                that.$set(courseItem.classes,courseNum-1,item_value);
                                that.$set(courseItem.classes,courseNum,item_value);
                            } else {
                                that.$set(courseItem.classes,courseNum,item_value);
                            }
                        }
                    });
                });
            },
            //点击加号按钮展开的菜单
            clickItem(index){
                // console.log(index);
                if (index.idx === 1) {
                    //加入组织弹出框
                    this.visibleJoin = true;
                }
                if (index.idx === 2) {
                    //创建组织弹出框
                    this.visibleCreate = true;
                    //清空表单
                    this.form.resetFields();
                }
                else if (index.idx === 0) {
                    //添加课程
                    this.$router.push({path:"/addCourse"})
                }
            },
            //切换是否包括我按钮状态
            switchInclude(value){
                if (value === false){
                    this.isLoad = true;
                    //不包括我
                    this.getNoClassTable(0);
                } else if (value === true){
                    this.isLoad = true;
                    //包括我
                    this.getNoClassTable(1);
                }
            },
            /**************************************************************操作弹出框*********************************************/
            plusPart(){
              //添加部门
                this.create_parts.push(""); //长度加1
            },
            lessPart(index){
                //删除部门
                this.create_parts.splice(index,1);
            },
            handleCreate(e) {
                //创建组织
                this.form.validateFields(
                    (err) => {
                        if (!err) {
                            this.loading = true;
                            //给创建的部门赋值为用户填入的部门名称
                            // console.log(this.form.getFieldValue("create_partName0"));
                            let input_create_parts = [];
                            this.create_parts.map((create_part,index) => {
                                // console.log(index);
                                input_create_parts.push(this.form.getFieldValue(`create_partName${index}`));
                            });
                            // console.log(input_create_parts);
                            //发送请求
                            let params = new URLSearchParams();
                            params.append("branch_name",input_create_parts.join());
                            params.append("name",this.form.getFieldValue('create_orgName'));
                            params.append("user_id",localStorage.getItem("user_id"));
                            this.axios.post(this.baseUrl+'/group',params,{
                                headers:{
                                    'Authorization':localStorage.getItem('token'),
                                }
                            })
                                .then((res) => {
                                    // console.log(res);
                                    this.loading = false;
                                    this.disabled = true;
                                    //全局提示
                                    this.$notification.open({
                                        message: '创建成功',
                                        icon: <a-icon type="check-circle" style="color: #108ee9" />
                                    });
                                    this.inviteSuccess = true;
                                    // this.inviteCode = res.data.data.groupKey;
                                    res.data.data.map((branch,index) => {
                                        this.inviteCodes[index] = branch.groupKey;
                                    })
                                })
                                .catch((err) => {
                                    // console.log(err);
                                    this.loading = false;
                                    //全局提示
                                    this.$notification.open({
                                        message: '发生未知错误，创建失败！',
                                        icon: <a-icon type="exclamation-circle" style="color: #FF434B" />
                                    });
                                })
                        }
                    },
                );
            },

            handleJoin(e) {
                //加入部门
                this.form.validateFields(
                    (err) => {
                        if (!err) {
                            // console.info('success');
                            this.loading = true;
                            //全局提示
                            this.$notification.open({
                                message: '加入成功',
                                icon: <a-icon type="check-circle" style="color: #108ee9" />
                            });
                            //按钮进入加载状态
                            setTimeout(() => {
                                this.visibleJoin = false;
                                this.loading = false;
                            }, 2000);
                            //发送请求
                            let params = new URLSearchParams();
                            params.append('_method','PUT');
                            params.append('key',this.form.getFieldValue('join_partName'));
                            params.append('user_id',localStorage.getItem("user_id"));
                            this.axios.post(this.baseUrl+'/group/apply',params,{
                                headers:{
                                    'Authorization':localStorage.getItem('token'),
                                }
                            })
                                .then((res) => {
                                    // console.log(res);
                                    //刷新页面
                                    this.$router.push({path:"111"});
                                    this.$router.go(-1);
                                })
                                .catch((err) => {
                                    this.$notification.open({
                                        message: '网络连接错误！',
                                        icon: <a-icon type="exclamation-circle" style="color: #FF434B" />
                                    });
                                })
                        }
                    },
                );
            },
            //取消
            handleCancel(e) {
                //清空表单
                this.form.resetFields();
                this.visibleCreate = false;
                this.visibleJoin = false;
                this.visibleEdit = false;
                this.visibleView = false;
                //刷新页面
                this.$router.push({path:"111"});
                this.$router.go(-1);
            },
            cancelView(){
             this.visibleView = false;
             this.visibleMember = false;
            },
            editTable(){
                this.$router.push({path:'/editCourse'});
            },
            //查看邀请码
            viewCode(){
                this.visibleView = true;
                // console.log(this.this_part);//当前选中部门
            },
            //返回我的课表
            backMain(){
                //相当于重新进入首页（刷新页面）
                this.$router.push({path:"111"});
                this.$router.go(-1);
            },
            //查看部门成员
            viewMember(){
                this.visibleMember = true;
                this.axios.get(this.baseUrl+'/group/users',{
                    params:{
                        id:this.this_part.id,
                        user_id:localStorage.getItem("user_id")
                    }
                })
                    .then((res) => {
                        // console.log(res);
                        if (res.data.status === "success"){
                            this.part_members = res.data.data;
                        }
                    })
                    .catch((err) => {
                        this.$notification.open({
                            message: '网络连接错误！',
                            icon: <a-icon type="exclamation-circle" style="color: #FF434B" />
                        });
                    })
            },
            /*******************************************************************左拉菜单*************************************************************/
            //点击编辑按钮，修改组织和部门的名字
            editBranch(){
                this.visibleEdit = true;
                let params = new URLSearchParams();
                params.append("branch_name",this.form.getFieldValue('edit_orgName'));
                params.append("name",this.form.getFieldValue('edit_partName'));
                this.axios.post(this.baseUrl+'/group')
            },
            //点击删除按钮，删除部门
            deleteBranch(){
                //弹出提示栏
                let that = this;
                const key = `open${Date.now()}`;
                this.$notification.open({
                    message: '确定解散该部门吗？（操作不可撤回）',
                    btn: (h)=>{
                        return h('a-button', {
                            props: {
                                type: 'primary',
                                size: 'small'
                            },
                            on: {
                                click: () =>{
                                    //关闭通知
                                    this.$notification.close(key);
                                    //删除部门
                                    if (this.selectedPart.substr(0,1) === '1') {
                                        this.deleteAllowed = true;
                                        //我管理的
                                        let i = parseInt(that.selectedPart.substr(2,1));
                                        let j = parseInt(that.selectedPart.substr(4,1));
                                        let this_part = that.manage_groups[i].parts[j];
                                        // console.log("this_part",that.manage_groups[i-1].parts[j]);
                                        //发送请求
                                        this.axios.get(this.baseUrl + '/group/delete',{
                                            params:{
                                                id:this_part.id,
                                                user_id:localStorage.getItem('user_id')
                                            },
                                            headers:{
                                                'Authorization':localStorage.getItem('token'),
                                            }
                                        })
                                            .then((res) => {
                                                //刷新页面
                                                this.$router.push({path:"111"});
                                                this.$router.go(-1);
                                            })
                                            .catch((err) => {
                                                this.$notification.open({
                                                    message: '网络连接错误！',
                                                    icon: <a-icon type="exclamation-circle" style="color: #FF434B" />
                                                });
                                            })
                                    }
                                    //全局提示
                                    this.$notification.open({
                                        message: '删除成功',
                                        icon: <a-icon type="check-circle" style="color: #108ee9" />
                                    });
                                }
                            }
                        }, '确定')
                    },
                    key,
                    onClose: close,
                });
            },
            //点击菜单按钮，显示左侧菜单
            showLayer(){
               this.$refs.drawer.toggle(true);
            },
            //操作左拉菜单
            handleClick (e) {
                // console.log('click', e);
                this.selectedPart = e.key; //选中的部门
            },
            titleClick (e) {
                this.deleteAllowed = false;
                //选择周次不可见
                this.isManager = false;
                // console.log('titleClick', e);
                // console.log(e.key); //sub1 , sub2
            },
            orgClick(e){
                // console.log('orgClick',e);
                this.isManager = true;   // 显示管理者拥有的功能
                this.deleteAllowed = true;
                this.selectedOrg = e.key; //选中的组织
                // console.log("selectedOrg",this.selectedOrg);
            },
            //点击我管理的部门，获取无课表
            getNoClassTable(isInclude){
                //清空原课表
                this.courses = [
                    {
                        weekday:'周一',
                        classes:["","","","","",""]
                    },
                    {
                        weekday:'周二',
                        classes:["","","","","",""]
                    },
                    {
                        weekday:'周三',
                        classes:["","","","","",""]
                    },
                    {
                        weekday:'周四',
                        classes:["","","","","",""]
                    },
                    {
                        weekday:'周五',
                        classes:["","","","","",""]
                    },
                ];
                //发送请求
                this.axios.get(this.baseUrl + '/course/no_class/group/'+this.this_part.id,{
                    params:{
                        include:isInclude,
                        user_id:localStorage.getItem('user_id'),
                        weeks:1  //默认第一周
                    },
                    headers:{
                        'Authorization':localStorage.getItem('token'),
                    }
                })
                    .then((res) => {
                        //选择周次可见
                        this.isManager = true;
                        // console.log("manage_class",res);
                        this.dataToClass(res.data.data);
                        this.setRowsHeight(res.data.data);
                        //左拉菜单自动收回
                        this.$refs.drawer.toggle(false);
                        this.isLoad = false;
                    })
                    .catch((err) => {
                        // console.log("err",err);
                        this.$notification.open({
                            message: '网络连接错误！',
                            icon: <a-icon type="exclamation-circle" style="color: #FF434B" />
                        });
                        this.isLoad = false;
                    })
            },
            partClick(e){
                let that = this;
                //点击部门
                // console.log('partClick',e);
                if (e.key.substr(0,1) === '1') {
                    //我管理的
                    this.isLoad = true;
                    this.deleteAllowed = true;  //删除允许
                    let i = parseInt(e.key.substr(2,1));
                    // console.log("i",i);
                    let j = parseInt(e.key.substr(4,1));
                    // console.log("j",j);
                    // console.log("manage_group",that.manage_groups);
                    this.this_part = that.manage_groups[i].parts[j]; //获取当前部门
                    // console.log("this_part",that.manage_groups[i].parts[j]);
                    this.getNoClassTable(1);  //获取无课表,默认"包含我"
                }
            },
            //选择周次
            onClick_week(key) {
                this.isLoad = true;
                let k = key.key; //用户选择的周次
                // console.log(k+1);
                this.defaultWeek = this.weeknums[k];
                //发送请求
                this.axios.get(this.baseUrl + '/course/no_class/group/'+this.this_part.id,{
                    params:{
                        include:1,
                        user_id:localStorage.getItem("user_id"),
                        weeks:k+1
                    },
                    headers:{
                        'Authorization':localStorage.getItem('token'),
                    }
                })
                    .then((res) => {
                        this.courses = [
                            {
                                weekday:'周一',
                                classes:["","","","","",""]
                            },
                            {
                                weekday:'周二',
                                classes:["","","","","",""]
                            },
                            {
                                weekday:'周三',
                                classes:["","","","","",""]
                            },
                            {
                                weekday:'周四',
                                classes:["","","","","",""]
                            },
                            {
                                weekday:'周五',
                                classes:["","","","","",""]
                            },
                        ];
                        // console.log(res);
                        this.dataToClass(res.data.data);
                        this.setRowsHeight(res.data.data);
                        this.isLoad = false;
                    })
                    .catch((err) => {
                        this.$notification.open({
                            message: '网络连接错误！',
                            icon: <a-icon type="exclamation-circle" style="color: #FF434B" />
                        });
                    })
            },
        }
    }
</script>

<style lang="less" scoped>
    @mainColor:#3fa4ff;
    @headerHeight:3rem;
    .mainPage{
        height: 100%;
        .loading_wrapper{
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            margin: 0 auto;
            background: fade(white,50%);
            .loading{
                position: absolute;
                top: 40%;
                width: 100%;
                margin: 0 auto;
                text-align: center;
            }
        }
        .noLogin{
            position: fixed;
            left: 2%;
            top: 38%;
        }
        /*/deep/ .drawer-layout{*/
        /*    overflow: visible;*/
        /*}*/
        /*/deep/ .content-wrap{*/
        /*    overflow: visible;*/
        /*}*/
        //底部悬浮按钮
        .mainContent{
            height: 100%;
            overflow-y: scroll;
            /deep/ .button_wrapper{
                position: fixed;
                height: auto;
                width: 100%;
                .fab-size-normal{
                    .icon-kecheng:before{
                        font-size: 1rem;
                    }
                    .icon-jiaruwomen:before{
                        font-size: 1rem;
                    }
                    .icon-jiarujiazuxianxing:before{
                        font-size: 1rem;
                    }
                }
                .includeMeBtn{
                    position: fixed;
                    left: 10%;
                    bottom: 5%;
                }
                .editBtn{
                    .fab-main-container{
                        right: 36%;
                        .icon-bianji:before{
                            color: fade(#009966,75%);
                            font-size: 1.26rem;
                        }
                    }
                    &:active{
                        .icon-bianji:before{
                            color: #009966;
                        }
                    }
                }
                .viewBtn{
                    .fab-main-container{
                        right: 36%;
                        .icon-yaoqingma:before{
                            color: fade(#FF0033,75%);
                            font-size: 1.6rem;
                        }
                    }
                    &:active{
                        .icon-yaoqingma:before{
                            color: #FF0033;
                        }
                    }
                }
                .backBtn{
                    .fab-main-container{
                        right: 52%;
                        .icon-tuichu:before{
                            color: fade(#4947d4,75%);
                            font-size: 1.26rem;
                        }
                    }
                    &:active{
                        .icon-tuichu:before{
                            color: #4947d4;
                        }
                    }
                }
                .memberBtn{
                    .fab-main-container{
                        right: 68%;
                        .icon-chengyuanguanli:before{
                            color: fade(#217724,75%);
                            font-size: 1.26rem;
                        }
                    }
                    &:active{
                        .icon-chengyuanguanli:before{
                            color: #217724;
                        }
                    }
                }
            }
        }
        //左拉菜单
        .drawer-content{
            .menu_delete_btn{
                position: fixed;
                bottom: 5%;
                right: 28%;
            }
            .menu_edit_btn{
                position: fixed;
                bottom: 5%;
                right: 10%;
            }
            .menu_exit_btn{
                position: fixed;
                bottom: 5%;
                left: 10%;
            }
        }
        //顶部操作栏
        .header{
            width: 100%;
            height: @headerHeight;
            background: #f6f6f6;
            border-bottom: 1px solid #eeeeee;
            box-shadow: 0 2px 6px #b3b3b3;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            .logo{
                margin-left: 1.2rem;
            }
            .icon-NMStubiao-{
                color: @mainColor;
                font-size: 1.4rem;
                margin-right: 1.2rem;
            }
        }
        //课表
        .course_table{
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            width: 94%;
            margin: 0 auto 6rem auto;
            .column{
                width: 18%;
                text-align: center;
                .course_header{
                    border-radius: 1.2rem;
                    padding-top: .14rem;
                    padding-bottom: .14rem;
                    margin-top:.6rem;
                    margin-left: auto;
                    margin-right: auto;
                    width: 3.4rem;
                    font-size: .88rem;
                }
                .rows{
                    width: 90%;
                    height: 50%;
                    border-radius: .48rem;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    flex-wrap: wrap;
                    position: relative;
                    margin: .4rem auto 0 auto;
                    .cell{
                        font-size: .68rem;
                        width: 90%;
                        word-break: break-all;
                        overflow: hidden;
                    }
                }
                .rowsFull{
                    padding-top: 0;
                    padding-bottom: 0;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                }
            }
            .column0{
                .course_header{
                    color: hotpink;
                    border: hotpink .5px solid;
                    &:active{
                        background: fade(hotpink,80%);
                        color: white;
                    }
                }
                .rows{
                    border: hotpink solid .5px;
                    &:active{
                        background: fade(hotpink,60%);
                    }
                }
                .rowsFull{
                    border: hotpink solid .5px;
                    background: fade(hotpink,40%);
                }
            }
            .column1{
                .course_header{
                    color: #FF9966;
                    border: #FF9966 .5px solid;
                    &:active{
                        background: fade(#FF9966,80%);
                        color: white;
                    }
                }
                .rows{
                    border: #FF9966 solid .5px;
                    &:active{
                        background: fade(#FF9966,60%);
                    }
                }
                .rowsFull{
                    border: #FF9966 solid .5px;
                    background: fade(#FF9966,40%);
                }
            }
            .column2{
                .course_header{
                    color: #66CC00;
                    border: #66CC00 .5px solid;
                    &:active{
                        background: fade(#66CC00,80%);
                        color: white;
                    }
                }
                .rows{
                    border: #66CC00 solid .5px;
                    &:active{
                        background: fade(#66CC00,60%);
                    }
                }
                .rowsFull{
                    border: #66CC00 solid .5px;
                    background: fade(#66CC00,40%);
                }
            }
            .column3{
                .course_header{
                    color: #99CCFF;
                    border: #99CCFF .5px solid;
                    &:active{
                        background: fade(#99CCFF,80%);
                        color: white;
                    }
                }
                .rows{
                    border: #99CCFF solid .5px;
                    &:active{
                        background: fade(#99CCFF,80%);
                    }
                }
                .rowsFull{
                    border: #99CCFF solid .5px;
                    background: fade(#99CCFF,60%);
                }
            }
            .column4{
                .course_header{
                    color: #CC99CC;
                    border: #CC99CC .5px solid;
                    &:active{
                        background: fade(#CC99CC,80%);
                        color: white;
                    }
                }
                .rows{
                    border: #CC99CC solid .5px;
                    &:active{
                        background: fade(#CC99CC,60%);
                    }
                }
                .rowsFull{
                    border: #CC99CC solid .5px;
                    background: fade(#CC99CC,40%);
                }
            }
        }
    }
</style>
