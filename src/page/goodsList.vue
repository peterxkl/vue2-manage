<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table-top">
            <el-row>
                <el-col :span="8">
                    <el-button type="primary" @click="addGoods()">新增商品</el-button>
                </el-col>
                <el-col :span="8">
                    <el-radio-group v-model="radio">
                        <el-radio :label="3">全部</el-radio>
                        <el-radio :label="6">上架</el-radio>
                        <el-radio :label="9">下架</el-radio>
                    </el-radio-group>
                </el-col>
                <el-col :span="8">
                    <el-select
                        v-model="value"
                        multiple
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请输入关键词"
                        :remote-method="remoteMethod"
                        :loading="loading">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
        </div>
        <div class="table_container">
            <el-table
                :data="tableData"
                :row-key="row => row.index"
                style="width: 100%">
                <el-table-column
                    label="ID"
                    prop="id">
                </el-table-column>
                <el-table-column
                    label="标题"
                    prop="title">
                </el-table-column>
                <el-table-column
                    label="商品分类"
                    prop="category">
                </el-table-column>
                <el-table-column
                    label="品牌"
                    prop="brand">
                </el-table-column>
                <el-table-column label="操作" width="160">
                    <template slot-scope="scope">
                        <el-button
                            size="small"
                            @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button
                            size="small"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-button
                            size="small"
                            type="danger"
                            @click="handleObtained(scope.$index, scope.row)">下架</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="Pagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="20"
                    layout="total, prev, pager, next"
                    :total="count">
                </el-pagination>
            </div>

            <el-dialog title="修改商品信息" v-model="dialogFormVisible">
                <el-form :model="selectTable">
                    <el-form-item label="商品名称" label-width="100px">
                        <el-input v-model="selectTable.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品卖点" label-width="100px">
                        <el-input v-model="selectTable.sellPoint"></el-input>
                    </el-form-item>
                    <el-form-item label="所属品牌" label-width="100px">
                        <el-select v-model="selectIndex" :placeholder="selectMenu.label" @change="handleSelect">
                            <el-option
                                v-for="item in menuOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品分类" label-width="100px">
                        <el-cascader
                            :options="categoryOptions"
                            v-model="selectedCategory"
                            change-on-select
                        ></el-cascader>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateGood">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {baseUrl, baseImgPath} from '@/config/env'
    import {getAllBrands, getBrandCount} from '@/api/getData'
    export default {
        data(){
            return {
                baseUrl,
                baseImgPath,
                tableData: [],
                currentPage: 1,
                count: 0,
                dialogFormVisible: false,
                selectTable: {},
                selectIndex: null,
                menuOptions: [],
                selectMenu: {},
                categoryOptions: [],
                selectedCategory: [],
                radio: 3
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
                    const countData = await getBrandCount();
                    if (countData.status == 1) {
                        this.count = countData.count;
                    }else{
                        throw new Error('获取数据失败');
                    }
                    this.getAllBrands();
                }catch(err){
                    console.log('获取数据失败', err);
                }
            },
            async getAllBrands(){
                const Brands = await getAllBrands({limit: this.limit, currentPage: this.currentPage});
                this.tableData = [];
                Brands.forEach((item, index) => {
                    const tableData = {};
                    tableData.title = item.title;
                    tableData.id = item.id;
                    tableData.category = item.category;
                    tableData.brand = item.brand;
                    this.tableData.push(tableData);
                })
            },
            handleEdit(row) {
                this.getSelectItemData(row, 'edit')
                this.dialogFormVisible = true;
            },
            async handleDelete(index, row) {
                try{
                    const res = await deleteFood(row.id);
                    if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '删除食品成功'
                        });
                        this.tableData.splice(index, 1);
                    }else{
                        throw new Error(res.message)
                    }
                }catch(err){
                    this.$message({
                        type: 'error',
                        message: err.message
                    });
                    console.log('删除食品失败')
                }
            },
            handleObtained(index, row) {

            },
            addGoods() {
                this.$router.push({ path: 'addGood', query: {  }})
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getAllBrands()
            },
            async updateGood(){
                this.dialogFormVisible = false;
                try{
                    const subData = {new_category_id: this.selectMenu.value, specs: this.specs};
                    const postData = {...this.selectTable, ...subData};
                    const res = await updateFood(postData)
                    if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '更新食品信息成功'
                        });
                        this.getFoods();
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                }catch(err){
                    console.log('更新餐馆信息失败', err);
                }
            },
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
