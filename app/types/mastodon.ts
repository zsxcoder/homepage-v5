export interface MastodonStatus {
	id: string
	created_at: string
	content: string
	spoiler_text?: string
	visibility: string
	sensitive: boolean
	language?: string
	uri: string
	url?: string
	replies_count: number
	reblogs_count: number
	favourites_count: number
	favourited: boolean
	reblogged: boolean
	muted: boolean
	bookmarked: boolean
	pinned: boolean
	media_attachments: MastodonMediaAttachment[]
	emojis: MastodonEmoji[]
	tags: MastodonTag[]
	reblog?: MastodonStatus
	in_reply_to_id?: string
	account: MastodonAccount
}

export interface MastodonAccount {
	id: string
	username: string
	acct: string
	display_name: string
	url: string
	note: string
	avatar: string
	avatar_static: string
	header: string
	header_static: string
	locked: boolean
	created_at: string
	followers_count: number
	following_count: number
	statuses_count: number
	bot: boolean
	discoverable?: boolean
}

export interface MastodonMediaAttachment {
	id: string
	type: 'image' | 'gifv' | 'video' | 'audio' | 'unknown'
	url: string
	preview_url: string
	remote_url?: string
	description?: string
	meta?: any
}

export interface MastodonEmoji {
	shortcode: string
	static_url: string
	url: string
	visible_in_picker: boolean
}

export interface MastodonTag {
	name: string
	url: string
	history?: Array<{
		day: string
		uses: string
		accounts: string
	}>
}

export interface MastodonConfig {
	instance: string
	userId: string
	token?: string
	tag?: string
	shownMax?: number
}
