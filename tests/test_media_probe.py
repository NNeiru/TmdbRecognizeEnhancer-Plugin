"""整理前媒体流扫描的纯解析与字段写入测试。"""

import importlib.util
import io
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MODULE_PATH = ROOT / "plugins.v2" / "tmdbrecognizeenhancer" / "media_probe.py"


def _load_module():
    spec = importlib.util.spec_from_file_location("media_probe_test", MODULE_PATH)
    module = importlib.util.module_from_spec(spec)
    assert spec and spec.loader
    spec.loader.exec_module(module)
    return module


def _probe_class():
    return _load_module().MediaFileProbe


def _sample_payload():
    return {
        "streams": [
            {
                "codec_type": "video", "codec_name": "hevc", "pix_fmt": "yuv420p10le",
                "width": 3840, "height": 2160, "color_transfer": "smpte2084",
                "avg_frame_rate": "24000/1001", "disposition": {"default": 1},
            },
            {
                "codec_type": "audio", "codec_name": "aac",
                "tags": {"language": "jpn"}, "disposition": {"default": 1},
            },
            {"codec_type": "subtitle", "codec_name": "ass", "tags": {"language": "zh-cn"}},
            {"codec_type": "subtitle", "codec_name": "ass", "tags": {"language": "zh-tw"}},
            {"codec_type": "subtitle", "codec_name": "ass", "tags": {"language": "jpn"}},
        ],
        "format": {"duration": "1438.125"},
    }


def test_parse_ffprobe_payload_to_mp_and_jinja_fields():
    probe = _probe_class()

    result = probe.parse_payload(_sample_payload())

    assert result["success"] is True
    assert result["fields"] == {
        "videoCodec": "H265", "videoBit": "10bit", "videoFormat": "2160P",
        "effect": "HDR10", "fps": 23.976, "audioCodec": "AAC",
    }
    assert result["context"]["probe_subtitle_languages"] == "简体、繁体、日语"
    assert result["context"]["probe_subtitle_track_labels"] == "简体、繁体、日语"
    assert result["context"]["probe_audio_languages"] == "日语"


def test_fill_empty_preserves_mp_values_but_exposes_probe_context():
    probe = _probe_class()
    result = probe.parse_payload(_sample_payload())
    rename_dict = {"videoCodec": "AV1", "videoFormat": ""}

    changes = probe.apply_fields(
        rename_dict, result, ["videoCodec", "videoFormat", "audioCodec", "subtitle"], "fill_empty",
    )

    assert rename_dict["videoCodec"] == "AV1"
    assert rename_dict["videoFormat"] == "2160P"
    assert rename_dict["audioCodec"] == "AAC"
    assert rename_dict["probe_subtitle_track_labels"] == "简体、繁体、日语"
    # 未配置规则时 mapped 回退为自动组合并按 fill_empty 写入空的 customization
    assert rename_dict["customization"] == "简繁日内封"
    assert {item["field"] for item in changes} == {"videoFormat", "audioCodec", "customization"}


def test_per_field_priority_and_subtitle_customization_mapping():
    probe = _probe_class()
    result = probe.parse_payload(_sample_payload())
    rename_dict = {"videoCodec": "AV1", "videoBit": "8bit", "customization": "标题已有"}

    changes = probe.apply_fields(
        rename_dict,
        result,
        ["videoCodec", "videoBit", "subtitle"],
        "fill_empty",
        overwrite_fields=["videoBit", "subtitle"],
        subtitle_rules="简体+繁体+日语 => 简繁日内封",
        subtitle_to_customization=True,
    )

    assert rename_dict["videoCodec"] == "AV1"
    assert rename_dict["videoBit"] == "10bit"
    assert rename_dict["customization"] == "简繁日内封"
    assert rename_dict["probe_subtitle_mapped"] == "简繁日内封"
    assert {item["field"] for item in changes} == {"videoBit", "customization"}


def test_per_field_append_keeps_existing_effect_and_customization():
    probe = _probe_class()
    result = probe.parse_payload(_sample_payload())
    result["fields"]["effect"] = "DOVI"
    rename_dict = {"effect": "HDR10", "customization": "简体标题"}

    changes = probe.apply_fields(
        rename_dict,
        result,
        ["effect", "subtitle"],
        field_policies={"effect": "append", "subtitle": "append"},
        subtitle_rules="简体+繁体+日语 => 简繁日内封",
        customization_separator="@",
    )

    assert rename_dict["effect"] == "HDR10 DOVI"
    assert rename_dict["customization"] == "简体标题@简繁日内封"
    assert {item["policy"] for item in changes} == {"append"}


