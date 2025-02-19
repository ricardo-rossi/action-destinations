// Generated file. DO NOT MODIFY IT BY HAND.

export interface Payload {
  /**
   * Whether or not the message should actually get sent.
   */
  send?: boolean
  /**
   * Whether or not trait enrich from event (i.e without profile api call)
   */
  traitEnrichment?: boolean
  /**
   * User ID in Segment
   */
  userId: string
  /**
   * Email to send to when testing
   */
  toEmail?: string
  /**
   * Verified domain in Sendgrid
   */
  fromDomain?: string | null
  /**
   * From Email
   */
  fromEmail: string
  /**
   * From Name displayed to end user email
   */
  fromName: string
  /**
   * Whether "reply to" settings are the same as "from"
   */
  replyToEqualsFrom?: boolean
  /**
   * The Email used by user to Reply To
   */
  replyToEmail: string
  /**
   * The Name used by user to Reply To
   */
  replyToName: string
  /**
   * BCC list of emails
   */
  bcc: string
  /**
   * Preview Text
   */
  previewText?: string
  /**
   * Subject for the email to be sent
   */
  subject: string
  /**
   * The message body
   */
  body?: string
  /**
   * URL to the message body
   */
  bodyUrl?: string
  /**
   * The type of body which is used generally html | design
   */
  bodyType: string
  /**
   * The HTML content of the body
   */
  bodyHtml?: string
  /**
   * An array of user profile identity information.
   */
  externalIds?: {
    /**
     * A unique identifier for the collection.
     */
    id?: string
    /**
     * The external ID contact type.
     */
    type?: string
    /**
     * The subscription status for the identity.
     */
    subscriptionStatus?: string
    /**
     * Subscription groups and their statuses for this id.
     */
    groups?: {
      id?: string
      /**
       * Group subscription status true is subscribed, false is unsubscribed or did-not-subscribe
       */
      isSubscribed?: boolean
    }[]
  }[]
  /**
   * Additional custom args that we be passed back opaquely on webhook events
   */
  customArgs?: {
    [k: string]: unknown
  }
  /**
   * A user profile's traits
   */
  traits?: {
    [k: string]: unknown
  }
}
