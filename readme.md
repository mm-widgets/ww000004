# a标签分页

## Attributes

### `key`

当前页码在url栏中的key值。（常用page-no）【 String 】

> 例：key="page-no" 同时需要添加page-no属性以及对应的值标示页码

```html
<mm-000004 key="page-no" size=3 total=20>
</mm-000004>
```

### `size`

每页显示的数据条数【 Number 】

### `total`

数据总条数【 Number 】

### `max-btn-num`

显示按钮总数 【 Number 】

### `show-first`

是否显示首页按钮 ( true | false )

### `show-last`

是否显示末页按钮 ( true | false )

### `show-goto`

是否显示跳转按钮 ( true | false )

### `show-total`

是否显示总数据条数信息 ( true | false )

### `show-first-last-no`

是否显示首页及末尾页数字按钮 ( true | false )

### `lang`

语言,目前可选值有`zh_CN`和`en_US`,其它值均作英文处理.

## Example

### 不显示按钮

```html
<mm-000004 key="page-no" size=3 total=20>
</mm-000004>
```

### 最多显示两个按钮

```html
<mm-000004 key="page-no" size=3 total=20 max-btn-num=2>
</mm-000004>
```

### 显示数据总条数

```html
<mm-000004 key="page-no" size=3 total=20 max-btn-num=2 show-total>
</mm-000004>
```

### 只显示页码

```html
<mm-000004 key="page-no" size=3 total=20 max-btn-num=4>
</mm-000004>
```

### 显示首页和末页

```html
<mm-000004 key="page-no" size=3 total=20 max-btn-num=4 show-first show-last>
</mm-000004>
```

### 显示跳转

```html
<mm-000004 key="page-no" size=3 total=20 max-btn-num=4  show-goto>
</mm-000004>
```

### 显示首页/末页/跳转

```html
<mm-000004 key="page-no" size=3 total=20 max-btn-num=4  show-first show-last show-goto>
</mm-000004>
```

### 完整功能示例

```html
<mm-000004 key="page-no" size=3 total=20 max-btn-num=4  show-first show-last show-goto show-total>
</mm-000004>
```
