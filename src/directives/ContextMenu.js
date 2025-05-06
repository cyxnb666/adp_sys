import Vue from 'vue'
import { Scrollbar as ElScrollbar } from 'element-ui'

class ContextMenu {
    name = 'contextmenu'
    constructor() {

    }
    bind(el, binding) {
        const _this = binding.def
        if (binding.modifiers.click) {
            el.addEventListener('click', _this.movePoint.bind(binding))
        } else {
            el.addEventListener('contextmenu', binding.def.movePoint.bind(binding))
        }
        window.addEventListener('resize', _this.hiddenEvent.bind(_this))
        window.addEventListener('click', _this.hiddenEvent.bind(_this))
    }
    unbind(el, binding) {
        if (binding.modifiers.click) {
            el.removeEventListener('click', binding.def.movePoint.bind(binding))
        } else {
            el.removeEventListener('contextmenu', binding.def.movePoint)
        }
        window.removeEventListener('resize', binding.def.hiddenEvent)
        window.removeEventListener('click', binding.def.hiddenEvent)
    }
    initMenu(config) {
        const instance = new Vue({
            components: { ElScrollbar },
            data() {
                return {
                    options: config.options || [],
                    visible: true,
                    style: {
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        zIndex: 100000,
                        'max-width': '495px',
                        'max-height': '350px',
                        overflow: 'hidden'
                    }
                }
            },
            render() {
                return <div v-show={this.visible} class="custom-menu el-select-dropdown" style={this.style}>
                    <el-scrollbar tag="ul">
                        {
                            this.options.map(v => {
                                return <li onClick={(ev) => this.$emit('handleSelect', v)} class="el-select-dropdown__item">{v.label}</li>
                            })
                        }
                    </el-scrollbar>
                </div>
            },
        }).$mount()
        instance.$on('handleSelect', config.callback)
        this.$menu = instance
        document.body.appendChild(instance.$el)
        return instance
    }
    movePoint(ev) {

        this.def.hiddenEvent()
        // if (this.modifiers.prevent)
        ev.preventDefault()

        ev.stopPropagation()

        let { options = [], validate, callback } = this.value

        if (typeof options === 'function' && !(options = options()) || !options.length) return

        // 验证是否禁用菜单
        if (validate && validate()) return

        const menu = this.def.initMenu({ options, callback })

        menu.$nextTick(() => {

            let bodyX = document.body.offsetWidth
            let bodyY = document.body.offsetHeight

            bodyX = ((ev.x + menu.$el.offsetWidth) > bodyX) ? (ev.x - menu.$el.offsetWidth) : ev.x

            menu.style.left = `${bodyX}px`

            // const top = ev.clientY + 10
            bodyY = ev.clientY + menu.$el.offsetHeight > bodyY ? ev.clientY - menu.$el.offsetHeight - 10 : ev.clientY + 10

            menu.style.top = `${bodyY}px`

            const scrollbarView = menu.$el.querySelector('.el-scrollbar__wrap')
            if (scrollbarView) {
                scrollbarView.style.maxHeight = '350px'
                scrollbarView.style.maxWidth = '500px'
            }
        })

    }
    hiddenEvent() {
        if (this.$menu) {
            this.$menu.visible = false
            this.$menu.$destroy()
            document.body.removeChild(this.$menu.$el)
            this.$menu = null
        }
    }
}

export default new ContextMenu()
