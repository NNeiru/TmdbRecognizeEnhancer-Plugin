export const DEFAULT_CONFIG = {
  enabled: false,
  show_sidebar_nav: true,
  debug: false,
  prefer_parsed_title: true,
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
  year_weight: 8,
  type_weight: 6,
  season_missing_penalty: 20,
  history_limit: 30,
}

export function cloneConfig(config) {
  return JSON.parse(JSON.stringify({ ...DEFAULT_CONFIG, ...(config || {}) }))
}

export function unwrapResponse(response) {
  if (response && Object.prototype.hasOwnProperty.call(response, 'data') && response.success !== undefined) {
    return response.data
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
