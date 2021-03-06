<template>
  <div :class="$style.container" :data-is-selected="isSelected">
    <span :class="$style.name" :title="pathTooltip">
      {{ pathToShow }}
    </span>
    <template v-if="qallUserIds.length > 0">
      <icon :class="$style.qallIcon" :size="16" mdi name="phone-outline" />
      <user-icon-ellipsis-list
        direction="row"
        transition="fade-right"
        :user-ids="qallUserIds"
        :border-width="2"
        :icon-size="24"
        :overlap="8"
        :show-count="false"
        prevent-modal
      />
    </template>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  reactive,
  PropType
} from '@vue/composition-api'
import useChannelPath from '@/use/channelPath'
import { useQallSession } from '../../MainView/ChannelSidebar/use/channelRTCSession'
import Icon from '@/components/UI/Icon.vue'
import UserIconEllipsisList from '@/components/UI/UserIconEllipsisList.vue'
import { ChannelTreeNode } from '@/store/domain/channelTree/state'
import { Channel } from '@traptitech/traq'

interface TreeProps {
  channel: ChannelTreeNode
  showShortenedPath: false
}

interface ListProps {
  channel: Channel
  showShortenedPath: true
}

type TypedProps = TreeProps | ListProps

const usePath = (typedProps: TypedProps) => {
  const { channelIdToShortPathString, channelIdToPathString } = useChannelPath()

  const getPathWithAncestor = (skippedAncestorNames?: string[]) =>
    skippedAncestorNames
      ? [...skippedAncestorNames].reverse().join('/').concat('/')
      : ''

  const pathToShow = computed(() =>
    typedProps.showShortenedPath
      ? channelIdToShortPathString(typedProps.channel.id)
      : getPathWithAncestor(typedProps.channel.skippedAncestorNames) +
        typedProps.channel.name
  )
  const pathTooltip = computed(() =>
    typedProps.showShortenedPath
      ? `#${channelIdToPathString(typedProps.channel.id)}`
      : undefined
  )

  return { pathToShow, pathTooltip }
}

const useRTCState = (typedProps: TypedProps) => {
  const { sessionUserIds } = useQallSession(
    reactive({ channelId: computed(() => typedProps.channel.id) })
  )

  return { qallUserIds: sessionUserIds }
}

export default defineComponent({
  name: 'ChannelElementName',
  components: {
    Icon,
    UserIconEllipsisList
  },
  props: {
    channel: {
      type: Object as PropType<ChannelTreeNode | Channel>,
      required: true
    },
    showShortenedPath: {
      type: Boolean,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const typedProps = props as TypedProps

    const { pathToShow, pathTooltip } = usePath(typedProps)
    const { qallUserIds } = useRTCState(typedProps)

    return { pathToShow, pathTooltip, qallUserIds }
  }
})
</script>

<style lang="scss" module>
.container {
  @include size-body1;
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  height: 100%;
  padding: 0 8px;
  cursor: pointer;
  &[data-is-selected] {
    font-weight: bold;
  }
}
.name {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.qallIcon {
  flex-shrink: 0;
  margin: 2px 8px;
  opacity: 0.5;
}
</style>
