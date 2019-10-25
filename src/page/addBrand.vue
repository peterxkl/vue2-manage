<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
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
                <el-button @click="resetForm('selectTable')">重 置</el-button>
                <el-button type="primary" @click="commitBrand">确 定</el-button>
            </div>
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
                selectTable: {},

            }
        },
        created() {
        },
        computed: {

        },
        comments: {
            headTop,
        },
        methods: {
            resetForm(formName) {
                this.$refs[formName].resetFields();
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
            async commitBrand(){
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
        padding: 50px;
    }
</style>
