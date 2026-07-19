const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};

const DEFAULT_CONFIG = {
  enabled: false,
  recognizer_enabled: true,
  show_sidebar_nav: true,
  debug: false,
  recognition_mode: "tmdb_first",
  prefer_parsed_title: true,
  use_year_hint: true,
  use_original_title_evidence: true,
  web_search_fallback: false,
  web_search_engine: "auto",
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
  emby_episode_group_sync_enabled: false,
  emby_episode_group_sync_servers: [],
  emby_episode_group_sync_initial_delay_seconds: 15,
  emby_episode_group_sync_retry_seconds: 30,
  emby_episode_group_sync_max_wait_minutes: 15,
  emby_episode_group_sync_path_mappings: [],
  emby_episode_group_sync_conflict_policy: "skip",
  emby_episode_group_sync_refresh_metadata: true,
  release_group_assist_enabled: true,
  recognition_rule_overrides_enabled: true,
  release_group_type_weight: 12,
  seasonal_evidence_enabled: true,
  seasonal_evidence_weight: 18,
  recognition_memory_enabled: true,
  recognition_memory_weight: 16,
  recognition_memory_min_hits: 3,
  recognition_memory_ttl_days: 14,
  custom_rename_fields_enabled: true,
  rename_mapping_enabled: true,
  rename_default_separator: "",
  rename_separator_fields: [],
  customization_separator: "@",
  release_group_default_connector: "@",
  release_group_normalize_unknown_connectors: false
};
const UI_VERSION = "0.7.0-beta.9";
function ensureUiVersion(backendVersion) {
  const backend = String(backendVersion || "").trim();
  if (!backend || backend === UI_VERSION || typeof window === "undefined") return false;
  const guardKey = `tmdb-recognize-enhancer-ui-reload:${backend}`;
  if (window.sessionStorage?.getItem(guardKey) !== "done") {
    window.sessionStorage?.setItem(guardKey, "done");
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("_tmdb_ui", backend);
    window.setTimeout(() => window.location.replace(nextUrl.toString()), 120);
  }
  return true;
}
function cloneConfig(config) {
  return JSON.parse(JSON.stringify({ ...DEFAULT_CONFIG, ...config || {} }));
}
function unwrapResponse(response) {
  const payload = response?.data && response.data.success !== void 0 ? response.data : response;
  if (payload?.success === false) {
    const error = new Error(payload.message || "请求处理失败");
    error.response = payload;
    throw error;
  }
  if (payload && Object.prototype.hasOwnProperty.call(payload, "data") && payload.success !== void 0) {
    return payload.data;
  }
  return response?.data ?? response;
}
function scoreColor(score) {
  if (Number(score || 0) >= 85) return "success";
  if (Number(score || 0) >= 72) return "warning";
  return "error";
}
function mediaTypeText(value) {
  if (value === "电影" || value === "movie") return "电影";
  if (value === "电视剧" || value === "tv") return "电视剧";
  return "未知";
}

export { UI_VERSION as U, _export_sfc as _, cloneConfig as c, ensureUiVersion as e, mediaTypeText as m, scoreColor as s, unwrapResponse as u };
