import Analytics from 'analytics'
export type ANALYTICS_ACTIONS =
  | 'registration_click'
  | 'registration_submit_click'
  | 'registration_close_click'
  | 'debate_vote_click'
  | 'submit_proposal_click'
  | 'submit_draft_proposal_click'
  | 'submit_reply_click'
  | 'submit_draft_reply_click'
  | 'debate_article_click'
  | 'debate_argument_delete'
  | 'debate_vote_delete'
  | 'debate_argument_publish'
export const analytics = Analytics({
  app: typeof window !== 'undefined' ? window.location.hostname : 'Unknown',
  plugins: [
    {
      name: 'Analythicccs',
      track: ({
        payload,
      }: {
        readonly payload: {
          readonly event: ANALYTICS_ACTIONS
          readonly properties?: any
        }
      }) => {
        if (window.gtag) window.gtag('event', payload.event, payload.properties)
      },
      identify: ({
        payload,
      }: {
        readonly payload: {
          readonly type: string
          readonly userId: string
        }
      }) => {
        if (window.gtag)
          window.gtag('config', window.__capco_gtagId, {
            user_id: payload.userId,
          })
      },
    },
  ],
})
