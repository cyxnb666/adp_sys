
<template>
  <div class="row">
    <div class="col-2">
      <div class="form-group">
        <div
          class="btn-group-vertical buttons"
          role="group"
          aria-label="Basic example"
        >
          <button class="btn btn-secondary" @click="add">Add</button>
          <button class="btn btn-secondary" @click="replace">Replace</button>
        </div>

        <div class="form-check">
          <input
            id="disabled"
            v-model="enabled"
            type="checkbox"
            class="form-check-input"
          >
          <label class="form-check-label" for="disabled">是否允许拖拽排序</label>
        </div>
      </div>
    </div>

    <div class="col-6">
      <h3>Draggable {{ draggingInfo }}</h3>

      <draggable
        :list="list"
        :disabled="!enabled"
        class="list-group"
        ghost-class="ghost"
        :move="checkMove"
        @start="dragging = true"
        @end="dragging = false"
      >
        <div
          v-for="element in list"
          :key="element.name"
          class="list-group-item"
        >
          {{ element.name }}
        </div>
      </draggable>
    </div>

    <!-- <rawDisplayer class="col-3" :value="list" title="List" /> -->
  </div>
</template>

<script>
// import draggable from '@/vuedraggable'
import draggable from 'vuedraggable'
let id = 1
export default {
  name: 'Simple',
  display: 'Simple',
  order: 0,
  components: {
    draggable
  },
  data() {
    return {
      enabled: true,
      list: [
        { name: 'John', id: 0 },
        { name: 'Joao', id: 1 },
        { name: 'Jean', id: 2 }
      ],
      dragging: false
    }
  },
  computed: {
    draggingInfo() {
      return this.dragging ? 'under drag' : ''
    }
  },
  methods: {
    add: function() {
      this.list.push({ name: 'Juan ' + id, id: id++ })
    },
    replace: function() {
      this.list = [{ name: 'Edgard', id: id++ }]
    },
    checkMove: function(e) {
      window.console.log('Future index: ' + e.draggedContext.futureIndex)
    }
  }
}
</script>
<style scoped>
.buttons {
  margin-top: 35px;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
