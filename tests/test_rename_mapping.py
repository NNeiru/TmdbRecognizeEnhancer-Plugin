"""命名阶段映射与字幕后处理适配器测试。"""

import importlib.util
import sys
from pathlib import Path
from types import ModuleType, SimpleNamespace


ROOT = Path(__file__).resolve().parents[1] / "plugins.v2" / "tmdbrecognizeenhancer"


def _load_file(name, filename):
    spec = importlib.util.spec_from_file_location(name, ROOT / filename)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


def test_sequential_mapping_covers_group_title_and_subtitle():
    module = _load_file("test_rename_mapping_module", "rename_mapping.py")
    registry = module.RenameMappingRegistry()
    registry.refresh([
        {
            "label": "固定合作组顺序", "stage": "release_group", "mode": "regex",
            "pattern": r"^(?:A[&@]B|B[&@]A)$", "replacement": "A@B", "priority": 100,
        },
        {
            "label": "自定义标题", "stage": "rendered_path", "mode": "literal",
            "pattern": "命运／奇异赝品", "replacement": "命运-奇异赝品", "priority": 100,
        },
        {
            "label": "简中后缀", "stage": "subtitle_name", "mode": "literal",
            "pattern": ".chi.zh-cn", "replacement": ".chs", "priority": 100,
        },
    ])

    assert registry.apply("B&A", "release_group")[0] == "A@B"
    assert registry.apply("命运／奇异赝品/S01E01.mkv", "rendered_path")[0] == "命运-奇异赝品/S01E01.mkv"
    assert registry.apply("Title.chi.zh-cn.srt", "subtitle_name")[0] == "Title.chs.srt"


def test_new_rule_with_empty_frontend_id_is_accepted():
    module = _load_file("test_rename_mapping_validation", "rename_mapping.py")
    rules = module.RenameMappingRegistry.validate_rule({
        "id": "", "label": "标题替换", "stage": "rendered_path", "mode": "literal",
        "pattern": "旧标题", "replacement": "新标题", "enabled": True,
    })
    assert len(rules) == 1
    assert rules[0]["id"].startswith("rename:")


def test_subtitle_adapter_only_changes_filename(monkeypatch):
    runtime = _load_file("test_runtime_adapter_module", "runtime_adapter.py")

    class TransHandler:
        @staticmethod
        def __rename_subtitles(sub_item, new_file):
            return Path(new_file).with_name(Path(new_file).stem + ".chi.zh-cn.srt")

    app_module = ModuleType("app")
    modules_module = ModuleType("app.modules")
    filemanager_module = ModuleType("app.modules.filemanager")
    transhandler_module = ModuleType("app.modules.filemanager.transhandler")
    transhandler_module.TransHandler = TransHandler
    monkeypatch.setitem(sys.modules, "app", app_module)
    monkeypatch.setitem(sys.modules, "app.modules", modules_module)
    monkeypatch.setitem(sys.modules, "app.modules.filemanager", filemanager_module)
    monkeypatch.setitem(sys.modules, "app.modules.filemanager.transhandler", transhandler_module)

    adapter = runtime.SubtitleRenameAdapter()
    assert adapter.install(lambda filename: filename.replace(".chi.zh-cn", ".chs"))
    output = TransHandler._TransHandler__rename_subtitles(
        SimpleNamespace(name="source.chs.srt"), Path("/library/show/Title.srt")
    )
    assert output == Path("/library/show/Title.chs.srt")

    adapter.uninstall()
    restored = TransHandler._TransHandler__rename_subtitles(
        SimpleNamespace(name="source.chs.srt"), Path("/library/show/Title.srt")
    )
    assert restored == Path("/library/show/Title.chi.zh-cn.srt")


def test_release_group_arranger_controls_alias_order_and_connector():
    module = _load_file("test_release_group_arranger", "release_group_arranger.py")
    registry = module.ReleaseGroupArrangementRegistry()
    registry.refresh([
        {
            "match_name": "VCB-Studio", "aliases": ["VCB", "VCB Studio"],
            "output_name": "VCB-Studio", "position": "last",
            "connector": "&", "order": 100,
        },
        {
            "match_name": "ADWeb", "output_name": "ADWeb",
            "position": "last", "connector": "@", "order": 200,
        },
    ])

    output, trace = registry.apply("ADWeb&A&VCB")

    assert output == "A&VCB-Studio@ADWeb"
    assert trace["applied"] is True
    assert [item["output"] for item in trace["members"]] == ["A", "VCB-Studio", "ADWeb"]


def test_release_group_arranger_keeps_complete_ampersand_group_and_unknown_input():
    module = _load_file("test_release_group_arranger_whole", "release_group_arranger.py")
    registry = module.ReleaseGroupArrangementRegistry()
    registry.refresh([
        {
            "match_name": "A&B", "output_name": "A&B",
            "position": "keep", "connector": "@", "order": 100,
        },
        {
            "match_name": "VCB-Studio", "output_name": "VCB-Studio",
            "position": "last", "connector": "&", "order": 100,
        },
    ])

    assert registry.apply("A&B")[0] == "A&B"
    output, trace = registry.apply("Unknown&Other")
    assert output == "Unknown&Other"
    assert trace["applied"] is False


def test_release_group_arranger_supports_space_connector_and_deduplication():
    module = _load_file("test_release_group_arranger_space", "release_group_arranger.py")
    registry = module.ReleaseGroupArrangementRegistry()
    registry.refresh([
        {
            "match_name": "Group B", "aliases": ["B"], "output_name": "Group B",
            "position": "last", "connector": " ", "order": 100,
        },
    ])

    assert registry.apply("A@B@Group B")[0] == "A Group B"
