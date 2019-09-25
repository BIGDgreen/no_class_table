<template>
    <div class="selectCode">
        <bm_select_code v-on:choose="selectCountry($event)"></bm_select_code>
    </div>
</template>

<script>
    export default {
        name: "selectCode",
        beforeRouteEnter(to,from,next){
            next(vm => {
                vm.lastRouter = from.name;
            })
        },
        methods:{
            selectCountry(event){
                let country_tel = event.tel;
                //向手机登录页面传参
                this.$router.push({name:this.lastRouter,params:{tel:country_tel}});
            }
        }
    }
</script>

<style scoped>

</style>
