"""ffprobe 原始输出 → Emby MediaSourceInfo 转换的单测（对照神医持久化样例）。"""

import importlib.util
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MODULE_PATH = ROOT / "plugins.v2" / "tmdbrecognizeenhancer" / "emby_media_info.py"


def _module():
    spec = importlib.util.spec_from_file_location("emby_media_info_test", MODULE_PATH)
    module = importlib.util.module_from_spec(spec)
    assert spec and spec.loader
    spec.loader.exec_module(module)
    return module


def _payload():
    """模拟一个动漫 mkv 的 ffprobe 输出：H265 10bit HDR + 日语 + 简繁日字幕 + 章节。"""
    return {
        "format": {
            "format_name": "matroska,webm",
            "duration": "1438.125",
            "size": "2502511395",
            "bit_rate": "5619226",
        },
        "streams": [
            {
                "index": 0, "codec_type": "video", "codec_name": "hevc",
                "width": 1920, "height": 1080, "pix_fmt": "yuv420p10le",
                "color_transfer": "smpte2084", "color_primaries": "bt2020",
                "color_space": "bt2020nc", "profile": "Main 10", "level": 120,
                "avg_frame_rate": "24000/1001", "r_frame_rate": "24000/1001",
                "bits_per_raw_sample": "10", "refs": "1",
                "display_aspect_ratio": "16:9", "bit_rate": "5000000",
                "disposition": {"default": 1},
            },
            {
                "index": 1, "codec_type": "audio", "codec_name": "aac",
                "channels": 2, "channel_layout": "stereo", "sample_rate": "48000",
                "bit_rate": "224000",
                "tags": {"language": "jpn", "title": "日语"},
                "disposition": {"default": 1},
            },
            {
                "index": 2, "codec_type": "subtitle", "codec_name": "ass",
                "tags": {"language": "chi", "title": "简日双语"},
                "disposition": {"default": 1},
            },
            {
                "index": 3, "codec_type": "subtitle", "codec_name": "ass",
                "tags": {"language": "chi", "title": "繁日雙語"},
                "disposition": {"default": 0},
            },
        ],
        "chapters": [
            {"start_time": "0.000000", "tags": {"title": "Intro"}},
            {"start_time": "90.000000", "tags": {"title": "Part A"}},
            {"start_time": "600.000000"},
        ],
    }


def test_media_source_top_level_fields():
    m = _module()
    result = m.build_media_source(_payload(), file_name="Anime.S01E01.mkv")
    source = result["MediaSourceInfo"]

    assert source["Container"] == "mkv"
    assert source["Protocol"] == "File"
    assert source["Type"] == "Default"
    assert source["Name"] == "Anime.S01E01"
    assert source["Size"] == 2502511395
    # 1438.125s * 1e7
    assert source["RunTimeTicks"] == 14381250000
    assert source["Bitrate"] == 5619226
    assert source["SupportsDirectPlay"] is True
    assert source["Formats"] == []


def test_video_stream_mapping():
    m = _module()
    source = m.build_media_source(_payload())["MediaSourceInfo"]
    video = next(s for s in source["MediaStreams"] if s["Type"] == "Video")

    assert video["Codec"] == "hevc"
    assert video["Width"] == 1920
    assert video["Height"] == 1080
    assert video["BitDepth"] == 10
    assert video["VideoRange"] == "HDR"
    assert video["VideoRangeType"] == "HDR10"
    assert video["Profile"] == "Main 10"
    assert video["Level"] == 120
    assert video["AverageFrameRate"] == 23.976024
    assert video["IsDefault"] is True
    assert video["IsTextSubtitleStream"] is False
    assert video["Index"] == 0


def test_audio_stream_mapping():
    m = _module()
    source = m.build_media_source(_payload())["MediaSourceInfo"]
    audio = next(s for s in source["MediaStreams"] if s["Type"] == "Audio")

    assert audio["Codec"] == "aac"
    assert audio["Language"] == "jpn"
    assert audio["DisplayLanguage"] == "Japanese"
    assert audio["Channels"] == 2
    assert audio["ChannelLayout"] == "stereo"
    assert audio["SampleRate"] == 48000
    assert audio["IsDefault"] is True
    assert "默认" in audio["DisplayTitle"]


def test_subtitle_stream_mapping():
    m = _module()
    source = m.build_media_source(_payload())["MediaSourceInfo"]
    subtitles = [s for s in source["MediaStreams"] if s["Type"] == "Subtitle"]

    assert len(subtitles) == 2
    first = subtitles[0]
    assert first["Codec"] == "ass"
    assert first["Language"] == "chi"
    assert first["IsTextSubtitleStream"] is True
    assert first["SupportsExternalStream"] is True
    assert first["SubtitleLocationType"] == "InternalStream"
    assert first["IsExternal"] is False


def test_chapters_converted_to_ticks():
    m = _module()
    result = m.build_media_source(_payload())
    chapters = result["Chapters"]

    assert len(chapters) == 3
    assert chapters[0]["StartPositionTicks"] == 0
    assert chapters[0]["Name"] == "Intro"
    assert chapters[1]["StartPositionTicks"] == 900000000
    assert chapters[2]["Name"] == "章节 3"  # 无标题时回退
    assert [c["ChapterIndex"] for c in chapters] == [0, 1, 2]


def test_attached_pic_video_stream_is_skipped():
    m = _module()
    payload = _payload()
    payload["streams"].append({
        "index": 4, "codec_type": "video", "codec_name": "mjpeg",
        "disposition": {"attached_pic": 1},
    })
    source = m.build_media_source(payload)["MediaSourceInfo"]
    videos = [s for s in source["MediaStreams"] if s["Type"] == "Video"]
    assert len(videos) == 1  # 封面图不算视频流


def test_size_override_and_acceptance():
    m = _module()
    result = m.build_media_source(_payload(), size=999, file_name="x.mkv")
    assert result["MediaSourceInfo"]["Size"] == 999
    assert m.is_acceptable(result) is True


def test_missing_duration_is_rejected():
    m = _module()
    payload = _payload()
    payload["format"].pop("duration")
    result = m.build_media_source(payload)
    assert "RunTimeTicks" not in result["MediaSourceInfo"]
    assert m.is_acceptable(result) is False


def test_build_sync_payload_is_a_list():
    m = _module()
    body = m.build_sync_payload(_payload(), size=100, file_name="x.mkv")
    assert isinstance(body, list)
    assert len(body) == 1
    assert "MediaSourceInfo" in body[0]


def test_sdr_video_range():
    m = _module()
    payload = _payload()
    payload["streams"][0]["color_transfer"] = "bt709"
    payload["streams"][0].pop("bits_per_raw_sample")
    payload["streams"][0]["pix_fmt"] = "yuv420p"
    source = m.build_media_source(payload)["MediaSourceInfo"]
    video = next(s for s in source["MediaStreams"] if s["Type"] == "Video")
    assert video["VideoRange"] == "SDR"
    assert video["BitDepth"] == 8
