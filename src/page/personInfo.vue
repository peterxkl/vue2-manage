<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">

        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {baseUrl, baseImgPath} from '@/config/env'
    export default {
        data(){
            return {
                baseUrl,
                baseImgPath,
                tableData: []
            }
        },
        created() {
            this.initData();
        },
        computed: {

        },
        comments: {
            headTop,
        },
        methods: {
            async initData(){
                try{
                    this.getAllUsers();

                }catch(err){
                    console.log('获取数据失败', err);
                }
            },
            async getAllUsers(){
                const Brands = await getAllBrands({rows: this.limit, page: this.currentPage});
                console.log(Brands);
                this.tableData = [];
                Brands.forEach((item, index) => {
                    const tableData = {};
                    tableData.name = item.name;
                    tableData.id = item.id;
                    tableData.logo = item.logo;
                    tableData.letter = item.letter;
                    this.tableData.push(tableData);
                })
                this.count = Brands.total;
            }
        }

    }
</script>

<style scoped>
    .table_container{
        padding: 20px;
    }
    .Pagination{
        display: flex;
        justify-content: flex-start;
        margin-top: 8px;
    }
    .table-top {
        padding: 20px;
        height: 20px;
        line-height: 20px;
    }
</style>
