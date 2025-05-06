import GuidRuleTableEditor from './index.vue'
import GuidEditorCol from './GuidEditorCol'
import GuidEditorExpress from './GuidEditorExpress'
import GuidEditorForm from './GuidEditorForm'
import GuidEditorBomField from './GuidEditorBomField'
import GuidEditorSelect from './GuidEditorSelect'
import GuidEditorString from './GuidEditorString'
import GuidEditorNumber from './GuidEditorNumber'
import GuidEditorDate from './GuidEditorDate'
import GuidEditorOperator from './GuidEditorOperator'
import GuidRuleEditor from './GuidRuleEditor'
import DecisionTableRow from './EditableDecisionTable/DecisionTableRow'
import EditableDecisionTable from './EditableDecisionTable/index'
export default {
    install(Vue) {
        Vue.component('GuidRuleTableEditor', GuidRuleTableEditor)
        Vue.component('GuidEditorCol', GuidEditorCol)
        Vue.component('GuidEditorExpress', GuidEditorExpress)
        Vue.component('GuidEditorForm', GuidEditorForm)
        Vue.component('GuidEditorBomField', GuidEditorBomField)
        Vue.component('GuidEditorSelect', GuidEditorSelect)
        Vue.component('GuidEditorString', GuidEditorString)
        Vue.component('GuidEditorNumber', GuidEditorNumber)
        Vue.component('GuidEditorDate', GuidEditorDate)
        Vue.component('GuidEditorOperator', GuidEditorOperator)
        Vue.component('GuidRuleEditor', GuidRuleEditor)
        Vue.component('DecisionTableRow', DecisionTableRow)
        Vue.component('EditableDecisionTable', EditableDecisionTable)
    }
}