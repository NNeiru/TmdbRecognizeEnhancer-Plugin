import ast
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PLUGIN_KEY = "TmdbRecognizeEnhancer"


def _backend_version() -> str:
    source = (ROOT / "plugins.v2" / "tmdbrecognizeenhancer" / "__init__.py").read_text(
        encoding="utf-8"
    )
    tree = ast.parse(source)
    for node in tree.body:
        if isinstance(node, ast.ClassDef) and node.name == PLUGIN_KEY:
            for statement in node.body:
                if (
                    isinstance(statement, ast.Assign)
                    and any(
                        isinstance(target, ast.Name) and target.id == "plugin_version"
                        for target in statement.targets
                    )
                    and isinstance(statement.value, ast.Constant)
                ):
                    return str(statement.value.value)
    raise AssertionError("plugin_version was not found")


def test_release_versions_are_synchronized():
    catalog = json.loads((ROOT / "package.v2.json").read_text(encoding="utf-8"))
    frontend = json.loads(
        (ROOT / "plugins.v2" / "tmdbrecognizeenhancer" / "package.json").read_text(
            encoding="utf-8"
        )
    )
    catalog_version = catalog[PLUGIN_KEY]["version"]

    assert catalog_version == _backend_version() == frontend["version"]
    assert f"v{catalog_version}" in catalog[PLUGIN_KEY]["history"]
