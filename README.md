### Augular11 模仿喜马拉雅项目

### 面包屑组件
- 在父组件中要改变子组件的视图样式，要在父组件component装饰器中加入`encapsulation: ViewEncapsulation.None`
- 在`ng-container`里面使用`ngTemplateOutlet`属性可以把`template`的内容放进`ng-container`里面
- 在子组件的构造函数里面注入父组件，可以用 `.参数`的形式访问父组件的参数数据
