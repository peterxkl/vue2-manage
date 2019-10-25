<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table-top">
            <el-button type="primary" @click="addBrand()">新增品牌</el-button>
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
                    label="名称"
                    prop="name">
                </el-table-column>
                <el-table-column
                    label="LOGO"
                    prop="logo">
                </el-table-column>
                <el-table-column
                    label="首字母"
                    prop="letter">
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

            <el-dialog title="修改品牌信息" v-model="dialogFormVisible">
                <el-form :model="selectTable">
                    <el-form-item label="品牌名称" label-width="100px">
                        <el-input v-model="selectTable.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="品牌字母" label-width="100px">
                        <el-input v-model="selectTable.letter"></el-input>
                    </el-form-item>
                    <el-form-item label="品牌分类" label-width="100px">
<!--                        <el-select v-model="selectIndex" :placeholder="selectMenu.label" @change="handleSelect">-->
<!--                            <el-option-->
<!--                                v-for="item in menuOptions"-->
<!--                                :key="item.value"-->
<!--                                :label="item.label"-->
<!--                                :value="item.index">-->
<!--                            </el-option>-->
<!--                        </el-select>-->
                    </el-form-item>
                    <el-form-item label="品牌图片" label-width="100px">
                        <el-upload
                            class="avatar-uploader"
                            :action="baseUrl + '/v1/addimg/food'"
                            :show-file-list="false"
                            :on-success="handleServiceAvatarScucess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="selectTable.image_path" :src="baseImgPath + selectTable.image_path" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateFood">确 定</el-button>
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
                    tableData.name = item.name;
                    tableData.id = item.id;
                    tableData.logo = item.logo;
                    tableData.letter = item.letter;
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
            addBrand() {
                this.$router.push({ path: 'addBrand', query: {  }})
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getAllBrands()
            },
            handleServiceAvatarScucess(res, file) {
                if (res.status == 1) {
                    this.selectTable.image_path = res.image_path;
                }else{
                    this.$message.error('上传图片失败！');
                }
            },
            beforeAvatarUpload(file) {
                const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png');
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isRightType) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isRightType && isLt2M;
            },
            async updateFood(){
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
