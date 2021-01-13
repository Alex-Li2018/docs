<template>
    <view
        class="position_container"
        :style="{
            background: rabColor,
            position: positionType,
        }"
    >
        <!-- 状态栏 -->
        <view
            class="status_bar"
            :style="{
                height: statusBarHeight + 'rpx',
                // background: rabColor
            }"
        />
        <!-- 胶囊 -->
        <view
            v-if="backAndHomeFlag"
            class="capsule-bar flex_layout"
            :style="{
                height: '88rpx',
                color
            }"
        >
            <view
                class="nav-wrap flex_layout_c"
                :style="{
                    marginTop: barMarginTop + 'rpx',
                }"
            >
                <image
                    src="https://imgcdn.huanjutang.com/image/2020/07/10/2091df3365b2dfb08d9c9b030fab77f9.png"
                    class="back-icon"
                    @tap="backPage"
                />
                <image
                    src="https://imgcdn.huanjutang.com/image/2020/07/10/ef8060f4cf427430240f64dd7cf40b8b.png"
                    class="line-icon"
                />
                <image
                    src="https://imgcdn.huanjutang.com/image/2020/07/10/014773f0a8d6e64066e6b4b922b2cd6e.png"
                    class="home-icon"
                    @tap="backHome"
                />
            </view>
            <view
                v-show="bgcolor === '#fff'"
                class="fz-15 .back-home_name ellipsis-line-1 mar-left-44 fb-bold"
            >
                {{ backAndHomeName || '' }}
            </view>
        </view>
        <!-- 模拟正常微信模式 -->
        <view
            v-else-if="wxFlag"
            class="flex_layout nav-bar_wrap"
        >
            <view
                class="iconfont iconjiantouxiangzuo fz-19 icon-back"
                :style="{color: wxColor}"
                @tap="backPage"
            />
            <view class="fz-15 nav-txt_wrap">
                <view
                    class="title fz-15 fb-bold ellipsis-line-1"
                    :style="{color: wxColor, opacity}"
                >
                    {{ wxTitle }}
                </view>
            </view>
        </view>
        <view
            v-else
            class="capsule-bar"
            :style="'color:'+ color"
        >
            <slot />
        </view>
    </view>
</template>

<script>
    const systemInfo = uni.getSystemInfoSync();
    // 自定义头部组件1111111
    // example:start
    /**
     * 
     * <template>
        <BaseNavCustom
            positionType="fixed"
            :bgcolor="bgcolor"
            wxFlag="true"
            :wxTitle="wxTitle"
            :wxColor="wxColor"
        />
    </template>
    <script>
    import BaseNavCustom from '@/components/BaseNavCustom';
    export default {
        components: {
            BaseNavCustom
        },
        data() {
            return {
                wxTitle: '学区宝',
                bgcolor: 'transparent',
                wxColor: '#fff'
            };
        },
    }
     */
    // example:end
    export default {
        name: 'components',
        props: {
            // 背景颜色
            bgcolor: {
                type: String,
                default: 'white'
            },
            // 文字颜色
            color: {
                type: String,
                default: 'rgba(0,0,0,0.85)'
            },
            // 微信模式下的字体颜色
            wxColor: {
                type: String,
                default: '#fff'
            },
            // 定位类型
            positionType: {
                type: String,
                default: 'sticky'
            },
            // 是否显示返回主页按钮
            backAndHomeFlag: {
                type: Boolean,
                default: false
            },
            // 返回按钮
            backAndHomeName: {
                type: String,
                default: ''
            },
            // 是否微信模式
            wxFlag: {
                type: Boolean,
                default: false
            },
            // 标题
            wxTitle: {
                type: String,
                default: ''
            },
            // 是否渐变
            top: {
                type: Number,
                default: null
            }
        },
        data() {
            return {

            };
        },
        computed: {
            statusBarHeight() {
                return (this.$store.getters.statusBarHeight || 20) * (750 / systemInfo.windowWidth);
            },
            barMarginTop () {
                const top = (uni.getMenuButtonBoundingClientRect().top || 24) - (this.$store.getters.statusBarHeight || 20);
                return top * (750 / systemInfo.windowWidth);
            },
            opacity() {
                const height = this.statusBarHeight + 88;
                if (this.top === null) return 1;
                return (this.top / height).toFixed(1);
            },
            rabColor() {
                if (/^#[a-fA-f1-9]{3,6}$/.test(this.bgcolor)) return `rgba(${this.colorRgb(this.bgcolor)}, ${this.opacity})`;
                return this.bgcolor;
            },
        },
        methods: {
            colorRgb(sColor) {
                sColor = sColor.toLowerCase();
                const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
                // 如果是16进制颜色
                if (sColor && reg.test(sColor)) {
                    if (sColor.length === 4) {
                        let sColorNew = '#';
                        for (let i = 1; i < 4; i += 1) {
                            sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                        }
                        sColor = sColorNew;
                    }
                    const sColorChange = [];
                    for (let i = 1; i < 7; i += 2) {
                        // eslint-disable-next-line radix
                        sColorChange.push(parseInt(`0x${sColor.slice(i, i + 2)}`));
                    }
                    return sColorChange.join(',');
                }
                return sColor;
            },
            // 返回上一页
            backPage() {
                // 测试
                this.$emit('test')
                // 获取页面栈
                const pages = getCurrentPages();
                if (pages.length === 1) {
                    uni.switchTab({
                        url: '/pages/index'
                    });

                } else {
                    uni.navigateBack({
                        delta: 1
                    });
                }
            },
            // 返回首页
            backHome() {
                uni.switchTab({
                    url: '/pages/index'
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
.position_container {
    position: sticky;
    top: 0;
    z-index: 99999;
}
.status_bar, .capsule-bar {
    width: 100vw;
}
.capsule-bar {
    display: flex;
    //align-items: center;
}
.img {
    width: 100vw;
    height: 410rpx;
    position: absolute;
    top: 0;
    z-index: 2;
}
.nav-wrap {
    width: 174rpx;
    height: 64rpx;
    background:rgba(255,255,255,0.6);
    border-radius: 32rpx;
    margin-left: 30rpx;
    box-sizing: border-box;
    border: 1rpx solid rgba(233, 234, 235, 0.8);
    .back-icon, .home-icon {
        width: 40rpx;
        height: 40rpx;
    }
    .line-icon {
        width: 2rpx;
        height: 32rpx;
        margin: 0 22rpx;
    }
}
.back-home_name {
    color: #303133;
    width: 290rpx;
    text-align: center;
}
.nav-bar_wrap {
    height: 88rpx;
    width: 100vw;
    position: relative;
    .icon-back {
        height: 40rpx;
        width: 40rpx;
        padding: 24rpx 26rpx 24rpx 28rpx;
        color: #fff;
        position: absolute;
        left: 0;
        top: 0;
    }
    .black {
        color: rgba(0, 0, 0, 0.85);
    }
    .nav-txt_wrap {
        display: flex;
        align-items: center;
        height: 88rpx;
        box-sizing: border-box;
        flex: 1;
        display: flex;
        justify-content: center;
        .title {
            color: #fff;
            line-height: 48rpx;
            text-align: center;
            width: 350rpx;
        }
        .nav-show-num {
            color: #909399;
            line-height: 28rpx;
        }
    }
}
</style>
