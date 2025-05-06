
const broadcast = function(componentName, eventName, params) {
    this.$children.forEach(child => {
        var name = child.$options.componentName
    
        broadcast.apply(child, [componentName, eventName].concat([params]))
        if (name === componentName || Array.isArray(componentName) && componentName.indexOf(name) > -1) {
            child.$emit.apply(child, [eventName].concat(params))
        }
    })
}

export default broadcast