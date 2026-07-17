export const DEFAULT_CONFIG = {
  enabled: false,
  recognizer_enabled: true,
  show_sidebar_nav: true,
  debug: false,
  recognition_mode: 'tmdb_first',
  prefer_parsed_title: true,
  use_year_hint: true,
  use_original_title_evidence: true,
  web_search_fallback: false,
  web_search_engine: 'auto',
  web_search_max_results: 8,
  web_search_timeout: 15,
  web_search_min_evidence: 78,
  main_title_fallback: true,
  progressive_fallback: false,
  fetch_aliases: true,
  max_queries: 4,
  candidate_limit: 8,
  detail_limit: 6,
  minimum_score: 72,
  minimum_margin: 8,
  minimum_query_length: 4,
  token_weight: 38,
  similarity_weight: 24,
  prefix_weight: 14,
  rank_weight: 10,
  query_confidence_weight: 18,
  anchor_weight: 24,
  fallback_anchor_min: 32,
  year_weight: 8,
  type_weight: 6,
  season_missing_penalty: 20,
  history_limit: 30,
  episode_normalizer_enabled: false,
  release_group_assist_enabled: true,
  custom_rename_fields_enabled: true,
  release_group_type_weight: 12,
}

export function cloneConfig(config) {
  return JSON.parse(JSON.stringify({ ...DEFAULT_CONFIG, ...(config || {}) }))
}

export function unwrapResponse(response) {
  const payload = response?.data && response.data.success !== undefined
    ? response.data
    : response
  if (payload?.success === false) {
    const error = new Error(payload.message || '请求处理失败')
    error.response = payload
    throw error
  }
  if (payload && Object.prototype.hasOwnProperty.call(payload, 'data') && payload.success !== undefined) {
    return payload.data
  }
  return response?.data ?? response
}

export function scoreColor(score) {
  if (Number(score || 0) >= 85) return 'success'
  if (Number(score || 0) >= 72) return 'warning'
  return 'error'
}

export function mediaTypeText(value) {
  if (value === '电影' || value === 'movie') return '电影'
  if (value === '电视剧' || value === 'tv') return '电视剧'
  return '未知'
}
