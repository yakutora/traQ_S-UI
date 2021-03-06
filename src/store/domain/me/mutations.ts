import Vue from 'vue'
import { defineMutations } from 'direct-vuex'
import { S } from './state'
import { WebhookId, ChannelId, StampId } from '@/types/entity-ids'
import {
  UnreadChannel,
  MyUserDetail,
  ChannelSubscribeLevel,
  Message
} from '@traptitech/traq'
import { detectMentionOfMe } from '@/lib/detector'
import store from '@/store'
import { checkBadgeAPISupport } from '@/lib/util/browser'
import { removeNotification } from '@/lib/firebase'

const isBadgingAPISupported = checkBadgeAPISupport()
const updateBadge = async () => {
  if (!isBadgingAPISupported) return

  const unreadChannelsSet = store.state.domain.me.unreadChannelsSet

  const unreadCount = Object.entries(unreadChannelsSet).reduce(
    (acc, [, current]) => acc + current.count,
    0
  )
  if (unreadCount > 0) {
    await navigator.setAppBadge(unreadCount)
  } else {
    await navigator.clearAppBadge()
  }
}

export const mutations = defineMutations<S>()({
  setDetail(state: S, detail: Readonly<MyUserDetail>) {
    state.detail = detail
  },
  setWebhooks(state: S, webhooks: WebhookId[]) {
    state.webhooks = webhooks
  },
  setStampHistory(state: S, stampHistory: Record<StampId, Date>) {
    state.stampHistory = stampHistory
  },

  setUnreadChannelsSet(state: S, unreadChannels: readonly UnreadChannel[]) {
    state.unreadChannelsSet = Object.fromEntries(
      unreadChannels.map(unread => [unread.channelId, unread])
    )
    updateBadge()
  },
  upsertUnreadChannel(state: S, message: Readonly<Message>) {
    const noticeable =
      detectMentionOfMe(
        message.content,
        state.detail?.id ?? '',
        state.detail?.groups ?? []
      ) || store.state.entities.channels[message.channelId]?.force

    if (
      !(
        state.subscriptionMap[message.channelId] > 0 ||
        store.state.entities.dmChannels[message.channelId] ||
        noticeable
      )
    )
      return

    if (message.channelId in state.unreadChannelsSet) {
      const oldUnreadChannel = state.unreadChannelsSet[message.channelId]
      Vue.set(state.unreadChannelsSet, message.channelId, {
        ...oldUnreadChannel,
        count: oldUnreadChannel.count + 1,
        noticeable: oldUnreadChannel.noticeable || noticeable,
        updatedAt: message.createdAt
      })
    } else {
      Vue.set(state.unreadChannelsSet, message.channelId, {
        channelId: message.channelId,
        count: 1,
        noticeable,
        since: message.createdAt,
        updatedAt: message.createdAt
      })
    }
    updateBadge()
  },
  // TODO: https://github.com/traPtitech/traQ_S-UI/issues/636
  deleteUnreadChannel(state: S, channelId: ChannelId) {
    Vue.delete(state.unreadChannelsSet, channelId)
    updateBadge()
    removeNotification(channelId)
  },

  setStaredChannels(state: S, channelIds: readonly ChannelId[]) {
    state.staredChannelSet = Object.fromEntries(
      channelIds.map(id => [id, true])
    )
  },
  addStaredChannel(state: S, channelId: ChannelId) {
    Vue.set(state.staredChannelSet, channelId, true)
  },
  deleteStaredChannel(state: S, channelId: ChannelId) {
    Vue.delete(state.staredChannelSet, channelId)
  },

  upsertLocalStampHistory(
    state: S,
    { stampId, datetime }: { stampId: StampId; datetime: Date }
  ) {
    Vue.set(state.stampHistory, stampId, datetime)
  },

  setSubscriptionMap(
    state: S,
    subscriptionMap: Record<ChannelId, ChannelSubscribeLevel>
  ) {
    state.subscriptionMap = subscriptionMap
  },
  setSubscription(
    state: S,
    payload: {
      channelId: ChannelId
      subscriptionLevel: ChannelSubscribeLevel
    }
  ) {
    Vue.set(state.subscriptionMap, payload.channelId, payload.subscriptionLevel)
  }
})
