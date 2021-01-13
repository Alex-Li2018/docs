# app3

自定义头部组件1111111 
```vue
<template>
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
</script>
```

## Props

<!-- @vuese:app3:props:start -->
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|bgcolor|背景颜色|`String`|`false`|white|
|color|文字颜色|`String`|`false`|rgba(0,0,0,0.85)|
|wxColor|微信模式下的字体颜色|`String`|`false`|#fff|
|positionType|定位类型|`String`|`false`|sticky|
|backAndHomeFlag|是否显示返回主页按钮|`Boolean`|`false`|false|
|backAndHomeName|返回按钮|`String`|`false`|-|
|wxFlag|是否微信模式|`Boolean`|`false`|false|
|wxTitle|标题|`String`|`false`|-|
|top|是否渐变|`Number`|`false`|null|

<!-- @vuese:app3:props:end -->


## Events

<!-- @vuese:app3:events:start -->
|Event Name|Description|Parameters|
|---|---|---|
|test|测试|-|

<!-- @vuese:app3:events:end -->


## Slots

<!-- @vuese:app3:slots:start -->
|Name|Description|Default Slot Content|
|---|---|---|
|default|-|-|

<!-- @vuese:app3:slots:end -->