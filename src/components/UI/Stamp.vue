<template>
  <img
    loading="lazy"
    :class="$style.container"
    :src="imageUrl"
    :alt="name"
    :title="!withoutTitle ? name : undefined"
    draggable="false"
  />
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api'
import store from '@/store'
import { StampId } from '@/types/entity-ids'
import { buildFilePath } from '@/lib/apis'

export default defineComponent({
  name: 'Stamp',
  props: {
    stampId: {
      type: String as PropType<StampId>,
      required: true
    },
    withoutTitle: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const name = computed(
      () => store.state.entities.stamps[props.stampId]?.name ?? ''
    )
    const imageUrl = computed(() => {
      const fileId = store.state.entities.stamps[props.stampId]?.fileId
      return fileId ? `${buildFilePath(fileId)}` : undefined
    })
    return { imageUrl, name }
  }
})
</script>

<style lang="scss" module>
.container {
  object-fit: contain;
  user-select: none;
  contain: strict;
}
</style>
