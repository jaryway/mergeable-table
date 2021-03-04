### 组件结构 ISchema<T>

| 属性          | 说明                             | 默认值 |
| :------------ | -------------------------------- | :----- |
| componentName | 必填，组件类型名称 如：TextField | 无     |
| id            | 必填，组件 ID，表单内唯一值      | 无     |
| props         | 必填，具体的组件属性             | 无     |
| children      | 子组件集合 ，`Array<ISchema<T>>` | 无     |

例子

```json
{
  "componentName": "Page",
  "id": "page_ockkf0f400h",
  "props": {},
  "children": [
    {
      "componentName": "TextField",
      "id": "textField_ockkf0fnm9h",
      "props": {
        "label": "申请单编号",
        "placeholder": "请输入申请单编号",
        "labelColSpan": 4,
        "fieldId": "textField_dddc"
      }
    }
  ]
}
```

### IValidation 验证规则结构

| 属性    | 说明                                                                                                   | 类型     | 默认值 |
| :------ | ------------------------------------------------------------------------------------------------------ | :------- | :----- |
| type    | 必填，可选值 `required` `phone` `minLength` `maxLength` `min` `max` `url` `mobile` `email` `ID` `date` | `string` | 无     |
| param   | 可选，比如 当 type='maxLength', param 则为 maxLength 的值                                              | `string` | 无     |
| message | 验证提示信息                                                                                           | `string` | 无     |

### IOption 验证规则结构

| 属性           | 说明           | 类型      | 默认值 |
| :------------- | -------------- | :-------- | :----- |
| value          | 必填，选项的值 | `string`  | 无     |
| defaultChecked | 默认是否选中   | `boolean` | 无     |
| text           | 选项显示的文本 | `string`  | 无     |

### IDisabledDate 可不选日期规则结构

| 属性  | 说明                                                                                     | 类型     | 默认值 |
| :---- | ---------------------------------------------------------------------------------------- | :------- | :----- |
| type  | 必填，可选值 `none` `afterToday` `beforeToday` `duration`, duration 为禁用一个区间的日期 | `string` | 无     |
| start | 当 type = duration 时必填， 区间的开始日期                                               | `Date`   | 无     |
| end   | 当 type = duration 时必填， 区间的结束日期                                               | `Date`   | 无     |

### 下面是各个组件的属性（即组件结构中的 props 属性的部分）：

#### Page 页面

_Page 组件暂无属性_

#### PageSection 分组

| 属性 | 说明                            | 类型     | 默认值 |
| :--- | ------------------------------- | :------- | :----- |
| size | 组件大小,可选 `small` `default` | `string` | 无     |

#### ColumnsLayout 布局容器

| 属性         | 说明         | 类型     | 默认值 |
| :----------- | ------------ | :------- | ------ |
| columnGap    | 列间隔       | `number` | 无     |
| rowGap       | 行间隔       | `number` | 无     |
| mobileRowGap | 移动端行间隔 | `number` | 无     |

#### Column 布局容器列（需在布局容器内用）

| 属性 | 说明                       | 类型     | 默认值 |
| :--- | -------------------------- | :------- | ------ |
| span | 栅格占位格数 可选值： 0~24 | `number` | 无     |

#### TextField 单行文本

| 属性           | 说明                                       | 类型                 | 默认值 |
| :------------- | ------------------------------------------ | :------------------- | ------ |
| fieldId        | 必填，字段的 ID，需唯一                    | `string`             | 无     |
| label          | 标签文本                                   | `string`             | 无     |
| labelAlign     | 标签对齐方式                               | `string`             | 无     |
| labelTextAlign | 标签文本对齐方式                           | `string`             | 无     |
| placeholder    | 占位提示                                   | `string`             | 无     |
| labelColSpan   | 标签宽度(栅格)                             | `number`             | 无     |
| validation     | 验证规则                                   | `Array<IValidation>` | 无     |
| value          | 默认值                                     | `string`             | 无     |
| size           | 组件大小,可选值 `small`\|`medium`\|`large` | `string`             | 无     |
| minLength      | 最小长度                                   | `number`             | 无     |
| maxLength      | 最大长度                                   | `number`             | 无     |

#### TextareaField 多行文本

