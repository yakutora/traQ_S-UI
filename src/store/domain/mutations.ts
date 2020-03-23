import Vue from 'vue'
import { defineMutations } from 'direct-vuex'
import { ChannelId, MessageId } from '@/types/entity-ids'
import { ActivityTimelineMessage } from '@/lib/api'
import { S } from './state'
import { ChannelState } from '.'

export const mutations = defineMutations<S>()({
  setChannelActivity(state: S, activity: ActivityTimelineMessage[]) {
    state.channelActivity = activity
  },
  setMessageActivity(state: S, activity: MessageId[]) {
    state.messageActivity = activity
  },
  addChannelState(
    state: S,
    payload: {
      id: ChannelId
      state: ChannelState
    }
  ) {
    // [TODO] ここでキャッシュされてるエントリを適切に削除する必要あり
    Vue.set(state.messageActivity, payload.id, payload.state)
  }
})
