import type { MastodonConfig } from './mastodon'

declare module 'vue-router' {
	interface RouteMeta {
		headerText?: string
	}
}

declare module 'nuxt/schema' {
	interface AppConfigInput {
		mastodon?: MastodonConfig
	}
}
export {}