def test_duration_can_be_exposed_only_as_jinja_context():
    probe = _probe_class()
    result = probe.parse_payload(_sample_payload())
    rename_dict = {}

    changes = probe.apply_fields(rename_dict, result, ["duration"])

    assert changes == []
    assert rename_dict["probe_duration"] == 1438.125


def test_unselected_stream_categories_are_not_exposed_to_jinja_context():
    probe = _probe_class()
    result = probe.parse_payload(_sample_payload())
    rename_dict = {}

    probe.apply_fields(rename_dict, result, ["videoCodec"], "fill_empty")

    assert rename_dict["probe_video_codec"] == "H265"
    assert "probe_audio_languages" not in rename_dict
    assert "probe_subtitle_languages" not in rename_dict


def test_sdr_is_context_only_and_does_not_fill_effect():
    probe = _probe_class()
    payload = _sample_payload()
    payload["streams"][0]["color_transfer"] = "bt709"

    result = probe.parse_payload(payload)

    assert "effect" not in result["fields"]
    assert result["context"]["probe_effect"] == "SDR"


def _subtitle_payload(*tags_list):
    return {
        "streams": [
            {
                "codec_type": "video", "codec_name": "hevc",
                "width": 1920, "height": 1080, "disposition": {"default": 1},
            },
            *({"codec_type": "subtitle", "codec_name": "ass", "tags": tags} for tags in tags_list),
        ],
        "format": {},
    }


def test_dual_language_tracks_expose_language_title_and_label_separately():
    probe = _probe_class()

    result = probe.parse_payload(_subtitle_payload(
        {"language": "chi", "title": "简日双语"},
        {"language": "chi", "title": "繁日雙語"},
    ))

    # 语言字段只取 language 标签的单一语言（标题仅细分简繁），组合简写放在处理后标题
    assert result["context"]["probe_subtitle_languages"] == "简体、繁体"
    assert result["context"]["probe_subtitle_titles"] == "简日双语、繁日雙語"
    assert result["context"]["probe_subtitle_track_labels"] == "简日、繁日"


def test_language_tag_variants_are_classified():
    probe = _probe_class()

    result = probe.parse_payload(_subtitle_payload(
        {"language": "zh-hans"},
        {"language": "zh-hant"},
        {"language": "chi", "title": "GB2312"},
        {"language": "chi", "title": "BIG5"},
        {"language": "chi", "title": "简繁双语"},
    ))

    # 简繁双语轨的 language 是 chi、标题同时含简繁 → 语言归为“中文”，标签保留“简繁”
    assert result["context"]["probe_subtitle_languages"] == "简体、繁体、中文"
    assert result["context"]["probe_subtitle_track_labels"] == "简体、简繁、繁体"


def test_subtitle_rules_support_contains_and_threshold_in_order():
    probe = _probe_class()
    rules = (
        "简体+繁体+日语 => 简繁日内封\n"
        "包含:简体+日语 => 简日内封\n"
        ">=4 => 多国字幕"
    )

    def result_for(*labels):
        return {"context": {"probe_subtitle_track_labels": "、".join(labels)}}

    assert probe.map_subtitles(result_for("简体", "繁体", "日语"), rules) == "简繁日内封"
    assert probe.map_subtitles(result_for("简体", "日语", "英语"), rules) == "简日内封"
    assert probe.map_subtitles(result_for("中文", "英语", "GER", "SPA"), rules) == "多国字幕"
    # 未命中任何规则时回退到自动组合（单语言用全称）
    assert probe.map_subtitles(result_for("英语"), rules) == "英语内封"
    assert probe.map_subtitles({"context": {}}, ">=1 => 有内封") == ""


def test_iso_probe_requires_static_ffprobe(tmp_path):
    probe = _probe_class()()
    iso = tmp_path / "Movie.iso"
    iso.write_bytes(b"fake")

    result = probe.probe(str(iso), executable_path="", iso_executable_path="")

    assert result["success"] is False
    assert "静态 ffprobe" in result["reason"]


