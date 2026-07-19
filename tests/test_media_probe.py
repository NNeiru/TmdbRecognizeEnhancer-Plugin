"""整理前媒体流扫描的纯解析与字段写入测试。"""

import importlib.util
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MODULE_PATH = ROOT / "plugins.v2" / "tmdbrecognizeenhancer" / "media_probe.py"


def _probe_class():
    spec = importlib.util.spec_from_file_location("media_probe_test", MODULE_PATH)
    module = importlib.util.module_from_spec(spec)
    assert spec and spec.loader
    spec.loader.exec_module(module)
    return module.MediaFileProbe


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
    assert result["context"]["probe_subtitle_profile"] == "简繁日内封"
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
    assert rename_dict["probe_subtitle_profile"] == "简繁日内封"
    assert {item["field"] for item in changes} == {"videoFormat", "audioCodec"}


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