| 属性           | 说明                                       | 类型                 | 默认值 |
| :------------- | ------------------------------------------ | :------------------- | ------ |
| fieldId        | 必填，字段的 ID，需唯一                    | `string`             | 无     |
| label          | 标签文本                                   | `string`             | 无     |
| labelAlign     | 标签对齐方式                               | `string`             | 无     |
| labelTextAlign | 标签文本对齐方式                           | `string`             | 无     |
| placeholder    | 占位提示                                   | `string`             | 无     |
| labelColSpan   | 标签宽度(栅格)                             | `number`             | 无     |
| validation     | 验证规则                                   | `Array<IValidation>` | 无     |
| value          | 默认值                                     | `string`             | 无     |
| size           | 组件大小,可选值 `small`\|`medium`\|`large` | `string`             | 无     |
| rows           | 行高                                       | `number`             | 无     |
| autoHeight     | 是否高度自增                               | `boolean`            | `true` |

#### NumberField 数值

| 属性           | 说明                                       | 类型                 | 默认值 |
| :------------- | ------------------------------------------ | :------------------- | ------ |
| fieldId        | 必填，字段的 ID，需唯一                    | `string`             | 无     |
| label          | 标签文本                                   | `string`             | 无     |
| labelAlign     | 标签对齐方式                               | `string`             | 无     |
| labelTextAlign | 标签文本对齐方式                           | `string`             | 无     |
| placeholder    | 占位提示                                   | `string`             | 无     |
| labelColSpan   | 标签宽度(栅格)                             | `number`             | 无     |
| validation     | 验证规则                                   | `Array<IValidation>` | 无     |
| value          | 默认值                                     | `number`             | 无     |
| size           | 组件大小,可选值 `small`\|`medium`\|`large` | `string`             | 无     |
| min            | 最小值                                     | `number`             | 无     |
| max            | 最大值                                     | `number`             | 无     |

#### CheckboxField 复选 和 RadioField 单选

| 属性           | 说明                                                           | 类型                 | 默认值   |
| :------------- | -------------------------------------------------------------- | :------------------- | -------- |
| fieldId        | 必填，字段的 ID，需唯一                                        | `string`             | 无       |
| label          | 标签文本                                                       | `string`             | 无       |
| labelAlign     | 标签对齐方式                                                   | `string`             | 无       |
| labelTextAlign | 标签文本对齐方式                                               | `string`             | 无       |
| labelColSpan   | 标签宽度(栅格)                                                 | `number`             | 无       |
| validation     | 验证规则                                                       | `Array<IValidation>` | 无       |
| value          | 默认值                                                         | `Array<string>`      | 无       |
| remote         | 当 dataSourceType=remote 时必填，数据源请求的 api 地址         | `string`             | 无       |
| dataSourceType | 必填，数据源类型，可选值 远程加载： `remote` 自定义： `custom` | `string`             | `custom` |
| dataSource     | 当 dataSourceType=custom 时必填，选项的数据源                  | `Array<IOption>`     | `custom` |

#### SelectField 下拉单选 和 MultiSelectField 下拉复选

| 属性           | 说明                                                   | 类型                 | 默认值   |
| :------------- | ------------------------------------------------------ | :------------------- | -------- |
| fieldId        | 必填，字段的 ID，需唯一                                | `string`             | 无       |
| label          | 标签文本                                               | `string`             | 无       |
| labelAlign     | 标签对齐方式                                           | `string`             | 无       |
| labelTextAlign | 标签文本对齐方式                                       | `string`             | 无       |
| placeholder    | 占位提示                                               | `string`             | 无       |
| labelColSpan   | 标签宽度(栅格)                                         | `number`             | 无       |
| validation     | 验证规则                                               | `Array<IValidation>` | 无       |
| value          | 默认值                                                 | `Array<string>`      | 无       |
| remote         | 当 dataSourceType=remote 时必填，数据源请求的 api 地址 | `string`             | 无       |
| dataSourceType | 必填，数据源类型，可选值 `remote`\|`custom`            | `string`             | `custom` |
| dataSource     | 当 dataSourceType=custom 时必填，选项的数据源          | `Array<IOption>`     | `custom` |
| mode           | 下拉单选为：`single`, 下拉复选为：`multiple`           | `string`             | 无       |

#### DateField 日期

