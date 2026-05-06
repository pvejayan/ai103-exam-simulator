import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from build_ai103_300_question_bank import build_questions  # noqa: E402


def main() -> None:
    out_dir = ROOT / "exam-simulator" / "data"
    out_dir.mkdir(parents=True, exist_ok=True)
    questions = build_questions()
    for question in questions:
        question["source"] = "Original AI-103 practice item aligned to Microsoft Learn skills measured"
    (out_dir / "questions.json").write_text(
        json.dumps(questions, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    print(f"Exported {len(questions)} questions to {out_dir / 'questions.json'}")


if __name__ == "__main__":
    main()
