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
<!--                    <ele-multi-cascader-->
<!--                        :options="options"-->
<!--                        v-model="form.isp"-->
<!--                        placeholder="选择运营商"-->
<!--                        @change="ispChange"-->
<!--                    >-->
<!--                    </ele-multi-cascader>-->
                </el-form-item>
                <el-form-item label="品牌图片" label-width="100px">
                    <el-upload
                        class="avatar-uploader"
                        :action="'http://localhost:8082/upload/image'"
                        :show-file-list="false"
                        :on-success="handleServiceAvatarScucess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="selectTable.image_path" :src="selectTable.image_path" class="avatar">
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
    import {getAllCategorys} from '@/api/getData'
    export default {
        data(){
            return {
                baseUrl,
                baseImgPath,
                selectTable: {},
                selectIndex: null,
                menuOptions: [],
                selectMenu: {},
                pid: 0,
                options2: [{
                    id: 1,
                    name: '手机',
                    brands: []
                }],
                checkList: []
                // props: {
                //     value: 'id',
                //     label: 'name',
                //     children: 'brands'
                // }
            }
        },
        created() {
            // this.initCascader();
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
                console.log(res);
                if (res.status == 1) {
                    this.selectTable.image_path = res.image_path;
                    console.log(this.selectTable.image_path);
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
            async initCascader() {
                this.options2 = [];
                const data = await getAllCategorys({Pid: this.pid});
                data.forEach((item,index) => {
                    const optionData = {};
                    // optionData.index = index;
                    optionData.id = item.id;
                    optionData.name = item.name;
                    this.options2.push(optionData);
                })
            },
            // handleItemChange(val) {
            //     console.log('active item:', val);
            //     this.Pid = parseInt(val);
            //     console.log(this.Pid);
            //     this.getCategorys();
            //     // setTimeout(_ => {
            //     //     if (val.indexOf('图书、音像、电子书刊') > -1 && !this.options2[0].brands.length) {
            //     //         this.options2[0].brands = [{
            //     //             id: 3,
            //     //             name: '图书',
            //     //         }];
            //     //     } else if (val.indexOf('手机、运营商、数码') > -1 && !this.options2[1].brands.length) {
            //     //         this.options2[1].brands = [{
            //     //             id: 4,
            //     //             name: '手机',
            //     //         }];
            //     //     }
            //     // }, 300);
            // },
            async getCategorys(){
                const categorys = await getAllCategorys({Pid: this.pid});
                this.options2.forEach((item,index) => {
                    if (item.id === this.Pid) {
                        categorys.forEach(item => {
                            const optionData = {};
                            optionData.id = item.id;
                            optionData.name = item.name;
                            this.options2[index].brands.push(optionData);
                        })
                        console.log(this.options2[index]);
                    }
                })
                return categorys;
            }

        }
    }
</script>

<style scoped>
    .table_container{
        padding: 50px;
        margin: 0 auto;
        width: 40%;
    }
    .dialog-footer{
        text-align: center;
    }
</style>