| 属性           | 说明                                                                                         | 类型                 | 默认值 |
| :------------- | -------------------------------------------------------------------------------------------- | :------------------- | ------ |
| fieldId        | 必填，字段的 ID，需唯一                                                                      | `string`             | 无     |
| label          | 标签文本                                                                                     | `string`             | 无     |
| labelAlign     | 标签对齐方式                                                                                 | `string`             | 无     |
| labelTextAlign | 标签文本对齐方式                                                                             | `string`             | 无     |
| placeholder    | 占位提示                                                                                     | `string`             | 无     |
| labelColSpan   | 标签宽度(栅格)                                                                               | `number`             | 无     |
| validation     | 验证规则                                                                                     | `Array<IValidation>` | 无     |
| value          | 默认值                                                                                       | `Date`\| `string`    | 无     |
| size           | 组件大小,可选值 `small`\|`medium`\|`large`                                                   | `string`             | 无     |
| disabledDate   | 不可选的日期                                                                                 | `IDisabledDate`      | 无     |
| format         | 格式化显示,可选值 `YYYY`\|`YYYY-MM`\|`YYYY-MM-DD`\|`YYYY-MM-DD HH:mm`\|`YYYY-MM-DD HH:mm:ss` | `string`             | 无     |

#### CascadeDateField 日期区间

| 属性           | 说明                                                                                         | 类型                 | 默认值 |
| :------------- | -------------------------------------------------------------------------------------------- | :------------------- | ------ |
| fieldId        | 必填，字段的 ID，需唯一                                                                      | `string`             | 无     |
| label          | 标签文本                                                                                     | `string`             | 无     |
| labelAlign     | 标签对齐方式                                                                                 | `string`             | 无     |
| labelTextAlign | 标签文本对齐方式                                                                             | `string`             | 无     |
| placeholder    | 占位提示                                                                                     | `string`             | 无     |
| labelColSpan   | 标签宽度(栅格)                                                                               | `number`             | 无     |
| validation     | 验证规则                                                                                     | `Array<IValidation>` | 无     |
| value          | 默认值                                                                                       | `Date`\|`string`     | 无     |
| size           | 组件大小,可选值 `small`\|`medium`\|`large`                                                   | `string`             | 无     |
| disabledDate   | 不可选的日期                                                                                 | `IDisabledDate`      | 无     |
| format         | 格式化显示,可选值 `YYYY`\|`YYYY-MM`\|`YYYY-MM-DD`\|`YYYY-MM-DD HH:mm`\|`YYYY-MM-DD HH:mm:ss` | `string`             | 无     |

#### EditorField 富文本编辑器

| 属性           | 说明                                       | 类型                 | 默认值 |
| :------------- | ------------------------------------------ | :------------------- | ------ |
| fieldId        | 必填，字段的 ID，需唯一                    | `string`             | 无     |
| label          | 标签文本                                   | `string`             | 无     |
| labelAlign     | 标签对齐方式                               | `string`             | 无     |
| labelTextAlign | 标签文本对齐方式                           | `string`             | 无     |
| placeholder    | 占位提示                                   | `string`             | 无     |
| labelColSpan   | 标签宽度(栅格)                             | `number`             | 无     |
| validation     | 验证规则                                   | `Array<IValidation>` | 无     |
| value          | 默认值                                     | `string`             | 无     |
| size           | 组件大小,可选值 `small`\|`medium`\|`large` | `string`             | 无     |
| scriptSrc      | js 链接                                    | `string`             | 无     |

#### OrganizationSelectField 组织机构选择器

| 属性           | 说明                                       | 类型                                                                                         | 默认值 |
| :------------- | ------------------------------------------ | :------------------------------------------------------------------------------------------- | ------ |
| fieldId        | 必填，字段的 ID，需唯一                    | `string`                                                                                     | 无     |
| label          | 标签文本                                   | `string`                                                                                     | 无     |
| labelAlign     | 标签对齐方式                               | `string`                                                                                     | 无     |
| labelTextAlign | 标签文本对齐方式                           | `string`                                                                                     | 无     |
| placeholder    | 占位提示                                   | `string`                                                                                     | 无     |
| labelColSpan   | 标签宽度(栅格)                             | `number`                                                                                     | 无     |
| validation     | 验证规则                                   | `Array<IValidation>`                                                                         | 无     |
| value          | 默认值                                     | `string`                                                                                     | 无     |
| size           | 组件大小,可选值 `small`\|`medium`\|`large` | `string`                                                                                     | 无     |
| type           | 必填，选择类型                             | `Array<'LEGALENTITY'\|'DIVISION'\|'GROUP'\|'POSITION'\|'USER'\|'VARIABLEROLE'\|'ROOTLEGAL'>` | 无     |
| multiple       | 是否多选                                   | `boolean`                                                                                    | `true` |
| tagClosable    | 是否显示删除按钮                           | `boolean`                                                                                    | `true` |
