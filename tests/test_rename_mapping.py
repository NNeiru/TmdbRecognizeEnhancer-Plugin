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


def test_sequential_mapping_migrates_old_title_and_subtitle_stages_to_final_result():
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
    output, changes = registry.apply(
        "命运／奇异赝品/Title.chi.zh-cn.srt", "final_result"
    )
    assert output == "命运-奇异赝品/Title.chs.srt"
    assert len(changes) == 2


def test_new_rule_with_empty_frontend_id_is_accepted():
    module = _load_file("test_rename_mapping_validation", "rename_mapping.py")
    rules = module.RenameMappingRegistry.validate_rule({
        "id": "", "label": "标题替换", "stage": "final_result", "mode": "literal",
        "pattern": "旧标题", "replacement": "新标题", "enabled": True,
    })
    assert len(rules) == 1
    assert rules[0]["id"].startswith("rename:")


def test_legacy_final_stages_are_deduplicated_during_migration():
    module = _load_file("test_rename_mapping_migration", "rename_mapping.py")
    rules = module.RenameMappingRegistry.normalize_rules([
        {"id": "old-render", "stage": "rendered_path", "pattern": "A", "replacement": "B"},
        {"id": "old-subtitle", "stage": "subtitle_name", "pattern": "A", "replacement": "B"},
    ])
    assert len(rules) == 1
    assert rules[0]["stage"] == "final_result"


def test_subtitle_adapter_changes_complete_relative_result_once(monkeypatch):
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
    relative_prefix = str(Path("AB") / "C")
    assert adapter.install(
        lambda value: value.replace(relative_prefix, "ABC").replace(".chi.zh-cn", ".chs")
    )
    adapter.prepare(Path("/library"))
    output = TransHandler._TransHandler__rename_subtitles(
        SimpleNamespace(name="source.chs.srt"), Path("/library/AB/C.srt")
    )
    assert output == Path("/library/ABC.chs.srt")

    adapter.uninstall()
    restored = TransHandler._TransHandler__rename_subtitles(
        SimpleNamespace(name="source.chs.srt"), Path("/library/AB/C.srt")
    )
    assert restored == Path("/library/AB/C.chi.zh-cn.srt")


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


def test_release_group_arranger_keeps_configured_complete_group_and_normalizes_unknown_input():
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
    assert output == "Unknown@Other"
    assert trace["applied"] is True


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


def test_release_group_arranger_supports_global_default_and_rule_override():
    module = _load_file("test_release_group_arranger_default", "release_group_arranger.py")
    registry = module.ReleaseGroupArrangementRegistry()
    registry.refresh([
        {
            "match_name": "VCB", "output_name": "VCB-Studio", "position": "last",
            "connector": module.ReleaseGroupArrangementRegistry.DEFAULT_CONNECTOR,
        },
        {
            "match_name": "ADWeb", "output_name": "ADWeb", "position": "last",
            "connector": "@", "order": 200,
        },
    ], default_connector="&")

    assert registry.apply("ADWeb+A+VCB")[0] == "A&VCB-Studio@ADWeb"

    global_only = module.ReleaseGroupArrangementRegistry()
    global_only.refresh([], default_connector=".")
    output, trace = global_only.apply("A&B+C")
    assert output == "A.B.C"
    assert trace["applied"] is True


def test_customization_separator_adapter_restores_previous_value(monkeypatch):
    runtime = _load_file("test_customization_separator_adapter", "runtime_adapter.py")

    class CustomizationMatcher:
        instance = None

        def __new__(cls):
            if cls.instance is None:
                cls.instance = super().__new__(cls)
                cls.instance.custom_separator = None
            return cls.instance

    app_module = ModuleType("app")
    core_module = ModuleType("app.core")
    meta_module = ModuleType("app.core.meta")
    customization_module = ModuleType("app.core.meta.customization")
    customization_module.CustomizationMatcher = CustomizationMatcher
    monkeypatch.setitem(sys.modules, "app", app_module)
    monkeypatch.setitem(sys.modules, "app.core", core_module)
    monkeypatch.setitem(sys.modules, "app.core.meta", meta_module)
    monkeypatch.setitem(sys.modules, "app.core.meta.customization", customization_module)

    adapter = runtime.CustomizationSeparatorAdapter()
    assert adapter.install(".") is True
    assert CustomizationMatcher().custom_separator == "."
    adapter.uninstall()
    assert CustomizationMatcher().custom_separator is None