def test_static_ffprobe_provisioner_downloads_and_installs(tmp_path):
    module = _load_module()
    archive = io.BytesIO()
    with zipfile.ZipFile(archive, "w") as bundle:
        bundle.writestr("ffprobe", b"#!/bin/sh\necho ok\n")
        bundle.writestr("readme.txt", "docs")
    urls = []

    def downloader(url):
        urls.append(url)
        return archive.getvalue()

    provisioner = module.StaticFfprobeProvisioner(lambda: tmp_path, downloader)
    assert provisioner.installed_path() == ""

    provisioner.ensure_installed(background=False)

    status = provisioner.status()
    assert status["installed"] is True
    assert status["last_error"] == ""
    assert Path(status["path"]).read_bytes().startswith(b"#!/bin/sh")
    assert provisioner.VERSION in urls[0] and "static-ffprobe" in urls[0]
    # 已安装后再次调用是幂等的，不会重复下载
    provisioner.ensure_installed(background=False)
    assert len(urls) == 1


def test_static_ffprobe_provisioner_records_download_failure(tmp_path):
    module = _load_module()
    provisioner = module.StaticFfprobeProvisioner(lambda: tmp_path, lambda url: None)

    provisioner.ensure_installed(background=False)

    status = provisioner.status()
    assert status["installed"] is False
    assert "下载失败" in status["last_error"]


def test_clear_cache_resets_entries():
    probe = _probe_class()()
    probe._cache[("x", 1, 2)] = {"success": True}

    assert probe.clear_cache() == 1
    assert probe.clear_cache() == 0
    assert probe.capability()["cache_entries"] == 0


def test_cached_result_survives_moved_source_file():
    probe = _probe_class()()
    probe._cache[("/downloads/episode.mkv", 1024, 7)] = {
        "success": True,
        "raw": {"streams": [], "format": {"duration": "24"}},
        "source_size": 1024,
    }

    result = probe.cached_result("/downloads/episode.mkv")

    assert result["success"] is True
    assert result["cached"] is True
    assert result["source_size"] == 1024
    assert probe.capability()["cache_hits"] == 1
    assert probe.cached_result("/downloads/missing.mkv") is None


def test_composite_labels_match_atomic_rules_and_vice_versa():
    probe = _probe_class()

    def result_for(*labels):
        return {"context": {"probe_subtitle_track_labels": "、".join(labels)}}

    # 简日+繁日 双语轨命中按原子语言写的规则
    assert probe.map_subtitles(result_for("简日", "繁日"), "简体+繁体+日语 => 简繁日内封") == "简繁日内封"
    # 组合标签规则同样命中双语轨，别名（簡日雙語）也可用
    assert probe.map_subtitles(result_for("简日", "繁日"), "简日+繁日 => 简繁日内封") == "简繁日内封"
    assert probe.map_subtitles(result_for("简日", "繁日"), "簡日雙語+繁日雙語 => 简繁日内封") == "简繁日内封"
    # 组合标签规则也能命中三条独立单语轨的文件
    assert probe.map_subtitles(result_for("简体", "繁体", "日语"), "简日+繁日 => 简繁日内封") == "简繁日内封"
    # 包含匹配可按原子语言命中组合标签
    assert probe.map_subtitles(result_for("简日", "英语"), "包含:简体+日语 => 简日内封") == "简日内封"
    # 单独的简体轨不命中要求日语的规则，回退到自动组合
    assert probe.map_subtitles(result_for("简体"), "简日+繁日 => 简繁日内封") == "简体内封"


def test_mapped_falls_back_to_auto_profile_and_multi_language_cap():
    probe = _probe_class()

    result = probe.parse_payload(_subtitle_payload(
        {"language": "chi", "title": "简日双语"},
        {"language": "chi", "title": "繁日雙語"},
    ))
    # 没有任何规则时，mapped 回退为自动组合：简日+繁日 → 简繁日内封
    assert probe.map_subtitles(result, "") == "简繁日内封"

    multi = probe.parse_payload(_subtitle_payload(
        {"language": "eng"}, {"language": "ger"}, {"language": "fre"}, {"language": "spa"},
    ))
    # 超过 3 种语言时自动组合归为多国，避免 ISO 代码拼接串
    assert probe.map_subtitles(multi, "") == "多国内封"
    assert "英语" in multi["context"]["probe_subtitle_languages"]
    assert len(multi["context"]["probe_subtitle_languages"].split("、")) == 4
