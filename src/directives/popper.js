import Vue from 'vue'

import Popper from 'element-ui/src/utils/popper'
import PopupManager from 'element-ui/src/utils/popup/popup-manager'

class Tooltip {
    constructor() {
        this.options = {
            offset: 0,
            arrowOffset: 0,
            placement: 'top',
            boundariesPadding: 10,
            gpuAcceleration: false,
        }
        this.tooltip = new Vue({
            data() {
                return {
                    content: '',
                    showPopper: false,
                    disabled: false,
                    effect: 'dark'
                }
            },
            render() {
                return <div v-show={ !this.disabled && this.showPopper } class={ ['el-tooltip__popper', "is-"+this.effect, this.popperClass] }>
                    { this.content }<div class="popper__arrow"></div>
                </div>
            }
        }).$mount()
        document.body.appendChild(this.tooltip.$el)
    }
    handleEnter(props, el) {
        
        let content = props.value.content

        if (typeof content === 'function' && !(content = content())) return

        el = el.target || el

        if (props.modifiers.overflow) {
            const style = getComputedStyle(el)
            // const range = document.createRange()
            // range.setStart(el, 0)
            // range.setEnd(el, el.childNodes.length)
            const rangeDom = el.getBoundingClientRect()
            let width = parseInt(style.paddingLeft) + parseInt(style.paddingRight) + Math.round(rangeDom.width)

            if (width <= el.parentNode.offsetWidth) return
        }

        this.tooltip.showPopper = true
        this.tooltip.content = content

        this.tooltip.$nextTick(() => {
            const popperJs = new Popper(el, this.tooltip.$el, Object.assign(this.options, props.value.options || {}))
            popperJs._popper.style.zIndex = PopupManager.nextZIndex()
        })
    }
    handleLeave() {
        this.tooltip.showPopper = false
    }
    bind(el, binding) {
        if (!binding.value.content) return
        el.addEventListener('mouseenter', binding.def.handleEnter.bind(binding.def, binding))
        el.addEventListener('mouseleave', binding.def.handleLeave.bind(binding.def))
    }
    unbind(el, binding) {
        if (!binding.value.content) return
        el.removeEventListener('mouseenter', binding.def.handleEnter)
        el.removeEventListener('mouseenter', binding.def.handleLeave)
    }
}
Vue.directive('popper', new Tooltip())